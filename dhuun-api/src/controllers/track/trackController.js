import fs from 'fs';

import path from 'path';

import slugify from 'slugify';

import Artist from '../../models/Artist.js';

import Track from '../../models/Track.js';

import uploadToMinio from '../../services/storage/uploadToMinio.js';

import uploadDirectoryToMinio from '../../services/storage/uploadDirectoryToMinio.js';

import getAudioMetadata from '../../services/media/getAudioMetadata.js';

import generateHLS from '../../services/media/generateHLS.js';

/* ----------------------------------- */
/* Create Track */
/* ----------------------------------- */

export const createTrack =
  async (req, res) => {
    try {
      const {
        title,
        primaryArtist,
        genre,
        language,
        lyrics,
        releaseType,
        releaseDate,
        isExplicit,
        isrc,
        moods,
        tags,
        contributors,
      } = req.body;

      const artist =
        await Artist.findOne({
          userId:
            req.user.id,
        });

      if (!artist) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              'Artist profile required',
          });
      }

      if (
        !req.files?.audio
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Audio file required',
          });
      }

      const audioFile =
        req.files.audio[0];

      const metadata =
        await getAudioMetadata(
          audioFile.path
        );

      const trackFolderId =
        Date.now().toString();

      const hlsOutputDir =
        path.resolve(
          '../storage/hls',
          trackFolderId
        );

      await generateHLS(
        audioFile.path,
        hlsOutputDir
      );

      await uploadDirectoryToMinio(
        hlsOutputDir,
        `tracks/${trackFolderId}/hls`
      );

      let coverImagePath =
        '';

      if (
        req.files
          ?.coverImage?.[0]
      ) {
        const coverFile =
          req.files
            .coverImage[0];

        coverImagePath =
          await uploadToMinio(
            coverFile.path,
            coverFile.originalname,
            coverFile.mimetype,
            'covers'
          );
      }

      const audioPath =
        await uploadToMinio(
          audioFile.path,
          audioFile.originalname,
          audioFile.mimetype,
          'tracks/originals'
        );

      /* ----------------------------------- */
      /* Parse Contributors */
      /* ----------------------------------- */

      const parsedContributors =
        contributors
          ? JSON.parse(
              contributors
            )
          : [
              {
                userId: req.user.id,

                artistId: artist._id,

                displayName: artist.stageName,

                role: 'SINGER',

                royaltyShare: 100,

                verified: true,
              },
            ];

            /* ----------------------------------- */
            /* Normalize Contributors */
            /* ----------------------------------- */

            const normalizedContributors =
              parsedContributors.map(
                (contributor) => ({
                  userId:
                    contributor.userId ||
                    null,

                  artistId:
                    contributor.artistId ||
                    null,

                  displayName:
                    contributor.displayName ||
                    contributor.name ||
                    'Unknown Contributor',

                  role:
                    contributor.role,

                  royaltyShare:
                    Number(
                      contributor.royaltyShare || 0
                    ),

                  verified:
                    contributor.verified ||
                    false,

                  credits:
                    contributor.credits ||
                    '',
                })
              );

            /* ----------------------------------- */
            /* Validate Royalty */
            /* ----------------------------------- */

            const totalRoyaltyShare =
              normalizedContributors.reduce(
                (
                  total,
                  contributor
                ) =>
                  total +
                  Number(
                    contributor.royaltyShare ||
                    0
                  ),

                0
              );

            if (
              totalRoyaltyShare !==
              100
            ) {
              return res.status(400)
                .json({
                  success: false,

                  message:
                    'Royalty share must equal 100%',
                });
            }
            
            /* ----------------------------------- */
            /* Artist Relationships */
            /* ----------------------------------- */

            const primaryArtists =
              [
                artist._id,
              ];

            const featuredArtists =
              normalizedContributors
                .filter(
                  (contributor) =>
                    contributor.role ===
                    'FEATURED_ARTIST' &&
                    contributor.artistId
                )
                .map(
                  (contributor) =>
                    contributor.artistId
                );

            /* ----------------------------------- */
            /* Slug */
            /* ----------------------------------- */

            const slug =
              slugify(title, {
                lower: true,
                strict: true,
              });

            const track =
              await Track.create({
                /* ----------------------------------- */
                /* Core */
                /* ----------------------------------- */

                title,

                slug:
                  `${slug}-${Date.now()}`,

                primaryArtist:
                  primaryArtist ||
                  artist._id,

                genre,

                language,

                /* ----------------------------------- */
                /* Discovery */
                /* ----------------------------------- */

                lyrics,

                releaseType,

                releaseDate,

                isExplicit:
                  isExplicit ===
                  'true',

                isrc,

                moods: moods
                  ? JSON.parse(
                      moods
                    )
                  : [],

                tags: tags
                  ? JSON.parse(
                      tags
                    )
                  : [],

                /* ----------------------------------- */
                /* Media */
                /* ----------------------------------- */

                coverImage:
                  coverImagePath,

                originalAudio:
                  audioPath,

                hlsMasterUrl:
                  `tracks/${trackFolderId}/hls/index.m3u8`,

                /* ----------------------------------- */
                /* Audio Intelligence */
                /* ----------------------------------- */

                duration:
                  metadata.duration,

                bitrate:
                  metadata.bitrate,

                codec:
                  metadata.codec,

                audioFormat:
                  metadata.format,

                /* ----------------------------------- */
                /* Processing */
                /* ----------------------------------- */

                processingStatus:
                  'READY',

                visibility:
                  'PUBLISHED',

                /* ----------------------------------- */
                /* Contributors */
                /* ----------------------------------- */

                contributors:
                  normalizedContributors,

                totalRoyaltyShare
            
              });

            /* ----------------------------------- */
            /* Cleanup */
            /* ----------------------------------- */

            fs.unlinkSync(
              audioFile.path
            );

            if (
              req.files
                ?.coverImage?.[0]
            ) {
              fs.unlinkSync(
                req.files
                  .coverImage[0]
                  .path
              );
            }

            fs.rmSync(
              hlsOutputDir,
              {
                recursive: true,
                force: true,
              }
            );

            res.status(201).json({
              success: true,

              track,
            });
          } catch (error) {
            console.error(error);

            res.status(500).json({
              success: false,

              message:
                'Track upload failed',
            });
          }
        };

        /* ----------------------------------- */
        /* Update Track */
        /* ----------------------------------- */

        export const updateTrack =
          async (req, res) => {
            try {
              const { id } =
                req.params;

              const track =
                await Track.findById(id);

              if (!track) {
                return res.status(404)
                  .json({
                    success: false,

                    message:
                      'Track not found',
                  });
              }

              const {
                title,
                primaryArtist,
                genre,
                language,
                lyrics,
                releaseType,
                releaseDate,
                isExplicit,
                isrc,
                moods,
                tags,
                contributors,
              } = req.body;

              /* ----------------------------------- */
              /* Contributors */
              /* ----------------------------------- */

              const parsedContributors =
                contributors
                  ? JSON.parse(
                      contributors
                    )
                  : track.contributors;

              const normalizedContributors =
                parsedContributors.map(
                  (contributor) => ({
                    userId:
                      contributor.userId ||
                      null,

                    artistId:
                      contributor.artistId ||
                      null,

                    displayName:
                      contributor.displayName ||
                      contributor.name ||
                      'Unknown Contributor',

                    role:
                      contributor.role,

                    royaltyShare:
                      Number(
                        contributor.royaltyShare || 0
                      ),

                    verified:
                      contributor.verified ||
                      false,

                    credits:
                      contributor.credits ||
                      '',
                  })
                );

              /* ----------------------------------- */
              /* Validate Royalty */
              /* ----------------------------------- */

              const totalRoyaltyShare =
                normalizedContributors.reduce(
                  (
                    total,
                    contributor
                  ) =>
                    total +
                    Number(
                      contributor.royaltyShare || 0
                    ),

                  0
                );

              if (
                totalRoyaltyShare !== 100
              ) {
                return res.status(400)
                  .json({
                    success: false,

                    message:
                      'Royalty share must equal 100%',
                  });
              }

              /* ----------------------------------- */
              /* Optional Cover Update */
              /* ----------------------------------- */

              let coverImagePath =
                track.coverImage;

              if (
                req.files
                  ?.coverImage?.[0]
              ) {
                const coverFile =
                  req.files
                    .coverImage[0];

                coverImagePath =
                  await uploadToMinio(
                    coverFile.path,
                    coverFile.originalname,
                    coverFile.mimetype,
                    'covers'
                  );

                fs.unlinkSync(
                  coverFile.path
                );
              }

              /* ----------------------------------- */
              /* Update Track */
              /* ----------------------------------- */

              track.title =
                title || track.title;

              track.primaryArtist =
                primaryArtist ||
                track.primaryArtist;

              track.genre =
                genre || track.genre;

              track.language =
                language || track.language;

              track.lyrics =
                lyrics || track.lyrics;

              track.releaseType =
                releaseType ||
                track.releaseType;

              track.releaseDate =
                releaseDate ||
                track.releaseDate;

              if (
                  typeof isExplicit !==
                  'undefined'
                ) {
                  track.isExplicit =
                    isExplicit === 'true';
                }

              track.isrc =
                isrc || track.isrc;

              track.moods =
                moods
                  ? JSON.parse(moods)
                  : track.moods;

              track.tags =
                tags
                  ? JSON.parse(tags)
                  : track.tags;

              track.coverImage =
                coverImagePath;

              track.contributors =
                normalizedContributors;

              track.totalRoyaltyShare =
                totalRoyaltyShare;

              await track.save();

              return res.json({
                success: true,

                track,
              });

            } catch (error) {
              console.error(error);

              return res.status(500)
                .json({
                  success: false,

                  message:
                    'Failed to update track',
                });
            }
          };

        /* ----------------------------------- */
        /* Get All Tracks */
        /* ----------------------------------- */

        export const getAllTracks =
          async (req, res) => {
            try {
              const tracks =
                await Track.find()
                  .populate(
                    'primaryArtist',
                    'stageName'
                  )
                  .sort({
                    createdAt: -1,
                  });

              res.json({
                success: true,

                tracks:
                  tracks.map(
                    (track) => ({
                      _id:
                        track._id,

                      title:
                        track.title,

                      genre:
                        track.genre,

                      language:
                        track.language,

                      lyrics:
                        track.lyrics,

                      moods:
                        track.moods,

                      tags:
                        track.tags,

                      isExplicit:
                        track.isExplicit,

                      releaseType:
                        track.releaseType,

                      releaseDate:
                        track.releaseDate,

                      isrc:
                        track.isrc,

                      coverImage:
                        track.coverImage,

                      totalStreams:
                        track.totalStreams ||
                        0,

                      totalLikes:
                        track.totalLikes ||
                        0,

                      totalShares:
                        track.totalShares ||
                        0,

                      totalSaves:
                        track.totalSaves ||
                        0,

                      duration:
                        track.duration,

                      bitrate:
                        track.bitrate,

                      codec:
                        track.codec,

                      audioFormat:
                        track.audioFormat,

                      processingStatus:
                        track.processingStatus,

                      visibility:
                        track.visibility,

                      primaryArtist:
                        track.primaryArtist,
                        
                      contributors:
                        track.contributors,

                      createdAt:
                        track.createdAt,
                    })
                  ),
              });

                        

              } catch (error) {
                console.error(error);

                res.status(500).json({
                  success: false,

                  message:
                    'Failed to fetch tracks',
                });
              }
            };

            /* ----------------------------------- */
            /* Delete Track */
            /* ----------------------------------- */

            export const deleteTrack =
              async (req, res) => {
                try {
                  const { id } =
                    req.params;

                  const track =
                    await Track.findById(id);

                  if (!track) {
                    return res.status(404)
                      .json({
                        success: false,

                        message:
                          'Track not found',
                      });
                  }

                  /*
                  |--------------------------------------------------------------------------
                  | TODO
                  |--------------------------------------------------------------------------
                  | Future:
                  | - Remove MinIO assets
                  | - Remove HLS directories
                  | - Cleanup CDN cache
                  | - Remove analytics references
                  */

                  await Track.findByIdAndDelete(
                    id
                  );

                  return res.json({
                    success: true,

                    message:
                      'Track deleted successfully',
                  });
                } catch (error) {
                  console.error(error);

                  return res.status(500)
                    .json({
                      success: false,

                      message:
                        'Failed to delete track',
                    });
                }
              };
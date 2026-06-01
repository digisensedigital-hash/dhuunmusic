import Artist from '../../models/Artist.js';

import Track from '../../models/Track.js';

import ArtistAnalytics
  from '../../models/ArtistAnalytics.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

import getPublicFileUrl
  from '../../services/storage/getPublicFileUrl.js';

import mongoose from 'mongoose';

export const getPublicArtistProfile =
  async (req, res) => {

    try {

      const { id } = req.params;

      const artist =

        mongoose.Types.ObjectId.isValid(id)

          ? await Artist.findOne({

              $or: [

                { _id: id },

                { slug: id },

              ],

            })

          : await Artist.findOne({

              slug: id,

            });

      if (!artist) {

        return res.status(404).json({

          success: false,

          message:
            'Artist not found',

        });

      }

      const analytics =
        await ArtistAnalytics.findOne({
          artistId: artist._id
        });

      // -----------------------------------
      // Public Top Tracks
      // -----------------------------------

      const topTracksRaw =
        await Track.find({

          primaryArtists:
            artist._id,

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,
        })
          .populate(
            'primaryArtists'
          )
          .sort({
            createdAt: -1
          })
          .limit(10);

      // -----------------------------------
      // Trending Tracks
      // -----------------------------------

      const trendingTracksRaw =
        await TrendingTrack.find()
          .sort({ rank: 1 })
          .populate({
            path: 'trackId',

            match: {

              publishingStatus:
                'PUBLISHED',

              processingStatus:
                'READY',

              isActive: true,
            },

            populate: {
              path: 'primaryArtists'
            }
          });

      // -----------------------------------
      // Remove Null Hydrated Tracks
      // -----------------------------------

      const visibleTrendingTracks =
        trendingTracksRaw.filter(
          (item) => item.trackId
        );

      // -----------------------------------
      // Artist Trending Tracks
      // -----------------------------------

      const artistTrendingTracks =
        visibleTrendingTracks
          .filter(
            (item) =>
              item.trackId
                ?.primaryArtists
                ?._id
                ?.toString() ===
              artist._id.toString()
          )
          .map((item) =>
            serializeTrack(
              item.trackId
            )
          );

      // -----------------------------------
      // Serialize Top Tracks
      // -----------------------------------

      const topTracks =
        topTracksRaw
          .filter(
            (track) =>

              track &&

              track.publishingStatus ===
                'PUBLISHED' &&

              track.processingStatus ===
                'READY' &&

              track.isActive === true
          )
          .map(
            serializeTrack
          );

      res.json({
        success: true,

        artist: {

          id: artist._id,

          stageName:
            artist.stageName,

          bio: artist.bio,

          profileImage:

          artist.profileImage

            ? getPublicFileUrl(
                artist.profileImage
              )

            : '',

          verified:
            artist.verified
        },

        analytics: analytics
          ? {
              totalStreams:
                analytics.totalStreams,

              qualifiedStreams:
                analytics.qualifiedStreams,

              totalListeningTime:
                analytics.totalListeningTime,

              averageCompletionRate:
                analytics.averageCompletionRate,

              totalTracks:
                analytics.totalTracks
            }
          : null,

        topTracks,

        trendingTracks:
          artistTrendingTracks
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch artist profile'
      });
    }
  };
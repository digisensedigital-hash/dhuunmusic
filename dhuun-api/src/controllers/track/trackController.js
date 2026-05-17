import fs from 'fs';

import path from 'path';

import slugify from 'slugify';

import Artist from '../../models/Artist.js';
import Track from '../../models/Track.js';

import uploadToMinio from '../../services/storage/uploadToMinio.js';

import uploadDirectoryToMinio from '../../services/storage/uploadDirectoryToMinio.js';

import getAudioMetadata from '../../services/media/getAudioMetadata.js';

import generateHLS from '../../services/media/generateHLS.js';

export const createTrack = async (req, res) => {
  try {
    const {
      title,
      genre,
      language
    } = req.body;

    const artist = await Artist.findOne({
      userId: req.user.id
    });

    if (!artist) {
      return res.status(403).json({
        success: false,
        message: 'Artist profile required'
      });
    }

    if (!req.files?.audio) {
      return res.status(400).json({
        success: false,
        message: 'Audio file required'
      });
    }

    const audioFile = req.files.audio[0];

    const metadata = await getAudioMetadata(
      audioFile.path
    );

    const trackFolderId = Date.now().toString();

    const hlsOutputDir = path.resolve(
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

    let coverImagePath = '';

    if (req.files?.coverImage?.[0]) {
      const coverFile = req.files.coverImage[0];

      coverImagePath = await uploadToMinio(
        coverFile.path,
        coverFile.originalname,
        coverFile.mimetype,
        'covers'
      );
    }

    const audioPath = await uploadToMinio(
      audioFile.path,
      audioFile.originalname,
      audioFile.mimetype,
      'tracks/originals'
    );

    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    const track = await Track.create({
      title,

      slug: `${slug}-${Date.now()}`,

      primaryArtist: artist._id,

      genre,

      language,

      coverImage: coverImagePath,

      originalAudio: audioPath,

      hlsMasterUrl:
        `tracks/${trackFolderId}/hls/index.m3u8`,

      duration: metadata.duration,

      bitrate: metadata.bitrate,

      codec: metadata.codec,

      audioFormat: metadata.format,

      processingStatus: 'READY',

      contributors: [
        {
          userId: req.user.id,
          artistId: artist._id,
          name: artist.stageName,
          role: 'SINGER',
          royaltyShare: 100,
          verified: true
        }
      ],

      totalRoyaltyShare: 100
    });

    fs.unlinkSync(audioFile.path);

    if (req.files?.coverImage?.[0]) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }

    fs.rmSync(hlsOutputDir, {
      recursive: true,
      force: true
    });

    res.status(201).json({
      success: true,
      track
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Track upload failed'
    });
  }
};
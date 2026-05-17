import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import ffmpeg from 'fluent-ffmpeg';

import dotenv from 'dotenv';

import uploadDirectoryToMinio
  from '../src/services/storage/uploadDirectoryToMinio.js';

dotenv.config();

// -----------------------------------
// CONFIG
// -----------------------------------

const TRACKS_DIR =
  '/var/www/dhuunmusic/music';

const OUTPUT_DIR =
  '/Users/arshadmalik/DHUUN/dhuun-api/uploads/tracks';

// -----------------------------------
// Mongo Connection
// -----------------------------------

await mongoose.connect(
  process.env.MONGO_URI
);

console.log(
  'MongoDB connected'
);

// -----------------------------------
// Track Model
// -----------------------------------

const {
  default: Track,
} = await import(
  '../src/models/Track.js'
);

// -----------------------------------
// Artist
// -----------------------------------

const ARTIST_ID =
  '6a083abc0a8b189b1d7c2d5f';

// -----------------------------------
// Helpers
// -----------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /(^-|-$)/g,
      ''
    );
}

function getDuration(
  filePath
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      ffmpeg.ffprobe(
        filePath,
        (
          err,
          metadata
        ) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              metadata.format
                .duration || 0
            );
          }
        }
      );
    }
  );
}

function generateHLS(
  inputPath,
  outputPath
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      fs.mkdirSync(
        outputPath,
        {
          recursive: true,
        }
      );

      ffmpeg(inputPath)

        .noVideo()

        .audioCodec('aac')

        .audioBitrate('192k')

        .audioFrequency(44100)

        .audioChannels(2)

        .format('hls')

        .outputOptions([
            '-hls_time 6',
            '-hls_playlist_type vod',
            '-hls_list_size 0',
            '-start_number 0',
            '-movflags +faststart',
        ])

        .output(
          path.join(
            outputPath,
            'index.m3u8'
          )
        )

        .on(
          'end',
          resolve
        )

        .on(
          'error',
          reject
        )

        .run();
    }
  );
}

// -----------------------------------
// Import Runtime
// -----------------------------------

const files =
  fs
    .readdirSync(
      TRACKS_DIR
    )
    .filter((file) =>
      file.endsWith('.mp3')
    );

console.log(
  `Found ${files.length} tracks`
);

for (const file of files) {
  try {
    console.log(
      `\nImporting: ${file}`
    );

    const inputPath =
      path.join(
        TRACKS_DIR,
        file
      );

    const baseName =
      path.parse(file)
        .name;

    const title =
      baseName.replaceAll(
        '_',
        ' '
      );

    const slug =
      `${slugify(
        title
      )}-${Date.now()}`;

    const trackFolder =
      `${Date.now()}`;

    const outputPath =
      path.join(
        OUTPUT_DIR,
        trackFolder,
        'hls'
      );

    // -----------------------------------
    // Duration
    // -----------------------------------

    const duration =
      await getDuration(
        inputPath
      );

    console.log(
      `Duration: ${duration}s`
    );

    // -----------------------------------
    // HLS Generation
    // -----------------------------------

    console.log(
      'Generating HLS...'
    );

    await generateHLS(
      inputPath,
      outputPath
    );

    // -----------------------------------
    // Upload To MinIO
    // -----------------------------------

    console.log(
      'Uploading HLS to MinIO...'
    );

    await uploadDirectoryToMinio(
      outputPath,
      `tracks/${trackFolder}/hls`
    );

    // -----------------------------------
    // Stream URL
    // -----------------------------------

    const streamUrl =
      `http://127.0.0.1:9000/dhuun-media/tracks/${trackFolder}/hls/index.m3u8`;

    // -----------------------------------
    // Create Track
    // -----------------------------------

    await Track.create({
      title,

      slug,

      genre: 'Pop',

      language:
        'Hindi',

      duration,

      hlsMasterUrl:
        `tracks/${trackFolder}/hls/index.m3u8`,

      coverImage: '',

      status: 'READY',

      primaryArtist:
        ARTIST_ID,
    });

    console.log(
      `Imported: ${title}`
    );
  } catch (err) {
    console.error(
      `Failed: ${file}`,
      err
    );
  }
}

console.log(
  '\nImport completed'
);

process.exit(0);
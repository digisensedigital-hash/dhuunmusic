import ffmpeg from 'fluent-ffmpeg';

import fs from 'fs';

import Track from '../../models/Track.js';

/* -------------------------------------------------------------------------- */
/* Generate HLS */
/* -------------------------------------------------------------------------- */

const generateHLS = async (
  inputPath,
  outputDir,

  /*
  |--------------------------------------------------------------------------
  | Optional Track ID
  |--------------------------------------------------------------------------
  */

  trackId = null
) => {

  return new Promise(
    async (resolve, reject) => {

      try {

        /* ------------------------------------------------------------------ */
        /* Ensure Output Directory */
        /* ------------------------------------------------------------------ */

        if (
          !fs.existsSync(outputDir)
        ) {

          fs.mkdirSync(
            outputDir,
            {
              recursive: true,
            }
          );
        }

        /* ------------------------------------------------------------------ */
        /* Processing State */
        /* ------------------------------------------------------------------ */

        if (trackId) {

          await Track.findByIdAndUpdate(
            trackId,
            {
              processingStatus:
                'PROCESSING',
            }
          );
        }

        /* ------------------------------------------------------------------ */
        /* Start FFmpeg */
        /* ------------------------------------------------------------------ */

        ffmpeg(inputPath)

        .noVideo()

        .audioCodec('aac')

        .audioFrequency(44100)

        .audioChannels(2)

        .outputOptions([
          '-vn',

          '-c:a aac',

          '-ar 44100',

          '-ac 2',

          '-b:a 128k',

          '-hls_time 10',

          '-hls_list_size 0',

          '-hls_playlist_type vod',

          '-hls_segment_filename',

          `${outputDir}/index%d.ts`
        ])

        .format('hls')

        .output(
          `${outputDir}/index.m3u8`
        )

        /* -------------------------------------------------------------- */
        /* Success */
        /* -------------------------------------------------------------- */

        .on(
          'end',

          async () => {

            try {

              if (trackId) {

                await Track.findByIdAndUpdate(
                  trackId,
                  {
                    processingStatus:
                      'READY',
                  }
                );
              }

              console.log(
                '✅ HLS generation completed'
              );

              return resolve({
                success: true,
              });

            } catch (error) {

              console.error(
                '❌ Failed updating READY status'
              );

              console.error(error);

              return reject(error);
            }
          }
        )

        /* -------------------------------------------------------------- */
        /* Failure */
        /* -------------------------------------------------------------- */

        .on(
          'error',

          async (error) => {

            try {

              if (trackId) {

                await Track.findByIdAndUpdate(
                  trackId,
                  {
                    processingStatus:
                      'FAILED',
                  }
                );
              }

            } catch (
              statusError
            ) {

              console.error(
                '❌ Failed updating FAILED status'
              );

              console.error(
                statusError
              );
            }

            console.error(
              '❌ HLS generation failed'
            );

            console.error(error);

            return reject(error);
          }
        )

        .run();

      } catch (error) {

        console.error(error);

        return reject(error);
      }
    }
  );
};

export default generateHLS;
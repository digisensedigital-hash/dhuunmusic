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

          .outputOptions([
            '-codec:a aac',
            '-b:a 128k',
            '-hls_time 10',
            '-hls_playlist_type vod',
          ])

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

                /* ---------------------------------------------------------- */
                /* Mark Ready */
                /* ---------------------------------------------------------- */

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

                /* ---------------------------------------------------------- */
                /* Mark Failed */
                /* ---------------------------------------------------------- */

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
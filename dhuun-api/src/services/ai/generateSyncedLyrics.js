import axios from 'axios';

/* -------------------------------------------------------------------------- */
/* Generate Synced Lyrics */
/* -------------------------------------------------------------------------- */

const generateSyncedLyrics =
  async ({

    audioPath,

    lyrics,

  }) => {

    try {

      /* ------------------------------------------------------------------ */
      /* Validation */
      /* ------------------------------------------------------------------ */

      if (!audioPath) {

        throw new Error(
          'audioPath required'
        );
      }

      if (!lyrics) {

        throw new Error(
          'lyrics required'
        );
      }

      /* ------------------------------------------------------------------ */
      /* AI Alignment Request */
      /* ------------------------------------------------------------------ */

      const response =
        await axios.post(

          'http://127.0.0.1:9010/align',

          {
            audioPath,
            lyrics,
          },

          {
            timeout:
              1000 * 60 * 10,
          }
        );

      /* ------------------------------------------------------------------ */
      /* Debug Response */
      /* ------------------------------------------------------------------ */

      console.log(
        'AI RESPONSE:',
        JSON.stringify(
          response.data,
          null,
          2
        )
      );

      /* ------------------------------------------------------------------ */
      /* Validation */
      /* ------------------------------------------------------------------ */

      if (
        !response.data?.success
      ) {

        throw new Error(
          'alignment failed'
        );
      }

      /* ------------------------------------------------------------------ */
      /* Flexible Response Mapping */
      /* ------------------------------------------------------------------ */

      const syncedLyrics =

        response.data
          ?.syncedLyrics ||

        response.data
          ?.synced_lyrics ||

        response.data
          ?.data ||

        [];

      /* ------------------------------------------------------------------ */
      /* Final Validation */
      /* ------------------------------------------------------------------ */

      if (
        !Array.isArray(
          syncedLyrics
        )
      ) {

        throw new Error(
          'Invalid synced lyrics format'
        );
      }

      console.log(
        `✅ Synced lyrics lines: ${syncedLyrics.length}`
      );

      /* ------------------------------------------------------------------ */
      /* Return */
      /* ------------------------------------------------------------------ */

      return syncedLyrics;

    } catch (error) {

      console.error(
        '❌ generateSyncedLyrics failed'
      );

      console.error(error);

      throw error;
    }
  };

export default generateSyncedLyrics;
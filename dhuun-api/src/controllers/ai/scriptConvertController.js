import {
  convertLyricsScript as convertLyricsScriptService,
} from '../../services/scriptConversion.service.js';

export const convertLyricsScript =
  async (req, res) => {

    try {

      const {
        trackId,
        targetScript,
      } = req.body;

      /* ----------------------------------- */
      /* Validation */
      /* ----------------------------------- */

      if (!trackId) {

        return res.status(400)
          .json({

            success: false,

            message:
              'trackId required',
          });
      }

      if (!targetScript) {

        return res.status(400)
          .json({

            success: false,

            message:
              'Target script required',
          });
      }

      /* ----------------------------------- */
      /* Script Conversion Service */
      /* ----------------------------------- */

      const result =
        await convertLyricsScriptService({

          trackId,
          targetScript,
        });

      return res.json({

        success: true,

        source:
          result.source,

        lyrics:
          result.convertedLyrics,
      });

    } catch (error) {

      console.error(
        'convertLyricsScript error:',
        error
      );

      return res.status(500)
        .json({

          success: false,

          message:
            error.message ||
            'Failed to convert lyrics script',
        });
    }
  };
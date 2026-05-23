import {
  translateLyricsMeaning,
} from '../../services/meaningTranslation.service.js';

export const
translateLyricsMeaningController =
  async (req, res) => {

    try {

      const {
        trackId,

        targetLanguage =
          'English',
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

      /* ----------------------------------- */
      /* Service */
      /* ----------------------------------- */

      const result =
        await translateLyricsMeaning({

          trackId,

          targetLanguage,
        });

      /* ----------------------------------- */
      /* Response */
      /* ----------------------------------- */

      return res.json({

        success: true,

        source:
          result.source,

        lyrics:
          result.translatedLyrics,
      });

    } catch (error) {

      console.error(
        'translateLyricsMeaningController error:',
        error
      );

      return res.status(
        error.statusCode || 500
      )
        .json({

          success: false,

          message:
            error.message ||

            'Failed to translate lyrics meaning',
        });
    }
   };
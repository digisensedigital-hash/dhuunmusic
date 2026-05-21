import openai
  from '../../lib/openai.js';

export const convertLyricsScript =
  async (req, res) => {

    try {

      const {
        lyrics,
        targetScript,
      } = req.body;

      /* ----------------------------------- */
      /* Validation */
      /* ----------------------------------- */

      if (!lyrics) {

        return res.status(400)
          .json({

            success: false,

            message:
              'Lyrics required',
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
      /* AI Conversion */
      /* ----------------------------------- */

      const completion =
        await openai.chat.completions.create({

          model:
            'gpt-4.1-mini',

          messages: [

            {
              role: 'system',

              content:
                `
                You are a multilingual lyrical phonetic conversion engine.

                Your job is to convert lyrics into the requested writing system while preserving:

                - pronunciation
                - lyrical cadence
                - emotional flow
                - singability

                IMPORTANT:
                - DO NOT translate semantic meaning
                - DO NOT summarize
                - DO NOT explain
                - ONLY convert writing system / script
                - Preserve line breaks
                - Preserve song formatting
                `,
            },

            {
              role: 'user',

              content:
                `
                Convert these lyrics into ${targetScript} script:

                ${lyrics}
                `,
            },
          ],

          temperature: 0.3,
        });

      const convertedLyrics =
        completion.choices?.[0]
          ?.message?.content || '';

      return res.json({

        success: true,

        lyrics:
          convertedLyrics,
      });

    } catch (error) {

      console.error(error);

      return res.status(500)
        .json({

          success: false,

          message:
            'Failed to convert lyrics script',
        });
    }
  };
import Track from '../../models/Track.js';

import getPublicFileUrl
  from '../../services/storage/getPublicFileUrl.js';

export const getTrackStream =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      /* ------------------------------------------------------------------ */
      /* Public Catalog Protection */
      /* ------------------------------------------------------------------ */

      const track =
        await Track.findOne({

          _id: id,

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,
        });

      /* ------------------------------------------------------------------ */
      /* Final Defensive Visibility Check */
      /* ------------------------------------------------------------------ */

      if (

        !track ||

        track.publishingStatus !==
          'PUBLISHED' ||

        track.processingStatus !==
          'READY' ||

        track.isActive !== true

      ) {

        return res.status(404)
          .json({
            success: false,

            message:
              'Track not found',
          });
      }

      /* ------------------------------------------------------------------ */
      /* Stream Validation */
      /* ------------------------------------------------------------------ */

      if (!track.hlsMasterUrl) {

        return res.status(400)
          .json({
            success: false,

            message:
              'Track stream unavailable',
          });
      }

      /* ------------------------------------------------------------------ */
      /* Generate Public Stream URL */
      /* ------------------------------------------------------------------ */

      const streamUrl =
        getPublicFileUrl(
          track.hlsMasterUrl
        );

      /* ------------------------------------------------------------------ */
      /* Stream Audit Logging */
      /* ------------------------------------------------------------------ */


      return res.json({
        success: true,

        trackId:
          track._id,

        streamUrl,
      });

    } catch (error) {

      console.error(error);

      return res.status(500)
        .json({
          success: false,

          message:
            'Failed to generate stream',
        });
    }
  };
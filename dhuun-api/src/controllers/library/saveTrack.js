import SavedTrack
  from '../../models/SavedTrack.js';

import Track
  from '../../models/Track.js';

export default async function
saveTrack(
  req,
  res
) {

  try {

    /* ----------------------------------- */
    /* Auth Guard */
    /* ----------------------------------- */

    if (!req.user?._id) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required',
      });

    }

    /* ----------------------------------- */
    /* Params */
    /* ----------------------------------- */

    const {
      trackId,
    } = req.params;

    if (!trackId) {

      return res.status(400).json({

        success: false,

        message:
          'trackId required',
      });

    }

    /* ----------------------------------- */
    /* Validate Track */
    /* ----------------------------------- */

    const track =
      await Track.findOne({

        _id: trackId,

        publishingStatus:
          'PUBLISHED',

        isActive: true,
      });

    if (!track) {

      return res.status(404).json({

        success: false,

        message:
          'Track not found',
      });

    }

    /* ----------------------------------- */
    /* Prevent Duplicates */
    /* ----------------------------------- */

    await SavedTrack.findOneAndUpdate(

      {

        userId:
          req.user._id,

        trackId,
      },

      {

        userId:
          req.user._id,

        trackId,
      },

      {

        upsert: true,

        new: true,

        setDefaultsOnInsert: true,
      }
    );

    /* ----------------------------------- */
    /* Response */
    /* ----------------------------------- */

    return res.json({

      success: true,

      message:
        'Track saved successfully',
    });

  } catch (error) {

    console.error(
      'SAVE_TRACK_ERROR',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Failed to save track',
    });

  }

}
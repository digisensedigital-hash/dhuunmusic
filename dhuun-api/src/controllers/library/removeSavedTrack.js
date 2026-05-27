import SavedTrack
  from '../../models/SavedTrack.js';

export default async function
removeSavedTrack(
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
    /* Remove */
    /* ----------------------------------- */

    await SavedTrack.deleteOne({

      userId:
        req.user._id,

      trackId,
    });

    /* ----------------------------------- */
    /* Response */
    /* ----------------------------------- */

    return res.json({

      success: true,

      message:
        'Track removed successfully',
    });

  } catch (error) {

    console.error(
      'REMOVE_SAVED_TRACK_ERROR',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Failed to remove saved track',
    });

  }

}
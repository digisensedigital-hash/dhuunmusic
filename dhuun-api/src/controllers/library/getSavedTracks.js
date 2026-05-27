import SavedTrack
  from '../../models/SavedTrack.js';

export default async function
getSavedTracks(
  req,
  res
) {

  try {

    /* ----------------------------------- */
    /* Auth Guard */
    /* ----------------------------------- */

    if (!req.user?._id) {

      return res.json({

        success: true,

        tracks: [],
      });

    }

    /* ----------------------------------- */
    /* Fetch Saved Tracks */
    /* ----------------------------------- */

    const savedTracks =
      await SavedTrack.find({

        userId:
          req.user._id,

      })

      .sort({
        createdAt: -1,
      })

      .populate({

        path: 'trackId',

        match: {

          publishingStatus:
            'PUBLISHED',

          isActive: true,
        },

        populate: {

          path:
            'primaryArtists',

          select:
            'stageName profileImage slug',
        },
      });

    /* ----------------------------------- */
    /* Normalize */
    /* ----------------------------------- */

    const tracks =
      savedTracks

        .filter(
          (item) =>
            item.trackId
        )

        .map((item) => {

            const track =
                item.trackId
                .toObject();

            return {

                ...track,

                id:
                track._id.toString(),
            };
            });

    /* ----------------------------------- */
    /* Response */
    /* ----------------------------------- */

    return res.json({

      success: true,

      tracks,
    });

  } catch (error) {

    console.error(
      'GET_SAVED_TRACKS_ERROR',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Failed to load saved tracks',
    });

  }

}
import TrendingTrack
  from '../../models/TrendingTrack.js';

export const getTrendingTracks =
  async (req, res) => {
    try {

      const trendingTracks =
        await TrendingTrack.find({
          window: 'DAILY'
        })
          .sort({ rank: 1 })
          .populate({
            path: 'trackId',

            match: {

              processingStatus:
                'READY',

              publishingStatus:
                'PUBLISHED',

              isActive: true,
            },

            populate: {
              path: 'primaryArtist',

              select:
                'stageName profileImage'
            }
          });

      // -----------------------------------
      // Remove Null Hydrated Tracks
      // -----------------------------------

      const tracks =
        trendingTracks.filter(
          item => item.trackId
        );

      res.json({
        success: true,

        tracks
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch trending tracks'
      });
    }
  };
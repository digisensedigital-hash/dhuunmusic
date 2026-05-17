import TrendingTrack
  from '../../models/TrendingTrack.js';

export const getTrendingTracks =
  async (req, res) => {
    try {
      const tracks =
        await TrendingTrack.find({
          window: 'DAILY'
        })
          .sort({ rank: 1 })
          .populate({
            path: 'trackId',
            populate: {
              path: 'primaryArtist',
              select:
                'stageName profileImage'
            }
          });

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
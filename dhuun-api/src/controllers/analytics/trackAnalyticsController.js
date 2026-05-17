import TrackAnalytics
  from '../../models/TrackAnalytics.js';

export const getTrackAnalytics =
  async (req, res) => {
    try {
      const { trackId } = req.params;

      const analytics =
        await TrackAnalytics.findOne({
          trackId
        });

      if (!analytics) {
        return res.status(404).json({
          success: false,
          message:
            'Analytics not found'
        });
      }

      const averageListenDuration =
        analytics.totalStreams > 0
          ? (
              analytics.totalListeningTime /
              analytics.totalStreams
            )
          : 0;

      res.json({
        success: true,

        analytics: {
          trackId:
            analytics.trackId,

          totalStreams:
            analytics.totalStreams,

          qualifiedStreams:
            analytics.qualifiedStreams,

          totalListeningTime:
            analytics.totalListeningTime,

          completionRate:
            analytics.completionRate,

          averageListenDuration,

          uniqueListeners:
            analytics.uniqueListeners,

          lastStreamedAt:
            analytics.lastStreamedAt
        }
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch analytics'
      });
    }
  };
import Track from '../../models/Track.js';

import TrackAnalytics
  from '../../models/TrackAnalytics.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

export const getPublicTrackDetails =
  async (req, res) => {
    try {
      const { id } = req.params;

      const track =
        await Track.findOne({
          _id: id,

          /*
          |--------------------------------------------------------------------------
          | Publishing Protection
          |--------------------------------------------------------------------------
          | Only publicly available tracks
          */

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,
        })
          .populate(
            'primaryArtist',
            'stageName profileImage bio'
          );

      if (!track) {
        return res.status(404).json({
          success: false,

          message:
            'Track not found'
        });
      }

      const analytics =
        await TrackAnalytics.findOne({
          trackId: track._id
        });

      const trending =
        await TrendingTrack.findOne({
          trackId: track._id,

          window: 'DAILY'
        });

      return res.json({
        success: true,

        track:
          serializeTrack(track),

        analytics: analytics
          ? {
              totalStreams:
                analytics.totalStreams,

              qualifiedStreams:
                analytics.qualifiedStreams,

              completionRate:
                analytics.completionRate,

              totalListeningTime:
                analytics.totalListeningTime
            }
          : null,

        trending: trending
          ? {
              rank:
                trending.rank,

              score:
                trending.score
            }
          : null
      });

    } catch (error) {
      console.error(error);

      return res.status(500)
        .json({
          success: false,

          message:
            'Failed to fetch track details'
        });
    }
  };
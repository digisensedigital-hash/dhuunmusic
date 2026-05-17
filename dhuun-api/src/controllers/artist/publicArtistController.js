import Artist from '../../models/Artist.js';

import Track from '../../models/Track.js';

import ArtistAnalytics
  from '../../models/ArtistAnalytics.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

export const getPublicArtistProfile =
  async (req, res) => {
    try {
      const { id } = req.params;

      const artist =
        await Artist.findById(id);

      if (!artist) {
        return res.status(404).json({
          success: false,
          message: 'Artist not found'
        });
      }

      const analytics =
        await ArtistAnalytics.findOne({
          artistId: artist._id
        });

      const topTracks =
        await Track.find({
          primaryArtist:
            artist._id
        })
          .sort({
            createdAt: -1
          })
          .limit(10);

      const trendingTracks =
        await TrendingTrack.find()
          .sort({ rank: 1 })
          .populate('trackId');

      const artistTrendingTracks =
        trendingTracks.filter(
          (item) =>
            item.trackId
              ?.primaryArtist
              ?.toString() ===
            artist._id.toString()
        );

      res.json({
        success: true,

        artist: {
          id: artist._id,

          stageName:
            artist.stageName,

          bio: artist.bio,

          profileImage:
            artist.profileImage,

          verified:
            artist.verified
        },

        analytics: analytics
          ? {
              totalStreams:
                analytics.totalStreams,

              qualifiedStreams:
                analytics.qualifiedStreams,

              totalListeningTime:
                analytics.totalListeningTime,

              averageCompletionRate:
                analytics.averageCompletionRate,

              totalTracks:
                analytics.totalTracks
            }
          : null,

        topTracks,

        trendingTracks:
          artistTrendingTracks
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch artist profile'
      });
    }
  };
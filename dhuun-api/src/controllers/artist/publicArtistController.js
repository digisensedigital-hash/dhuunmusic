import Artist from '../../models/Artist.js';

import Track from '../../models/Track.js';

import ArtistAnalytics
  from '../../models/ArtistAnalytics.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

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

      const topTracksRaw =
        await Track.find({
          primaryArtist:
            artist._id,

          processingStatus:
            'READY'
        })
          .populate(
            'primaryArtist'
          )
          .sort({
            createdAt: -1
          })
          .limit(10);

      const trendingTracksRaw =
        await TrendingTrack.find()
          .sort({ rank: 1 })
          .populate({
            path: 'trackId',
            populate: {
              path: 'primaryArtist'
            }
          });

      const artistTrendingTracks =
        trendingTracksRaw
          .filter(
            (item) =>
              item.trackId
                ?.primaryArtist
                ?._id
                ?.toString() ===
              artist._id.toString()
          )
          .map((item) =>
            serializeTrack(
              item.trackId
            )
          );

      const topTracks =
        topTracksRaw.map(
          serializeTrack
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
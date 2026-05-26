import TrendingTrack
  from '../../models/TrendingTrack.js';

import TrackAnalytics
  from '../../models/TrackAnalytics.js';

import Track
  from '../../models/Track.js';

export const updateTrendingTracks =
  async () => {

    try {

      // -----------------------------------
      // Load Analytics
      // -----------------------------------

      const analytics =
        await TrackAnalytics.find();

      // -----------------------------------
      // Build Track ID List
      // -----------------------------------

      const trackIds =
        analytics.map(
          (item) =>
            item.trackId
        );

      // -----------------------------------
      // Load Publicly Eligible Tracks
      // -----------------------------------

      const visibleTracks =
        await Track.find({

          _id: {
            $in: trackIds
          },

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,
        })
          .select('_id')
          .lean();

      // -----------------------------------
      // Visibility Map
      // -----------------------------------

      const visibleTrackIds =
        new Set(
          visibleTracks.map(
            (track) =>
              track._id.toString()
          )
        );

      // -----------------------------------
      // Score Eligible Tracks
      // -----------------------------------

      const scoredTracks =
        analytics

          .filter(
            (item) =>
              visibleTrackIds.has(
                item.trackId.toString()
              )
          )

          .map((item) => {

            const score =
              (
                item.qualifiedStreams *
                0.7
              ) +
              (
                item.completionRate *
                100 *
                0.3
              );

            return {

              trackId:
                item.trackId,

              score,

              qualifiedStreams:
                item.qualifiedStreams,

              completionRate:
                item.completionRate,

              totalListeningTime:
                item.totalListeningTime
            };
          });

      // -----------------------------------
      // Rank Descending
      // -----------------------------------

      scoredTracks.sort(
        (a, b) =>
          b.score - a.score
      );

      // -----------------------------------
      // Reset Daily Trending
      // -----------------------------------

      await TrendingTrack.deleteMany({
        window: 'DAILY'
      });

      // -----------------------------------
      // Rebuild Trending Index
      // -----------------------------------

      for (
        let i = 0;
        i < scoredTracks.length;
        i++
      ) {

        const track =
          scoredTracks[i];

        await TrendingTrack.create({

          trackId:
            track.trackId,

          score:
            track.score,

          rank:
            i + 1,

          qualifiedStreams:
            track.qualifiedStreams,

          completionRate:
            track.completionRate,

          totalListeningTime:
            track.totalListeningTime,

          window:
            'DAILY'
        });
      }

      console.log(
        'TRENDING_TRACKS_UPDATED',
        scoredTracks.length
      );

    } catch (error) {

      console.error(error);
    }
  };

export default updateTrendingTracks;
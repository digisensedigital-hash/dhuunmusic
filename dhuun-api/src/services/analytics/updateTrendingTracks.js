import TrendingTrack
  from '../../models/TrendingTrack.js';

import TrackAnalytics
  from '../../models/TrackAnalytics.js';

export const updateTrendingTracks =
  async () => {
    try {
      const analytics =
        await TrackAnalytics.find();

      const scoredTracks =
        analytics.map((item) => {
          const score =
            (
              item.qualifiedStreams * 0.7
            ) +
            (
              item.completionRate * 100 * 0.3
            );

          return {
            trackId: item.trackId,

            score,

            qualifiedStreams:
              item.qualifiedStreams,

            completionRate:
              item.completionRate,

            totalListeningTime:
              item.totalListeningTime
          };
        });

      scoredTracks.sort(
        (a, b) =>
          b.score - a.score
      );

      await TrendingTrack.deleteMany({
        window: 'DAILY'
      });

      for (
        let i = 0;
        i < scoredTracks.length;
        i++
      ) {
        const track =
          scoredTracks[i];

        await TrendingTrack.create({
          trackId: track.trackId,

          score: track.score,

          rank: i + 1,

          qualifiedStreams:
            track.qualifiedStreams,

          completionRate:
            track.completionRate,

          totalListeningTime:
            track.totalListeningTime,

          window: 'DAILY'
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
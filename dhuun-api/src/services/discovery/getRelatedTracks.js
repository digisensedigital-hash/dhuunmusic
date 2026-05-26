import Track from "../../models/Track.js";
import TrendingTrack from "../../models/TrendingTrack.js";
import TrackAnalytics from "../../models/TrackAnalytics.js";

import serializeTrack from "../../serializers/serializeTrack.js";

const MAX_RESULTS = 20;

function calculateRelatedScore({
  sameGenre,
  sameArtist,
  trendingScore = 0,
  completionRate = 0,
}) {
  let score = 0;

  // Strong contextual signal
  if (sameGenre) score += 40;

  // Artist continuation signal
  if (sameArtist) score += 25;

  // Discovery boost
  score += trendingScore * 2;

  // Quality / engagement boost
  score += completionRate * 10;

  return score;
}

export default async function getRelatedTracks(
  trackId
) {
  // ---------------------------------------------------
  // Load Source Track
  // ---------------------------------------------------

  const sourceTrack =
  await Track.findOne({
    _id: trackId,

    processingStatus:
      'READY',

    publishingStatus:
      'PUBLISHED',

    isActive: true,
  })
      .populate(
        'primaryArtist',
        'stageName profileImage'
      )
      .lean();

  if (!sourceTrack) {
  return {
    track: null,
    relatedTracks: [],
  };
  }

  // ---------------------------------------------------
  // Candidate Pools
  // ---------------------------------------------------

  const [
    genreTracks,
    artistTracks,
    trendingTracks
  ] = await Promise.all([
    // Same Genre
    Track.find({
      genre: sourceTrack.genre,

      _id: {
        $ne: sourceTrack._id
      },

      processingStatus:
        'READY',

      publishingStatus:
        'PUBLISHED',

      isActive: true,
    })
      .populate(
        'primaryArtist',
        'stageName profileImage'
      )
      .limit(50)
      .lean(),

    // Same Artist
    sourceTrack.primaryArtist?._id

      ? Track.find({
        primaryArtist:
          sourceTrack.primaryArtist._id,

        _id: {
          $ne: sourceTrack._id
        },

        processingStatus:
          'READY',

        publishingStatus:
          'PUBLISHED',

        isActive: true,
      })
          .populate(
            'primaryArtist',
            'stageName profileImage'
          )
          .limit(50)
          .lean()

      : Promise.resolve([])
      .populate(
        'primaryArtist',
        'stageName profileImage'
      )
      .limit(50)
      .lean(),

    // Trending Pool
    TrendingTrack.find({})
      .sort({
        score: -1
      })
      .limit(50)
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
      })
      .lean(),
  ]);

  // ---------------------------------------------------
  // Merge Candidate Pools
  // ---------------------------------------------------

  const candidateMap =
    new Map();

  // Genre Tracks
  for (const track of genreTracks) {
    candidateMap.set(
      track._id.toString(),
      {
        track,

        sameGenre: true,

        sameArtist: false,

        trendingScore: 0,
      }
    );
  }

  // Artist Tracks
  for (const track of artistTracks) {
    const key =
      track._id.toString();

    if (
      candidateMap.has(key)
    ) {
      candidateMap
        .get(key)
        .sameArtist = true;
    } else {
      candidateMap.set(key, {
        track,

        sameGenre: false,

        sameArtist: true,

        trendingScore: 0,
      });
    }
  }

  // Trending Tracks
  for (const trending of trendingTracks) {
    if (
      !trending.trackId
    ) {
      continue;
    }

    // Prevent current track
    // from re-entering queue
    if (
      trending.trackId._id.toString() ===
      sourceTrack._id.toString()
    ) {
      continue;
    }

    const track =
      trending.trackId;

    const key =
      track._id.toString();

    if (
      candidateMap.has(key)
    ) {
      candidateMap.get(
        key
      ).trendingScore =
        trending.score || 0;
    } else {
      candidateMap.set(key, {
        track,

        sameGenre: false,

        sameArtist: false,

        trendingScore:
          trending.score || 0,
      });
    }
  }

  // ---------------------------------------------------
  // Load Analytics
  // ---------------------------------------------------

  const candidateIds =
    Array.from(
      candidateMap.values()
    ).map(
      (item) =>
        item.track._id
    );

  const analytics =
    await TrackAnalytics.find({
      track: {
        $in: candidateIds
      },
    }).lean();

  const analyticsMap =
    new Map();

  for (const item of analytics) {
    analyticsMap.set(
      item.track.toString(),
      item
    );
  }

  // ---------------------------------------------------
  // Score Candidates
  // ---------------------------------------------------

  const scoredTracks = [];

  for (
    const candidate of
    candidateMap.values()
  ) {
    const trackId =
      candidate.track._id.toString();

    const analyticsData =
      analyticsMap.get(
        trackId
      );

    const completionRate =
      analyticsData
        ?.completionRate || 0;

    const score =
      calculateRelatedScore({
        sameGenre:
          candidate.sameGenre,

        sameArtist:
          candidate.sameArtist,

        trendingScore:
          candidate.trendingScore,

        completionRate,
      });

    scoredTracks.push({
      track:
        candidate.track,

      score,

      reasons: {
        sameGenre:
          candidate.sameGenre,

        sameArtist:
          candidate.sameArtist,

        trendingScore:
          candidate.trendingScore,

        completionRate,
      },
    });
  }

  // ---------------------------------------------------
  // Sort by Score
  // ---------------------------------------------------

  scoredTracks.sort(
    (a, b) =>
      b.score - a.score
  );

  // ---------------------------------------------------
  // Limit Results
  // ---------------------------------------------------

  const visibleScoredTracks =
  scoredTracks.filter(
    item =>
      item.track &&
      item.track.publishingStatus ===
        'PUBLISHED' &&
      item.track.isActive === true
  );

  const finalTracks =
    visibleScoredTracks
      .slice(
        0,
        MAX_RESULTS
      )
      .map((item) => ({
        ...serializeTrack(
          item.track
        ),

        relatedScore:
          item.score,
      }));

  return {
    track:
      serializeTrack(
        sourceTrack
      ),

    relatedTracks:
      finalTracks,
  };
}
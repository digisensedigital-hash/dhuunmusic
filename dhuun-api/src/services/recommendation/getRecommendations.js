import Track from '../../models/Track.js';

import SavedTrack from '../../models/SavedTrack.js';

import RecentlyPlayed
  from '../../models/RecentlyPlayed.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

export default async function
getRecommendations({
  userId,
  seedTrackId = null,
} = {}) {

  // -----------------------------------
  // Defensive Guard
  // -----------------------------------

  if (
    !userId &&
    !seedTrackId
  ) {
    return [];
  }

  const savedTracks =
    userId
      ? await SavedTrack.find({
          userId,
        }).populate('trackId')
      : [];

  const recentlyPlayed =
    userId
      ? await RecentlyPlayed.find({
          userId,
        }).populate('trackId')
      : [];

  // -----------------------------------
  // Seed Track
  // -----------------------------------

  let seedTrack = null;

  if (seedTrackId) {
    seedTrack =
      await Track.findById(
        seedTrackId
      ).populate(
        'primaryArtist',
        'stageName profileImage'
      );
  }

  // -----------------------------------
  // Preference Signals
  // -----------------------------------

  const preferredGenres =
    new Set();

  const preferredArtists =
    new Set();

  for (const item of savedTracks) {
    if (item.trackId?.genre) {
      preferredGenres.add(
        item.trackId.genre
      );
    }

    if (
      item.trackId
        ?.primaryArtist
    ) {
      preferredArtists.add(
        item.trackId.primaryArtist.toString()
      );
    }
  }

  for (const item of recentlyPlayed) {
    if (item.trackId?.genre) {
      preferredGenres.add(
        item.trackId.genre
      );
    }

    if (
      item.trackId
        ?.primaryArtist
    ) {
      preferredArtists.add(
        item.trackId.primaryArtist.toString()
      );
    }
  }

  // -----------------------------------
  // Trending Candidate Pool
  // -----------------------------------

  const trendingTracks =
    await TrendingTrack.find({
      window: 'DAILY',
    })
      .sort({
        rank: 1,
      })
      .limit(100);

  const trackScores = [];

  // -----------------------------------
  // Score Tracks
  // -----------------------------------

  for (const trending of trendingTracks) {
    const track =
      await Track.findById(
        trending.trackId
      ).populate(
        'primaryArtist',
        'stageName profileImage'
      );

    if (!track) {
      continue;
    }

    // -----------------------------------
    // Avoid Recommending
    // Current Seed Track
    // -----------------------------------

    if (
      seedTrackId &&
      track._id.toString() ===
        seedTrackId.toString()
    ) {
      continue;
    }

    let score = 0;

    let reason =
      'Trending for listeners like you';

    // -----------------------------------
    // Trending Base Score
    // -----------------------------------

    score +=
      trending.score || 0;

    // -----------------------------------
    // Genre Affinity
    // -----------------------------------

    if (
      preferredGenres.has(
        track.genre
      )
    ) {
      score += 25;

      reason =
        `Because you enjoy ${track.genre}`;
    }

    // -----------------------------------
    // Artist Affinity
    // -----------------------------------

    if (
      preferredArtists.has(
        track.primaryArtist
          ?._id?.toString()
      )
    ) {
      score += 40;

      reason =
        `Similar to ${track.primaryArtist?.stageName}`;
    }

    // -----------------------------------
    // Seed Track Genre
    // -----------------------------------

    if (
      seedTrack?.genre &&
      seedTrack.genre ===
        track.genre
    ) {
      score += 60;

      reason =
        `More ${track.genre} vibes`;
    }

    // -----------------------------------
    // Seed Track Artist
    // -----------------------------------

    if (
      seedTrack
        ?.primaryArtist?._id
          ?.toString() ===
      track.primaryArtist
        ?._id?.toString()
    ) {
      score += 80;

      reason =
        `More from ${track.primaryArtist?.stageName}`;
    }

    trackScores.push({
      track,

      score,

      reason,
    });
  }

  // -----------------------------------
  // Sort + Limit
  // -----------------------------------

  trackScores.sort(
    (a, b) =>
      b.score - a.score
  );

  return trackScores.slice(
    0,
    25
  );
}
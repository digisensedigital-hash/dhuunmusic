import Track from '../../models/Track.js';

import SavedTrack from '../../models/SavedTrack.js';

import RecentlyPlayed
  from '../../models/RecentlyPlayed.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

export default async function
getRecommendations(userId) {
  const savedTracks =
    await SavedTrack.find({
      userId
    }).populate('trackId');

  const recentlyPlayed =
    await RecentlyPlayed.find({
      userId
    }).populate('trackId');

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
      item.trackId?.primaryArtist
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
      item.trackId?.primaryArtist
    ) {
      preferredArtists.add(
        item.trackId.primaryArtist.toString()
      );
    }
  }

  const trendingTracks =
    await TrendingTrack.find({
      window: 'DAILY'
    })
      .sort({
        rank: 1
      })
      .limit(100);

  const trackScores = [];

  for (const trending of trendingTracks) {
    const track =
      await Track.findById(
        trending.trackId
      ).populate(
        'primaryArtist',
        'stageName profileImage'
      );

    if (!track) continue;

    let score = 0;

    let reason =
    'Trending for listeners like you';

    score += trending.score || 0;

    if (
    preferredGenres.has(
      track.genre
    )
    ) {
      score += 25;

      reason =
        `Because you enjoy ${track.genre}`;
    }

    if (
      preferredArtists.has(
        track.primaryArtist?._id?.toString()
      )
    ) {
      score += 40;

      reason =
        `Similar to ${track.primaryArtist?.stageName}`;
    }

    trackScores.push({
      track,
      score,
      reason,
    });
  }

  trackScores.sort(
    (a, b) => b.score - a.score
  );

  return trackScores.slice(0, 25);
}
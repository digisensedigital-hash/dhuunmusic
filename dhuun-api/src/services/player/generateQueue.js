import Track from '../../models/Track.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

import getRecommendations
  from '../recommendation/getRecommendations.js';

import getRelatedTracks
  from '../discovery/getRelatedTracks.js';

import dedupeQueue
  from '../../utils/player/dedupeQueue.js';

import balanceQueue
  from '../../utils/player/balanceQueue.js';

export default async function
generateQueue({
  trackId,
  userId
}) {

  const currentTrack =
    await Track.findById(
      trackId
    ).populate(
      'primaryArtist',
      'stageName profileImage'
    );

  if (!currentTrack) {
    return null;
  }

  // -----------------------------------
  // Contextual Continuation
  // -----------------------------------

  const related =
    await getRelatedTracks(
      trackId
    );

  // -----------------------------------
  // Personalized Recommendations
  // -----------------------------------

  const recommendations =
    await getRecommendations({
      userId,
    });

  // -----------------------------------
  // Trending Expansion
  // -----------------------------------

  const trending =
    await TrendingTrack.find({
      window: 'DAILY'
    })
      .sort({
        rank: 1
      })
      .limit(25)
      .populate({
        path: 'trackId',

        populate: {
          path: 'primaryArtist',

          select:
            'stageName profileImage'
        }
      });

  // -----------------------------------
  // Queue Assembly
  // -----------------------------------

  const queueTracks = [];

  // -----------------------------------
  // Related Tracks First
  // -----------------------------------

  for (const item of related.relatedTracks) {

    if (
      item.id?.toString() ===
      trackId
    ) {
      continue;
    }

    queueTracks.push(item);
  }

  // -----------------------------------
  // Recommendations Second
  // -----------------------------------

  for (const item of recommendations) {

    if (
      item.track?._id?.toString() ===
      trackId
    ) {
      continue;
    }

    if (!item.track) {
      continue;
    }

    queueTracks.push(
      item.track
    );
  }

  // -----------------------------------
  // Trending Expansion
  // -----------------------------------

  for (const item of trending) {

    if (!item.trackId) {
      continue;
    }

    if (
      item.trackId._id.toString() ===
      trackId
    ) {
      continue;
    }

    queueTracks.push(
      item.trackId
    );
  }

  // -----------------------------------
  // Playback Safety Filter
  // -----------------------------------

  const playableQueue =
    queueTracks.filter(
      (track) =>

        track &&

        track.isActive ===
          true &&

        track.processingStatus ===
          'READY' &&

        track.publishingStatus ===
          'PUBLISHED'
    );

  // -----------------------------------
  // Playback Intelligence Pipeline
  // -----------------------------------

  const dedupedQueue =
    dedupeQueue(
      playableQueue
    );

  const balancedQueue =
    balanceQueue(
      dedupedQueue
    );

  return {

    currentTrack,

    nextTracks:
      balancedQueue.slice(
        0,
        25
      )
  };
}
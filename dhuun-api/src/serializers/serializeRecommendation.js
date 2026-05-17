import serializeTrack
  from './serializeTrack.js';

export default function
serializeRecommendation(item) {
  if (!item) return null;

  return {
    score: item.score,

    track:
      serializeTrack(
        item.track
      )
  };
}
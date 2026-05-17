import serializeTrack
  from './serializeTrack.js';

export default function
serializeRecentlyPlayed(item) {
  if (!item) return null;

  return {
    id: item._id,

    playedAt: item.playedAt,

    duration: item.duration,

    track:
      serializeTrack(
        item.trackId
      )
  };
}
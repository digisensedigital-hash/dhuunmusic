import serializeTrack
  from './serializeTrack.js';

export default function
serializeSavedTrack(item) {
  if (!item) return null;

  return {
    id: item._id,

    savedAt: item.savedAt,

    track:
      serializeTrack(
        item.trackId
      )
  };
}
import serializeTrack
  from './serializeTrack.js';

export default function
serializeSavedTrack(
  item
) {

  if (!item?.trackId) {
    return null;
  }

  const track =
    serializeTrack(
      item.trackId
    );

  return {

    ...track,

    savedAt:
      item.savedAt,
  };
}
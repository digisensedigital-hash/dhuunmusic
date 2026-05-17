export default function dedupeQueue(
  tracks = []
) {
  const map =
    new Map();

  for (const track of tracks) {
    const trackId =
      track.id?.toString?.() ||
      track._id?.toString?.();

    if (!trackId) {
      continue;
    }

    if (!map.has(trackId)) {
      map.set(
        trackId,
        track
      );
    }
  }

  return Array.from(
    map.values()
  );
}
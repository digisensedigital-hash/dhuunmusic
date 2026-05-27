export default function balanceQueue(
  tracks = []
) {
  if (!tracks.length) {
    return [];
  }

  const balanced = [];
  const remaining = [...tracks];

  let lastArtistId = null;

  while (remaining.length > 0) {
    let selectedIndex = -1;

    // -----------------------------------
    // Find Track With Different Artist
    // -----------------------------------

    for (
      let i = 0;
      i < remaining.length;
      i++
    ) {
      const track =
        remaining[i];

      const artistId =
        track.primaryArtists?.[0]?._id?.toString?.() ||
        track.primaryArtists?.[0]?.toString?.() ||
        null;

      if (
        artistId !==
        lastArtistId
      ) {
        selectedIndex = i;
        break;
      }
    }

    // -----------------------------------
    // Fallback
    // -----------------------------------

    if (selectedIndex === -1) {
      selectedIndex = 0;
    }

    const selectedTrack =
      remaining.splice(
        selectedIndex,
        1
      )[0];

    balanced.push(
      selectedTrack
    );

    lastArtistId =
      selectedTrack
        .primaryArtists?._id
        ?.toString?.() ||
      selectedTrack
        .primaryArtists
        ?.toString?.() ||
      null;
  }

  return balanced;
}
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
        track.primaryArtist?._id?.toString?.() ||
        track.primaryArtist?.toString?.() ||
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
        .primaryArtist?._id
        ?.toString?.() ||
      selectedTrack
        .primaryArtist
        ?.toString?.() ||
      null;
  }

  return balanced;
}
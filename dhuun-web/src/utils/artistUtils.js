export function getTrackArtists(track) {

  return (
    track?.primaryArtists || []
  );
}

export function getTrackArtistNames(track) {

  return getTrackArtists(track)

    .map(
      (artist) =>
        artist?.stageName
    )

    .filter(Boolean)

    .join(', ');
}

export function getPrimaryArtist(track) {

  return (
    track?.primaryArtists?.[0] ||
    null
  );
}
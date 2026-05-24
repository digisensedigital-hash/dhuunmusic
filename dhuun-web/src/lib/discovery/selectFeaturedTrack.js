export default function
selectFeaturedTrack({
  tracks = [],
  recentlyPlayed = [],
}) {

  if (!tracks.length) {
    return null;
  }

  // -----------------------------------
  // Emotional Vocabulary
  // -----------------------------------

  const emotionalWords = [

    'dil',
    'ishq',
    'mohabbat',
    'yaad',
    'khwaab',
    'raat',
    'judai',
    'safar',
    'dua',
    'rooh',
    'sufi',
    'jazba',
    'love',
    'heart',
    'lonely',
    'pain',
    'soul',
    'dream',
    'night',
    'silence',

  ];

  // -----------------------------------
  // Recently Played Lookup
  // -----------------------------------

  const recentlyPlayedIds =
    new Set(

      recentlyPlayed.map(
        (track) =>

          track?.id ||
          track?._id
      )
    );

  // -----------------------------------
  // Score Tracks
  // -----------------------------------

  const scoredTracks =

    tracks

      .map(
        (item) => {

          const track =
            item?.track || item;

          if (!track) {

            return null;
          }

          let score = 0;

          // -----------------------------------
          // Lyrics Presence
          // -----------------------------------

          if (
            track.lyrics
          ) {
            score += 35;
          }

          // -----------------------------------
          // Synced Lyrics
          // -----------------------------------

          if (

            track.syncedLyricsStatus ===
            'READY'

          ) {
            score += 30;
          }

          // -----------------------------------
          // Artwork Presence
          // -----------------------------------

          if (
            track.coverImage
          ) {
            score += 20;
          }

          // -----------------------------------
          // Duration Weight
          // -----------------------------------

          if (
            track.duration >= 120
          ) {
            score += 10;
          }

          // -----------------------------------
          // Emotional Density
          // -----------------------------------

          const lyricsText =

            (
              track.lyrics || ''
            ).toLowerCase();

          emotionalWords.forEach(
            (word) => {

              if (
                lyricsText.includes(
                  word
                )
              ) {

                score += 4;
              }
            }
          );

          // -----------------------------------
          // Variant Bonus
          // -----------------------------------

          if (
            track.hasVariants
          ) {
            score += 6;
          }

          // -----------------------------------
          // Recently Played
          // -----------------------------------

          const trackId =

            track.id ||
            track._id;

          if (

            recentlyPlayedIds.has(
              trackId
            )

          ) {
            score += 14;
          }

          // -----------------------------------
          // Explicit Penalty
          // -----------------------------------

          if (
            track.isExplicit
          ) {
            score -= 10;
          }

          return {
            track,
            score,
          };
        }
      )

      .filter(Boolean);

  // -----------------------------------
  // No Valid Tracks
  // -----------------------------------

  if (!scoredTracks.length) {
    return null;
  }

  // -----------------------------------
  // Sort By Score
  // -----------------------------------

  scoredTracks.sort(
    (a, b) =>
      b.score - a.score
  );

  // -----------------------------------
  // Top Atmospheric Pool
  // -----------------------------------

  const topCandidates =

    scoredTracks.slice(
      0,
      5
    );

  // -----------------------------------
  // Hero Cooldown Memory
  // -----------------------------------

  const STORAGE_KEY =
    'dhuun_recent_hero_tracks';

  let recentHeroIds = [];

  try {

    recentHeroIds =
      JSON.parse(

        localStorage.getItem(
          STORAGE_KEY
        ) || '[]'

      );

  } catch {

    recentHeroIds = [];
  }

  // -----------------------------------
  // Remove Recently Featured
  // -----------------------------------

  const freshCandidates =

    topCandidates.filter(
      (item) => {

        const trackId =

          item?.track?.id ||
          item?.track?._id;

        return (

          trackId &&

          !recentHeroIds.includes(
            trackId
          )
        );
      }
    );

  // -----------------------------------
  // Candidate Pool
  // -----------------------------------

  const candidatePool =

    freshCandidates.length
      ? freshCandidates
      : topCandidates;

  /* ----------------------------------- */
    /* Rotating Deterministic Selection */
    /* ----------------------------------- */

    const rotationIndex =

    Math.floor(
        Date.now() /
        (1000 * 60 * 15)
    );

    const selectedTrack =

    candidatePool[
        rotationIndex %
        candidatePool.length
    ]?.track || null;

  // -----------------------------------
  // Persist Cooldown
  // -----------------------------------

  if (selectedTrack) {

    const selectedTrackId =

      selectedTrack.id ||
      selectedTrack._id;

    const updatedHistory = [

      selectedTrackId,

      ...recentHeroIds.filter(
        (id) =>

          id !==
          selectedTrackId
      ),

    ].slice(0, 5);

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        updatedHistory
      )
    );
  }

  // -----------------------------------
  // Final Result
  // -----------------------------------

  return selectedTrack;
}
import getPublicFileUrl
  from '../services/storage/getPublicFileUrl.js';

export default function
serializeTrack(track) {

  /* ---------------------------------------------------------------------- */
  /* Final Catalog Visibility Guard */
  /* ---------------------------------------------------------------------- */

  if (

    !track ||

    track.publishingStatus !==
      'PUBLISHED' ||

    track.processingStatus !==
      'READY' ||

    track.isActive !== true

  ) {

    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Variant Intelligence
  |--------------------------------------------------------------------------
  */

  const hasVariants =

    track.isMasterTrack ||

    !!track.masterTrackId;

  return {

    id: track._id,

    title: track.title,

    slug: track.slug,

    genre: track.genre,

    language:
      track.trackLanguage,

    lyrics: track.lyrics,

    allowMeaningGeneration:
      track.allowMeaningGeneration,

    syncedLyrics:
      track.syncedLyrics || [],

    syncedLyricsStatus:
      track.syncedLyricsStatus ||
      'NONE',

    contributors:
      track.contributors || [],

    isExplicit:
      track.isExplicit,

    duration:
      track.duration,

    /*
    |--------------------------------------------------------------------------
    | Variant Relationships
    |--------------------------------------------------------------------------
    */

    isMasterTrack:
      track.isMasterTrack || false,

    masterTrackId:
      track.masterTrackId || null,

    versionType:
      track.versionType ||
      'ORIGINAL',

    hasVariants,

    variantCount:
      track.variantCount || 1,

    /* ----------------------------------- */
    /* Media */
    /* ----------------------------------- */

    coverImage:
      track.coverImage
        ? getPublicFileUrl(
            track.coverImage
          )
        : '',

    streamUrl:
      track.hlsMasterUrl
        ? getPublicFileUrl(
            track.hlsMasterUrl
          )
        : '',

    /* ----------------------------------- */
    /* Artist */
    /* ----------------------------------- */

    primaryArtists:

      track.primaryArtists?.length

        ? track.primaryArtists.map(
            (artist) => ({

              id:
                artist._id,

              slug:
                artist.slug,

              stageName:
                artist.stageName,

              profileImage:

                artist?.profileImage

                  ? getPublicFileUrl(
                      artist.profileImage
                    )

                  : ''
            })
          )

        : [],
  };
}
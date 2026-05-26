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

    language: track.language,

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
      getPublicFileUrl(
        track.hlsMasterUrl
      ),

    /* ----------------------------------- */
    /* Artist */
    /* ----------------------------------- */

    primaryArtist:
      track.primaryArtist
        ? {

            id:
              track.primaryArtist._id,

            slug:
              track.primaryArtist.slug,

            stageName:
              track.primaryArtist
                .stageName,

            profileImage:
              track.primaryArtist
                ?.profileImage || ''

          }
        : null
  };
}
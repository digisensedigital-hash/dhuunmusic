import getPublicFileUrl
  from '../services/storage/getPublicFileUrl.js';

export default function
serializeTrack(track) {
  if (!track) return null;

  return {
    id: track._id,

    title: track.title,

    slug: track.slug,

    genre: track.genre,

    language: track.language,

    duration: track.duration,

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

    artist:
      track.primaryArtist
        ? {
            id:
              track.primaryArtist._id,

            stageName:
              track.primaryArtist
                .stageName,

            profileImage:
              track.primaryArtist
                .profileImage || ''
          }
        : null
  };
}
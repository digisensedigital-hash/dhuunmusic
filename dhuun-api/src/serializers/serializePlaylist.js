import serializeTrack
  from './serializeTrack.js';

export default function
serializePlaylist(playlist) {
  if (!playlist) return null;

  return {
    id: playlist._id,

    title: playlist.title,

    description:
      playlist.description,

    visibility:
      playlist.visibility,

    coverImage:
      playlist.coverImage || '',

    totalTracks:
      playlist.totalTracks,

    totalDuration:
      playlist.totalDuration,

    followersCount:
      playlist.followersCount,

    createdAt:
      playlist.createdAt,

    updatedAt:
      playlist.updatedAt,

    tracks:
      playlist.tracks?.map(
        (item) => ({
          id: item._id,

          addedAt:
            item.addedAt,

          track:
            serializeTrack(
              item.trackId
            )
        })
      ) || []
  };
}
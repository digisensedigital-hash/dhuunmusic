import {
  Play,
  Pause,
} from 'lucide-react';

import { useMemo }
  from 'react';

import {
  useParams,
} from 'react-router-dom';

import useHomeFeed
  from '../hooks/useHomeFeed';

import PlaylistTrackRow
  from '../components/playlists/PlaylistTrackRow';

import usePlayerStore
  from '../store/playerStore';

import {
  getMediaUrl,
} from '../utils/media';

export default function
PlaylistPage() {
  const { id } =
    useParams();

  const {
  currentTrack,
  isPlaying,
  togglePlayPause,
  playTrack,
  } = usePlayerStore();  

  const {
    data,
    loading,
  } = useHomeFeed();

  const trending =
    data?.home?.trending || [];

  // -----------------------------------
  // Temporary Mock Playlist Resolver
  // -----------------------------------

  const playlist =
    useMemo(() => {
      const mockPlaylists =
        {
          '1': {
            id: '1',

            title:
              'Late Night Vibes',

            description:
              'Moody tracks for deep nights and cinematic drives.',

            tracks:
              trending.map(
                (
                  item
                ) =>
                  item.track
              ),
          },

          '2': {
            id: '2',

            title:
              'Hindi Pop Essentials',

            description:
              'Trending Hindi pop hits and immersive melodies.',

            tracks:
              trending.map(
                (
                  item
                ) =>
                  item.track
              ),
          },

          '3': {
            id: '3',

            title:
              'Soulful Sufi',

            description:
              'Spiritual vocals, deep poetry, and emotional journeys.',

            tracks:
              trending.map(
                (
                  item
                ) =>
                  item.track
              ),
          },
        };

      return (
        mockPlaylists[id]
      );
    }, [
      id,
      trending,
    ]);

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const handlePlayAll =
  () => {
    const validTracks =
  playlist.tracks.filter(
    Boolean
  );

    if (!validTracks.length) {
      return;
    }

    playTrack({
      track:
        validTracks[0],

      queue:
        validTracks,

      startIndex: 0,
    });
   };

  if (!playlist) {
    return (
      <div className="p-6">
        Playlist not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-6 pt-8 pb-40">
        {/* -------------------------------- */}
        {/* Hero */}
        {/* -------------------------------- */}

        <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          {/* Glow */}

          <div className="absolute -top-16 right-[-40px] w-[240px] h-[240px] bg-purple-500/20 blur-[100px] rounded-full" />

          {/* Hero Content */}

          <div className="relative z-10">
            <div className="w-40 h-40 rounded-[30px] overflow-hidden shadow-2xl">
              {playlist.tracks[0]
                ?.coverImage ? (
                <img
                  src={
                    getMediaUrl(
                      playlist
                        .tracks[0]
                        .coverImage
                    )
                  }
                  alt={
                    playlist.title
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
              )}
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
              Curated Playlist
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight leading-none">
              {playlist.title}
            </h1>

            <p className="mt-4 text-white/60 leading-relaxed max-w-[320px]">
              {
                playlist.description
              }
            </p>

            {/* Meta */}

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handlePlayAll}
                className="h-14 px-7 rounded-full bg-white text-black flex items-center gap-3 font-semibold shadow-2xl">
                {currentTrack?.id ===
                playlist.tracks[0]
                    ?.id &&
                isPlaying ? (
                <Pause size={20} />
                ) : (
                <Play
                    size={20}
                    fill="currentColor"
                />
                )}

                Play All
              </button>

              <div className="text-sm text-white/45">
                {
                  playlist.tracks
                    .length
                } Tracks
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-4 z-30 flex justify-end mt-8">
        <button
            onClick={handlePlayAll}
            className="w-16 h-16 rounded-full bg-fuchsia-500 text-white shadow-2xl flex items-center justify-center backdrop-blur-xl border border-white/10"
        >
            {currentTrack?.id ===
            playlist.tracks[0]
                ?.id &&
            isPlaying ? (
            <Pause size={24} />
            ) : (
            <Play
                size={24}
                fill="currentColor"
                className="ml-1"
            />
            )}
        </button>
        </div>

        {/* -------------------------------- */}
        {/* Tracks */}
        {/* -------------------------------- */}

        <div className="mt-10 flex flex-col gap-2">
            {playlist.tracks
              ?.filter(
                (track) => track
              )
              .map(
                (
                  track,
                  index
                ) => (
                  <PlaylistTrackRow
                    key={
                      track?.id
                    }
                    track={track}
                    index={index}
                    queue={playlist.tracks.filter(
                      Boolean
                    )}
                  />
                )
              )}
          </div>
      </div>
    </div>
  );
}
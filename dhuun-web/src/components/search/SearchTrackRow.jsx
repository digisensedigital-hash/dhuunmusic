import {
  Play,
  Pause,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import usePlayerStore
  from '../../store/playerStore';

import {
  loadPlaybackQueue,
} from '../../lib/player';

import {
  getMediaUrl,
} from '../../utils/media';

export default function
SearchTrackRow({
  track,
}) {

  const navigate =
    useNavigate();

  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playTrack,
  } = usePlayerStore();

  // -----------------------------------
  // Active State
  // -----------------------------------

  const isActive =
    currentTrack?.id ===
    track.id;

  // -----------------------------------
  // Play Handler
  // -----------------------------------

  const handlePlay =
    async () => {

      if (isActive) {

        togglePlayPause();

        return;
      }

      try {

        const response =
          await loadPlaybackQueue(
            track.id
          );

        const queue = [
          response.currentTrack,
          ...response.nextTracks,
        ];

        playTrack({
          track:
            response.currentTrack,

          queue,

          startIndex: 0,
        });

      } catch (error) {

        console.error(error);

        playTrack({
          track,
          queue: [track],
          startIndex: 0,
        });
      }
    };

  // -----------------------------------
  // Navigation
  // -----------------------------------

  const handleNavigate =
    (event) => {

      event.stopPropagation();

      const slug =
        track.slug;

      const trackId =
        track.id ||
        track._id;

      if (!slug && !trackId) {
        return;
      }

      navigate(
        slug
          ? `/app/track/${slug}`
          : `/app/track/${trackId}`
      );
    };

  return (

    <div className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-white/[0.04]">

      {/* -------------------------------- */}
      {/* Artwork */}
      {/* -------------------------------- */}

      <button

        type="button"

        onClick={
          handleNavigate
        }

        className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5 transition-opacity hover:opacity-80"
      >

        {track.coverImage ? (

          <img
            src={
              getMediaUrl(
                track.coverImage
              )
            }
            alt={
              track.title
            }
            className="h-full w-full object-cover"
          />

        ) : (

          <div className="h-full w-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />

        )}

      </button>

      {/* -------------------------------- */}
      {/* Meta */}
      {/* -------------------------------- */}

      <button

        type="button"

        onClick={
          handleNavigate
        }

        className="min-w-0 flex-1 text-left transition-opacity hover:opacity-80"
      >

        <h3
          className={`truncate font-semibold ${
            isActive
              ? 'text-fuchsia-400'
              : 'text-white'
          }`}
        >

          {track.title}

        </h3>

        <p className="mt-1 truncate text-sm text-white/45">

          {track.primaryArtist
            ?.stageName ||
            'Unknown Artist'}

        </p>

      </button>

      {/* -------------------------------- */}
      {/* Playback */}
      {/* -------------------------------- */}

      <button
        onClick={handlePlay}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
      >

        {isActive &&
        isPlaying ? (

          <Pause
            size={18}
          />

        ) : (

          <Play
            size={18}
            fill="currentColor"
            className="ml-0.5"
          />

        )}

      </button>

    </div>
  );
}
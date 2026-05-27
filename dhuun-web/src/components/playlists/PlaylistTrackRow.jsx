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
PlaylistTrackRow({
  track,
  index,
  queue = [],
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
  // Primary Artist
  // -----------------------------------

  const primaryArtist =
    track
      ?.primaryArtists?.[0] ||
    null;

  // -----------------------------------
  // Active State
  // -----------------------------------

  const isActive =
    (
      currentTrack?.id ||
      currentTrack?._id
    ) ===
    (
      track.id ||
      track._id
    );

  // -----------------------------------
  // Play Handler
  // -----------------------------------

  const handlePlay =
    async () => {

      // Toggle Existing Track

      if (isActive) {

        togglePlayPause();

        return;
      }

      try {

        const response =
          await loadPlaybackQueue(

            track.id ||
            track._id

          );

        const playbackQueue =
          [
            response.currentTrack,
            ...response.nextTracks,
          ];

        playTrack({
          track:
            response.currentTrack,

          queue:
            playbackQueue,

          startIndex: 0,
        });

      } catch (error) {

        console.error(error);

        playTrack({
          track,
          queue,
          startIndex:
            index,
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
      {/* Index / Playback */}
      {/* -------------------------------- */}

      <button
        onClick={handlePlay}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.04]"
      >

        {isActive &&
        isPlaying ? (

          <Pause
            size={16}
          />

        ) : (

          <Play
            size={16}
            fill="currentColor"
            className="ml-0.5"
          />

        )}

      </button>

      {/* -------------------------------- */}
      {/* Artwork */}
      {/* -------------------------------- */}

      <button

        type="button"

        onClick={
          handleNavigate
        }

        className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5 transition-opacity hover:opacity-80"
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
          className={`truncate font-medium ${
            isActive
              ? 'text-fuchsia-400'
              : 'text-white'
          }`}
        >

          {track.title}

        </h3>

        <p className="mt-1 truncate text-sm text-white/45">

          {
            primaryArtist
              ?.stageName ||
            'Unknown Artist'
          }

        </p>

      </button>

      {/* -------------------------------- */}
      {/* Duration */}
      {/* -------------------------------- */}

      <div className="text-sm text-white/35">

        {track.duration
          ? `${Math.floor(
              track.duration /
                60
            )}:${String(
              Math.floor(
                track.duration %
                  60
              )
            ).padStart(
              2,
              '0'
            )}`
          : '--:--'}

      </div>

    </div>
  );
}
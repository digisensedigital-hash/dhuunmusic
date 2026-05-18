import {
  Play,
  Pause,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

import {
  loadPlaybackQueue,
} from '../../lib/player';

export default function
PlaylistTrackRow({
  track,
  index,
  queue = [],
}) {
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
      // Toggle Existing Track

      if (isActive) {
        togglePlayPause();

        return;
      }

      try {
        const response =
          await loadPlaybackQueue(
            track.id
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

  return (
    <div className="group flex items-center gap-4 rounded-2xl px-3 py-3 hover:bg-white/[0.04] transition-colors">
      {/* -------------------------------- */}
      {/* Index / Playback */}
      {/* -------------------------------- */}

      <button
        onClick={handlePlay}
        className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0"
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

      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
        {track.coverImage ? (
          <img
            src={
              track.coverImage
            }
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
        )}
      </div>

      {/* -------------------------------- */}
      {/* Meta */}
      {/* -------------------------------- */}

      <div className="min-w-0 flex-1">
        <h3
          className={`truncate font-medium ${
            isActive
              ? 'text-fuchsia-400'
              : 'text-white'
          }`}
        >
          {track.title}
        </h3>

        <p className="text-sm text-white/45 truncate mt-1">
          {track.artist
            ?.stageName ||
            'Unknown Artist'}
        </p>
      </div>

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
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
SearchTrackRow({
  track,
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

  return (
    <div className="group flex items-center gap-4 rounded-2xl px-3 py-3 hover:bg-white/[0.04] transition-colors">

      {/* -------------------------------- */}
      {/* Artwork */}
      {/* -------------------------------- */}

      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">

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

      <div className="flex-1 min-w-0">

        <h3
          className={`truncate font-semibold ${
            isActive
              ? 'text-fuchsia-400'
              : 'text-white'
          }`}
        >
          {track.title}
        </h3>

        <p className="text-sm text-white/45 truncate mt-1">

          {track.primaryArtist
            ?.stageName ||
            'Unknown Artist'}

        </p>
      </div>

      {/* -------------------------------- */}
      {/* Playback */}
      {/* -------------------------------- */}

      <button
        onClick={handlePlay}
        className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0"
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
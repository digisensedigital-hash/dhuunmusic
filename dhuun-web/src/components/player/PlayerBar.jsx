import {
  Pause,
  Play,
} from 'lucide-react';

import { motion }
  from 'framer-motion';

import usePlayerStore
  from '../../store/playerStore';

export default function
PlayerBar() {
  const {
    currentTrack,

    isPlaying,

    currentTime,

    duration,

    isExpandedPlayerOpen,

    togglePlayPause,

    openExpandedPlayer,
  } = usePlayerStore();

  // -----------------------------------
  // Hidden Until Playback Exists
  // -----------------------------------

  if (!currentTrack) {
    return null;
  }

  // -----------------------------------
  // Hide While Fullscreen Player Open
  // -----------------------------------

  if (
    isExpandedPlayerOpen
  ) {
    return null;
  }

  // -----------------------------------
  // Progress
  // -----------------------------------

  const progress =
    duration > 0
      ? (currentTime /
          duration) *
        100
      : 0;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
      <motion.div
        layoutId="player-shell"
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#18181F]/95 backdrop-blur-2xl shadow-2xl"
      >
        {/* -------------------------------- */}
        {/* Ambient Glow */}
        {/* -------------------------------- */}

        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-pink-500/10 pointer-events-none" />

        {/* -------------------------------- */}
        {/* Content */}
        {/* -------------------------------- */}

        <div
          onClick={
            openExpandedPlayer
          }
          className="relative flex items-center gap-4 px-4 py-4 cursor-pointer"
        >
          {/* -------------------------------- */}
          {/* Artwork */}
          {/* -------------------------------- */}

          <motion.div
            layoutId="player-artwork"
            className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5"
          >
            {currentTrack.coverImage ? (
              <img
                src={
                  currentTrack.coverImage
                }
                alt={
                  currentTrack.title
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl font-black bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500">
                ♪
              </div>
            )}
          </motion.div>

          {/* -------------------------------- */}
          {/* Track Meta */}
          {/* -------------------------------- */}

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">
              {
                currentTrack.title
              }
            </h3>

            <p className="text-sm text-white/50 truncate mt-1">
              {currentTrack
                .primaryArtist
                ?.stageName ||
                'Unknown Artist'}
            </p>
          </div>

          {/* -------------------------------- */}
          {/* Playback Control */}
          {/* -------------------------------- */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              togglePlayPause();
            }}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause size={22} />
            ) : (
              <Play
                size={22}
                fill="currentColor"
                className="ml-1"
              />
            )}
          </button>
        </div>

        {/* -------------------------------- */}
        {/* Progress Bar */}
        {/* -------------------------------- */}

        <div className="h-[3px] w-full bg-white/5">
          <motion.div
            layoutId="player-progress"
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
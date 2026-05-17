import {
  Pause,
  Play,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

export default function
PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    setExpandedPlayerOpen,
  } = usePlayerStore();

  // -----------------------------------
  // Hidden Until Playback Exists
  // -----------------------------------

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#18181F]/95 backdrop-blur-2xl shadow-2xl">
        {/* -------------------------------- */}
        {/* Ambient Glow */}
        {/* -------------------------------- */}

        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-pink-500/10 pointer-events-none" />

        {/* -------------------------------- */}
        {/* Content */}
        {/* -------------------------------- */}

        <div
          onClick={() =>
            setExpandedPlayerOpen(
              true
            )
          }
          className="relative flex items-center gap-4 px-4 py-4 cursor-pointer"
        >
          {/* -------------------------------- */}
          {/* Artwork */}
          {/* -------------------------------- */}

          <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
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
              <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
            )}
          </div>

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
              {
                currentTrack.artist
                  ?.stageName
              }
            </p>
          </div>

          {/* -------------------------------- */}
          {/* Playback Control */}
          {/* -------------------------------- */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              setIsPlaying(
                !isPlaying
              );
            }}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl"
          >
            {isPlaying ? (
              <Pause size={22} />
            ) : (
              <Play
                size={22}
                fill="currentColor"
              />
            )}
          </button>
        </div>

        {/* -------------------------------- */}
        {/* Progress Accent */}
        {/* -------------------------------- */}

        <div className="h-[3px] w-full bg-white/5">
          <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
import {
  Pause,
  Play,
  ListMusic,
} from 'lucide-react';

import { motion }
  from 'framer-motion';

import usePlayerStore
  from '../../store/playerStore';

export default function
PlayerBar() {

  const {
    currentTrack,

    queue,

    isPlaying,

    currentTime,

    duration,

    isExpandedPlayerOpen,

    togglePlayPause,

    openExpandedPlayer,

    openQueueDrawer,
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

  const hasQueue =
    queue.length > 1;

  return (

    <div className="fixed bottom-20 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">

      <motion.div
        layoutId="player-shell"
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#18181F]/95 shadow-2xl backdrop-blur-2xl"
      >

        {/* -------------------------------- */}
        {/* Ambient Glow */}
        {/* -------------------------------- */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-pink-500/10" />

        {/* -------------------------------- */}
        {/* Content */}
        {/* -------------------------------- */}

        <div
          onClick={
            openExpandedPlayer
          }
          className="relative flex cursor-pointer items-center gap-4 px-4 py-4"
        >

          {/* -------------------------------- */}
          {/* Artwork */}
          {/* -------------------------------- */}

          <motion.div
            layoutId="player-artwork"
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5"
          >

            {currentTrack.coverImage ? (

              <img
                src={
                  currentTrack.coverImage
                }
                alt={
                  currentTrack.title
                }
                className="h-full w-full object-cover"
              />

            ) : (

              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-3xl font-black text-white/20">

                ♪

              </div>

            )}

          </motion.div>

          {/* -------------------------------- */}
          {/* Track Meta */}
          {/* -------------------------------- */}

          <div className="min-w-0 flex-1">

            <h3 className="truncate text-base font-semibold">

              {
                currentTrack.title
              }

            </h3>

            <p className="mt-1 truncate text-sm text-white/50">

              {currentTrack
                .primaryArtist
                ?.stageName ||
                'Unknown Artist'}

            </p>

          </div>

          {/* -------------------------------- */}
          {/* Queue Button */}
          {/* -------------------------------- */}

          {hasQueue && (

            <button
              onClick={(e) => {

                e.stopPropagation();

                openQueueDrawer();
              }}

              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >

              <ListMusic
                size={20}
              />

            </button>

          )}

          {/* -------------------------------- */}
          {/* Playback Control */}
          {/* -------------------------------- */}

          <button
            onClick={(e) => {

              e.stopPropagation();

              togglePlayPause();
            }}

            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform active:scale-95"
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
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </motion.div>

    </div>
  );
}
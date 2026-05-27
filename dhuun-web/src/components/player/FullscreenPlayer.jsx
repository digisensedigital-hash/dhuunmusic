import {
  ChevronDown,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  ListMusic,
  Repeat,
  Shuffle,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import usePlayerStore
  from '../../store/playerStore';

import NowPlayingLyrics
  from './NowPlayingLyrics';

export default function
FullscreenPlayer() {

  const {
    currentTrack,

    queue,

    isPlaying,

    currentTime,

    duration,

    isExpandedPlayerOpen,

    togglePlayPause,

    playNextTrack,

    playPreviousTrack,

    closeExpandedPlayer,

    openQueueDrawer,

    seekTo,

    isShuffleEnabled,

    repeatMode,

    toggleShuffle,

    cycleRepeatMode,
  } = usePlayerStore();

  // -----------------------------------
  // Primary Artist
  // -----------------------------------

  const primaryArtist =
    currentTrack
      ?.primaryArtists?.[0] ||
    null;

  // -----------------------------------
  // Time Formatter
  // -----------------------------------

  const formatTime = (
    value
  ) => {

    if (!value) {
      return '0:00';
    }

    const mins =
      Math.floor(
        value / 60
      );

    const secs =
      Math.floor(
        value % 60
      )
        .toString()
        .padStart(2, '0');

    return `${mins}:${secs}`;
  };

  const hasQueue =
    queue.length > 1;

  return (

    <AnimatePresence>

      {isExpandedPlayerOpen &&
        currentTrack && (

        <motion.div
          layoutId="player-shell"
          initial={{
            y: '100%',
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: '100%',
            opacity: 0,
          }}
          transition={{
            type: 'spring',
            damping: 34,
            stiffness: 320,
            mass: 0.9,
          }}
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          dragElastic={0.15}
          onDragEnd={(
            _,
            info
          ) => {

            if (
              info.offset.y >
              140
            ) {

              closeExpandedPlayer();
            }
          }}
          className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[#07010F]/95 text-white backdrop-blur-3xl touch-pan-y"
        >

          {/* -------------------------------- */}
          {/* Ambient Background */}
          {/* -------------------------------- */}

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-600 blur-[140px]"
          />

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.14, 0.24, 0.14],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[420px] w-[420px] rounded-full bg-purple-600 blur-[140px]"
          />

          {/* -------------------------------- */}
          {/* Header */}
          {/* -------------------------------- */}

          <motion.div
            initial={{
              y: -20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.03,
              duration: 0.35,
            }}
            className="relative z-10 flex items-center justify-between px-6 pb-6 pt-[max(24px,env(safe-area-inset-top))]"
          >

            <button
              onClick={
                closeExpandedPlayer
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur"
            >

              <ChevronDown
                size={24}
              />

            </button>

            <div className="text-center">

              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Now Playing
              </p>

            </div>

            <div className="w-11" />

          </motion.div>

          {/* -------------------------------- */}
          {/* Content */}
          {/* -------------------------------- */}

          <motion.div
            initial={{
              scale: 0.96,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.04,
              duration: 0.45,
              ease: 'easeOut',
            }}
            className="relative z-10 flex flex-1 flex-col overflow-hidden px-8"
          >

            {/* Artwork */}

            <motion.div
              initial={{
                scale: 0.92,
                opacity: 0,
                rotate: -2,
                y: 24,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: 'easeOut',
              }}
              className="mt-6 flex justify-center"
            >

              <motion.div
                layoutId="player-artwork"
                initial={{
                  y: 18,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.12,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="aspect-square w-[68vw] max-w-[300px] overflow-hidden rounded-[28px] bg-white/5 shadow-2xl"
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

                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-6xl font-black text-white/20">

                    ♪

                  </div>

                )}

              </motion.div>

            </motion.div>

            {/* Track Info */}

            <motion.div
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.12,
              }}
              className="mt-6 flex min-h-0 flex-1 flex-col"
            >

              <h1 className="text-2xl font-black tracking-tight">

                {
                  currentTrack.title
                }

              </h1>

              <p className="mt-2 text-lg text-white/60">

                {
                  primaryArtist
                    ?.stageName ||
                  'Unknown Artist'
                }

              </p>

              <div className="mt-4 min-h-0 flex-1">

                <NowPlayingLyrics
                  currentTrack={
                    currentTrack
                  }
                  currentTime={
                    currentTime
                  }
                />

              </div>

            </motion.div>

            {/* -------------------------------- */}
            {/* Audio Visualizer */}
            {/* -------------------------------- */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.14,
              }}
              className="mt-4 flex h-8 shrink-0 items-end justify-center gap-1.5"
            >

              {[...Array(12)].map(
                (_, index) => (

                  <motion.span
                    key={index}
                    animate={{
                      height: isPlaying
                        ? [
                            10,
                            30 +
                            Math.random() *
                              20,
                            12,
                          ]
                        : 10,
                    }}
                    transition={{
                      duration:
                        0.6 +
                        Math.random() *
                          0.8,
                      repeat:
                        Infinity,
                      repeatType:
                        'mirror',
                    }}
                    className="w-1 rounded-full bg-gradient-to-t from-fuchsia-500 to-purple-300"
                  />

                )
              )}

            </motion.div>

            {/* Progress */}

            <motion.div
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.16,
              }}
              className="mt-5 shrink-0"
            >

              <motion.div
                layoutId="player-progress"
                className="mb-4 h-[3px] w-full overflow-hidden rounded-full bg-white/10"
              >

                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{
                    width: `${
                      duration > 0
                        ? (currentTime /
                            duration) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </motion.div>

              <input
                type="range"
                min={0}
                max={
                  duration || 0
                }
                value={
                  currentTime
                }
                onChange={(
                  e
                ) =>
                  seekTo(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="w-full accent-white"
              />

              <div className="mt-2 flex items-center justify-between text-sm text-white/50">

                <span>

                  {formatTime(
                    currentTime
                  )}

                </span>

                <span>

                  {formatTime(
                    duration
                  )}

                </span>

              </div>

            </motion.div>

            {/* Controls */}

            <motion.div
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mt-5 flex shrink-0 items-center justify-between"
            >

              {/* Shuffle */}

              <div className="flex w-10 justify-start">

                {hasQueue && (

                  <button
                    onClick={
                      toggleShuffle
                    }
                    className={
                      isShuffleEnabled
                        ? 'text-fuchsia-400'
                        : 'text-white/60'
                    }
                  >

                    <Shuffle
                      size={24}
                    />

                  </button>

                )}

              </div>

              {/* Previous */}

              <button
                onClick={
                  playPreviousTrack
                }
              >

                <SkipBack
                  size={30}
                />

              </button>

              {/* Play Pause */}

              <motion.button
                whileTap={{
                  scale: 0.92,
                }}
                onClick={
                  togglePlayPause
                }
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl"
              >

                {isPlaying ? (

                  <Pause
                    size={28}
                  />

                ) : (

                  <Play
                    size={28}
                    className="ml-1"
                  />

                )}

              </motion.button>

              {/* Next */}

              <button
                onClick={
                  playNextTrack
                }
              >

                <SkipForward
                  size={30}
                />

              </button>

              {/* Repeat */}

              <div className="flex w-10 justify-end">

                {(hasQueue ||
                  !hasQueue) && (

                  <button
                    onClick={() => {

                      /*
                      -----------------------------------
                      Single Track Playback
                      -----------------------------------
                      */

                      if (!hasQueue) {

                        if (
                          repeatMode ===
                          'one'
                        ) {

                          cycleRepeatMode();

                          return;
                        }

                        cycleRepeatMode();

                        return;
                      }

                      /*
                      -----------------------------------
                      Queue Playback
                      -----------------------------------
                      */

                      cycleRepeatMode();
                    }}
                    className={
                      repeatMode !== 'off'
                        ? 'text-fuchsia-400'
                        : 'text-white/60'
                    }
                  >

                    <div className="relative">

                      <Repeat
                        size={24}
                      />

                      {repeatMode ===
                        'one' && (

                        <span className="absolute -bottom-2 -right-2 text-[10px] font-bold">

                          1

                        </span>

                      )}

                    </div>

                  </button>

                )}

              </div>

            </motion.div>

            {/* Bottom Actions */}

            {hasQueue && (

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.24,
                }}
                className="mt-auto flex items-center justify-center pb-[max(18px,env(safe-area-inset-bottom))] pt-6"
              >

                <button
                  onClick={
                    openQueueDrawer
                  }
                  className="flex items-center gap-3 text-white/70"
                >

                  <ListMusic
                    size={22}
                  />

                  <span className="text-sm font-medium">

                    Up Next

                  </span>

                </button>

              </motion.div>

            )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}
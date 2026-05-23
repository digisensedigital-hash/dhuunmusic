import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  useMemo,
} from 'react';

export default function
NowPlayingLyrics({

  currentTrack,

  currentTime,

}) {

  /*
  -----------------------------------
  Synced Lyrics
  -----------------------------------
  */

  const syncedLyrics =
    useMemo(() => {

      return (
        currentTrack
          ?.syncedLyrics || []
      );

    }, [currentTrack]);

  /*
  -----------------------------------
  Active Line Resolver
  -----------------------------------
  */

  const activeIndex =
    syncedLyrics.findIndex(

      (line) =>

        currentTime >=
          line.startTime &&

        currentTime <=
          line.endTime
    );

  const activeLine =
    activeIndex >= 0

      ? syncedLyrics[
          activeIndex
        ]

      : null;

  /*
  -----------------------------------
  Progress %
  -----------------------------------
  */

  const progress =

    activeLine

      ? Math.min(

          (
            (
              currentTime -
              activeLine.startTime
            ) /

            (
              activeLine.endTime -
              activeLine.startTime
            )
          ) * 100,

          100
        )

      : 0;

  /*
  -----------------------------------
  Empty State
  -----------------------------------
  */

  if (!activeLine) {

    return (

      <div className="h-[120px]" />

    );
  }

  return (

    <div

      className="
        relative
        flex
        h-[180px]
        w-full
        items-center
        justify-center
        overflow-hidden
        px-8
      "
    >

      {/* ----------------------------------- */}
      {/* Ambient Background */}
      {/* ----------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-transparent
          via-fuchsia-500/[0.03]
          to-transparent
        "
      />

      {/* ----------------------------------- */}
      {/* Center Glow */}
      {/* ----------------------------------- */}

      <motion.div

        animate={{
          opacity:
            0.18 +
            (progress / 100) * 0.35,

          scale:
            0.96 +
            (progress / 100) * 0.08,
        }}

        transition={{
          duration: 0.35,
        }}

        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[100px]
          w-[88%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.05]
          blur-3xl
        "
      />

      {/* ----------------------------------- */}
      {/* Lyrics */}
      {/* ----------------------------------- */}

      <AnimatePresence
        mode="wait"
      >

        <motion.div

          key={`${activeIndex}-${activeLine.text}`}

          initial={{
            opacity: 0,
            y: 26,
            scale: 0.985,
            filter: 'blur(14px)',
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}

          exit={{
            opacity: 0,
            y: -26,
            scale: 0.985,
            filter: 'blur(14px)',
          }}

          transition={{
            duration: 0.55,
            ease: 'easeOut',
          }}

          className="
            relative
            z-10
            flex
            max-w-full
            items-center
            justify-center
          "
        >

          <div
            className="
              relative
              overflow-hidden
            "
          >

            {/* ----------------------------------- */}
            {/* Base Text */}
            {/* ----------------------------------- */}

            <p

              className="
                whitespace-nowrap
                text-center
                text-[24px]
                font-medium
                leading-[1.35]
                tracking-[-0.03em]
                text-white/30
              "
            >

              {activeLine.text}

            </p>

            {/* ----------------------------------- */}
            {/* Animated Progress Fill */}
            {/* ----------------------------------- */}

            <motion.p

              animate={{
                width: `${progress}%`,
              }}

              transition={{
                ease: 'linear',
                duration: 0.15,
              }}

              className="
                absolute
                left-0
                top-0
                overflow-hidden
                whitespace-nowrap
                text-center
                text-[24px]
                font-medium
                leading-[1.35]
                tracking-[-0.03em]
                text-white
                drop-shadow-[0_0_22px_rgba(255,255,255,0.22)]
              "
            >

              {activeLine.text}

            </motion.p>

          </div>

        </motion.div>

      </AnimatePresence>

      {/* ----------------------------------- */}
      {/* Cinematic Fade */}
      {/* ----------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-black
          via-transparent
          to-black
          opacity-35
        "
      />

    </div>

  );
}
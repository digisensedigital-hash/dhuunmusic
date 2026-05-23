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

  const activeLine =
    syncedLyrics
      .slice()
      .reverse()
      .find(

        (line) =>

          currentTime >=
          line.startTime

      );

  /*
  -----------------------------------
  Empty State
  -----------------------------------
  */

  if (!activeLine) {

    return (

      <div className="h-[140px]" />

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
        px-6
      "
    >

      {/* ----------------------------------- */}
      {/* Ambient Glow */}
      {/* ----------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-transparent
          via-fuchsia-500/[0.05]
          to-transparent
        "
      />

      {/* ----------------------------------- */}
      {/* Center Glow */}
      {/* ----------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[110px]
          w-[90%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.04]
          blur-3xl
        "
      />

      {/* ----------------------------------- */}
      {/* Active Line */}
      {/* ----------------------------------- */}

      <AnimatePresence
        mode="wait"
      >

        <motion.div

          key={activeLine.text}

          initial={{
            opacity: 0,
            y: 24,
            scale: 0.96,
            filter: 'blur(12px)',
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}

          exit={{
            opacity: 0,
            y: -24,
            scale: 0.96,
            filter: 'blur(12px)',
          }}

          transition={{
            duration: 0.55,
            ease: 'easeOut',
          }}

          className="
            relative
            z-10
            flex
            items-center
            justify-center
          "
        >

          <p

            className="
              max-w-[92%]
              text-center
              text-[34px]
              font-semibold
              leading-[1.5]
              tracking-[-0.03em]
              text-white
              drop-shadow-[0_0_36px_rgba(255,255,255,0.24)]
            "
          >

            {activeLine.text}

          </p>

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
          opacity-40
        "
      />

    </div>

  );
}
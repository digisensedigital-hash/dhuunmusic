import {
  motion,
} from 'framer-motion';

import {
  Music4,
} from 'lucide-react';

export default function
AppSplashScreen() {

  return (

    <motion.div

      initial={{
        opacity: 0,
      }}

      animate={{
        opacity: 1,
      }}

      exit={{
        opacity: 0,
      }}

      transition={{
        duration: 0.45,
      }}

      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#07010F]"
    >

      {/* Ambient Glow */}

      <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-[140px]" />

      {/* Content */}

      <div className="relative z-10 flex flex-col items-center">

        {/* Logo */}

        <motion.div

          initial={{
            scale: 0.9,
            opacity: 0,
          }}

          animate={{
            scale: 1,
            opacity: 1,
          }}

          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}

          className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_0_80px_rgba(168,85,247,0.18)] backdrop-blur-2xl"
        >

          <Music4
            size={46}
            className="text-white"
          />

        </motion.div>

        {/* Brand */}

        <motion.h1

          initial={{
            y: 12,
            opacity: 0,
          }}

          animate={{
            y: 0,
            opacity: 1,
          }}

          transition={{
            delay: 0.12,
            duration: 0.45,
          }}

          className="mt-8 text-5xl font-black tracking-tight text-white"
        >

          Dhuun

        </motion.h1>

        <motion.p

          initial={{
            y: 10,
            opacity: 0,
          }}

          animate={{
            y: 0,
            opacity: 1,
          }}

          transition={{
            delay: 0.2,
            duration: 0.45,
          }}

          className="mt-3 text-sm tracking-[0.24em] text-white/45 uppercase"
        >

          Music For The Soul

        </motion.p>

      </div>

    </motion.div>
  );
}
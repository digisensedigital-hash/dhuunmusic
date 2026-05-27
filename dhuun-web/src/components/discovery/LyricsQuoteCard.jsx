import {
  Play,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

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
LyricsQuoteCard({
  track,
}) {

  const navigate =
    useNavigate();

  const {
    playTrack,
  } = usePlayerStore();

  if (
    !track
  ) {
    return null;
  }

  // -----------------------------------
  // Primary Artist
  // -----------------------------------

  const primaryArtist =
    track
      ?.primaryArtists?.[0] ||
    null;

  // -----------------------------------
  // Quote Extraction
  // -----------------------------------

  const quote =

    track.lyrics
      ?.split('\n')
      ?.find(
        (line) =>
          line.trim()
            .length > 12
      ) ||

    'Feel the emotion through music and poetry.';

  // -----------------------------------
  // Playback
  // -----------------------------------

  const handlePlay =
    async (
      e
    ) => {

      e.stopPropagation();

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

    <AnimatePresence
      mode="wait"
    >

      <motion.section

        key={
          track.id
        }

        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
          filter:
            'blur(10px)',
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter:
            'blur(0px)',
        }}

        exit={{
          opacity: 0,
          y: -30,
          scale: 1.02,
          filter:
            'blur(12px)',
        }}

        transition={{
          duration: 0.75,
          ease:
            [0.22, 1, 0.36, 1],
        }}

        whileHover={{
          y: -4,
        }}

        whileTap={{
          scale: 0.99,
        }}

        onClick={() => {

          navigate(
            `/app/track/${
              track.slug ||
              track.id
            }`
          );
        }}

        className="group relative mb-16 cursor-pointer overflow-hidden rounded-[48px] border border-white/10 bg-[#120F18] shadow-[0_20px_100px_rgba(0,0,0,0.55)]"
      >

        {/* Background Artwork */}

        {track.coverImage && (

          <img
            src={getMediaUrl(
              track.coverImage
            )}

            alt={track.title}

            className="absolute inset-0 h-full w-full object-cover opacity-30 blur-[2px] transition duration-700 group-hover:scale-105"
          />

        )}

        {/* Overlays */}

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-purple-500/10" />

        {/* Ambient */}

        <div className="absolute left-[-100px] top-[-80px] h-[280px] w-[280px] rounded-full bg-fuchsia-500/20 blur-[140px]" />

        <div className="absolute bottom-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-purple-500/20 blur-[140px]" />

        {/* Content */}

        <div className="relative z-10 p-10 md:p-14">

          {/* Label */}

          <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[10px] uppercase tracking-[0.32em] text-white/70 backdrop-blur-xl">

            Lyrical Moment

          </div>

          {/* Quote */}

          <blockquote className="max-w-4xl text-3xl font-black leading-[1.35] tracking-tight text-white md:text-5xl">

            “{quote}”

          </blockquote>

          {/* Footer */}

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            {/* Meta */}

            <div>

              <h3 className="text-2xl font-black text-white">

                {track.title}

              </h3>

              <p className="mt-3 text-white/65">

                {
                  primaryArtist
                    ?.stageName ||
                  'Unknown Artist'
                }

              </p>

            </div>

            {/* CTA */}

            <button

              onClick={
                handlePlay
              }

              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110"
            >

              <Play
                size={26}
                fill="currentColor"
                className="ml-1"
              />

            </button>

          </div>

        </div>

      </motion.section>

    </AnimatePresence>

  );
}
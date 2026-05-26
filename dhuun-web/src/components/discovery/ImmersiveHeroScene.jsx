import {
  motion,
} from 'framer-motion';

import {
  Play,
  Volume2,
} from 'lucide-react';

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
ImmersiveHeroScene({
  track,
  queue = [],
}) {

  const navigate =
    useNavigate();

  const {
    currentTrack,
    isPlaying,
    playTrack,
  } = usePlayerStore();

  if (!track) {
    return null;
  }

  // -----------------------------------
  // Lyrics Fragments
  // -----------------------------------

  const lyricalFragments =

    track.lyrics
      ?.split('\n')

      ?.map(
        (line) =>
          line.trim()
      )

      ?.filter(
        (line) =>

          line.length >= 8 &&

          line.length <= 26
      )

      ?.slice(0, 5) ||

    [];

  // -----------------------------------
  // Play Handler
  // -----------------------------------

  const handlePlay =
    async () => {

      try {

        const response =
          await loadPlaybackQueue(
            track.id ||
            track._id
          )

        const playbackQueue = [

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

          startIndex: 0,
        });
      }
    };

  return (

    <section className="relative mb-16 overflow-hidden rounded-[42px] border border-white/10 bg-[#09090F]">

      {/* -------------------------------- */}
      {/* Background */}
      {/* -------------------------------- */}

      {track.coverImage && (

        <img
          src={getMediaUrl(
            track.coverImage
          )}

          alt={track.title}

          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-[2px]"
        />

      )}

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-purple-500/10" />

      {/* -------------------------------- */}
      {/* Ambient */}
      {/* -------------------------------- */}

      <div className="absolute left-[-120px] top-[-100px] h-[340px] w-[340px] rounded-full bg-fuchsia-500/20 blur-[140px]" />

      <div className="absolute bottom-[-140px] right-[-120px] h-[340px] w-[340px] rounded-full bg-purple-500/20 blur-[140px]" />

      {/* -------------------------------- */}
      {/* Floating Lyrics */}
      {/* -------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {lyricalFragments.map(
          (
            line,
            index
          ) => (

            <motion.div

              key={`${line}-${index}`}

              animate={{
                y: [
                  0,
                  -16,
                  0,
                ],
              }}

              transition={{
                duration:
                  8 + index,

                repeat:
                  Infinity,

                ease:
                  'easeInOut',
              }}

              className="absolute whitespace-nowrap text-4xl font-black tracking-tight text-white/5"

              style={{
                top: `${
                  14 +
                  index * 14
                }%`,

                left: `${
                  8 +
                  index * 10
                }%`,
              }}
            >

              {line}

            </motion.div>

          )
        )}

      </div>

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-8 py-10 md:px-12 md:py-12">

        {/* -------------------------------- */}
        {/* Top */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-between">

          <img
            src="/DhuunMusic_Logo.png"
            alt="Dhuun"
            className="h-16 w-16 object-contain"
          />

          {currentTrack && (

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">

              <div className="relative">

                <Volume2
                  size={16}
                  className="text-fuchsia-300"
                />

                {isPlaying && (

                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />

                )}

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">

                  Now Floating Through

                </p>

                <p className="mt-1 max-w-[160px] truncate text-sm font-semibold text-white">

                  {
                    currentTrack.title
                  }

                </p>

              </div>

            </div>

          )}

        </div>

        {/* -------------------------------- */}
        {/* Hero Layout */}
        {/* -------------------------------- */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">

          {/* -------------------------------- */}
          {/* Left */}
          {/* -------------------------------- */}

          <div>

            <p className="mb-5 text-xs uppercase tracking-[0.34em] text-white/40">

              Featured Atmosphere

            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">

              {track.title}

            </h1>

            <p className="mt-5 text-xl text-white/60">

              {
                track.primaryArtist
                  ?.stageName
              }

            </p>

            {/* -------------------------------- */}
            {/* CTA */}
            {/* -------------------------------- */}

            <div className="mt-10 flex items-center gap-4">

              <button

                onClick={
                  handlePlay
                }

                className="group flex items-center gap-4 rounded-full bg-white px-6 py-4 text-black shadow-2xl transition duration-300 hover:scale-[1.03]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">

                  <Play
                    size={16}
                    fill="currentColor"
                    className="ml-1"
                  />

                </div>

                <span className="font-bold">

                  Play Now

                </span>

              </button>

              <button

                onClick={() => {

                  navigate(
                    `/app/track/${
                      track.slug ||
                      track.id
                    }`
                  );
                }}

                className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.08]"
              >

                Open Track

              </button>

            </div>

          </div>

          {/* -------------------------------- */}
          {/* Artwork */}
          {/* -------------------------------- */}

          <div className="relative flex justify-center">

            {/* Glow */}

            <div className="absolute h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

            {/* Back Layer */}

            <motion.div

              animate={{
                rotate: -8,
                y: [
                  0,
                  -10,
                  0,
                ],
              }}

              transition={{
                duration: 9,
                repeat:
                  Infinity,
                ease:
                  'easeInOut',
              }}

              className="absolute top-6 h-[280px] w-[280px] overflow-hidden rounded-[34px] border border-white/10 opacity-60"
            >

              {track.coverImage && (

                <img
                  src={getMediaUrl(
                    track.coverImage
                  )}

                  alt={track.title}

                  className="h-full w-full object-cover"
                />

              )}

            </motion.div>

            {/* Main Artwork */}

            <motion.div

              animate={{
                rotate: 5,
                y: [
                  0,
                  12,
                  0,
                ],
              }}

              transition={{
                duration: 10,
                repeat:
                  Infinity,
                ease:
                  'easeInOut',
              }}

              className="relative z-10 h-[320px] w-[320px] overflow-hidden rounded-[40px] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
            >

              {track.coverImage ? (

                <img
                  src={getMediaUrl(
                    track.coverImage
                  )}

                  alt={track.title}

                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="h-full w-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500" />

              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            </motion.div>

          </div>

        </div>

      </div>

    </section>

  );
}
import {
  Play,
} from 'lucide-react';

import {
  motion,
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
ContinueListeningStack({
  title = 'Continue Listening',
  items = [],
}) {

  const navigate =
    useNavigate();

  const {
    playTrack,
  } = usePlayerStore();

  // -----------------------------------
  // Remove Invalid Entries
  // -----------------------------------

  const validItems =
    items.filter(
      (item) =>
        item?.track
    );

  if (
    !validItems.length
  ) {
    return null;
  }

  // -----------------------------------
  // Visible Stack
  // -----------------------------------

  const visibleItems =
    validItems.slice(0, 5);

  return (

    <section className="mb-14">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="mb-7 flex items-end justify-between">

        <div>

          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">

            Playback Continuity

          </p>

          <h2 className="text-4xl font-black tracking-tight">

            {title}

          </h2>

        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/45 backdrop-blur-xl">

          Resume

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Floating Stack */}
      {/* -------------------------------- */}

      <div className="relative h-[420px] overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

        {/* Ambient Layers */}

        <div className="pointer-events-none absolute left-[-60px] top-[-60px] h-[240px] w-[240px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[-80px] right-[-80px] h-[260px] w-[260px] rounded-full bg-purple-500/20 blur-[120px]" />

        {/* Stack */}

        <div className="relative flex h-full items-center justify-center">

          {visibleItems.map(

            (
              item,
              index
            ) => {

              const track =
                item.track;

              const offset =
                index * 38;

              const scale =
                1 - (index * 0.06);

              const rotate =
                index % 2 === 0
                  ? -5 + index
                  : 5 - index;

              const zIndex =
                50 - index;

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

                <motion.div

                  key={
                    track.id ||
                    index
                  }

                  initial={{
                    opacity: 0,
                    y: 80,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.45,
                    delay:
                      index * 0.08,
                  }}

                  whileHover={{
                    y: -12,
                    scale:
                      scale + 0.03,
                  }}

                  onClick={() => {

                    navigate(
                      `/track/${
                        track.slug ||
                        track.id
                      }`
                    );
                  }}

                  className="group absolute cursor-pointer"
                  style={{
                    zIndex,
                    transform: `
                      translateX(${offset}px)
                      translateY(${index * 10}px)
                      rotate(${rotate}deg)
                      scale(${scale})
                    `,
                  }}
                >

                  {/* Card */}

                  <div className="relative w-[250px] overflow-hidden rounded-[38px] border border-white/10 bg-[#15151D]/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

                    {/* Artwork */}

                    <div className="relative aspect-[0.92] overflow-hidden">

                      {track.coverImage ? (

                        <img
                          src={getMediaUrl(
                            track.coverImage
                          )}

                          alt={
                            track.title
                          }

                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                      ) : (

                        <div className="h-full w-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500" />

                      )}

                      {/* Overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      {/* Glow */}

                      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

                      {/* Play */}

                      <button

                        onClick={
                          handlePlay
                        }

                        className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110"
                      >

                        <Play
                          size={22}
                          fill="currentColor"
                          className="ml-1"
                        />

                      </button>

                      {/* Progress Stub */}

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">

                        <div
                          className="h-full rounded-full bg-fuchsia-400"
                          style={{
                            width: `${
                              22 +
                              (
                                index *
                                14
                              )
                            }%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Meta */}

                    <div className="relative p-5">

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

                      <div className="relative">

                        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/35">

                          Continue Listening

                        </p>

                        <h3 className="truncate text-xl font-black tracking-tight text-white transition group-hover:text-fuchsia-300">

                          {track.title}

                        </h3>

                        <p className="mt-3 truncate text-sm text-white/60">

                          {track.primaryArtist
                            ?.stageName ||
                            'Unknown Artist'}

                        </p>

                      </div>

                    </div>

                  </div>

                </motion.div>

              );
            }

          )}

        </div>

      </div>

    </section>

  );
}
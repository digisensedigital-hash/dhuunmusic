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
WideMoodRail({
  title,
  subtitle,
  items = [],
}) {

  const navigate =
    useNavigate();

  const {
    playTrack,
  } = usePlayerStore();

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

  return (

    <section className="mb-16">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="mb-7 flex items-end justify-between">

        <div>

          {subtitle && (

            <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">

              {subtitle}

            </p>

          )}

          <h2 className="text-4xl font-black tracking-tight">

            {title}

          </h2>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Wide Cards */}
      {/* -------------------------------- */}

      <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">

        {validItems.map(

          (
            item,
            index
          ) => {

            const track =
              item.track;

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

                whileHover={{
                  y: -6,
                }}

                whileTap={{
                  scale: 0.985,
                }}

                onClick={() => {

                  navigate(
                    `/app/track/${
                      track.slug ||
                      track.id
                    }`
                  );
                }}

                className="group relative h-[240px] min-w-[420px] cursor-pointer overflow-hidden rounded-[42px] border border-white/10 bg-[#12121A] shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
              >

                {/* Artwork */}

                {track.coverImage ? (

                  <img
                    src={getMediaUrl(
                      track.coverImage
                    )}

                    alt={
                      track.title
                    }

                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                ) : (

                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500" />

                )}

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-black/10" />

                {/* Glow */}

                <div className="absolute left-[-60px] top-[-60px] h-[220px] w-[220px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

                {/* Content */}

                <div className="relative flex h-full flex-col justify-between p-7">

                  {/* Top */}

                  <div>

                    <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl">

                      Cinematic Mood

                    </div>

                  </div>

                  {/* Bottom */}

                  <div className="flex items-end justify-between gap-5">

                    {/* Meta */}

                    <div className="min-w-0">

                      <h3 className="text-4xl font-black leading-none tracking-tight text-white">

                        {track.title}

                      </h3>

                      <p className="mt-4 truncate text-sm text-white/70">

                        {track.primaryArtist
                          ?.stageName ||
                          'Unknown Artist'}

                      </p>

                      {track.genre && (

                        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur-xl">

                          {track.genre}

                        </div>

                      )}

                    </div>

                    {/* Play */}

                    <button

                      onClick={
                        handlePlay
                      }

                      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110"
                    >

                      <Play
                        size={26}
                        fill="currentColor"
                        className="ml-1"
                      />

                    </button>

                  </div>

                </div>

              </motion.div>

            );
          }

        )}

      </div>

    </section>

  );
}
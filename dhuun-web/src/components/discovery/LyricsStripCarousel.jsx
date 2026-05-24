import {
  Play,
} from 'lucide-react';

import {
  motion,
} from 'framer-motion';

import {
  useRef,
} from 'react';

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
LyricsStripCarousel({
  items = [],
}) {

  const navigate =
    useNavigate();

  const {
    playTrack,
  } = usePlayerStore();

  // -----------------------------------
  // Extract Lyrical Tracks
  // -----------------------------------

  const lyricalTracks =

    items
      .filter(
        (item) =>
          item?.track?.lyrics
      )

      .map(
        (item) =>
          item.track
      )

      .slice(0, 12);

  if (
    !lyricalTracks.length
  ) {
    return null;
  }

  // -----------------------------------
  // Quote Extraction
  // -----------------------------------

  const getQuote =
    (lyrics = '') => {

      const lines =

        lyrics
          .split('\n')

          .map(
            (line) =>
              line.trim()
          )

          .filter(
            (line) =>

              line.length >= 8 &&

              line.length <= 42
          );

      return (
        lines[
          Math.floor(
            Math.random() *
            lines.length
          )
        ] ||

        'Feel the emotion through music.'
      );
    };

  /* ----------------------------------- */
    /* Persistent Quotes */
    /* ----------------------------------- */

    const quotesMapRef =
    useRef(
        new Map()
    );

    lyricalTracks.forEach(
    (track) => {

        if (

        !quotesMapRef.current.has(
            track.id
        )

        ) {

        quotesMapRef.current.set(

            track.id,

            getQuote(
            track.lyrics
            )

        );
        }
    }
    );

  // -----------------------------------
  // Split Rows
  // -----------------------------------

  const topRow =
    lyricalTracks.slice(
      0,
      6
    );

  const bottomRow =
    lyricalTracks.slice(
      6,
      12
    );

  // -----------------------------------
  // Play Handler
  // -----------------------------------

  const handlePlay =
    async (
      e,
      track
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

  // -----------------------------------
  // Strip Renderer
  // -----------------------------------

  const renderRow =
    (
      tracks,
      direction = 'left'
    ) => (

      <div

        className={`
          flex
          w-max
          gap-5
          ${
            direction === 'left'
              ? 'lyrics-marquee-left'
              : 'lyrics-marquee-right'
          }
        `}
      >

        {[...tracks, ...tracks]
          .map(
            (
              track,
              index
            ) => (

              <motion.div

                key={`${track.id}-${index}`}

                whileHover={{
                  y: -3,
                  scale: 1.01,
                }}

                whileTap={{
                  scale: 0.985,
                }}

                onClick={() => {

                  navigate(
                    `/track/${
                      track.slug ||
                      track.id
                    }`
                  );
                }}

                className="group relative flex h-[104px] min-w-[460px] cursor-pointer items-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/90 px-4 backdrop-blur-2xl"
              >

                {/* Ambient */}

                <div className="absolute left-[-40px] top-[-40px] h-[140px] w-[140px] rounded-full bg-fuchsia-500/10 blur-[80px]" />

                {/* Thumbnail */}

                <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-xl bg-white/5">

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

                  <div className="absolute inset-0 bg-black/10" />

                </div>

                {/* Quote */}

                <div className="relative z-10 min-w-0 flex-1">

                  <p className="line-clamp-2 text-[17px] font-semibold leading-relaxed tracking-tight text-white">

                    “{
                      quotesMapRef.current.get(
                        track.id
                      )
                    }”

                  </p>

                  <div className="mt-2 flex items-center gap-2 overflow-hidden">

                    <span className="truncate text-sm text-white/55">

                      {
                        track
                          .primaryArtist
                          ?.stageName
                      }

                    </span>

                    <span className="text-white/20">

                      •

                    </span>

                    <span className="truncate text-sm text-white/35">

                      {
                        track.title
                      }

                    </span>

                  </div>

                </div>

                {/* Play */}

                <button

                  onClick={(e) =>
                    handlePlay(
                      e,
                      track
                    )
                  }

                  className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl transition duration-300 group-hover:scale-110"
                >

                  <Play
                    size={16}
                    fill="currentColor"
                    className="ml-0.5"
                  />

                </button>

              </motion.div>

            )
          )}

      </div>
    );

  return (

    <section className="mb-16 overflow-hidden">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="mb-6 px-1">

        <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">

          Poetic Discovery

        </p>

        <h2 className="text-4xl font-black tracking-tight">

          Lyrical Moments

        </h2>

      </div>

      {/* -------------------------------- */}
      {/* Marquee Rows */}
      {/* -------------------------------- */}

      <div className="space-y-5">

        <div className="overflow-hidden">

          {renderRow(
            topRow,
            'left'
          )}

        </div>

        <div className="overflow-hidden">

          {renderRow(
            bottomRow,
            'right'
          )}

        </div>

      </div>

    </section>

  );
}
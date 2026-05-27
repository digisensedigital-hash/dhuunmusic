import {
  Play,
  Heart,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import usePlayerStore
  from '../../store/playerStore';

import {
  loadPlaybackQueue,
} from '../../lib/player';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  getMediaUrl,
} from '../../utils/media';

export default function
TrackCard({
  track,
  recommendationReason,
}) {

  const navigate =
    useNavigate();

  const {
    playTrack,
    toggleSaveTrack,
    isTrackSaved,
  } = usePlayerStore();

  // -----------------------------------
  // Intelligent Playback Startup
  // -----------------------------------

  if (!track) {
    return null;
  }

  // -----------------------------------
  // Primary Artist
  // -----------------------------------

  const primaryArtist =
    track
      ?.primaryArtists?.[0] ||
    null;

  const primaryArtistId =
    primaryArtist?._id ||
    primaryArtist?.id;

  const isSaved =
    isTrackSaved(
      track.id
    );

  const handlePlay =
    async (e) => {

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

        console.error(
          'Failed to load playback queue:',
          error
        );

        // -----------------------------------
        // Fallback Playback
        // -----------------------------------

        playTrack({
          track,
          queue: [track],
          startIndex: 0,
        });
      }
    };

  /* ----------------------------------- */
  /* Navigation */
  /* ----------------------------------- */

  const handleNavigate =
    () => {

      navigate(
        `/app/track/${track.id}`
      );
    };

  return (

    <motion.div

      whileTap={{
        scale: 0.97,
      }}

      onClick={
        handleNavigate
      }

      className="group relative cursor-pointer overflow-hidden rounded-[34px] border border-white/10 bg-[#15151D] shadow-2xl"
    >

      {/* -------------------------------- */}
      {/* Artwork */}
      {/* -------------------------------- */}

      <div className="relative aspect-square overflow-hidden">

        {/* Real Artwork */}

        {track.coverImage ? (

          <motion.img

            whileHover={{
              scale: 1.06,
            }}

            transition={{
              duration: 0.4,
            }}

            src={
              getMediaUrl(
                track.coverImage
              )
            }

            alt={track.title}

            className="h-full w-full object-cover"
          />

        ) : (

          <div className="h-full w-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />

        )}

        {/* Ambient Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Top Glow */}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />

        {/* Floating Play Button */}

        <motion.button

          whileTap={{
            scale: 0.92,
          }}

          onClick={handlePlay}

          className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl backdrop-blur transition-all duration-300 group-hover:scale-110"
        >

          <Play
            size={22}
            fill="currentColor"
            className="ml-1"
          />

        </motion.button>

        {/* Save Button */}

        <button

          onClick={(e) => {

            e.stopPropagation();

            toggleSaveTrack(
              track
            );
          }}

          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:scale-110"
        >

          <AnimatePresence mode="wait">

            <motion.div

              key={
                isSaved
                  ? 'saved'
                  : 'unsaved'
              }

              initial={{
                scale: 0.6,
                opacity: 0,
              }}

              animate={{
                scale: 1,
                opacity: 1,
              }}

              exit={{
                scale: 0.6,
                opacity: 0,
              }}

              transition={{
                duration: 0.18,
              }}
            >

              <Heart
                size={18}
                className={
                  isSaved
                    ? 'fill-fuchsia-500 text-fuchsia-500'
                    : 'text-white'
                }
              />

            </motion.div>

          </AnimatePresence>

        </button>

        {/* Floating Genre Pill */}

        {track.genre && (

          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-xl">

            {track.genre}

          </div>

        )}

        {/* Multi-language Badge */}

        {track.hasVariants && (

          <div className="absolute bottom-4 left-4 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/15 px-3 py-1 text-[11px] font-medium text-fuchsia-200 shadow-lg backdrop-blur-xl">

            <div className="flex items-center gap-2">

              <span>

                🌐

              </span>

              <span>

                {track.variantCount > 1
                  ? `${track.variantCount} Versions`
                  : 'Multi-language'}

              </span>

            </div>

          </div>

        )}

      </div>

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative p-5">

        {/* Ambient Blur */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

        <div className="relative">

          {/* Track Title */}

          <h3 className="truncate text-[17px] font-bold transition-colors group-hover:text-fuchsia-300">

            {track.title}

          </h3>

          {/* Artist */}

          <Link

            to={
              primaryArtistId
                ? `/app/artist/${primaryArtistId}`
                : '#'
            }

            onClick={(e) =>
              e.stopPropagation()
            }

            className="group/artist mt-3 flex items-center gap-3"
          >

            {/* Avatar */}

            {primaryArtist
              ?.profileImage ? (

              <img

                src={
                  getMediaUrl(
                    primaryArtist
                      ?.profileImage
                  )
                }

                alt={
                  primaryArtist
                    ?.stageName
                }

                className="h-8 w-8 rounded-full border border-white/10 object-cover"
              />

            ) : (

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-[10px] font-bold text-white">

                {(
                  primaryArtist
                    ?.stageName ||
                  'U'
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>

            )}

            {/* Meta */}

            <div className="min-w-0">

              <div className="mt-1">

                <div className="flex items-center gap-1.5">

                  <p className="truncate text-sm text-white/70 transition-colors group-hover/artist:text-white">

                    {
                      primaryArtist
                        ?.stageName ||
                      'Unknown Artist'
                    }

                  </p>

                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />

                </div>

                {recommendationReason && (

                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-fuchsia-300/80">

                    {
                      recommendationReason
                    }

                  </p>

                )}

              </div>

              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/35">

                Featured Artist

              </p>

            </div>

          </Link>

        </div>

      </div>

    </motion.div>
  );
}
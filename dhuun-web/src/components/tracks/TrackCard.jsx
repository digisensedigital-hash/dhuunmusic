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
} from 'react-router-dom';

import {
  getMediaUrl,
} from '../../utils/media';

export default function
TrackCard({
  track,
  recommendationReason,
}) {
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

  const isSaved =
  isTrackSaved(
    track.id
  );

  const handlePlay =
    async () => {
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

  return (
    <motion.div
      whileTap={{
        scale: 0.97,
      }}
      className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#15151D] shadow-2xl"
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
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
        )}

        {/* Ambient Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Top Glow */}

        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Floating Play Button */}

        <motion.button
          whileTap={{
            scale: 0.92,
          }}
          onClick={handlePlay}
          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl backdrop-blur transition-all duration-300 group-hover:scale-110"
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
          className="absolute top-4 right-4 w-11 h-11 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
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
          <div className="absolute top-4 left-4 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
            {track.genre}
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative p-5">

        {/* Ambient Blur */}

        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        <div className="relative">

          <h3 className="text-[17px] font-bold truncate">
            {track.title}
          </h3>

          <Link
            to={
              track.primaryArtist?.id
                ? `/artist/${track.primaryArtist.id}`
                : '#'
            }
            className="flex items-center gap-3 mt-3 group/artist"
          >

            {/* Avatar */}

            {track.primaryArtist
              ?.profileImage ? (

              <img
                src={
                  getMediaUrl(
                    track.primaryArtist
                      ?.profileImage
                  )
                }
                alt={
                  track.primaryArtist
                    ?.stageName
                }
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />

            ) : (

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">

                {(
                  track.primaryArtist
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

                  <p className="text-sm text-white/70 truncate transition-colors group-hover/artist:text-white">

                    {track.primaryArtist
                      ?.stageName ||
                      'Unknown Artist'}

                  </p>

                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />

                </div>

                {recommendationReason && (
                  <p className="text-[11px] text-fuchsia-300/80 mt-2 line-clamp-2 leading-relaxed">

                    {
                      recommendationReason
                    }

                  </p>
                )}

              </div>

              <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mt-0.5">
                Featured Artist
              </p>

            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
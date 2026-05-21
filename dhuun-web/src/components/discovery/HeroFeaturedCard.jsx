import {
  Play,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

export default function
HeroFeaturedCard({
  track,
  queue = [],
}) {
  const {
    playTrack,
  } = usePlayerStore();

  if (!track) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[36px] h-[420px] bg-[#15151D] border border-white/10">

      {/* -------------------------------- */}
      {/* Background Artwork */}
      {/* -------------------------------- */}

      {track.coverImage ? (

        <img
          src={track.coverImage}
          alt={track.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

      ) : (

        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500" />

      )}

      {/* -------------------------------- */}
      {/* Dark Overlay */}
      {/* -------------------------------- */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

      {/* -------------------------------- */}
      {/* Ambient Glow */}
      {/* -------------------------------- */}

      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-fuchsia-500/30 blur-[120px] rounded-full" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 h-full flex flex-col justify-end p-7">

        {/* Label */}

        <div className="mb-4">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white/70">
            Featured Track
          </span>
        </div>

        {/* Title */}

        <h2 className="text-4xl font-black leading-none tracking-tight">
          {track.title}
        </h2>

        {/* Artist */}

        <p className="mt-3 text-lg text-white/70">

          {track.primaryArtist
            ?.stageName ||
            'Unknown Artist'}

        </p>

        {/* CTA */}

        <div className="mt-8 flex items-center gap-4">

          <button
            onClick={() =>
              playTrack({

                track: {
                  ...track,

                  id:
                    track.id ||
                    track._id,
                },

                queue: [
                  {
                    ...track,

                    id:
                      track.id ||
                      track._id,
                  },
                ],

                startIndex: 0,
              })
            }
            className="h-14 px-7 rounded-full bg-white text-black flex items-center gap-3 font-semibold shadow-2xl active:scale-95 transition-transform"
          >

            <Play
              size={20}
              fill="currentColor"
            />

            Play Now

          </button>

          <div className="text-sm text-white/50">
            Feel the music.
          </div>
        </div>
      </div>
    </div>
  );
}
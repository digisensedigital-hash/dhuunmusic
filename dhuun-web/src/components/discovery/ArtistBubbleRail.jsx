import {
  motion,
} from 'framer-motion';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getMediaUrl,
} from '../../utils/media';

export default function
ArtistBubbleRail({
  title = 'Featured Artists',
  artists = [],
}) {

  const navigate =
    useNavigate();

  const validArtists =
    artists.filter(
      (artist) =>
        artist?.id
    );

  if (
    !validArtists.length
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

          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">

            Voices & Creators

          </p>

          <h2 className="text-4xl font-black tracking-tight">

            {title}

          </h2>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Artist Bubbles */}
      {/* -------------------------------- */}

      <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-3">

        {validArtists.map(

          (
            artist,
            index
          ) => (

            <motion.button

              key={
                artist.id ||
                index
              }

              whileHover={{
                y: -8,
                scale: 1.04,
              }}

              whileTap={{
                scale: 0.96,
              }}

              onClick={() => {

                navigate(
                  `/app/artist/${artist.id}`
                );
              }}

              className="group relative flex min-w-[140px] flex-col items-center"
            >

              {/* Ambient Glow */}

              <div className="absolute inset-0 rounded-full bg-fuchsia-500/0 blur-[60px] transition duration-500 group-hover:bg-fuchsia-500/25" />

              {/* Bubble */}

              <div className="relative h-[132px] w-[132px] overflow-hidden rounded-full border border-white/10 bg-[#17171F] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

                {artist.profileImage ? (

                  <img
                    src={getMediaUrl(
                      artist.profileImage
                    )}

                    alt={
                      artist.stageName
                    }

                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                ) : (

                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-4xl font-black text-white">

                    {artist.stageName
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                )}

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              </div>

              {/* Meta */}

              <div className="mt-5 text-center">

                <h3 className="max-w-[140px] truncate text-lg font-bold text-white transition group-hover:text-fuchsia-300">

                  {artist.stageName}

                </h3>

                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/35">

                  Featured Artist

                </p>

              </div>

            </motion.button>

          )

        )}

      </div>

    </section>

  );
}
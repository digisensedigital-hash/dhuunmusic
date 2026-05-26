import {
  ChevronRight,
  Disc3,
} from 'lucide-react';

import {
  useMemo,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

export default function
ArtistsView({

  tracks = [],

}) {

  const navigate =
    useNavigate();

  /* -------------------------------- */
  /* Derive Artists */
  /* -------------------------------- */

  const artists =
    useMemo(() => {

      const map =
        new Map();

      tracks.forEach(
        (track) => {

          const artist =

            track.primaryArtist ||

            track.artist;

          if (
            !artist?.id
          ) {
            return;
          }

          const existing =
            map.get(
              artist.id
            );

          if (
            existing
          ) {

            existing.trackCount += 1;

            return;
          }

          map.set(
            artist.id,

            {

              artist,

              trackCount: 1,
            }
          );
        }
      );

      return Array.from(
        map.values()
      )

        .sort(
          (a, b) =>

            b.trackCount -
            a.trackCount
        );

    }, [tracks]);

  /* -------------------------------- */
  /* Empty State */
  /* -------------------------------- */

  if (
    !artists.length
  ) {

    return (

      <div className="mt-12 rounded-[36px] border border-white/10 bg-white/[0.03] p-10 text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">

          <Disc3
            size={34}
            className="text-white/40"
          />

        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">

          No Artists Found

        </h2>

        <p className="mt-4 text-white/50">

          Artists will appear here
          once tracks are available.

        </p>

      </div>
    );
  }

  return (

    <div className="mt-12">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-white/40">

            Dhuun Artists

          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">

            Artists

          </h2>

        </div>

        <div className="text-sm text-white/40">

          {artists.length}
          {' '}
          Artists

        </div>

      </div>

      <div className="mb-6 border-t border-white/10" />

      {/* Artist List */}

      <div className="flex flex-col gap-2">

        {artists.map(
        ({
          artist,
          trackCount,
        }) => {

          const profileImage =
            artist?.profileImage;

          const imageUrl =

            typeof profileImage ===
            'string'

              &&

              profileImage.trim()

                ? (

                    profileImage.startsWith(
                      'http'
                    )

                      ? profileImage

                      : `${
                          import.meta.env.VITE_API_URL
                            .replace('/api', '')
                        }${profileImage}`

                  )

                : null;

          console.log(
          'FINAL IMAGE URL:',
          imageUrl
          );


          return (

            <button

              key={
                artist.id
              }

              onClick={() =>

                navigate(
                  `/app/artist/${
                    artist.slug ||
                    artist.id
                  }`
                )
              }

              className="group flex w-full items-center gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] px-5 py-4 text-left transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"

            >

              {/* Artist Artwork */}

              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">

                {imageUrl ? (

                  <img

                    src={imageUrl}

                    alt={
                      artist.stageName ||
                      artist.name
                    }

                    className="h-full w-full object-cover"

                    onError={(e) => {

                      e.currentTarget.style.display =
                        'none';

                    }}

                  />

                ) : (

                  <div className="flex h-full w-full items-center justify-center">

                    <Disc3
                      size={22}
                      className="text-white/40"
                    />

                  </div>

                )}

              </div>

              {/* Artist Meta */}

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-lg font-bold text-white">

                  {artist.stageName ||
                    artist.name}

                </h3>

                <p className="mt-1 text-sm text-white/45">

                  {trackCount}
                  {' '}
                  Track{
                    trackCount > 1
                      ? 's'
                      : ''
                  }

                </p>

              </div>

              {/* Arrow */}

              <ChevronRight
                size={18}
                className="text-white/25 transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          );

        }
      )}

      </div>

    </div>
  );
}
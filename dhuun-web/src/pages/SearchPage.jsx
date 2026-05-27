import {
  Search,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import useHomeFeed
  from '../hooks/useHomeFeed';

import SearchTrackRow
  from '../components/search/SearchTrackRow';

import PlaylistCard
  from '../components/playlists/PlaylistCard';

import ArtistResultCard
  from '../components/search/ArtistResultCard';

export default function
SearchPage() {

  const navigate =
    useNavigate();

  const [query, setQuery] =
    useState('');

  const [
    recentSearches,
    setRecentSearches,
  ] = useState([
    'Hindi Pop',
    'Lo-Fi',
    'Sufi Soul',
  ]);

  const {
    data,
    loading,
  } = useHomeFeed();

  const trending =
    data?.home?.trending || [];

  // -----------------------------------
  // Mock Playlists
  // -----------------------------------

  const playlists = [
    {
      id: '1',

      title:
        'Late Night Vibes',

      description:
        'Moody tracks for deep nights and cinematic drives.',

      trackCount: 18,

      images:
        trending
          .slice(0, 4)
          .map(
            (
              item
            ) =>
              item.track
                ?.coverImage
          ),
    },

    {
      id: '2',

      title:
        'Hindi Pop Essentials',

      description:
        'Trending Hindi pop hits and immersive melodies.',

      trackCount: 24,

      images:
        trending
          .slice(2, 6)
          .map(
            (
              item
            ) =>
              item.track
                ?.coverImage
          ),
    },
  ];

  // -----------------------------------
  // Search Results
  // -----------------------------------

  const filteredTracks =
    useMemo(() => {

      return trending.filter(
        (item) => {

          const track =
            item.track;

          const search =
            query.toLowerCase();

          return (

            track?.title
              ?.toLowerCase()
              .includes(
                search
              ) ||

            track?.primaryArtists?.[0]?.stageName
              ?.toLowerCase()
              .includes(
                search
              )

          );
        }
      );

    }, [
      trending,
      query,
    ]);

  const topResult =
    filteredTracks[0]
      ?.track || null;

  const filteredArtists =
    useMemo(() => {

      const uniqueArtists =
        [];

      const seen =
        new Set();

      trending.forEach(
        (item) => {

          const artist =
            item.track
              ?.primaryArtists?.[0]

          if (
            artist?.id &&
            !seen.has(
              artist.id
            )
          ) {

            seen.add(
              artist.id
            );

            uniqueArtists.push(
              artist
            );
          }
        }
      );

      return uniqueArtists.filter(
        (artist) =>
          artist.stageName
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );

    }, [
      trending,
      query,
    ]);

  const filteredPlaylists =
    useMemo(() => {

      return playlists.filter(
        (
          playlist
        ) =>
          playlist.title
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );

    }, [
      playlists,
      query,
    ]);

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {

    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#07010F] text-white">

      {/* Ambient */}

      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[140px]" />

      {/* Content */}

      <div className="relative z-10 px-6 pb-40 pt-[max(56px,env(safe-area-inset-top))]">

        {/* -------------------------------- */}
        {/* Hero */}
        {/* -------------------------------- */}

        <div className="relative mb-10 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">

          {/* Ambient */}

          <div className="absolute -top-16 right-[-30px] h-[220px] w-[220px] rounded-full bg-fuchsia-500/20 blur-[100px]" />

          <div className="absolute bottom-[-80px] left-[-20px] h-[180px] w-[180px] rounded-full bg-purple-500/20 blur-[100px]" />

          <div className="relative z-10">

            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/40">

              Discovery Engine

            </p>

            <h1 className="text-5xl font-black tracking-tight leading-none">

              Discover Music

            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">

              Search cinematic tracks, immersive lyrics, moods, artists, and curated vibes across Dhuun.

            </p>

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Search */}
        {/* -------------------------------- */}

        <div className="relative mb-10">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            value={query}
            onChange={(e) => {

              setQuery(
                e.target.value
              );
            }}

            placeholder="Tracks, artists, playlists, moods..."

            className="h-16 w-full rounded-[28px] border border-white/10 bg-white/[0.05] pl-14 pr-5 text-white shadow-[0_0_40px_rgba(168,85,247,0.08)] outline-none backdrop-blur-xl transition focus:border-fuchsia-500/30 focus:bg-white/[0.07]"
          />

        </div>

        {/* -------------------------------- */}
        {/* Empty Search */}
        {/* -------------------------------- */}

        {!query && (

          <div className="space-y-12">

            {/* Genres */}

            <div>

              <h2 className="mb-5 text-2xl font-black">

                Browse Vibes

              </h2>

              <div className="grid grid-cols-2 gap-4">

                {[
                  {
                    label: 'Hindi Pop',
                    gradient:
                      'from-pink-500 via-fuchsia-500 to-purple-600',
                  },

                  {
                    label: 'Sufi Soul',
                    gradient:
                      'from-amber-500 via-orange-500 to-rose-500',
                  },

                  {
                    label: 'Night Drive',
                    gradient:
                      'from-indigo-500 via-violet-500 to-fuchsia-500',
                  },

                  {
                    label: 'Lo-Fi',
                    gradient:
                      'from-cyan-500 via-sky-500 to-indigo-500',
                  },

                  {
                    label: 'Romantic',
                    gradient:
                      'from-rose-500 via-pink-500 to-fuchsia-500',
                  },

                  {
                    label: 'Soulful',
                    gradient:
                      'from-purple-500 via-violet-500 to-indigo-500',
                  },
                ].map(
                  (
                    genre
                  ) => (

                    <button
                      key={
                        genre.label
                      }

                      onClick={() =>
                        setQuery(
                          genre.label
                        )
                      }

                      className={`relative h-32 overflow-hidden rounded-[30px] bg-gradient-to-br ${genre.gradient} p-5 text-left shadow-2xl transition duration-300 hover:scale-[1.02]`}
                    >

                      <div className="absolute inset-0 bg-black/10" />

                      <div className="relative z-10 flex h-full items-end">

                        <div>

                          <p className="text-xs uppercase tracking-[0.25em] text-white/70">

                            Explore

                          </p>

                          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">

                            {genre.label}

                          </h3>

                        </div>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

            {/* Recent Searches */}

            <div>

              <h2 className="mb-5 text-2xl font-black">

                Recent Searches

              </h2>

              <div className="flex flex-wrap gap-3">

                {recentSearches.map(
                  (
                    item
                  ) => (

                    <button
                      key={item}

                      onClick={() =>
                        setQuery(item)
                      }

                      className="h-12 rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm text-white/70 transition hover:bg-white/[0.08]"
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        )}

        {/* -------------------------------- */}
        {/* Results */}
        {/* -------------------------------- */}

        {query && (

          <div className="space-y-12">

            {/* No Results */}

            {!filteredTracks.length &&
            !filteredArtists.length &&
            !filteredPlaylists.length && (

              <div className="flex flex-col items-center justify-center py-24 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">

                  <Search
                    size={34}
                    className="text-zinc-500"
                  />

                </div>

                <h3 className="mt-8 text-3xl font-black tracking-tight">

                  No Matches Found

                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500">

                  Try searching tracks, artists, moods, lyrics, or cinematic vibes.

                </p>

              </div>

            )}

            {/* Top Result */}

            {topResult && (

              <div>

                <h2 className="mb-5 text-2xl font-black">

                  Top Result

                </h2>

                <button

                  onClick={() => {

                    navigate(
                      `/app/track/${
                        topResult.slug ||
                        topResult.id
                      }`
                    );
                  }}

                  className="relative w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur-xl transition hover:bg-white/[0.05]"
                >

                  <div className="absolute -top-16 right-[-40px] h-[220px] w-[220px] rounded-full bg-fuchsia-500/20 blur-[100px]" />

                  <div className="relative z-10 flex items-center gap-5">

                    {/* Artwork */}

                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-[26px] bg-white/5">

                      {topResult.coverImage ? (

                        <img
                          src={
                            topResult.coverImage
                          }

                          alt={
                            topResult.title
                          }

                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="h-full w-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />

                      )}

                    </div>

                    {/* Meta */}

                    <div className="min-w-0">

                      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">

                        Track

                      </p>

                      <h3 className="text-3xl font-black tracking-tight leading-none">

                        {topResult.title}

                      </h3>

                      <p className="mt-3 text-white/60">

                        {topResult.primaryArtists?.[0]
                          ?.stageName ||
                          'Unknown Artist'}

                      </p>

                      <div className="mt-5 inline-flex h-11 items-center rounded-full bg-fuchsia-500 px-5 text-sm font-medium text-white">

                        Top Match

                      </div>

                    </div>

                  </div>

                </button>

              </div>

            )}

            {/* Artists */}

            {filteredArtists
              .length > 0 && (

              <div>

                <h2 className="mb-5 text-2xl font-black">

                  Artists

                </h2>

                <div className="scrollbar-hide flex gap-5 overflow-x-auto">

                  {filteredArtists.map(
                    (
                      artist
                    ) => (

                      <ArtistResultCard
                        key={
                          artist.id
                        }

                        artist={
                          artist
                        }
                      />

                    )
                  )}

                </div>

              </div>

            )}

            {/* Tracks */}

            {filteredTracks
              .length > 0 && (

              <div>

                <h2 className="mb-5 text-2xl font-black">

                  Tracks

                </h2>

                <div className="flex flex-col gap-2">

                  {filteredTracks.map(
                    (
                      item
                    ) => (

                      <SearchTrackRow
                        key={
                          item.track?.id
                        }

                        track={
                          item.track
                        }
                      />

                    )
                  )}

                </div>

              </div>

            )}

            {/* Playlists */}

            {filteredPlaylists
              .length > 0 && (

              <div>

                <h2 className="mb-5 text-2xl font-black">

                  Playlists

                </h2>

                <div className="scrollbar-hide flex gap-5 overflow-x-auto">

                  {filteredPlaylists.map(
                    (
                      playlist
                    ) => (

                      <PlaylistCard
                        key={
                          playlist.id
                        }

                        playlist={
                          playlist
                        }
                      />

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}
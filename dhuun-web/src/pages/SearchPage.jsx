import {
  Search,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

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
            track?.primaryArtist?.stageName
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
          ?.primaryArtist;

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

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-6 pt-8 pb-40">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">
            Explore
          </p>

          <h1 className="text-4xl font-black tracking-tight">
            Search
          </h1>
        </div>

        {/* -------------------------------- */}
        {/* Search Input */}
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
            placeholder="Tracks, artists, playlists..."
            className="w-full h-16 rounded-3xl bg-white/[0.04] border border-white/10 pl-14 pr-5 text-white placeholder:text-white/30 outline-none backdrop-blur-xl"
          />
        </div>

        {/* -------------------------------- */}
        {/* Empty Search */}
        {/* -------------------------------- */}

        {!query && (
          <div className="space-y-10">
            {/* Genres */}

            <div>
              <h2 className="text-xl font-bold mb-5">
                Browse Genres
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  'Pop',
                  'Hindi',
                  'Sufi',
                  'Lo-Fi',
                  'Romantic',
                  'Soulful',
                ].map(
                  (
                    genre
                  ) => (
                    <button
                      key={genre}
                      className="relative overflow-hidden rounded-[28px] h-28 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-5 text-left font-bold text-lg shadow-2xl"
                    >
                      {genre}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Recent Searches */}

                <div>
                <h2 className="text-xl font-bold mb-5">
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
                        className="px-5 h-12 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white/70"
                        >
                        {item}
                        </button>
                    )
                    )}
                </div>
                </div>

            {/* Trending Searches */}

            <div>
              <h2 className="text-xl font-bold mb-5">
                Trending
              </h2>

              <div className="flex flex-wrap gap-3">
                {[
                  'Hindi Pop',
                  'Lo-Fi Nights',
                  'Sufi Soul',
                  'Romantic',
                  'Trending Hits',
                ].map(
                  (
                    item
                  ) => (
                    <button
                      key={item}
                      className="px-5 h-12 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white/70"
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
                {/* -------------------------------- */}
                {/* Top Result */}
                {/* -------------------------------- */}

                {topResult && (
                <div>
                    <h2 className="text-2xl font-bold mb-5">
                    Top Result
                    </h2>

                    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
                    {/* Ambient Glow */}

                    <div className="absolute -top-16 right-[-40px] w-[220px] h-[220px] bg-fuchsia-500/20 blur-[100px] rounded-full" />

                    <div className="relative z-10 flex items-center gap-5">
                        {/* Artwork */}

                        <div className="w-28 h-28 rounded-[26px] overflow-hidden flex-shrink-0 bg-white/5">
                        {topResult.coverImage ? (
                            <img
                            src={
                                topResult.coverImage
                            }
                            alt={
                                topResult.title
                            }
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
                        )}
                        </div>

                        {/* Meta */}

                        <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
                            Track
                        </p>

                        <h3 className="text-3xl font-black tracking-tight leading-none">
                            {topResult.title}
                        </h3>

                        <p className="text-white/60 mt-3">
                          {topResult.primaryArtist
                            ?.stageName ||
                            'Unknown Artist'}
                        </p>

                        <div className="mt-5 inline-flex items-center rounded-full bg-fuchsia-500 text-white px-5 h-11 text-sm font-medium">
                            Top Match
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                {/* -------------------------------- */}
                {/* Artists */}
                {/* -------------------------------- */}

                {filteredArtists
                .length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-5">
                    Artists
                    </h2>

                    <div className="flex gap-5 overflow-x-auto scrollbar-hide">
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

                {/* -------------------------------- */}
                {/* Tracks */}
                {/* -------------------------------- */}

                <div>
                <h2 className="text-2xl font-bold mb-5">
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

                {/* -------------------------------- */}
                {/* Playlists */}
                {/* -------------------------------- */}

                <div>
                <h2 className="text-2xl font-bold mb-5">
                    Playlists
                </h2>

                <div className="flex gap-5 overflow-x-auto scrollbar-hide">
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
            </div>
            )}
      </div>
    </div>
  );
}
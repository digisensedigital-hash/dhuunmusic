import {
  Play,
  Pause,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import getArtist
  from '../api/artist/getArtist';

import {
  useParams,
} from 'react-router-dom';

import PlaylistTrackRow
  from '../components/playlists/PlaylistTrackRow';

import usePlayerStore
  from '../store/playerStore';

import {
  getMediaUrl,
} from '../utils/media';

export default function
ArtistPage() {
  const { id } =
    useParams();

    const {
      currentTrack,
      isPlaying,
      togglePlayPause,
      playTrack,
    } = usePlayerStore();

    const [artistData, setArtistData] =
      useState(null);

    const [loading, setLoading] =
      useState(true);

    const [error, setError] =
      useState(null);

    useEffect(() => {

      const loadArtist =
        async () => {

          try {

            setLoading(true);

            const response =
              await getArtist(id);

            setArtistData(
              response
            );

          } catch (err) {

            console.error(err);

            setError(err);

          } finally {

            setLoading(false);

          }

        };

      loadArtist();

    }, [id]);

    const artist =
      artistData?.artist;

    const tracks =
      artistData?.topTracks || [];

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const handlePlayArtist =
  () => {
    if (
      currentTrack?.id ===
        tracks[0]
          ?.id &&
      isPlaying
    ) {
      togglePlayPause();

      return;
    }

    playTrack({
      track:
        tracks[0],

      queue:
        tracks,

      startIndex: 0,
    });
  };

  if (error) {

  return (

    <div className="p-6 text-red-500">

      Failed to load artist

    </div>

  );

  }

  if (!artist) {
    return (
      <div className="p-6">
        Artist not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fuchsia-600/20 blur-[160px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-6 pt-8 pb-40">
        {/* -------------------------------- */}
        {/* Artist Hero */}
        {/* -------------------------------- */}

        <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-[#14141B] min-h-[520px]">
    {/* -------------------------------- */}
    {/* Background Artwork */}
    {/* -------------------------------- */}

    {artist.coverImage && (
      <img
        src={getMediaUrl(
          artist.coverImage
        )}
        alt={
          artist.stageName
        }
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          opacity-25
          scale-110
          blur-[2px]
        "
      />
    )}

    {/* -------------------------------- */}
    {/* Overlay Layers */}
    {/* -------------------------------- */}

    <div className="absolute inset-0 bg-gradient-to-t from-[#07070B] via-[#07070B]/70 to-black/20" />

    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070B]" />

    {/* -------------------------------- */}
    {/* Ambient Glow */}
    {/* -------------------------------- */}

    <div className="absolute -top-20 right-[-40px] w-[260px] h-[260px] bg-fuchsia-500/20 blur-[120px] rounded-full" />

    {/* -------------------------------- */}
    {/* Hero Content */}
    {/* -------------------------------- */}

    <div className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-10 h-full justify-end">
        {/* Avatar */}

        {artist.profileImage ? (
        <img
            src={
              getMediaUrl(
                artist.profileImage
              )
            }
            alt={
            artist.stageName
            }
            className="w-40 h-40 rounded-full object-cover border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
        />
        ) : (
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-6xl font-black text-white shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
            {artist.stageName
            ?.charAt(0)
            ?.toUpperCase()}
        </div>
        )}

        {/* Meta */}

        <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/40">
        Verified Artist
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight leading-none">
        {
            artist.stageName
        }
        </h1>

        <p className="mt-5 text-white/60 leading-relaxed max-w-[320px]">
        Immersive melodies,
        emotional storytelling,
        and cinematic soundscapes.
        </p>

        {/* Stats */}

        <div className="mt-8 flex items-center gap-8">
        <div>
            <div className="text-2xl font-black">
            {
                tracks
                .length
            }
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1">
            Tracks
            </div>
        </div>

        <div>
            <div className="text-2xl font-black">
            128K
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1">
            Monthly
            </div>
        </div>

        <div>
            <div className="text-2xl font-black">
            #12
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1">
            Trending
            </div>
        </div>
        </div>

        {/* CTA */}

        <button
        onClick={
            handlePlayArtist
        }
        className="mt-8 h-14 px-8 rounded-full bg-white text-black flex items-center gap-3 font-semibold shadow-2xl">
        {currentTrack?.id ===
            tracks[0]
                ?.id &&
            isPlaying ? (
            <Pause size={20} />
            ) : (
            <Play
                size={20}
                fill="currentColor"
            />
            )}

        Play Artist
        </button>
    </div>
    </div>


    <div className="sticky top-4 z-30 flex justify-end mt-8">
    <button
        onClick={
        handlePlayArtist
        }
        className="w-16 h-16 rounded-full bg-fuchsia-500 text-white shadow-2xl flex items-center justify-center border border-white/10 backdrop-blur-xl"
    >
        {currentTrack?.id ===
        tracks[0]
            ?.id &&
        isPlaying ? (
        <Pause size={24} />
        ) : (
        <Play
            size={24}
            fill="currentColor"
            className="ml-1"
        />
        )}
    </button>
    </div>

        {/* -------------------------------- */}
        {/* Top Tracks */}
        {/* -------------------------------- */}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black tracking-tight">
              Top Tracks
            </h2>

            <button className="text-sm text-white/40">
              View All
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {tracks.map(
              (
                track,
                index
              ) => (
                <PlaylistTrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  queue={
                    tracks
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import {
  Heart,
  Play,
  Pause,
} from 'lucide-react';

import usePlayerStore
  from '../store/playerStore';

import PlaylistTrackRow
  from '../components/playlists/PlaylistTrackRow';

export default function
LibraryPage() {
  const {
  savedTracks,
  currentTrack,
  isPlaying,
  togglePlayPause,
  playTrack,
  } = usePlayerStore();

  const handlePlayAll =
  () => {
    if (
      currentTrack?.id ===
        savedTracks[0]
          ?.id &&
      isPlaying
    ) {
      togglePlayPause();

      return;
    }

    if (
      !savedTracks.length
    ) {
      return;
    }

    playTrack({
      track:
        savedTracks[0],

      queue:
        savedTracks,

      startIndex: 0,
    });
  };

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
        {/* Library Hero */}
        {/* -------------------------------- */}

        <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-[#14141B] p-6 min-h-[320px]">
          {/* Glow */}

          <div className="absolute -top-20 right-[-40px] w-[260px] h-[260px] bg-fuchsia-500/20 blur-[120px] rounded-full" />

          {/* Content */}

          <div className="relative z-10 flex flex-col justify-end h-full">
            {/* Icon */}

            <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-2xl">
              <Heart
                size={42}
                className="fill-white text-white"
              />
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/40">
              Your Collection
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight leading-none">
              Saved Tracks
            </h1>

            <p className="mt-5 text-white/60 leading-relaxed max-w-[320px]">
              Music you love,
              collected into your
              personal universe.
            </p>

            <button
                onClick={handlePlayAll}
                className="mt-8 h-14 px-8 rounded-full bg-white text-black flex items-center gap-3 font-semibold shadow-2xl w-fit"
                >
                {currentTrack?.id ===
                    savedTracks[0]
                    ?.id &&
                isPlaying ? (
                    <Pause size={20} />
                ) : (
                    <Play
                    size={20}
                    fill="currentColor"
                    />
                )}

                Play All
                </button>

            {/* Stats */}

            <div className="mt-8 flex items-center gap-8">
              <div>
                <div className="text-2xl font-black">
                  {
                    savedTracks.length
                  }
                </div>

                <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1">
                  Saved
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">
                  HD
                </div>

                <div className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1">
                  Audio
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Empty State */}
        {/* -------------------------------- */}

        {!savedTracks.length && (
          <div className="mt-14 rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
              <Heart
                size={32}
                className="text-white/40"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No Saved Tracks Yet
            </h2>

            <p className="mt-4 text-white/50 leading-relaxed max-w-[280px] mx-auto">
              Save tracks you love
              to build your personal
              music collection.
            </p>
          </div>
        )}

        {/* -------------------------------- */}
        {/* Saved Tracks */}
        {/* -------------------------------- */}

        {savedTracks.length >
          0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black tracking-tight">
                Your Tracks
              </h2>

              <button className="text-sm text-white/40">
                Recently Added
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {savedTracks.map(
                (
                  track,
                  index
                ) => (
                  <PlaylistTrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    queue={
                      savedTracks
                    }
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
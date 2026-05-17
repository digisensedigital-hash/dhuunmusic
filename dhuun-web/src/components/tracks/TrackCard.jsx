import {
  Play,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

import {
  loadPlaybackQueue,
} from '../../lib/player';

export default function
TrackCard({
  track,
}) {
  const {
    playTrack,
  } = usePlayerStore();

  // -----------------------------------
  // Intelligent Playback Startup
  // -----------------------------------

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
    <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-[#15151D] shadow-2xl">
      {/* -------------------------------- */}
      {/* Artwork */}
      {/* -------------------------------- */}

      <div className="relative aspect-square overflow-hidden">
        {/* Real Artwork */}
        {track.coverImage ? (
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Floating Play Button */}
        <button
          onClick={handlePlay}
          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl"
        >
          <Play
            size={22}
            fill="currentColor"
          />
        </button>
      </div>

      {/* -------------------------------- */}
      {/* Track Content */}
      {/* -------------------------------- */}

      <div className="p-4">
        <h3 className="text-base font-semibold truncate">
          {track.title}
        </h3>

        <p className="text-sm text-white/60 truncate mt-1">
          {
            track.artist
              ?.stageName
          }
        </p>
      </div>
    </div>
  );
}
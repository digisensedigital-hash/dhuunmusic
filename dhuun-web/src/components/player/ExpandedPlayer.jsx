import {
  Pause,
  Play,
  ChevronDown,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

function formatTime(
  seconds = 0
) {
  const mins =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60);

  return `${mins}:${secs
    .toString()
    .padStart(2, '0')}`;
}

export default function
ExpandedPlayer({
  open,
  onClose,
}) {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    audioRef,
  } = usePlayerStore();

  if (
    !open ||
    !currentTrack
  ) {
    return null;
  }

  const progress =
    duration > 0
      ? (
          (currentTime /
            duration) *
          100
        ).toFixed(2)
      : 0;

  // -----------------------------------
  // Seeking
  // -----------------------------------

  const handleSeek =
    (e) => {
      const value =
        Number(
          e.target.value
        );

      if (audioRef) {
        audioRef.currentTime =
          value;
      }
    };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B0B12] overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex flex-col h-full px-6 pt-6 pb-12">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <ChevronDown size={22} />
          </button>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              Now Playing
            </p>
          </div>

          <div className="w-10" />
        </div>

        {/* -------------------------------- */}
        {/* Artwork */}
        {/* -------------------------------- */}

        <div className="aspect-square rounded-[40px] overflow-hidden mb-10 shadow-2xl">
          {currentTrack.coverImage ? (
            <img
              src={
                currentTrack.coverImage
              }
              alt={
                currentTrack.title
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
          )}
        </div>

        {/* -------------------------------- */}
        {/* Meta */}
        {/* -------------------------------- */}

        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">
            {
              currentTrack.title
            }
          </h1>

          <p className="text-lg text-white/50 mt-3">
            {
              currentTrack.primaryArtist
                ?.stageName
            }
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Progress */}
        {/* -------------------------------- */}

        <div className="mb-10">
          {/* Visual Progress */}
          <div className="relative mb-4">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* Interactive Seek Layer */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Timing */}
          <div className="flex justify-between text-xs text-white/40">
            <span>
              {formatTime(
                currentTime
              )}
            </span>

            <span>
              {formatTime(
                duration
              )}
            </span>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Controls */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-center">
          <button
            onClick={() =>
              setIsPlaying(
                !isPlaying
              )
            }
            className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center shadow-2xl"
          >
            {isPlaying ? (
              <Pause size={36} />
            ) : (
              <Play
                size={36}
                fill="currentColor"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
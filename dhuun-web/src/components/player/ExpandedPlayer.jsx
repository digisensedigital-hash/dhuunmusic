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

  // -----------------------------------
  // Primary Artist
  // -----------------------------------

  const primaryArtist =
    currentTrack
      ?.primaryArtists?.[0] ||
    null;

  // -----------------------------------
  // Progress
  // -----------------------------------

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

    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#0B0B12]">

      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex h-full flex-col px-6 pb-12 pt-6">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="mb-10 flex items-center justify-between">

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
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

        <div className="mb-10 aspect-square overflow-hidden rounded-[40px] shadow-2xl">

          {currentTrack.coverImage ? (

            <img
              src={
                currentTrack.coverImage
              }
              alt={
                currentTrack.title
              }
              className="h-full w-full object-cover"
            />

          ) : (

            <div className="h-full w-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />

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

          <p className="mt-3 text-lg text-white/50">

            {
              primaryArtist
                ?.stageName ||
              'Unknown Artist'
            }

          </p>

        </div>

        {/* -------------------------------- */}
        {/* Progress */}
        {/* -------------------------------- */}

        <div className="mb-10">

          {/* Visual Progress */}

          <div className="relative mb-4">

            <div className="overflow-hidden rounded-full bg-white/10">

              <div
                className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
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
              className="absolute inset-0 w-full cursor-pointer opacity-0"
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
            className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-black shadow-2xl"
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
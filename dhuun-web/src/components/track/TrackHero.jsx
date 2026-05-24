import {
  Play,
} from 'lucide-react';

import {
  getMediaUrl,
} from '../../utils/media';

export default function TrackHero({
  track,
  navigate,
  playTrack,
  loadPlaybackQueue,
}) {

  return (

    <>

      {/* ----------------------------------- */}
      {/* Cinematic Hero */}
      {/* ----------------------------------- */}

      <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#181022] via-[#130B1D] to-[#221133] p-5 shadow-[0_0_80px_rgba(168,85,247,0.08)]">

        {/* ----------------------------------- */}
        {/* Top Bar */}
        {/* ----------------------------------- */}

        <div className="flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >

            ←

          </button>

          <div className="text-sm font-medium tracking-wide text-zinc-400">

            Track

          </div>

          <button

            onClick={async () => {

              try {

                await navigator.share({

                  title:
                    track.title,

                  text:
                    `${track.title} by ${
                      track.primaryArtist
                        ?.stageName ||
                      'Unknown Artist'
                    }`,

                  url:
                  `${window.location.origin}/app/track/${
                    track.slug ||
                    track.id
                  }`,
                });

              } catch (error) {

                console.error(error);
              }
            }}

            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >

            ⋯

          </button>

        </div>

        {/* ----------------------------------- */}
        {/* Hero Content */}
        {/* ----------------------------------- */}

        <div className="mt-8 flex gap-5">

          {/* Artwork */}

          <div className="w-[42%] flex-shrink-0">

            <img
              src={getMediaUrl(
                track.coverImage
              )}
              alt={track.title}
              className="aspect-square w-full rounded-[28px] object-cover shadow-2xl"
            />

          </div>

          {/* Meta */}

          <div className="flex min-w-0 flex-1 flex-col">

            {/* Label */}

            <div className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">

              Cinematic Single

            </div>

            {/* Title */}

            <h1 className="mt-3 text-[38px] font-black leading-[0.95] tracking-tight text-white">

              {track.title}

            </h1>

            {/* Artist */}

            <div className="mt-4 flex items-center gap-3">

              {track.primaryArtist
                ?.profileImage && (

                <img
                  src={getMediaUrl(
                    track.primaryArtist
                      .profileImage
                  )}
                  alt={
                    track.primaryArtist
                      ?.stageName
                  }
                  className="h-10 w-10 rounded-full object-cover"
                />

              )}

              <div>

                <p className="font-semibold text-white">

                  {
                    track.primaryArtist
                      ?.stageName
                  }

                </p>

                <p className="text-sm text-zinc-500">

                  Dhuun Music

                </p>

              </div>

            </div>

            {/* Metadata */}

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-400">

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                {track.genre}

              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                {track.language}

              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                {Math.floor(
                  Number(track.duration || 0) / 60
                )}
                :
                {String(
                  Math.floor(
                    Number(track.duration || 0) % 60
                  )
                ).padStart(2, '0')}

              </div>

            </div>

            {/* Actions */}

            <div className="mt-auto pt-6">

              <button
                onClick={async () => {

                  try {

                    const response =
                      await loadPlaybackQueue(
                        track.id
                      );

                    const normalizedQueue = [

                      response.currentTrack,

                      ...response.nextTracks,

                    ].map((queueTrack) => ({

                      ...queueTrack,

                      id:
                        queueTrack.id ||
                        queueTrack._id,
                    }));

                    playTrack({

                      track:
                        response.currentTrack,

                      queue:
                        normalizedQueue,

                      startIndex: 0,
                    });

                  } catch (error) {

                    console.error(
                      'Failed to load playback queue:',
                      error
                    );

                    playTrack({

                      track: {
                        ...track,

                        artwork:
                          track.coverImage,
                      },

                      queue: [
                        {
                          ...track,

                          artwork:
                            track.coverImage,
                        },
                      ],

                      startIndex: 0,
                    });
                  }
                }}

                className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-white px-5 py-4 text-lg font-bold text-black transition hover:scale-[1.01]"
              >

                <Play
                  size={20}
                  fill="black"
                />

                Play Now

              </button>

            </div>

          </div>

        </div>

      </div>

    </>

  );
}
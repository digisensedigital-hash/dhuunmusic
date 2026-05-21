import {
  X,
  Music2,
} from 'lucide-react';

import usePlayerStore
  from '../../store/playerStore';

export default function
QueueDrawer() {

  const {
    queue,

    playOrder,

    currentIndex,

    isQueueDrawerOpen,

    closeQueueDrawer,

    playQueueTrack,
  } = usePlayerStore();

  // -----------------------------------
  // Hidden
  // -----------------------------------

  if (

  !isQueueDrawerOpen ||

  queue.length <= 1

  ) {
    return null;
  }

  const effectiveOrder =
    playOrder?.length
      ? playOrder
      : queue.map(
          (_, index) => index
        );

  const orderedQueue =
    effectiveOrder.map(
      (queueIndex) =>
        queue[queueIndex]
    );

  return (

    <div className="fixed inset-0 z-[300] flex items-end bg-black/60 backdrop-blur-md">

      {/* -------------------------------- */}
      {/* Backdrop */}
      {/* -------------------------------- */}

      <div
        onClick={
          closeQueueDrawer
        }
        className="absolute inset-0"
      />

      {/* -------------------------------- */}
      {/* Drawer */}
      {/* -------------------------------- */}

      <div className="relative mx-auto flex max-h-[78vh] w-full max-w-md flex-col overflow-hidden rounded-t-[36px] border-t border-white/10 bg-[#111118]">

        {/* -------------------------------- */}
        {/* Handle */}
        {/* -------------------------------- */}

        <div className="flex justify-center pb-3 pt-4">

          <div className="h-1.5 w-14 rounded-full bg-white/15" />

        </div>

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-between px-6 pb-5">

          <div>

            <h2 className="text-xl font-black text-white">

              Up Next

            </h2>

            <p className="mt-1 text-sm text-white/40">

              {queue.length}{' '}
              tracks in queue

            </p>

          </div>

          <button
            onClick={
              closeQueueDrawer
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70"
          >

            <X size={20} />

          </button>

        </div>

        {/* -------------------------------- */}
        {/* Queue List */}
        {/* -------------------------------- */}

        <div className="overflow-y-auto px-4 pb-[max(24px,env(safe-area-inset-bottom))]">

          <div className="space-y-2">

            {orderedQueue.map(
              (
                track,
                playbackIndex
              ) => {

                const isActive =
                  playbackIndex ===
                  currentIndex;

                return (

                  <button
                    key={
                      track.id ||
                      track._id ||
                      `${track.title}-${playbackIndex}`
                    }

                    onClick={() =>
                      playQueueTrack(
                        effectiveOrder[
                          playbackIndex
                        ]
                      )
                    }

                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                      isActive
                        ? 'border border-white/10 bg-white/10'
                        : 'bg-white/[0.03]'
                    }`}
                  >

                    {/* Artwork */}

                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white/5">

                      {track.coverImage ? (

                        <img
                          src={
                            track.coverImage
                          }
                          alt={
                            track.title
                          }
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-white/20">

                          <Music2
                            size={22}
                          />

                        </div>

                      )}

                    </div>

                    {/* Meta */}

                    <div className="min-w-0 flex-1 text-left">

                      <h3
                        className={`truncate font-semibold ${
                          isActive
                            ? 'text-white'
                            : 'text-white/90'
                        }`}
                      >

                        {
                          track.title
                        }

                      </h3>

                      <p className="mt-1 truncate text-sm text-white/40">

                        {track
                          .primaryArtist
                          ?.stageName ||
                          'Unknown Artist'}

                      </p>

                    </div>

                    {/* Playing Indicator */}

                    {isActive && (

                      <div className="flex items-center gap-1">

                        <span className="h-4 w-1 animate-pulse rounded-full bg-purple-400" />

                        <span className="delay-75 h-6 w-1 animate-pulse rounded-full bg-fuchsia-400" />

                        <span className="delay-150 h-3 w-1 animate-pulse rounded-full bg-pink-400" />

                      </div>

                    )}

                  </button>

                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
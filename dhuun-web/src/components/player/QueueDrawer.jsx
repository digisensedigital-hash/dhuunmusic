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
    !isQueueDrawerOpen
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
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-end">

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

      <div className="relative w-full max-w-md mx-auto bg-[#111118] rounded-t-[36px] border-t border-white/10 overflow-hidden max-h-[78vh] flex flex-col">

        {/* -------------------------------- */}
        {/* Handle */}
        {/* -------------------------------- */}

        <div className="flex justify-center pt-4 pb-3">
          <div className="w-14 h-1.5 rounded-full bg-white/15" />
        </div>

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-between px-6 pb-5">

          <div>

            <h2 className="text-xl font-black text-white">
              Up Next
            </h2>

            <p className="text-sm text-white/40 mt-1">
              {queue.length}{' '}
              tracks in queue
            </p>

          </div>

          <button
            onClick={
              closeQueueDrawer
            }
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70"
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
                      track.id
                    }
                    onClick={() =>
                      playQueueTrack(
                        effectiveOrder[
                          playbackIndex
                        ]
                      )
                    }
                    className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                      isActive
                        ? 'bg-white/10 border border-white/10'
                        : 'bg-white/[0.03]'
                    }`}
                  >

                    {/* Artwork */}

                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">

                      {track.coverImage ? (

                        <img
                          src={
                            track.coverImage
                          }
                          alt={
                            track.title
                          }
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-white/20">

                          <Music2
                            size={
                              22
                            }
                          />

                        </div>
                      )}
                    </div>

                    {/* Meta */}

                    <div className="flex-1 min-w-0 text-left">

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

                      <p className="text-sm text-white/40 truncate mt-1">

                        {track
                          .primaryArtist
                          ?.stageName ||
                          'Unknown Artist'}

                      </p>
                    </div>

                    {/* Playing Indicator */}

                    {isActive && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-4 rounded-full bg-purple-400 animate-pulse" />
                        <span className="w-1 h-6 rounded-full bg-fuchsia-400 animate-pulse delay-75" />
                        <span className="w-1 h-3 rounded-full bg-pink-400 animate-pulse delay-150" />
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
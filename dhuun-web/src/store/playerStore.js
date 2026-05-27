import { create }
  from 'zustand';

import {
  persist,
} from 'zustand/middleware';

import authStore
  from './auth/authStore';

import {

  getSavedTracks,

  saveTrack as saveTrackApi,

  removeSavedTrack as removeSavedTrackApi,

} from '../api/library';

const usePlayerStore =
  create(
    persist(
      (set, get) => ({
    // -----------------------------------
    // Core Playback State
    // -----------------------------------

    currentTrack: null,

    queue: [],

    smartQueue: [],

    playedTrackIds: [],

    smartQueuePrefetchedFor: [],

    queueSource: null,

    playOrder: [],

    currentIndex: 0,

    isPlaying: false,

    currentTime: 0,

    duration: 0,

    audioRef: null,

    savedTracks: [],

    recentlyPlayed: [],

    continueListening: [],

    // -----------------------------------
    // UI State
    // -----------------------------------

    isExpandedPlayerOpen: false,

    isQueueDrawerOpen: false,

    // -----------------------------------
    // Playback Modes
    // -----------------------------------

    isShuffleEnabled: false,

    repeatMode: 'off',
    // off | one | all

    // -----------------------------------
    // Playback Actions
    // -----------------------------------

    playTrack:
      ({
        track,

        queue = [],

        startIndex = 0,

        queueSource = 'manual',
      }) => {
        // -----------------------------------
        // Sanitize Queue
        // -----------------------------------

        queue =
          queue?.filter(
            Boolean
          ) || [];

        if (!track) {
          return;
        }

        const {
          recentlyPlayed,
          isShuffleEnabled,
        } = get();

        const deduped =
        recentlyPlayed.filter(
            (item) =>
              item?.id !==
              track?.id
          );

        const playOrder =
          isShuffleEnabled
            ? [
                startIndex,

                ...queue
                  .map(
                    (_, index) =>
                      index
                  )
                  .filter(
                    (index) =>
                      index !==
                      startIndex
                  )
                  .sort(
                    () =>
                      Math.random() -
                      0.5
                  ),
              ]
            : queue.map(
                (_, index) =>
                  index
              );

        const playbackIndex =
          playOrder.findIndex(
            (index) =>
              index ===
              startIndex
          );

        set({
          currentTrack:
            track,

          queue,

          queueSource,

          playOrder,

          currentIndex:
            playbackIndex >= 0
              ? playbackIndex
              : 0,

          isPlaying: true,

          currentTime: 0,

          recentlyPlayed: [
            track,
            ...deduped,
          ].slice(0, 30),
        });
      },

      playNextTrack:
      () => {
        const {
          queue,
          playOrder,
          currentIndex,
          repeatMode,
        } = get();

        const effectiveOrder =
        playOrder?.length
          ? playOrder
          : queue.map(
              (_, index) => index
            );

        // -----------------------------------
        // Repeat One
        // -----------------------------------

        if (
          repeatMode ===
          'one'
        ) {
          const audio =
            get().audioRef;

          if (audio) {
            audio.currentTime = 0;

            audio.play();
          }

          return;
        }

        const nextIndex =
          currentIndex + 1;

        const nextQueueIndex =
          effectiveOrder[
            nextIndex
          ];

        const nextTrack =
          queue[
            nextQueueIndex
          ];

        // -----------------------------------
        // Repeat All
        // -----------------------------------

        if (
          !nextTrack &&
          repeatMode ===
            'all'
        ) {
          set({
            currentTrack:
              queue[
                effectiveOrder[0]
              ],

            currentIndex: 0,

            isPlaying: true,

            currentTime: 0,
          });

          return;
        }

        // -----------------------------------
        // End Queue
        // -----------------------------------

        if (!nextTrack) {
          const {
            smartQueue,
          } = get();

          // -----------------------------------
          // Continue Into Smart Queue
          // -----------------------------------

          if (
            smartQueue?.length
          ) {
            const nextSmartTrack =
              smartQueue[0];

            const remainingSmartQueue =
              smartQueue.slice(1);

            set({
              currentTrack:
                nextSmartTrack,

              queue: [
                ...queue,
                nextSmartTrack,
              ],

              smartQueue:
                remainingSmartQueue,

              playOrder: [
                ...effectiveOrder,
                queue.length,
              ],

              currentIndex:
                currentIndex + 1,

              isPlaying: true,

              currentTime: 0,
            });

            return;
          }

  // -----------------------------------
  // End Playback
  // -----------------------------------

  set({
    isPlaying: false,
  });

  return;
}

        // -----------------------------------
        // Normal Next
        // -----------------------------------

        set({
          currentTrack:
            nextTrack,

          playedTrackIds: [
            ...new Set([
              ...get()
                .playedTrackIds,

              nextTrack.id,
            ]),
          ],

          currentIndex:
            nextIndex,

          isPlaying: true,

          currentTime: 0,
        });
      },

     playPreviousTrack:
      () => {
        const {
          queue,
          playOrder,
          currentIndex,
        } = get();

        const effectiveOrder =
          playOrder?.length
            ? playOrder
            : queue.map(
                (_, index) => index
              );

        const prevIndex =
          currentIndex - 1;

        const prevQueueIndex =
          effectiveOrder[
            prevIndex
          ];

        const prevTrack =
          queue[
            prevQueueIndex
          ];

        if (!prevTrack) {
          return;
        }

        set({
          currentTrack:
            prevTrack,

          currentIndex:
            prevIndex,

          isPlaying: true,

          currentTime: 0,
        });
      },

     togglePlayPause:
      () => {
        const {
          isPlaying,
        } = get();

        set({
          isPlaying:
            !isPlaying,
        });
      },

    
      seekTo:
      (time) => {
        const audio =
          get().audioRef;

        if (!audio) {
          return;
        }

        audio.currentTime =
          time;

        set({
          currentTime: time,
        });
      },

    // -----------------------------------
    // Queue Actions
    // -----------------------------------

    playQueueTrack:
    (index) => {
      const {
        queue,
        playOrder,
      } = get();

      const track =
        queue[index];

      if (!track) {
        return;
      }

      const effectiveOrder =
        playOrder?.length
          ? playOrder
          : queue.map(
              (_, i) => i
            );

      const playbackIndex =
        effectiveOrder.findIndex(
          (
            queueIndex
          ) =>
            queueIndex ===
            index
        );

      set({
        currentTrack:
          track,

        currentIndex:
          playbackIndex >= 0
            ? playbackIndex
            : index,

        isPlaying: true,

        currentTime: 0,
      });
    },

    enqueueSmartTracks:
      (tracks = []) => {
        if (
          !tracks?.length
        ) {
          return;
        }

        const existingIds =
          new Set([
            ...get().queue.map(
              (track) =>
                track?.id
            ),

            ...get().smartQueue.map(
              (track) =>
                track?.id
            ),
          ]);

        const uniqueTracks =
          tracks.filter(
            (track) =>
              track?.id &&
              !existingIds.has(
                track.id
              )
          );

        if (
          !uniqueTracks.length
        ) {
          return;
        }

        set({
          smartQueue: [
            ...get()
              .smartQueue,

            ...uniqueTracks,
          ],
        });
      },

    // -----------------------------------
    // UI Actions
    // -----------------------------------

    openExpandedPlayer:
      () =>
        set({
          isExpandedPlayerOpen: true,
        }),

    closeExpandedPlayer:
      () =>
        set({
          isExpandedPlayerOpen: false,
        }),

    openQueueDrawer:
      () =>
        set({
          isQueueDrawerOpen: true,
        }),

    closeQueueDrawer:
      () =>
        set({
          isQueueDrawerOpen: false,
        }),

    toggleQueueDrawer:
      () =>
        set({
          isQueueDrawerOpen:
            !get()
              .isQueueDrawerOpen,
        }),

    // -----------------------------------
    // Playback Modes
    // -----------------------------------

    toggleShuffle:
  () => {
    const {
      isShuffleEnabled,
      queue,
      currentTrack,
    } = get();

    // -----------------------------------
    // Disable Shuffle
    // -----------------------------------

    if (
      isShuffleEnabled
    ) {
      const currentIndex =
        queue.findIndex(
          (track) =>
            track?.id ===
            currentTrack?.id
        );

      set({
        isShuffleEnabled:
          false,

        playOrder:
          queue.map(
            (_, index) =>
              index
          ),

        currentIndex:
          currentIndex >= 0
            ? currentIndex
            : 0,
      });

      return;
    }

    // -----------------------------------
    // Enable Shuffle
    // -----------------------------------

    const indices =
      queue.map(
        (_, index) =>
          index
      );

    const currentQueueIndex =
      queue.findIndex(
        (track) =>
          track?.id ===
          currentTrack?.id
      );

    const remaining =
      indices.filter(
        (index) =>
          index !==
          currentQueueIndex
      );

    // Fisher-Yates Shuffle

    for (
      let i =
        remaining.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() *
            (i + 1)
        );

      [
        remaining[i],
        remaining[j],
      ] = [
        remaining[j],
        remaining[i],
      ];
    }

    const shuffledOrder =
      [
        currentQueueIndex,
        ...remaining,
      ];

    set({
      isShuffleEnabled:
        true,

      playOrder:
        shuffledOrder,

      currentIndex: 0,
    });
    },

    cycleRepeatMode:
      () => {
        const current =
          get().repeatMode;

        if (
          current === 'off'
        ) {
          set({
            repeatMode:
              'all',
          });

          return;
        }

        if (
          current === 'all'
        ) {
          set({
            repeatMode:
              'one',
          });

          return;
        }

        set({
          repeatMode:
            'off',
        });
      },

    // -----------------------------------
    // State Setters
    // -----------------------------------

    setCurrentTrack:
      (track) =>
        set({
          currentTrack: track,
        }),

    setQueue:
      (queue) =>
        set({
          queue,
        }),

    setPlayOrder:
    (playOrder) =>
      set({
        playOrder,
      }),

    setCurrentIndex:
      (index) =>
        set({
          currentIndex: index,
        }),

    setIsPlaying:
      (value) =>
        set({
          isPlaying: value,
        }),

    setExpandedPlayerOpen:
      (value) =>
        set({
          isExpandedPlayerOpen:
            value,
        }),

    setCurrentTime:
      (value) =>
        set({
          currentTime: value,
        }),

    setDuration:
      (value) =>
        set({
          duration: value,
        }),

    setAudioRef:
      (value) =>
        set({
          audioRef: value,
        }),

    setSmartQueuePrefetchedFor:
    (tracks) =>
      set({
        smartQueuePrefetchedFor:
          tracks,
      }),

    // -----------------------------------
    // Saved Tracks
    // -----------------------------------

    hydrateSavedTracks:
      async () => {

        try {

          const user =
            authStore
              .getState()
              ?.user;

          // -----------------------------------
          // Guest User
          // -----------------------------------

          if (!user) {

            const guestTracks =
              JSON.parse(

                localStorage.getItem(
                  'guest-saved-tracks'
                ) || '[]'
              );

            set({
              savedTracks:
                guestTracks,
            });

            return;
          }

          // -----------------------------------
          // Authenticated User
          // -----------------------------------

          const response =
            await getSavedTracks();

          set({

            savedTracks:
              response.tracks || [],
          });

        } catch (error) {

          console.error(error);
        }
      },

    toggleSaveTrack:
      async (track) => {

        try {

          const user =
            authStore
              .getState()
              ?.user;

          const {
            savedTracks,
          } = get();

          const trackId =

            track.id ||
            track._id;

          const exists =
            savedTracks.some(

              (item) =>

                (
                  item.id ||
                  item._id
                ) === trackId
            );

          // -----------------------------------
          // Remove Saved Track
          // -----------------------------------

          if (exists) {

            // Guest

            if (!user) {

              const updated =
                savedTracks.filter(

                  (item) =>

                    (
                      item.id ||
                      item._id
                    ) !== trackId
                );

              localStorage.setItem(

                'guest-saved-tracks',

                JSON.stringify(
                  updated
                )
              );

              set({
                savedTracks:
                  updated,
              });

              return;
            }

            // Authenticated

            await removeSavedTrackApi(
              trackId
            );

            set({

              savedTracks:
                savedTracks.filter(

                  (item) =>

                    (
                      item.id ||
                      item._id
                    ) !== trackId
                ),
            });

            return;
          }

          // -----------------------------------
          // Add Saved Track
          // -----------------------------------

          // Guest

          if (!user) {

            const updated = [

              track,
              ...savedTracks,
            ];

            localStorage.setItem(

              'guest-saved-tracks',

              JSON.stringify(
                updated
              )
            );

            set({
              savedTracks:
                updated,
            });

            return;
          }

          // Authenticated

          await saveTrackApi(
            trackId
          );

          set({

            savedTracks: [

              track,
              ...savedTracks,
            ],
          });

        } catch (error) {

          console.error(error);
        }
      },

    isTrackSaved:
      (trackId) => {

    return get()
      .savedTracks
      .some(

        (track) =>

          (
            track.id ||
            track._id
          ) === trackId
      );
  },
    
    // -----------------------------------
    // Continue Listening
    // -----------------------------------

    updateContinueListening:
      ({
        track,
        currentTime,
        duration,
      }) => {
        if (
          !track ||
          !duration
        ) {
          return;
        }

        // Ignore near-complete tracks

        const progress =
          currentTime /
          duration;

        if (progress > 0.95) {
          set({
            continueListening:
              get()
                .continueListening
                .filter(
                  (
                    item
                  ) =>
                    item.track
                      .id !==
                    track.id
                ),
          });

          return;
        }

        const existing =
          get()
            .continueListening;

        const deduped =
          existing.filter(
            (item) =>
              item.track.id !==
              track.id
          );

        set({
          continueListening:
            [
              {
                track,
                currentTime,
                duration,
                updatedAt:
                  Date.now(),
              },

              ...deduped,
            ].slice(0, 20),
        });
      },  
    
        }),
      {
      name:
        'dhuun-player-store',

      version: 2,
      

  partialize:
    (state) => ({
      currentTrack:
        state.currentTrack,

      queue:
        state.queue,

      playOrder:
        state.playOrder,

      currentIndex:
        state.currentIndex,

      isPlaying:
        false,

      currentTime: 0,

      duration:
        state.duration,

      savedTracks:
        state.savedTracks,

      recentlyPlayed:
      state.recentlyPlayed,

      continueListening:
      state.continueListening,

    }),
  }
    )
  );

export default usePlayerStore;
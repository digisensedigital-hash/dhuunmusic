import { create }
  from 'zustand';

const usePlayerStore =
  create((set, get) => ({
    currentTrack: null,

    queue: [],

    currentIndex: 0,

    isPlaying: false,

    isExpandedPlayerOpen: false,

    currentTime: 0,

    duration: 0,

    audioRef: null,

    // -----------------------------------
    // Playback Actions
    // -----------------------------------

    playTrack:
      ({
        track,
        queue = [],
        startIndex = 0,
      }) => {
        set({
          currentTrack: track,

          queue,

          currentIndex:
            startIndex,

          isPlaying: true,

          currentTime: 0,
        });
      },

    playNextTrack:
      () => {
        const {
          queue,
          currentIndex,
        } = get();

        const nextIndex =
          currentIndex + 1;

        const nextTrack =
          queue[nextIndex];

        if (!nextTrack) {
          set({
            isPlaying: false,
          });

          return;
        }

        set({
          currentTrack:
            nextTrack,

          currentIndex:
            nextIndex,

          isPlaying: true,

          currentTime: 0,
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
  }));

export default usePlayerStore;
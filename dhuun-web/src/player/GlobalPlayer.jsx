import {
  useEffect,
  useRef,
} from 'react';

import Hls from 'hls.js';

import usePlayerStore
  from '../store/playerStore';

import {
  startListenSession,
  sendListenHeartbeat,
  completeListenSession,
} from '../lib/listenSession';

import {
  getRecommendedTracks,
} from '../api/recommendations';

export default function
GlobalPlayer() {
  const audioRef =
    useRef(null);

  const hlsRef =
    useRef(null);

  const sessionRef =
    useRef(null);

  const heartbeatRef =
    useRef(null);

  const activeTrackSessionRef =
  useRef(null);

  const {
  currentTrack,
  isPlaying,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setAudioRef,
  playNextTrack,
  updateContinueListening,
  queue,
  currentIndex,
  smartQueue,
  enqueueSmartTracks,
  smartQueuePrefetchedFor,
  setSmartQueuePrefetchedFor,
  } = usePlayerStore();

  // -----------------------------------
  // Stream Loader
  // -----------------------------------

  useEffect(() => {
    if (
      !currentTrack ||
      !audioRef.current ||
      !currentTrack.streamUrl
    ) {
      return;
    }

    const audio =
      audioRef.current;

    const streamUrl =
      currentTrack.streamUrl;

    setAudioRef(audio);

    // -----------------------------------
    // Cleanup Previous Session
    // -----------------------------------

    if (
      heartbeatRef.current
    ) {
      clearInterval(
        heartbeatRef.current
      );

      heartbeatRef.current =
        null;
    }

    if (
      sessionRef.current
    ) {
      completeListenSession({
        sessionId:
          sessionRef.current,
      });

      sessionRef.current =
        null;
    }

    // -----------------------------------
    // Start Listen Session
    // -----------------------------------

    // -----------------------------------
    // Prevent Duplicate Session Starts
    // -----------------------------------

    if (
      activeTrackSessionRef.current ===
      currentTrack.id
    ) {
    } else {
      activeTrackSessionRef.current =
        currentTrack.id;

      (async () => {
        try {
          const response =
            await startListenSession(
              currentTrack.id
            );

          if (
            response?.sessionId
          ) {
            sessionRef.current =
              response.sessionId;

            // -----------------------------------
            // Heartbeat Loop
            // -----------------------------------

            heartbeatRef.current =
              setInterval(() => {
                if (
                  sessionRef.current
                ) {
                  sendListenHeartbeat(
                    {
                      sessionId:
                        sessionRef.current,
                    }
                  );
                }
              }, 15000);
          }
        } catch (error) {
          console.error(
            '[LISTEN_SESSION_FAILED]',
            error
          );

          activeTrackSessionRef.current =
            null;
        }
      })();
    }

    
    // -----------------------------------
    // Full Cleanup
    // -----------------------------------

    if (!audio.paused) {
      audio.pause();
    }

    if (hlsRef.current) {
      hlsRef.current.destroy();

      hlsRef.current =
        null;
    }

    // IMPORTANT:
    // Avoid fully resetting the audio
    // element on mobile browsers.
    //
    // removeAttribute('src') + load()
    // can aggressively unload media
    // pipeline while app is backgrounded,
    // which may break next-track autoplay.
    //
    // Keep the audio element alive
    // and only replace source when
    // next track initializes.


    // -----------------------------------
    // Native Safari HLS
    // -----------------------------------

    if (
      audio.canPlayType(
        'application/vnd.apple.mpegurl'
      )
    ) {

      audio.src =
        streamUrl;

      if (isPlaying) {
        audio
          .play()
          .catch(
            console.error
          );
      }
    }

    // -----------------------------------
    // HLS.js
    // -----------------------------------

    else if (
      Hls.isSupported()
    ) {

      const hls =
        new Hls({
          enableWorker: true,
        });

      hlsRef.current =
        hls;

      hls.loadSource(
        streamUrl
      );

      hls.attachMedia(
        audio
      );

      hls.on(
        Hls.Events.MANIFEST_PARSED,
        () => {

          if (isPlaying) {
            audio
              .play()
              .catch(
                console.error
              );
          }
        }
      );

      hls.on(
        Hls.Events.ERROR,
        (
          event,
          data
        ) => {
          console.error(
            'HLS Error:',
            data
          );
        }
      );
    }

    // -----------------------------------
    // Playback Events
    // -----------------------------------

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          audio.currentTime
        );

        updateContinueListening(
          {
            track:
              currentTrack,

            currentTime:
              audio.currentTime,

            duration:
              audio.duration ||
              0,
          }
        );
      };

    const handleLoadedMetadata =
      () => {
        setDuration(
          audio.duration || 0
        );
      };

    const handleEnded = () => {
      const sessionId =
        sessionRef.current;

      sessionRef.current =
        null;

      activeTrackSessionRef.current =
        null;

      // ADVANCE IMMEDIATELY
      playNextTrack();

      // Fire-and-forget telemetry
      if (sessionId) {
        completeListenSession({
          sessionId,
        }).catch(console.error);
      }
    };

    // -----------------------------------
    // Interruption Handling
    // -----------------------------------

    const handlePause =
      () => {
        setIsPlaying(
          false
        );
      };

    const handlePlay =
      () => {
        setIsPlaying(
          true
        );
      };

    // -----------------------------------
    // Buffer / Stall Recovery
    // -----------------------------------

    const handleWaiting =
      () => {
      };

    const handleCanPlay =
      () => {
    };

    const handleAudioError =
    () => {

      console.error(
        '[AUDIO_PLAYBACK_FAILED]',
        currentTrack?.id
      );

      // -----------------------------------
      // Stop Recovery Loops
      // -----------------------------------

      if (
        heartbeatRef.current
      ) {

        clearInterval(
          heartbeatRef.current
        );

        heartbeatRef.current =
          null;
      }

      // -----------------------------------
      // Cleanup HLS
      // -----------------------------------

      if (hlsRef.current) {

        hlsRef.current.destroy();

        hlsRef.current =
          null;
      }

      // -----------------------------------
      // Reset Failed Session
      // -----------------------------------

      sessionRef.current =
        null;

      activeTrackSessionRef.current =
        null;

      // -----------------------------------
      // Skip Dead Track
      // -----------------------------------

      playNextTrack();
    };

    // -----------------------------------
    // Visibility Recovery
    // -----------------------------------

      const handleVisibilityChange =
      () => {

        if (
          document.visibilityState !==
          'visible'
        ) {
          return;
        }

        // -----------------------------------
        // Invalid / Removed Track
        // -----------------------------------

        if (
          !currentTrack?.streamUrl
        ) {
          return;
        }

        // -----------------------------------
        // Soft Resume Retry Loop
        // -----------------------------------

        let attempts = 0;

        const maxAttempts = 5;

        const retryInterval =
          setInterval(
            async () => {

              attempts++;

              // -----------------------------------
              // Playback Already Recovered
              // -----------------------------------

              if (
                !audio.paused
              ) {

                clearInterval(
                  retryInterval
                );

                return;
              }

              // -----------------------------------
              // Invalid Stream During Retry
              // -----------------------------------

              if (
                !currentTrack?.streamUrl
              ) {

                clearInterval(
                  retryInterval
                );

                return;
              }

              // -----------------------------------
              // Stop Retry Loop
              // -----------------------------------

              if (
                attempts >=
                maxAttempts
              ) {

                clearInterval(
                  retryInterval
                );

                return;
              }

              // -----------------------------------
              // Retry Playback
              // -----------------------------------

              try {

                await audio.play();

              } catch (error) {

                console.error(
                  '[AUDIO_RESUME_FAILED]',
                  error
                );
              }
            },
            1500
          );
      };

    audio.addEventListener(
      'timeupdate',
      handleTimeUpdate
    );

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    audio.addEventListener(
      'ended',
      handleEnded
    );

    audio.addEventListener(
      'pause',
      handlePause
    );

    audio.addEventListener(
      'play',
      handlePlay
    );

    audio.addEventListener(
      'waiting',
      handleWaiting
    );

    audio.addEventListener(
      'canplay',
      handleCanPlay
    );

    audio.addEventListener(
      'error',
      handleAudioError
    );

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    // -----------------------------------
    // Media Session API
    // -----------------------------------

    if (
      'mediaSession' in
      navigator
    ) {
      navigator.mediaSession.setActionHandler(
        'play',
        () => {
          audio
            .play()
            .catch(
              console.error
            );
        }
      );

      navigator.mediaSession.setActionHandler(
        'pause',
        () => {
          audio.pause();
        }
      );

      navigator.mediaSession.setActionHandler(
        'nexttrack',
        () => {
          playNextTrack();
        }
      );
    }

    return () => {
      audio.removeEventListener(
        'timeupdate',
        handleTimeUpdate
      );

      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );

      audio.removeEventListener(
        'ended',
        handleEnded
      );

      audio.removeEventListener(
        'pause',
        handlePause
      );

      audio.removeEventListener(
        'play',
        handlePlay
      );

      audio.removeEventListener(
        'waiting',
        handleWaiting
      );

      audio.removeEventListener(
        'canplay',
        handleCanPlay
      );

      audio.removeEventListener(
        'error',
        handleAudioError
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      // -----------------------------------
      // Session Cleanup
      // -----------------------------------

      if (
        heartbeatRef.current
      ) {
        clearInterval(
          heartbeatRef.current
        );

        heartbeatRef.current =
          null;
      }

      if (
        sessionRef.current
      ) {
        completeListenSession({
          sessionId:
            sessionRef.current,
        });

        sessionRef.current =
          null;
        
        activeTrackSessionRef.current =
          null;

      }

      audio.pause();

      if (hlsRef.current) {
        hlsRef.current.destroy();

        hlsRef.current =
          null;
      }
    };
  }, [currentTrack]);

  // -----------------------------------
  // Play / Pause Sync
  // -----------------------------------

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const audio =
      audioRef.current;

    if (isPlaying) {
      audio
        .play()
        .catch(
          console.error
        );
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // -----------------------------------
  // Smart Queue Prefetch
  // -----------------------------------

  useEffect(() => {
    // -----------------------------------
    // No Queue
    // -----------------------------------

    if (!queue?.length) {
      return;
    }

    // -----------------------------------
    // Already Has Smart Queue
    // -----------------------------------

    if (smartQueue?.length > 0) {
      return;
    }

    // -----------------------------------
    // Near Queue End
    // -----------------------------------

    const remainingTracks =
      queue.length -
      currentIndex -
      1;

    if (remainingTracks > 1) {
      return;
    }

    // -----------------------------------
    // Prevent Recursive Prefetch
    // -----------------------------------

    if (
      smartQueuePrefetchedFor.includes(
        currentTrack?.id
      )
    ) {
      return;
    }

    // -----------------------------------
    // Intelligent Continuation
    // -----------------------------------

    // -----------------------------------
    // Fetch Intelligent Recommendations
    // -----------------------------------

    (async () => {
      if (
        !currentTrack?.id
      ) {
        return;
      }

      setSmartQueuePrefetchedFor(
        [
          ...smartQueuePrefetchedFor,

          currentTrack.id,
        ]
      );

      const recommendations =
        await getRecommendedTracks(
          currentTrack.id
        );

      if (
        !recommendations?.length
      ) {
        return;
      }

      enqueueSmartTracks(
        recommendations
          .map(
            (item) =>
              item.track
          )
          .filter(Boolean)
      );
    })();
      }, [
    queue,

    currentIndex,

    smartQueue,

    currentTrack,

    enqueueSmartTracks,
  ]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      hidden
    />
  );
}
import {
  useEffect,
  useRef,
} from 'react';

import Hls from 'hls.js';

import usePlayerStore
  from '../store/playerStore';

export default function
GlobalPlayer() {
  const audioRef =
    useRef(null);

  const hlsRef =
    useRef(null);

  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setAudioRef,
    playNextTrack,
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

    console.log(
      'Loading stream:',
      streamUrl
    );

    setAudioRef(audio);

    // -----------------------------------
    // Full Cleanup
    // -----------------------------------

    audio.pause();

    if (hlsRef.current) {
      hlsRef.current.destroy();

      hlsRef.current =
        null;
    }

    audio.removeAttribute(
      'src'
    );

    audio.load();

    // -----------------------------------
    // Native Safari HLS
    // -----------------------------------

    if (
      audio.canPlayType(
        'application/vnd.apple.mpegurl'
      )
    ) {
      console.log(
        'Using native HLS'
      );

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
      console.log(
        'Using HLS.js'
      );

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
          console.log(
            'Manifest parsed'
          );

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
      };

    const handleLoadedMetadata =
      () => {
        setDuration(
          audio.duration || 0
        );
      };

    const handleEnded =
      () => {
        playNextTrack();
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

  return (
    <audio
      ref={audioRef}
      preload="auto"
      hidden
    />
  );
}
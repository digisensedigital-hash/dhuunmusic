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
      !audioRef.current
    ) {
      return;
    }

    const audio =
      audioRef.current;

    setAudioRef(audio);

    const streamUrl =
      currentTrack.streamUrl;

    console.log(
      'Loading stream:',
      streamUrl
    );

    // -----------------------------------
    // Full Runtime Cleanup
    // -----------------------------------

    audio.pause();

    audio.removeAttribute(
      'src'
    );

    audio.load();

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

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
    // HLS.js Runtime
    // -----------------------------------

    else if (
      Hls.isSupported()
    ) {
      const hls =
        new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });

      hlsRef.current =
        hls;

      hls.attachMedia(
        audio
      );

      hls.on(
        Hls.Events.MEDIA_ATTACHED,
        () => {
          console.log(
            'HLS media attached'
          );

          hls.loadSource(
            streamUrl
          );
        }
      );

      hls.on(
        Hls.Events.MANIFEST_PARSED,
        () => {
          console.log(
            'HLS manifest parsed'
          );

          if (isPlaying) {
            audio
              .play()
              .then(() => {
                console.log(
                  'Playback started'
                );
              })
              .catch(
                (err) => {
                  console.error(
                    'Playback failed:',
                    err
                  );
                }
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
        console.log(
          'Track ended'
        );

        playNextTrack();
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

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
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
        .then(() => {
          console.log(
            'Playback resumed'
          );
        })
        .catch((err) => {
          console.error(
            'Playback failed:',
            err
          );
        });
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
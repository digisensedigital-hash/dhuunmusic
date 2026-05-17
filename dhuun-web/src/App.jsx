import AppRoutes
  from './routes/AppRoutes';

import usePlayerStore
  from './store/playerStore';

export default function App() {
  const {
    setCurrentTrack,
    setIsPlaying,
  } = usePlayerStore();

  // -----------------------------------
  // Temporary Playback Debug
  // -----------------------------------

  window.playTrack =
    (track) => {
      console.log(
        'Playing track:',
        track
      );

      setCurrentTrack(track);

      setIsPlaying(true);
    };

  return <AppRoutes />;
}
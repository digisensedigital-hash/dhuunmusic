import AppRoutes
  from './routes/AppRoutes';

import usePlayerStore
  from './store/playerStore';

import useHydrateAuth
  from './hooks/auth/useHydrateAuth';

import useHydrateCapabilities
  from './hooks/capabilities/useHydrateCapabilities';

export default function App() {

  const {
    setCurrentTrack,
    setIsPlaying,
  } = usePlayerStore();

  useHydrateAuth();

  useHydrateCapabilities();

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
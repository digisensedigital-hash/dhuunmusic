import {
  useEffect,
} from 'react';

import AppRoutes
  from './routes/AppRoutes';

import usePlayerStore
  from './store/playerStore';

import useHydrateAuth
  from './hooks/auth/useHydrateAuth';

import useHydrateCapabilities
  from './hooks/capabilities/useHydrateCapabilities';

import authStore
  from './store/auth/authStore';

export default function App() {

  const {
    setCurrentTrack,
    setIsPlaying,
    hydrateSavedTracks,
  } = usePlayerStore();

  const {
  user,
  hydrating,
  } = authStore();

  useHydrateAuth();

  useHydrateCapabilities();

  // -----------------------------------
  // Hydrate Saved Tracks
  // -----------------------------------

  useEffect(() => {

  if (hydrating) {
    return;
  }

  hydrateSavedTracks();

  }, [
    user,
    hydrating,
    hydrateSavedTracks,
  ]);

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
import {
  useEffect,
} from 'react';

import {
  Toaster,
} from 'sonner';

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

  /* ----------------------------------- */
  /* Hydrate Saved Tracks */
  /* ----------------------------------- */

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

  /* ----------------------------------- */
  /* Temporary Playback Debug */
  /* ----------------------------------- */

  window.playTrack =
    (track) => {

      setCurrentTrack(track);

      setIsPlaying(true);

    };

  return (

    <>

      {/* ----------------------------------- */}
      {/* Global Toast System */}
      {/* ----------------------------------- */}

      <Toaster

        position="top-center"

        richColors

        closeButton

        theme="dark"

        duration={3000}

        expand={false}

        visibleToasts={3}

        toastOptions={{

          style: {

            background:
              '#18181b',

            color:
              '#ffffff',

            border:
              '1px solid #27272a',

            borderRadius:
              '18px',

            padding:
              '14px 18px',

            fontSize:
              '14px',

            boxShadow:
              '0 10px 30px rgba(0,0,0,0.35)',

          },

        }}

      />

      <AppRoutes />

    </>

  );

}
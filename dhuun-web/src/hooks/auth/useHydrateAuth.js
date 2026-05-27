import {
  useEffect,
} from 'react';

import getMe
  from '../../api/auth/getMe';

import authStore
  from '../../store/auth/authStore';

import usePlayerStore
  from '../../store/playerStore';

const useHydrateAuth =
  () => {

    const {
      token,
      setUser,
      logout,
      setHydrating,
    } = authStore();

    const {
      hydrateSavedTracks,
    } = usePlayerStore();

    useEffect(() => {

      const hydrate =
        async () => {

          /* -------------------------------- */
          /* No Token */
          /* -------------------------------- */

          if (!token) {

            setHydrating(false);

            return;

          }

          try {

            const response =
              await getMe();

            setUser(
              response.user
            );

            localStorage.removeItem(
              'guest-saved-tracks'
            );

            await hydrateSavedTracks();

          } catch (error) {

            console.error(error);

            logout();

          } finally {

            setHydrating(false);

          }

        };

    hydrate();

    }, [
      token,
      setUser,
      logout,
      setHydrating,
      hydrateSavedTracks,
    ]);

  };

export default
  useHydrateAuth;
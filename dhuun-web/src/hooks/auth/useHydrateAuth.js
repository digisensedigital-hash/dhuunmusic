import {
  useEffect,
} from 'react';

import getMe
  from '../../api/auth/getMe';

import authStore
  from '../../store/auth/authStore';

const useHydrateAuth =
  () => {

    const {
      token,
      setUser,
      logout,
      setHydrating,
    } = authStore();

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
    ]);

  };

export default
  useHydrateAuth;
import {
  useEffect,
} from 'react';

import authStore
  from '../../store/auth/authStore';

import capabilityStore
  from '../../store/capabilityStore';

import getCapabilities
  from '../../services/capabilities/getCapabilities';

const useHydrateCapabilities =
  () => {

    const {
      token,
    } = authStore();

    const {
      setCapabilities,
      setLoading,
      reset,
    } = capabilityStore();

    useEffect(() => {

      const hydrate =
        async () => {

          if (!token) {

            reset();

            return;

          }

          try {

            setLoading(true);

            const response =
              await getCapabilities();

            setCapabilities(
              response.capabilities
            );

          } catch (error) {

            console.error(error);

            reset();

          } finally {

            setLoading(false);

          }

        };

      hydrate();

    }, [
      token,
      setCapabilities,
      setLoading,
      reset,
    ]);

  };

export default
  useHydrateCapabilities;
import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  getHomeFeed,
} from '../api/home';

export default function
useHomeFeed() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // -----------------------------------
  // Load Feed
  // -----------------------------------

  const loadFeed =
    useCallback(
      async (
        silent = false
      ) => {
        try {
          if (!silent) {
            setLoading(
              true
            );
          }

          const response =
            await getHomeFeed();

          setData(
            response
          );

          setError(null);
        } catch (err) {
          setError(err);
        } finally {

          if (!silent) {
            setLoading(
              false
            );
          }
        }
      },
      []
    );

  // -----------------------------------
  // Initial Load
  // -----------------------------------

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return {
    data,
    loading,
    error,
    refreshFeed:
      loadFeed,
  };
}
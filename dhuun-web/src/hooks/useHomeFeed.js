import { useEffect, useState }
  from 'react';

import {
  getHomeFeed
} from '../api/home';

export default function
useHomeFeed() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getHomeFeed();

        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    data,
    loading,
    error,
  };
}
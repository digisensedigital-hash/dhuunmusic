import client
  from './client';

export const getArtists =
  async () => {

    const response =
      await client.get(
        '/artists'
      );

    return response.data;
  };
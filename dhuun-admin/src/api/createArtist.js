import client
  from './client';

export const createArtist =
  async (payload) => {

    const response =
      await client.post(
        '/artists',
        payload
      );

    return response.data;
  };
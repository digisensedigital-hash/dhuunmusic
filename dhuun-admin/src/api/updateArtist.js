import client
  from './client';

export const updateArtist =
  async (
    artistId,
    payload
  ) => {

    const response =
      await client.put(
        `/artists/${artistId}`,
        payload
      );

    return response.data;
  };
import client
  from './client';

export const deleteArtist =
  async (
    artistId
  ) => {

    const response =
      await client.delete(
        `/artists/${artistId}`
      );

    return response.data;
  };
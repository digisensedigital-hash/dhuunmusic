import client
  from './client';

export const uploadTrack =
  async (formData) => {

    const response =
      await client.post(
        '/tracks',
        formData
      );

    return response.data;
  };
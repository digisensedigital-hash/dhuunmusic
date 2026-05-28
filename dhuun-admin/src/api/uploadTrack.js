import client
  from './client';

export const uploadTrack =
  async (
    formData,
    config = {}
  ) => {

    const response =
      await client.post(
        '/tracks',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },

          ...config,
        }
      );

    return response.data;
  };
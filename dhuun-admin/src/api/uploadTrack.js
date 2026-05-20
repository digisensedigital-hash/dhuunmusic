import client
  from './client';

export const uploadTrack =
  async (formData) => {
    const response =
      await client.post(
        '/tracks',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return response.data;
  };
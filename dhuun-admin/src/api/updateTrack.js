import client
  from './client';

/* ----------------------------------- */
/* Update Track */
/* ----------------------------------- */

export const updateTrack =
  async (
    trackId,
    formData
  ) => {
    const response =
      await client.put(
        `/tracks/${trackId}`,
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
import client
  from './client';

/* ----------------------------------- */
/* Get All Tracks */
/* ----------------------------------- */

export const getTracks =
  async () => {
    const response =
      await client.get(
        '/tracks'
      );

    return response.data;
  };

/* ----------------------------------- */
/* Get Single Track */
/* ----------------------------------- */

export const getTrackById =
  async (trackId) => {
    const response =
      await client.get(
        `/tracks/${trackId}`
      );

    return response.data;
  };

/* ----------------------------------- */
/* Create Track */
/* ----------------------------------- */

export const createTrack =
  async (payload) => {
    const response =
      await client.post(
        '/tracks',
        payload
      );

    return response.data;
  };

/* ----------------------------------- */
/* Update Track */
/* ----------------------------------- */

export const updateTrack =
  async (
    trackId,
    payload
  ) => {
    const response =
      await client.put(
        `/tracks/${trackId}`,
        payload
      );

    return response.data;
  };

/* ----------------------------------- */
/* Delete Track */
/* ----------------------------------- */

export const deleteTrack =
  async (trackId) => {
    const response =
      await client.delete(
        `/tracks/${trackId}`
      );

    return response.data;
  };
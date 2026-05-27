import api from './client';

/* ----------------------------------- */
/* Get Saved Tracks */
/* ----------------------------------- */

export const getSavedTracks =
  async () => {

    const response =
      await api.get(
        '/library/tracks'
      );

    return response.data;
  };

/* ----------------------------------- */
/* Save Track */
/* ----------------------------------- */

export const saveTrack =
  async (trackId) => {

    const response =
      await api.post(
        '/library/save',
        {
          trackId,
        }
      );

    return response.data;
  };

/* ----------------------------------- */
/* Remove Saved Track */
/* ----------------------------------- */

export const removeSavedTrack =
  async (trackId) => {

    const response =
      await api.delete(
        `/library/save/${trackId}`
      );

    return response.data;
  };
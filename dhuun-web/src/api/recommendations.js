import client from './client';

// -----------------------------------
// Get Track Recommendations
// -----------------------------------

export async function
getRecommendedTracks(
  trackId
) {
  try {
    const response =
      await client.get(
        `/recommendations/${trackId}`
      );

    return (
      response.data
        ?.tracks || []
    );
  } catch (error) {
    console.error(
      'RECOMMENDATION_FETCH_ERROR',
      error
    );

    return [];
  }
}
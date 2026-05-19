import getRecommendations
  from '../../services/recommendation/getRecommendations.js';

export default async function
getTrackRecommendations(
  req,
  res
) {
  try {
    const {
      trackId,
    } = req.params;

    const recommendations =
      await getRecommendations({
        userId:
          req.user?._id ||
          null,

        seedTrackId:
          trackId,
      });

    return res.json({
      success: true,

      tracks:
        recommendations,
    });
  } catch (error) {
    console.error(
      'TRACK_RECOMMENDATIONS_ERROR',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to load recommendations',
    });
  }
}
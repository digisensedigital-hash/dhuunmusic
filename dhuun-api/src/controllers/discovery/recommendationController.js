import getRecommendations
  from '../../services/recommendation/getRecommendations.js';

import serializeRecommendation
  from '../../serializers/serializeRecommendation.js';

export const getRecommendedTracks =
  async (req, res) => {
    try {
      const recommendations =
        await getRecommendations(
          req.user.id
        );

      res.json({
        success: true,

        recommendations:
          recommendations.map(
            serializeRecommendation
          )
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch recommendations'
      });
    }
  };
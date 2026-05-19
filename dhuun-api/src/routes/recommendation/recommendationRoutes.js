import express
  from 'express';

import getTrackRecommendations
  from '../../controllers/recommendation/getTrackRecommendations.js';

const router =
  express.Router();

router.get(
  '/:trackId',
  getTrackRecommendations
);

export default router;
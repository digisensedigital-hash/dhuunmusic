import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  getTrendingTracks
} from '../../controllers/discovery/trendingController.js';

import {
  getRecommendedTracks
} from '../../controllers/discovery/recommendationController.js';

const router = express.Router();

router.get(
  '/trending',
  getTrendingTracks
);

router.get(
  '/recommended',
  authMiddleware,
  getRecommendedTracks
);

export default router;
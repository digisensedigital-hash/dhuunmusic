import express from 'express';

import {
  getTrackAnalytics
} from '../../controllers/analytics/trackAnalyticsController.js';

const router = express.Router();

router.get(
  '/tracks/:trackId',
  getTrackAnalytics
);

export default router;
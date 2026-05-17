import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  startListenSession,
  heartbeatListenSession,
  completeListenSession
} from '../../controllers/listen/listenController.js';

const router = express.Router();

router.post(
  '/start',
  authMiddleware,
  startListenSession
);

router.post(
  '/heartbeat',
  heartbeatListenSession
);

router.post(
  '/complete',
  completeListenSession
);

export default router;
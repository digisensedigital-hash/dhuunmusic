import express from 'express';

import {
  startListenSession,
  heartbeatListenSession,
  completeListenSession
} from '../../controllers/listen/listenController.js';

const router = express.Router();

router.post(
  '/start',
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
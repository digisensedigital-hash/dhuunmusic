import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  getPlaybackQueue
} from '../../controllers/player/playerController.js';

const router = express.Router();

router.get(
  '/queue/:trackId',
  authMiddleware,
  getPlaybackQueue
);

export default router;
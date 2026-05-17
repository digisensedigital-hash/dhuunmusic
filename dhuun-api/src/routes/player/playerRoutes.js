import express from 'express';

import {
  getPlaybackQueue
} from '../../controllers/player/playerController.js';

const router = express.Router();

router.get(
  '/queue/:trackId',
  getPlaybackQueue
);

export default router;
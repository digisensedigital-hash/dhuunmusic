import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  saveTrack,
  removeSavedTrack,
  getSavedTracks,
  getRecentlyPlayed
} from '../../controllers/library/libraryController.js';

const router = express.Router();

router.post(
  '/save',
  authMiddleware,
  saveTrack
);

router.delete(
  '/save/:trackId',
  authMiddleware,
  removeSavedTrack
);

router.get(
  '/tracks',
  authMiddleware,
  getSavedTracks
);

router.get(
  '/recently-played',
  authMiddleware,
  getRecentlyPlayed
);

export default router;
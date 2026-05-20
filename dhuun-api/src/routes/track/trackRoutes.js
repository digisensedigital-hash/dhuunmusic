import express from 'express';

import authMiddleware from '../../middleware/authMiddleware.js';

import upload from '../../middleware/uploadMiddleware.js';

import {
  createTrack,
  updateTrack,
  getAllTracks,
  deleteTrack,
} from '../../controllers/track/trackController.js';

import {
  getTrackStream
} from '../../controllers/track/streamController.js';

import {
  getPublicTrackDetails
} from '../../controllers/track/publicTrackController.js';

import getRelatedTracksController from '../../controllers/track/getRelatedTracksController.js';

const router = express.Router();

router.get(
  '/',
  getAllTracks
);

router.post(
  '/',
  authMiddleware,

  upload.fields([
    {
      name: 'audio',
      maxCount: 1
    },
    {
      name: 'coverImage',
      maxCount: 1
    }
  ]),

  createTrack
);

router.put(
  '/:id',
  authMiddleware,

  upload.fields([
    {
      name: 'audio',
      maxCount: 1
    },
    {
      name: 'coverImage',
      maxCount: 1
    }
  ]),

  updateTrack
);

router.delete(
  '/:id',
  authMiddleware,
  deleteTrack
);

// Related Tracks Discovery
router.get(
  '/:id/related',
  getRelatedTracksController
);

// HLS Stream Endpoint
router.get(
  '/:id/stream',
  getTrackStream
);

// Public Track Details
router.get(
  '/:id',
  getPublicTrackDetails
);

export default router;
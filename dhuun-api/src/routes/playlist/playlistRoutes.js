import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  createPlaylist,
  addTrackToPlaylist
} from '../../controllers/playlist/playlistController.js';

import {
  getPublicPlaylist
} from '../../controllers/playlist/publicPlaylistController.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  createPlaylist
);

router.post(
  '/:id/tracks',
  authMiddleware,
  addTrackToPlaylist
);

router.get(
  '/:id',
  getPublicPlaylist
);

export default router;
import express from 'express';

import authMiddleware from '../../middleware/authMiddleware.js';

import {
  createArtist
} from '../../controllers/artist/artistController.js';

import {
  getPublicArtistProfile
} from '../../controllers/artist/publicArtistController.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  createArtist
);

router.get(
  '/:id',
  getPublicArtistProfile
);

export default router;
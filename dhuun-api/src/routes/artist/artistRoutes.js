import express from 'express';

import authMiddleware from '../../middleware/authMiddleware.js';

import upload
  from '../../middleware/uploadMiddleware.js';

import {
  createArtist,
  getArtists,
  updateArtist,
  deleteArtist,
} from '../../controllers/artist/artistController.js';

import {
  getPublicArtistProfile
} from '../../controllers/artist/publicArtistController.js';

const router =
  express.Router();

/* -------------------------------------------------------------------------- */
/* Artist CMS */
/* -------------------------------------------------------------------------- */

router.get(
  '/',
  authMiddleware,
  getArtists
);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  createArtist
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  updateArtist
);

router.delete(
  '/:id',
  authMiddleware,
  deleteArtist
);

/* -------------------------------------------------------------------------- */
/* Public Artist */
/* -------------------------------------------------------------------------- */

router.get(
  '/:id',
  getPublicArtistProfile
);

export default router;
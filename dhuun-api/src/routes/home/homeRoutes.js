import express from 'express';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import {
  getHomeFeed
} from '../../controllers/home/homeController.js';

const router = express.Router();

router.get(
  '/',
  getHomeFeed
);

export default router;
import express from 'express';

import {
  registerUser,
  loginUser
} from '../../controllers/auth/authController.js';

import authMiddleware
  from '../../middleware/authMiddleware.js';

import getCapabilitiesController
  from '../../controllers/auth/getCapabilitiesController.js';

import getMeController
  from '../../controllers/auth/getMeController.js';


const router = express.Router();

router.post(
  '/login',
  loginUser
);

router.post(
   '/register',
   registerUser
);

router.get(
  '/capabilities',
  authMiddleware,
  getCapabilitiesController
);

router.get(
  '/me',
  authMiddleware,
  getMeController
);

export default router;
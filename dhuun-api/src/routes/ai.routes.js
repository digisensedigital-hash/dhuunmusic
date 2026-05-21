import express
  from 'express';

import {
  convertLyricsScript,
} from '../controllers/ai/scriptConvertController.js';

const router =
  express.Router();

router.post(
  '/script-convert',
  convertLyricsScript
);

export default router;
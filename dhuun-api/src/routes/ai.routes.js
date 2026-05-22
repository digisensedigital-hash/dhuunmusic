import express
  from 'express';

import {
  convertLyricsScript,
} from '../controllers/ai/scriptConvertController.js';

import {
  translateLyricsMeaningController,
} from '../controllers/ai/meaningTranslationController.js';

const router =
  express.Router();

/* ----------------------------------- */
/* Script Conversion */
/* ----------------------------------- */

router.post(
  '/script-convert',

  convertLyricsScript
);

/* ----------------------------------- */
/* Meaning Translation */
/* ----------------------------------- */

router.post(
  '/meaning-translate',

  translateLyricsMeaningController
);

export default router;
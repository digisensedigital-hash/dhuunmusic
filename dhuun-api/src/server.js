import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import path from 'path';

import connectDB from './config/db.js';

/* -------------------------------------------------------------------------- */
/* Routes */
/* -------------------------------------------------------------------------- */

import authRoutes from './routes/auth/authRoutes.js';
import artistRoutes from './routes/artist/artistRoutes.js';
import trackRoutes from './routes/track/trackRoutes.js';
import listenRoutes from './routes/listen/listenRoutes.js';
import analyticsRoutes from './routes/analytics/analyticsRoutes.js';
import discoveryRoutes from './routes/discovery/discoveryRoutes.js';
import playlistRoutes from './routes/playlist/playlistRoutes.js';
import libraryRoutes from './routes/library/libraryRoutes.js';
import homeRoutes from './routes/home/homeRoutes.js';
import playerRoutes from './routes/player/playerRoutes.js';
import aiRoutes from './routes/ai.routes.js';
import recommendationRoutes from './routes/recommendation/recommendationRoutes.js';

/* -------------------------------------------------------------------------- */
/* Jobs */
/* -------------------------------------------------------------------------- */

import startPublishingScheduler from './jobs/publishingScheduler.js';

/* -------------------------------------------------------------------------- */
/* Environment */
/* -------------------------------------------------------------------------- */

dotenv.config({
  path: new URL(
    '../.env',
    import.meta.url
  ).pathname,
});

const app = express();

/* -------------------------------------------------------------------------- */
/* Database */
/* -------------------------------------------------------------------------- */

connectDB();

/* -------------------------------------------------------------------------- */
/* Middleware */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
    origin: true,

    credentials: true,

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

app.use(express.json());

/* -------------------------------------------------------------------------- */
/* Upload Serving */
/* -------------------------------------------------------------------------- */

app.use(
  '/uploads',

  express.static(
    process.env.NODE_ENV ===
      'production'

      ? '/var/www/dhuunmusic/storage/temp'

      : path.resolve(
          '../storage/temp'
        )
  )
);

app.use(helmet());

app.use(morgan('dev'));

/* -------------------------------------------------------------------------- */
/* Health */
/* -------------------------------------------------------------------------- */

app.get('/', (req, res) => {

  return res.json({
    success: true,

    message:
      'Dhuun API Running',
  });
});

/* -------------------------------------------------------------------------- */
/* API Routes */
/* -------------------------------------------------------------------------- */

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/artists',
  artistRoutes
);

app.use(
  '/api/tracks',
  trackRoutes
);

app.use(
  '/api/listens',
  listenRoutes
);

app.use(
  '/api/analytics',
  analyticsRoutes
);

app.use(
  '/api/discovery',
  discoveryRoutes
);

app.use(
  '/api/playlists',
  playlistRoutes
);

app.use(
  '/api/library',
  libraryRoutes
);

app.use(
  '/api/home',
  homeRoutes
);

app.use(
  '/api/player',
  playerRoutes
);

app.use(
  '/api/recommendations',
  recommendationRoutes
);

app.use(
  '/api/ai',
  aiRoutes
);

/* -------------------------------------------------------------------------- */
/* Start Server */
/* -------------------------------------------------------------------------- */

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

  /* ---------------------------------------------------------------------- */
  /* Background Jobs */
  /* ---------------------------------------------------------------------- */

  startPublishingScheduler();
});
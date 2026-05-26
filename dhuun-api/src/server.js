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

import authRoutes
  from './routes/auth/authRoutes.js';

import artistRoutes
  from './routes/artist/artistRoutes.js';

import trackRoutes
  from './routes/track/trackRoutes.js';

import listenRoutes
  from './routes/listen/listenRoutes.js';

import analyticsRoutes
  from './routes/analytics/analyticsRoutes.js';

import discoveryRoutes
  from './routes/discovery/discoveryRoutes.js';

import playlistRoutes
  from './routes/playlist/playlistRoutes.js';

import libraryRoutes
  from './routes/library/libraryRoutes.js';

import homeRoutes
  from './routes/home/homeRoutes.js';

import playerRoutes
  from './routes/player/playerRoutes.js';

import aiRoutes
  from './routes/ai.routes.js';

import recommendationRoutes
  from './routes/recommendation/recommendationRoutes.js';

/* -------------------------------------------------------------------------- */
/* Jobs */
/* -------------------------------------------------------------------------- */

import startPublishingScheduler
  from './jobs/publishingScheduler.js';

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
    origin: [
      'http://127.0.0.1:5199',
      'http://localhost:5199',

      'http://127.0.0.1:5180',
      'http://localhost:5180',

      'http://127.0.0.1:5197',
      'http://localhost:5197',
    ],

    credentials: true,

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

app.use(express.json());

app.use(

  helmet({

    crossOriginResourcePolicy: false,

  })

);

app.use(morgan('dev'));

/* -------------------------------------------------------------------------- */
/* Request Debug */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {

  console.log(
    '[REQUEST]',
    req.method,
    req.originalUrl,
    req.headers['content-type']
  );

  next();

});

/* -------------------------------------------------------------------------- */
/* Upload Serving */
/* -------------------------------------------------------------------------- */

app.use(
  '/uploads',

  express.static(
    process.env.NODE_ENV ===
      'production'

      ? '/var/www/dhuunmusic/storage/temp'

      : path.join(
          process.cwd(),
          'storage/temp'
        )
  )
);

app.use(
  '/dhuun-media',

  express.static(
    process.env.NODE_ENV ===
      'production'

      ? '/var/www/dhuunmusic/storage/media'

      : path.resolve(
          '../storage/media'
        )
  )
);

app.use(
  '/tracks',

  express.static(
    path.join(
      process.cwd(),
      'uploads/tracks'
    )
  )
);

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
/* Global Error Handler */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {

  console.error(
    '[GLOBAL ERROR]',
    err
  );

  return res.status(500).json({
    success: false,
    error: err.message,
  });

});

/* -------------------------------------------------------------------------- */
/* Start Server */
/* -------------------------------------------------------------------------- */

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

  startPublishingScheduler();

});
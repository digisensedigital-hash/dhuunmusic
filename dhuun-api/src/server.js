import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';

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
import recommendationRoutes from './routes/recommendation/recommendationRoutes.js';

dotenv.config({
  path: new URL(
    '../.env',
    import.meta.url
  ).pathname,
});

const app = express();

connectDB();

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

app.use(helmet());

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dhuun API Running'
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/artists', artistRoutes);

app.use('/api/tracks', trackRoutes);

app.use('/api/listens', listenRoutes);

app.use('/api/analytics', analyticsRoutes);

app.use('/api/discovery', discoveryRoutes);

app.use('/api/playlists', playlistRoutes);

app.use('/api/library', libraryRoutes);

app.use('/api/home', homeRoutes);

app.use('/api/player', playerRoutes);

app.use( '/api/recommendations', recommendationRoutes );

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
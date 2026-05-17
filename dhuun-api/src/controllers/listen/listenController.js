import { v4 as uuidv4 } from 'uuid';

import Track from '../../models/Track.js';

import TrackListen from '../../models/TrackListen.js';

import TrackAnalytics from '../../models/TrackAnalytics.js';

import ArtistAnalytics from '../../models/ArtistAnalytics.js';

import updateTrendingTracks from '../../services/analytics/updateTrendingTracks.js';

import RecentlyPlayed from '../../models/RecentlyPlayed.js';

export const startListenSession =
  async (req, res) => {
    try {
      const { trackId } = req.body;

      const track =
        await Track.findById(trackId);

      if (!track) {
        return res.status(404).json({
          success: false,
          message: 'Track not found'
        });
      }

      const sessionId = uuidv4();

      const listenSession =
        await TrackListen.create({
          trackId: track._id,

          userId:
            req.user?.id || null,

          sessionId,

          ipAddress: req.ip,

          userAgent:
            req.headers['user-agent'],

          source: 'WEB'
        });

      console.log(
        'LISTEN_SESSION_STARTED',
        {
          sessionId,
          trackId: track._id.toString(),
          userId:
            req.user?.id || null,
          ip: req.ip
        }
      );

      res.json({
        success: true,

        sessionId,

        trackId: track._id,

        startedAt:
          listenSession.startedAt
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to start listen session'
      });
    }
  };

export const heartbeatListenSession =
  async (req, res) => {
    try {
      const { sessionId } = req.body;

      const listenSession =
        await TrackListen.findOne({
          sessionId
        });

      if (!listenSession) {
        return res.status(404).json({
          success: false,
          message:
            'Listen session not found'
        });
      }

      const now = new Date();

      const secondsSinceLastHeartbeat =
        Math.floor(
          (
            now -
            listenSession.lastHeartbeatAt
          ) / 1000
        );

      const safeIncrement =
        Math.min(
          secondsSinceLastHeartbeat,
          20
        );

      listenSession.totalListenedSeconds +=
        safeIncrement;

      listenSession.lastHeartbeatAt =
        now;

      await listenSession.save();

      console.log(
        'LISTEN_HEARTBEAT',
        {
          sessionId,
          listenedSeconds:
            listenSession.totalListenedSeconds
        }
      );

      res.json({
        success: true,

        sessionId,

        totalListenedSeconds:
          listenSession.totalListenedSeconds
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to process heartbeat'
      });
    }
  };

export const completeListenSession =
  async (req, res) => {
    try {
      const { sessionId } = req.body;

      const listenSession =
        await TrackListen.findOne({
          sessionId
        });

      if (!listenSession) {
        return res.status(404).json({
          success: false,
          message:
            'Listen session not found'
        });
      }

      listenSession.completed = true;

        listenSession.completedAt =
        new Date();

        const qualifies =
        listenSession.totalListenedSeconds >= 30;

        if (qualifies) {
        listenSession.qualified = true;

        listenSession.qualifiedAt =
            new Date();
        }

        await listenSession.save();

        let analytics =
        await TrackAnalytics.findOne({
            trackId:
            listenSession.trackId
        });

        if (!analytics) {
        analytics =
            await TrackAnalytics.create({
            trackId:
                listenSession.trackId
            });
        }

        analytics.totalStreams += 1;

        if (listenSession.qualified) {
        analytics.qualifiedStreams += 1;
        }

        analytics.totalListeningTime +=
        listenSession.totalListenedSeconds;

        analytics.lastStreamedAt =
        new Date();

        analytics.completionRate =
        analytics.qualifiedStreams /
        analytics.totalStreams;

        await analytics.save();

        const track =
        await Track.findById(
            listenSession.trackId
        );

        if (track?.primaryArtist) {
        let artistAnalytics =
            await ArtistAnalytics.findOne({
            artistId:
                track.primaryArtist
            });

        if (!artistAnalytics) {
            const totalTracks =
            await Track.countDocuments({
                primaryArtist:
                track.primaryArtist
            });

            artistAnalytics =
            await ArtistAnalytics.create({
                artistId:
                track.primaryArtist,

                totalTracks
            });
        }

        artistAnalytics.totalStreams += 1;

        if (listenSession.qualified) {
            artistAnalytics.qualifiedStreams += 1;
        }

        artistAnalytics.totalListeningTime +=
            listenSession.totalListenedSeconds;

        artistAnalytics.averageCompletionRate =
            artistAnalytics.qualifiedStreams /
            artistAnalytics.totalStreams;

        artistAnalytics.lastStreamedAt =
            new Date();

        await artistAnalytics.save();
        }

        await updateTrendingTracks();

        if (listenSession.userId) {
        await RecentlyPlayed.create({
            userId:
            listenSession.userId,

            trackId:
            listenSession.trackId,

            listenSessionId:
            listenSession.sessionId,

            duration:
            listenSession.totalListenedSeconds
        });
        }

      console.log(
        'LISTEN_COMPLETED',
        {
          sessionId,
          trackId:
            listenSession.trackId.toString(),
          totalListenedSeconds:
            listenSession.totalListenedSeconds
        }
      );

      res.json({
        success: true,

        sessionId,

        completed: true,

        qualified:
            listenSession.qualified,

        totalListenedSeconds:
            listenSession.totalListenedSeconds
        });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to complete listen session'
      });
    }
  };
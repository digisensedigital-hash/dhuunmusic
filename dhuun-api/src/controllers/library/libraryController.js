import SavedTrack from '../../models/SavedTrack.js';

import Track from '../../models/Track.js';

import RecentlyPlayed from '../../models/RecentlyPlayed.js';

import serializeRecentlyPlayed from '../../serializers/serializeRecentlyPlayed.js';

import serializeSavedTrack from '../../serializers/serializeSavedTrack.js';

export const saveTrack =
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

      const existingSave =
        await SavedTrack.findOne({
          userId: req.user.id,
          trackId
        });

      if (existingSave) {
        return res.status(400).json({
          success: false,
          message:
            'Track already saved'
        });
      }

      const savedTrack =
        await SavedTrack.create({
          userId: req.user.id,
          trackId
        });

      res.status(201).json({
        success: true,

        savedTrack
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to save track'
      });
    }
  };

export const removeSavedTrack =
  async (req, res) => {
    try {
      const { trackId } = req.params;

      await SavedTrack.findOneAndDelete({
        userId: req.user.id,
        trackId
      });

      res.json({
        success: true,
        removed: true
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to remove saved track'
      });
    }
  };

export const getSavedTracks =
  async (req, res) => {
    try {
      const savedTracks =
        await SavedTrack.find({
          userId: req.user.id
        })
          .sort({
            savedAt: -1
          })
          .populate({
            path: 'trackId',
            populate: {
              path: 'primaryArtist',
              select:
                'stageName profileImage'
            }
          });

      res.json({
        success: true,

        tracks:
        savedTracks.map(
            serializeSavedTrack
        )
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch saved tracks'
      });
    }
  };

export const getRecentlyPlayed =
  async (req, res) => {
    try {
      const tracks =
        await RecentlyPlayed.find({
          userId: req.user.id
        })
          .sort({
            playedAt: -1
          })
          .limit(25)
          .populate({
            path: 'trackId',
            populate: {
              path: 'primaryArtist',
              select:
                'stageName profileImage'
            }
          });

      res.json({
        success: true,

        tracks:
        tracks.map(
            serializeRecentlyPlayed
        )
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch recently played'
      });
    }
  };  
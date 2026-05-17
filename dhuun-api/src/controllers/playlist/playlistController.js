import Playlist from '../../models/Playlist.js';

import Track from '../../models/Track.js';

export const createPlaylist =
  async (req, res) => {
    try {
      const {
        title,
        description,
        visibility
      } = req.body;

      const playlist =
        await Playlist.create({
          title,

          description,

          visibility:
            visibility || 'PUBLIC',

          ownerId:
            req.user.id
        });

      res.status(201).json({
        success: true,

        playlist
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to create playlist'
      });
    }
  };

export const addTrackToPlaylist =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { trackId } = req.body;

      const playlist =
        await Playlist.findById(id);

      if (!playlist) {
        return res.status(404).json({
          success: false,
          message:
            'Playlist not found'
        });
      }

      if (
        playlist.ownerId.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const track =
        await Track.findById(trackId);

      if (!track) {
        return res.status(404).json({
          success: false,
          message:
            'Track not found'
        });
      }

      const alreadyExists =
        playlist.tracks.some(
          (item) =>
            item.trackId.toString() ===
            trackId
        );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message:
            'Track already in playlist'
        });
      }

      playlist.tracks.push({
        trackId
      });

      playlist.totalTracks =
        playlist.tracks.length;

      playlist.totalDuration +=
        track.duration || 0;

      await playlist.save();

      res.json({
        success: true,

        playlist
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to add track'
      });
    }
  };
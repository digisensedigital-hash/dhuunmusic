import Playlist from '../../models/Playlist.js';

import serializePlaylist
  from '../../serializers/serializePlaylist.js';

export const getPublicPlaylist =
  async (req, res) => {

    try {

      const { id } = req.params;

      const playlist =
        await Playlist.findById(id)
          .populate(
            'ownerId',
            'name email'
          )
          .populate({
            path: 'tracks.trackId',

            match: {

              publishingStatus:
                'PUBLISHED',

              processingStatus:
                'READY',

              isActive: true,
            },

            populate: {
              path: 'primaryArtists',

              select:
                'stageName profileImage'
            }
          });

      if (!playlist) {

        return res.status(404).json({
          success: false,

          message:
            'Playlist not found'
        });
      }

      // -----------------------------------
      // Remove Null Hydrated Tracks
      // -----------------------------------

      playlist.tracks =
        playlist.tracks.filter(
          (item) => item.trackId
        );

      res.json({
        success: true,

        playlist:
          serializePlaylist(
            playlist
          )
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch playlist'
      });
    }
  };
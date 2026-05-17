import generateQueue
  from '../../services/player/generateQueue.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

export const getPlaybackQueue =
  async (req, res) => {
    try {
      const { trackId } =
        req.params;

      const queue =
        await generateQueue({
          trackId,

          userId:
            req.user.id
        });

      if (!queue) {
        return res.status(404).json({
          success: false,
          message:
            'Track not found'
        });
      }

      res.json({
        success: true,

        currentTrack:
          serializeTrack(
            queue.currentTrack
          ),

        nextTracks:
          queue.nextTracks.map(
            serializeTrack
          )
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to generate queue'
      });
    }
  };
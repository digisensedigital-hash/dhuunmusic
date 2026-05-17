import Track from '../../models/Track.js';

import getPublicFileUrl from '../../services/storage/getPublicFileUrl.js';

export const getTrackStream = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const track = await Track.findById(id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    if (!track.hlsMasterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Track stream unavailable'
      });
    }

    const streamUrl = getPublicFileUrl(
      track.hlsMasterUrl
    );

    console.log(
      'STREAM_REQUEST',
      {
        trackId: track._id.toString(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      }
    );

    res.json({
      success: true,
      trackId: track._id,
      streamUrl
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate stream'
    });
  }
};
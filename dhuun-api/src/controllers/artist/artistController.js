import Artist from '../../models/Artist.js';

export const createArtist = async (req, res) => {
  try {
    const {
      stageName,
      bio
    } = req.body;

    const existingArtist = await Artist.findOne({
      userId: req.user.id
    });

    if (existingArtist) {
      return res.status(400).json({
        success: false,
        message: 'Artist profile already exists'
      });
    }

    const artist = await Artist.create({
      userId: req.user.id,
      stageName,
      bio
    });

    res.status(201).json({
      success: true,
      artist
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to create artist'
    });
  }
};
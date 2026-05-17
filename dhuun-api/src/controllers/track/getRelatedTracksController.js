import getRelatedTracks from "../../services/discovery/getRelatedTracks.js";

export default async function getRelatedTracksController(req, res) {
  try {
    const { id } = req.params;

    const data = await getRelatedTracks(id);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Get Related Tracks Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch related tracks",
    });
  }
}
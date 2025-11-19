import VideoAdvertise from "../models/VideoAdvertise.js";

// CREATE
export const createVideoAd = async (req, res) => {
  try {
    const { videoAdvertiseUrl, imageUrl, title, price } = req.body;

    const newAd = await VideoAdvertise.create({
      videoAdvertiseUrl,
      imageUrl,
      title,
      price,
    });

    res.status(201).json({ message: "Video Advertise Added", newAd });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
export const getAllVideoAds = async (req, res) => {
  try {
    const ads = await VideoAdvertise.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE
export const getSingleVideoAd = async (req, res) => {
  try {
    const ad = await VideoAdvertise.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Not found" });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateVideoAd = async (req, res) => {
  try {
    const updatedAd = await VideoAdvertise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAd) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Video Ad Updated", updatedAd });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteVideoAd = async (req, res) => {
  try {
    const deleted = await VideoAdvertise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Video Ad Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
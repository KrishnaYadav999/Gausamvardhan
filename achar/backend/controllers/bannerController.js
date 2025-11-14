import Banner from "../models/bannerModel.js";

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single banner by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new banner
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, images, backgroundColors } = req.body;
    const newBanner = new Banner({ title, subtitle, buttonText, buttonLink, images, backgroundColors });
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a banner
export const updateBanner = async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: "Banner not found" });
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

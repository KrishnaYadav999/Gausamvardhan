import SmallBanner from "../models/SmallBanner.js";

// Create SmallBanner
export const createSmallBanner = async (req, res) => {
  try {
    const { title, btnText, img, links } = req.body;

    if (!title || !btnText || !img || !links) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const smallBanner = new SmallBanner({ title, btnText, img, links });
    await smallBanner.save();

    res.status(201).json(smallBanner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All SmallBanners
export const getSmallBanners = async (req, res) => {
  try {
    const banners = await SmallBanner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete SmallBanner
export const deleteSmallBanner = async (req, res) => {
  try {
    const banner = await SmallBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

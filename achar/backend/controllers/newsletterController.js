import Newsletter from "../models/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // already subscribed check
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newEmail = new Newsletter({ email });
    await newEmail.save();

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
import Counter from "../models/Counter.js";

// Get current counter value by id
export const getCounter = async (req, res) => {
  try {
    const counter = await Counter.findOne({ id: req.params.id });
    if (!counter) return res.status(404).json({ success: false, message: "Counter not found" });
    res.json({ success: true, counter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Increment counter by 1 and return new value
export const incrementCounter = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    res.json({ success: true, seq: counter.seq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import WorkerAdmin from "../models/WorkerAdmin.js";
import bcrypt from "bcryptjs";

// ✅ Create new worker (by main admin)
export const createWorker = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingWorker = await WorkerAdmin.findOne({ email });
    if (existingWorker)
      return res.status(400).json({ message: "Worker already exists" });

    const newWorker = await WorkerAdmin.create({ name, email, password });
    res.status(201).json({ message: "Worker created successfully", newWorker });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Worker login
export const workerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await WorkerAdmin.findOne({ email });

    if (!worker) return res.status(404).json({ message: "Worker not found" });
    if (worker.isBlocked)
      return res.status(403).json({ message: "Account is blocked" });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        isBlocked: worker.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all workers
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await WorkerAdmin.find().sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Block or Unblock worker
export const toggleBlockWorker = async (req, res) => {
  try {
    const worker = await WorkerAdmin.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    worker.isBlocked = !worker.isBlocked;
    await worker.save();

    res.status(200).json({
      message: worker.isBlocked ? "Worker blocked" : "Worker unblocked",
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

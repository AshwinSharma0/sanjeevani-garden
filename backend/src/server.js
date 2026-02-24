import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import Consultation from "./models/Consultation.js";
import HerbalPlant from "./models/HerbalPlant.js";


// ================== CONFIG ==================
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/sanjeevani_garden";

app.use(cors());
app.use(express.json());


// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("Sanjeevani Garden API running 🌿");
});


// ================== CONSULT FORM SAVE ==================
app.post("/api/consult", async (req, res) => {
  try {
    const data = req.body;

    const newConsult = new Consultation(data);
    await newConsult.save();

    res.json({ success: true, message: "Consult saved in DB" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});


// ================== PLANTS API ==================

// GET all plants
app.get("/api/plants", async (req, res) => {
  try {
    const plants = await HerbalPlant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: "Error fetching plants" });
  }
});

// ADD plant
app.post("/api/plants", async (req, res) => {
  try {
    const plant = new HerbalPlant(req.body);
    await plant.save();
    res.json({ message: "Plant added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE plant
app.delete("/api/plants/:id", async (req, res) => {
  try {
    await HerbalPlant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== START SERVER ==================
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
  }
}
import Feedback from "./models/Feedback.js";

app.post("/api/feedback", async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();

    res.json({ success: true, message: "Feedback saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving feedback" });
  }
});

start();

export default app;
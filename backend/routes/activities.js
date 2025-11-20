const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
// If you want auth later → const auth = require("../middleware/auth");

// ===============================
// GET ALL ACTIVITIES
// ===============================
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error("GET ERROR =>", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// CREATE NEW ACTIVITY
// ===============================
router.post("/", async (req, res) => {
  try {
    const { type, durationMin, intensity, calories, steps, distanceKm } =
      req.body;

    const newActivity = new Activity({
      type,
      durationMin,
      intensity,
      calories,
      steps,
      distanceKm,
    });

    await newActivity.save();

    res.json({ success: true, activity: newActivity });
  } catch (err) {
    console.error("POST ERROR =>", err);
    res.status(500).json({ error: "Failed to add activity" });
  }
});
// routes/activities.js
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});


module.exports = router;

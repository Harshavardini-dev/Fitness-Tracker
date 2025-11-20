// backend/routes/fitbitData.js
const express = require("express");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();

// GET /api/fitbit-data/sync?userId=xxxx
router.get("/sync", async (req, res) => {
    console.log("➡️ Fitbit sync route hit!", req.query);

  try {
    const { userId } = req.query;
    if (!userId) return res.json({ ok: false, error: "No userId" });

    const user = await User.findById(userId);
    if (!user || !user.fitbit || !user.fitbit.accessToken) {
      return res.json({ ok: false, error: "Fitbit not connected" });
    }

    const token = user.fitbit.accessToken;
    const fitbitUser = user.fitbit.userId;

    const headers = {
      Authorization: "Bearer " + token
    };

    // 1️⃣ Get Profile
    const profile = await axios
      .get(`https://api.fitbit.com/1/user/${fitbitUser}/profile.json`, { headers })
      .then(r => r.data)
      .catch(() => null);

    // 2️⃣ Get Activity Summary
    const activity = await axios
      .get(`https://api.fitbit.com/1/user/${fitbitUser}/activities/date/today.json`, { headers })
      .then(r => r.data)
      .catch(() => null);

    // 3️⃣ Get Heart Rate
    const heart = await axios
      .get(`https://api.fitbit.com/1/user/${fitbitUser}/activities/heart/date/today/1d.json`, { headers })
      .then(r => r.data)
      .catch(() => null);

    // 4️⃣ Get Sleep
    const sleep = await axios
      .get(`https://api.fitbit.com/1.2/user/${fitbitUser}/sleep/date/today.json`, { headers })
      .then(r => r.data)
      .catch(() => null);

    return res.json({
      ok: true,
      profile,
      activitiesSummary: activity,
      heart,
      sleep
    });
  } catch (err) {
    return res.json({ ok: false, error: "sync failed", details: err.message });
  }
});

module.exports = router;

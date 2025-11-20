const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');

// get or update user goals
router.get('/goals', auth, async (req, res) => {
  res.json(req.user.profile);
});

router.put('/goals', auth, async (req, res) => {
  try {
    const { stepGoal, calGoal, workoutsPerWeek, age, weightKg } = req.body;
    const user = await User.findById(req.user._id);
    user.profile = {
      ...user.profile,
      stepGoal: stepGoal ?? user.profile.stepGoal,
      calGoal: calGoal ?? user.profile.calGoal,
      workoutsPerWeek: workoutsPerWeek ?? user.profile.workoutsPerWeek,
      age: age ?? user.profile.age,
      weightKg: weightKg ?? user.profile.weightKg
    };
    await user.save();
    res.json(user.profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// dashboard: aggregated stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // recent activities
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(20);

    // compute weekly steps (Mon-Sun)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 Sun .. 6 Sat
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1); // Monday
    weekStart.setHours(0,0,0,0);

    // aggregate steps per day for last 7 days
    const start = new Date();
    start.setDate(now.getDate() - 6); // last 7 days
    start.setHours(0,0,0,0);

    const aggr = await Activity.aggregate([
      { $match: { user: userId, createdAt: { $gte: start } } },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          steps: { $ifNull: ["$steps", 0] },
          calories: { $ifNull: ["$calories", 0] },
          distanceKm: { $ifNull: ["$distanceKm", 0] }
        }
      },
      {
        $group: {
          _id: "$day",
          totalSteps: { $sum: "$steps" },
          totalCalories: { $sum: "$calories" },
          totalDistance: { $sum: "$distanceKm" }
        }
      }
    ]);

    // build array of 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const found = aggr.find(a => a._id === key);
      days.push({
        day: key,
        steps: found ? found.totalSteps : 0,
        calories: found ? found.totalCalories : 0,
        distance: found ? found.totalDistance : 0
      });
    }

    // totals (today)
    const todayStr = new Date().toISOString().slice(0,10);
    const todayAgg = aggr.find(a => a._id === todayStr) || { totalSteps:0, totalCalories:0, totalDistance:0 };

    res.json({
      user: { username: req.user.username, email: req.user.email },
      goals: req.user.profile,
      activities,
      weekly: days,
      steps: todayAgg.totalSteps,
      calories: todayAgg.totalCalories,
      distance: todayAgg.totalDistance,
      sleep: 7.5 // placeholder (you can add Sleep model later)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

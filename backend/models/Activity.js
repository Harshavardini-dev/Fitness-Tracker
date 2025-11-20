const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true }, // Running/Cycling/etc.
  durationMin: { type: Number, default: 0 },
  intensity: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  calories: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
  distanceKm: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);

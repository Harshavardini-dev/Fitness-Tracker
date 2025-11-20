const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // user profile
  profile: {
    age: Number,
    weightKg: Number,
    stepGoal: { type: Number, default: 10000 },
    calGoal: { type: Number, default: 2500 },
    workoutsPerWeek: { type: Number, default: 4 }
  },

  // FITBIT TOKENS (correct format)
  fitbit: {
    isConnected: { type: Boolean, default: false },
    userId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date }   // rename from tokenExpiresAt → expiresAt
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

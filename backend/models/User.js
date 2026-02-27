const mongoose = require('mongoose');

const CommitmentSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  startTime: { type: String, default: '09:00' },
  endTime:   { type: String, default: '17:00' },
  days:      [{ type: String }]
}, { _id: false });

const BadgeSchema = new mongoose.Schema({
  name:     String,
  icon:     String,
  earnedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, sparse: true },

  profile: {
    dailyHours:         { type: Number, default: 4, min: 1, max: 16 },
    preferredTime:      { type: String, enum: ['morning','afternoon','evening','night'], default: 'morning' },
    studyGoal:          { type: String, default: '' },
    fixedCommitments:   [CommitmentSchema]
  },

  gamification: {
    xp:            { type: Number, default: 0 },
    level:         { type: Number, default: 1 },
    streak:        { type: Number, default: 0 },
    lastStudyDate: { type: Date },
    badges:        [BadgeSchema]
  },

  analytics: {
    totalPlannedHours:   { type: Number, default: 0 },
    totalCompletedHours: { type: Number, default: 0 },
    consistencyScore:    { type: Number, default: 0 },
    peakFocusHour:       { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

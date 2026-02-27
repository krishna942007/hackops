const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date:             { type: Date, required: true },
  plannedHours:     { type: Number, default: 0 },
  completedHours:   { type: Number, default: 0 },
  focusScore:       { type: Number, default: 0 },
  subjectsStudied:  [{ name: String, minutes: Number }],
  burnoutLevel:     { type: String, enum: ['low','medium','high'], default: 'low' },
  sessionsCompleted:{ type: Number, default: 0 },
  sessionsMissed:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  subject:       { type: String, required: true },
  subjectId:     { type: mongoose.Schema.Types.ObjectId },
  subjectColor:  { type: String, default: '#a78bfa' },
  chapter:       { type: String, default: '' },
  chapterNumber: { type: Number, default: 1 },
  duration:      { type: Number, default: 60 },  // minutes
  type:          { type: String, enum: ['study','revision','practice','break'], default: 'study' },
  focusMode:     { type: String, enum: ['pomodoro','deep-focus','light-review'], default: 'pomodoro' },
  startTime:     { type: String, default: '09:00' },
  endTime:       { type: String, default: '10:00' },
  completed:     { type: Boolean, default: false },
  notes:         { type: String, default: '' }
}, { _id: true });

const DayPlanSchema = new mongoose.Schema({
  date:        { type: Date, required: true },
  dayOfWeek:   { type: String },
  totalHours:  { type: Number, default: 0 },
  burnoutRisk: { type: String, enum: ['low','medium','high'], default: 'low' },
  tasks:       [TaskSchema],
  isRestDay:   { type: Boolean, default: false }
}, { _id: false });

const AllocationSchema = new mongoose.Schema({
  subjectId:      mongoose.Schema.Types.ObjectId,
  subjectName:    String,
  allocatedHours: Number,
  color:          String
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStart:         Date,
  weekEnd:           Date,
  plan:              [DayPlanSchema],
  subjectAllocation: [AllocationSchema],
  version:           { type: Number, default: 1 },
  isActive:          { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);

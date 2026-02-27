const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema({
  date: Date,
  done: { type: Boolean, default: false }
}, { _id: false });

const SubjectSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:              { type: String, required: true, trim: true },
  difficulty:        { type: Number, min: 1, max: 5, default: 3 },
  chapters:          { type: Number, default: 10, min: 1 },
  completedChapters: { type: Number, default: 0, min: 0 },
  examDate:          { type: Date },
  color:             { type: String, default: '#a78bfa' },
  weightage:         { type: Number, default: 1, min: 1, max: 5 },
  hoursAllocated:    { type: Number, default: 0 },
  hoursCompleted:    { type: Number, default: 0 },
  priority:          { type: Number, default: 0 },
  revisionSchedule:  [RevisionSchema]
}, { timestamps: true });

// Auto-compute priority before save
SubjectSchema.pre('save', function (next) {
  if (this.examDate) {
    const daysLeft = Math.max(1, Math.ceil((this.examDate - new Date()) / 86400000));
    const urgency  = daysLeft <= 3 ? 10 : daysLeft <= 7 ? 8 : daysLeft <= 14 ? 6 : daysLeft <= 30 ? 4 : 2;
    this.priority  = urgency * this.difficulty * this.weightage;
  } else {
    this.priority  = this.difficulty * this.weightage * 2;
  }
  next();
});

module.exports = mongoose.model('Subject', SubjectSchema);

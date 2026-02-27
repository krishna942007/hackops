require('dotenv').config();
const mongoose  = require('mongoose');
const User      = require('./models/User');
const Subject   = require('./models/Subject');
const Timetable = require('./models/Timetable');
const Analytics = require('./models/Analytics');
const { generateTimetable } = require('./utils/aiEngine');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyflow');
  console.log('✅ Connected');

  await Promise.all([User.deleteMany(), Subject.deleteMany(), Timetable.deleteMany(), Analytics.deleteMany()]);

  const exam1 = new Date(); exam1.setDate(exam1.getDate() + 14);
  const exam2 = new Date(); exam2.setDate(exam2.getDate() + 30);
  const exam3 = new Date(); exam3.setDate(exam3.getDate() + 7);

  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@studyflow.app',
    profile: {
      dailyHours: 5,
      preferredTime: 'morning',
      studyGoal: 'Crack semester exams with distinction',
      fixedCommitments: [{ name: 'College', startTime: '09:00', endTime: '15:00', days: ['Monday','Tuesday','Wednesday','Thursday','Friday'] }]
    },
    gamification: { xp: 725, level: 2, streak: 5 }
  });

  const subjects = await Subject.create([
    { userId: user._id, name: 'Mathematics',      difficulty: 5, chapters: 20, completedChapters: 8,  examDate: exam1, color: '#a78bfa', weightage: 5 },
    { userId: user._id, name: 'Physics',           difficulty: 4, chapters: 15, completedChapters: 5,  examDate: exam2, color: '#38bdf8', weightage: 4 },
    { userId: user._id, name: 'Computer Science',  difficulty: 3, chapters: 12, completedChapters: 6,  examDate: exam3, color: '#2dd4bf', weightage: 3 },
    { userId: user._id, name: 'English',           difficulty: 2, chapters: 8,  completedChapters: 5,  color: '#fb923c', weightage: 2 },
  ]);

  const { plan, subjectAllocation } = generateTimetable(subjects, user.profile);
  const start = new Date(); start.setHours(0,0,0,0);
  const end   = new Date(start); end.setDate(end.getDate() + 13);

  await Timetable.create({ userId: user._id, weekStart: start, weekEnd: end, plan, subjectAllocation, isActive: true });

  // Seed analytics for last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
    await Analytics.create({
      userId: user._id, date: d,
      plannedHours: 5, completedHours: 3 + Math.random() * 2,
      focusScore: 60 + Math.round(Math.random() * 30),
      subjectsStudied: [{ name: 'Mathematics', minutes: 90 }, { name: 'Physics', minutes: 60 }],
      sessionsCompleted: 3, sessionsMissed: 1
    });
  }

  console.log('🎉 Seed complete!');
  console.log('👤 Demo user ID:', user._id.toString());
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });

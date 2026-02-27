const express   = require('express');
const router    = express.Router();
const Timetable = require('../models/Timetable');
const Subject   = require('../models/Subject');
const User      = require('../models/User');
const { generateTimetable } = require('../utils/aiEngine');

// POST /api/timetable/generate/:userId
router.post('/generate/:userId', async (req, res, next) => {
  try {
    const user     = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const subjects = await Subject.find({ userId: req.params.userId });
    if (!subjects.length) return res.status(400).json({ error: 'Add at least one subject before generating a timetable' });

    // Deactivate old timetables
    await Timetable.updateMany({ userId: req.params.userId }, { isActive: false });

    const { plan, subjectAllocation } = generateTimetable(subjects, user.profile);

    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(start); end.setDate(end.getDate() + 13);

    const tt = await Timetable.create({
      userId: req.params.userId,
      weekStart: start,
      weekEnd: end,
      plan,
      subjectAllocation,
      isActive: true
    });

    res.status(201).json(tt);
  } catch (err) { next(err); }
});

// GET /api/timetable/active/:userId
router.get('/active/:userId', async (req, res, next) => {
  try {
    const tt = await Timetable.findOne({ userId: req.params.userId, isActive: true }).sort({ createdAt: -1 });
    res.json(tt || null);
  } catch (err) { next(err); }
});

// GET /api/timetable/history/:userId
router.get('/history/:userId', async (req, res, next) => {
  try {
    const tts = await Timetable.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(5).select('createdAt version isActive weekStart weekEnd');
    res.json(tts);
  } catch (err) { next(err); }
});

// PATCH /api/timetable/:id/task/:dayIndex/:taskIndex/complete
router.patch('/:id/task/:dayIndex/:taskIndex/complete', async (req, res, next) => {
  try {
    const tt = await Timetable.findById(req.params.id);
    if (!tt) return res.status(404).json({ error: 'Timetable not found' });

    const day  = tt.plan[req.params.dayIndex];
    const task = day?.tasks[req.params.taskIndex];
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = !task.completed;
    tt.markModified('plan');
    await tt.save();

    res.json({ task, completed: task.completed });
  } catch (err) { next(err); }
});

// POST /api/timetable/:id/redistribute — reschedule missed tasks
router.post('/:id/redistribute', async (req, res, next) => {
  try {
    const { dayIndex } = req.body;
    const tt = await Timetable.findById(req.params.id);
    if (!tt) return res.status(404).json({ error: 'Timetable not found' });

    const missed = tt.plan[dayIndex]?.tasks.filter(t => !t.completed && t.type === 'study') || [];

    missed.forEach((task, i) => {
      const targetIdx = dayIndex + 1 + (i % 2);
      if (targetIdx < tt.plan.length) {
        const clone = { ...task.toObject(), notes: '📌 Rescheduled from missed session', completed: false };
        tt.plan[targetIdx].tasks.push(clone);
      }
    });

    tt.markModified('plan');
    await tt.save();
    res.json(tt);
  } catch (err) { next(err); }
});

module.exports = router;

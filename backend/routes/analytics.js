const express   = require('express');
const router    = express.Router();
const Analytics = require('../models/Analytics');
const { generateInsights } = require('../utils/aiEngine');

// GET /api/analytics/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const days  = parseInt(req.query.days) || 14;
    const since = new Date(); since.setDate(since.getDate() - days);

    const data = await Analytics.find({ userId: req.params.userId, date: { $gte: since } }).sort({ date: 1 });

    const totalPlanned   = data.reduce((s, a) => s + a.plannedHours, 0);
    const totalCompleted = data.reduce((s, a) => s + a.completedHours, 0);
    const completionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;
    const studyDays      = data.filter(a => a.completedHours > 0).length;
    const consistencyScore = Math.round((studyDays / days) * 100);

    // Subject breakdown
    const subjectMap = {};
    data.forEach(a => (a.subjectsStudied || []).forEach(s => {
      subjectMap[s.name] = (subjectMap[s.name] || 0) + s.minutes;
    }));

    res.json({
      data,
      summary: {
        totalPlanned:    Math.round(totalPlanned * 10) / 10,
        totalCompleted:  Math.round(totalCompleted * 10) / 10,
        completionRate,
        consistencyScore,
        studyDays
      },
      subjectBreakdown: Object.entries(subjectMap).map(([name, minutes]) => ({ name, minutes })),
      insights: generateInsights(data)
    });
  } catch (err) { next(err); }
});

// POST /api/analytics — log daily entry
router.post('/', async (req, res, next) => {
  try {
    const entry = await Analytics.create({ ...req.body, date: new Date() });
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

// PUT /api/analytics/:id
router.put('/:id', async (req, res, next) => {
  try {
    const entry = await Analytics.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(entry);
  } catch (err) { next(err); }
});

module.exports = router;

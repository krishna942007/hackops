require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Subject = require('../models/Subject');

const {
  askAANUSHASANAI,
  generateStudyStrategyAI,
  analyzeStudyBehaviourAI
} = require('../utils/aiEngine');

/* ================= CHAT ================= */

router.post('/chat', async (req, res) => {
  try {

    const { message, userId } = req.body;

    const user = await User.findById(userId);
    const subjects = await Subject.find({ userId });

    const prompt = `
Student:${user?.name}
Subjects:${subjects.map(s=>s.name).join(",")}

Question:${message}
`;

    const reply = await askAANUSHASANAI(prompt);

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI failed" });
  }
});

/* ================= STRATEGY ================= */

router.post('/strategy', async (req, res) => {

  try {

    const { userId, weakAreas } = req.body;

    const user = await User.findById(userId);
    const subjects = await Subject.find({ userId });

    const strategy = await generateStudyStrategyAI({
      name: user?.name || "Student",
      subjects,
      dailyHours: user?.profile?.dailyHours || 4,
      preferredTime: user?.profile?.preferredTime || "morning",
      weakAreas
    });

    res.json(strategy);

  } catch (err) {
    console.error("Strategy Error:", err);
    res.status(500).json({
      overallStrategy: "Strategy generation failed"
    });
  }
});

/* ================= ANALYSIS ================= */

router.post('/analyse', async (req, res) => {

  try {

    const { userId } = req.body;

    const user = await User.findById(userId);

    const analysis = await analyzeStudyBehaviourAI({
      completionRate: req.body.completionRate || 0,
      streak: user?.gamification?.streak || 0,
      xp: user?.gamification?.xp || 0,
      dailyHours: user?.profile?.dailyHours || 4,
      missedTasks: req.body.missedTasks || 0
    });

    res.json({ analysis });

  } catch (err) {
    console.error(err);
    res.status(500).json({ analysis: "Analysis failed" });
  }
});

module.exports = router;
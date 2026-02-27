const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// POST /api/users — create user
router.post('/', async (req, res, next) => {
  try {
    const { name, email, profile } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    // Reuse existing account by email
    let user = email ? await User.findOne({ email: email.toLowerCase().trim() }) : null;

    if (user) {
      // Update profile if re-onboarding
      if (profile) user.profile = { ...user.profile.toObject(), ...profile };
      await user.save();
    } else {
      user = await User.create({ name: name.trim(), email: email?.trim() || undefined, profile });
    }

    res.status(201).json(user);
  } catch (err) { next(err); }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/users/:id — update profile
router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// POST /api/users/:id/xp — award XP and update streak
router.post('/:id/xp', async (req, res, next) => {
  try {
    const { xp = 25, badge } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.gamification.xp += xp;
    user.gamification.level = Math.floor(user.gamification.xp / 500) + 1;

    // Streak logic
    const today = new Date(); today.setHours(0,0,0,0);
    const last  = user.gamification.lastStudyDate
      ? new Date(user.gamification.lastStudyDate) : null;
    if (last) {
      last.setHours(0,0,0,0);
      const diff = Math.round((today - last) / 86400000);
      user.gamification.streak = diff === 1 ? user.gamification.streak + 1 : diff === 0 ? user.gamification.streak : 1;
    } else {
      user.gamification.streak = 1;
    }
    user.gamification.lastStudyDate = new Date();
    if (badge) user.gamification.badges.push(badge);

    await user.save();
    res.json(user.gamification);
  } catch (err) { next(err); }
});

module.exports = router;

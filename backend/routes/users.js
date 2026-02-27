const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* =====================================================
   CREATE USER (Used for onboarding without password)
   POST /api/users
===================================================== */
router.post("/", async (req, res, next) => {
  try {
    const { name, email, profile } = req.body;

    if (!name?.trim())
      return res.status(400).json({ error: "Name is required" });

    // Reuse existing account by email
    let user = email
      ? await User.findOne({ email: email.toLowerCase().trim() })
      : null;

    if (user) {
      // Update profile if re-onboarding
      if (profile) {
        user.profile = {
          ...(user.profile?.toObject?.() || user.profile || {}),
          ...profile,
        };
      }
      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: email?.trim() || undefined,
        profile,
      });
    }

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

/* =====================================================
   GET USER BY ID (Protected)
   GET /api/users/:id
===================================================== */
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    // Prevent users from accessing other accounts
    if (req.user.id !== req.params.id)
      return res.status(403).json({ error: "Unauthorized access" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/* =====================================================
   UPDATE USER PROFILE (Protected)
   PUT /api/users/:id
===================================================== */
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return res.status(403).json({ error: "Unauthorized access" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/* =====================================================
   AWARD XP & UPDATE STREAK (Protected)
   POST /api/users/:id/xp
===================================================== */
router.post("/:id/xp", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return res.status(403).json({ error: "Unauthorized access" });

    const { xp = 25, badge } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    /* ===== XP & LEVEL ===== */
    user.gamification.xp += xp;
    user.gamification.level =
      Math.floor(user.gamification.xp / 500) + 1;

    /* ===== STREAK LOGIC ===== */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last = user.gamification.lastStudyDate
      ? new Date(user.gamification.lastStudyDate)
      : null;

    if (last) {
      last.setHours(0, 0, 0, 0);
      const diff = Math.round((today - last) / 86400000);

      if (diff === 1) {
        user.gamification.streak += 1;
      } else if (diff > 1) {
        user.gamification.streak = 1;
      }
      // if diff === 0 → same day, do nothing
    } else {
      user.gamification.streak = 1;
    }

    user.gamification.lastStudyDate = new Date();

    /* ===== BADGES ===== */
    if (badge) {
      user.gamification.badges.push(badge);
    }

    await user.save();

    res.json(user.gamification);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
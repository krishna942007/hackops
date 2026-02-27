const express = require('express');
const router = express.Router();

/* ─────────────────────────────────────────────
   TASK ROUTES
───────────────────────────────────────────── */

// GET all tasks
router.get('/', (req, res) => {
  res.json({ message: "Tasks route working ✅" });
});

// POST create task
router.post('/', (req, res) => {
  const task = req.body;
  res.json({
    message: "Task created ✅",
    data: task
  });
});

module.exports = router;   // ⭐ THIS LINE IS THE FIX
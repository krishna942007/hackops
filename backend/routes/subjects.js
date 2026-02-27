const express = require('express');
const router  = express.Router();
const Subject = require('../models/Subject');

// POST /api/subjects — create subject
router.post('/', async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) { next(err); }
});

// GET /api/subjects/:userId — get all subjects for a user
router.get('/:userId', async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.params.userId }).sort({ priority: -1 });
    res.json(subjects);
  } catch (err) { next(err); }
});

// PUT /api/subjects/:id — update a subject
router.put('/:id', async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) { next(err); }
});

// DELETE /api/subjects/:id — delete a subject
router.delete('/:id', async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;

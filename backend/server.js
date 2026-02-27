require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

/* ─────────────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────────────── */

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.url}`);
  next();
});


/* ─────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   ROUTES (Debug Mode)
───────────────────────────────────────────── */

const authRoute = require('./routes/auth');
console.log("authRoute type:", typeof authRoute);

const usersRoute = require('./routes/users');
console.log("usersRoute type:", typeof usersRoute);

const subjectsRoute = require('./routes/subjects');
console.log("subjectsRoute type:", typeof subjectsRoute);

const timetableRoute = require('./routes/timetable');
console.log("timetableRoute type:", typeof timetableRoute);

const analyticsRoute = require('./routes/analytics');
console.log("analyticsRoute type:", typeof analyticsRoute);

const tasksRoute = require('./routes/tasks');
console.log("tasksRoute type:", typeof tasksRoute);

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/subjects', subjectsRoute);
app.use('/api/timetable', timetableRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/tasks', tasksRoute);

/* ─────────────────────────────────────────────
   404 HANDLER
───────────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


/* ─────────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────────── */

app.use((err, _req, res, _next) => {
  console.error('🔥 Global Error:', err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});


/* ─────────────────────────────────────────────
   DATABASE CONNECTION
───────────────────────────────────────────── */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyflow';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`📦 Database: ${MONGO_URI}`);

    app.listen(PORT, () => {
      console.log(`🚀 StudyFlow API running at → http://localhost:${PORT}`);
      console.log(`🔍 Health Check → http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
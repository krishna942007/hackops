require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

/* ================= Middleware ================= */

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ================= Routes ================= */

app.use('/api/users', require('./routes/users'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/tasks', require('./routes/tasks'));

app.use('/api/ai', require('./routes/ai'));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok' })
);

/* ================= 404 ================= */

app.use((_req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

/* ================= MongoDB ================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(`🚀 Server running → http://localhost:${PORT}`)
  );
})
.catch(err => {
  console.error("Mongo Error:", err.message);
});
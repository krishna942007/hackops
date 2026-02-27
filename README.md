# 🎓 StudyFlow — Smart Timetable & Adaptive Study Planner

Full-stack web app: **React + Vite + Tailwind** frontend · **Node.js + Express** backend · **MongoDB** database

---

## ⚡ Quick Start (3 steps)

### Prerequisites
- Node.js 18+  
- MongoDB running locally (`mongod`) or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster

---

### Step 1 — Backend
```bash
cd backend
npm install
# Edit .env if using MongoDB Atlas (change MONGO_URI)
npm run dev
# ✅ Server running at http://localhost:5000
# ✅ Health check: http://localhost:5000/api/health
```

### Step 2 — Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

### Step 3 — Open & use
Navigate to **http://localhost:5173** and go through onboarding.

> **Why "Error creating profile"?**  
> The backend must be running on port 5000 BEFORE you use the frontend.  
> Vite proxies `/api` → `localhost:5000` automatically.

---

## 🗄️ MongoDB Setup

**Local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Windows — run as Administrator
net start MongoDB

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas (cloud — free tier):**
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Edit `backend/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studyflow
```

---

## 📁 Project Structure

```
studyflow/
├── backend/
│   ├── models/
│   │   ├── User.js          # Profile, gamification, analytics
│   │   ├── Subject.js       # Name, difficulty, chapters, exam date, priority
│   │   ├── Timetable.js     # 14-day plan with tasks per day
│   │   └── Analytics.js     # Daily study logs
│   ├── routes/
│   │   ├── users.js         # CRUD + XP award + streak
│   │   ├── subjects.js      # CRUD + priority scores
│   │   ├── timetable.js     # Generate, complete task, redistribute missed
│   │   ├── analytics.js     # Log and fetch analytics
│   │   └── tasks.js         # Today's tasks
│   ├── utils/
│   │   └── aiEngine.js      # 🧠 AI planning logic
│   ├── server.js
│   ├── seed.js              # Demo data
│   └── .env
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx      # Marketing page
        │   ├── OnboardingPage.jsx   # 4-step setup wizard
        │   ├── DashboardPage.jsx    # Today's tasks + stats
        │   ├── TimetablePage.jsx    # Weekly calendar view
        │   ├── PlannerPage.jsx      # Subject management + micro-tasks
        │   ├── AnalyticsPage.jsx    # Charts + insights
        │   └── AchievementsPage.jsx # XP, badges, levels
        ├── components/common/
        │   ├── Layout.jsx           # Sidebar + navigation
        │   └── Toast.jsx            # Notifications
        ├── context/
        │   └── AppContext.jsx       # Global state + API calls
        └── utils/
            └── api.js               # Axios client + all API helpers
```

---

## 🧠 AI Engine (`backend/utils/aiEngine.js`)

```
Priority = Urgency × Difficulty × Weightage

Urgency (based on days to exam):
  ≤ 3 days  → 10
  ≤ 7 days  → 8
  ≤ 14 days → 6
  ≤ 30 days → 4
  > 30 days → 2

Focus Mode:
  difficulty ≥ 4 → Deep Focus (90 min blocks)
  difficulty = 3 → Pomodoro (50 min)
  difficulty ≤ 2 → Light Review (30 min)

Burnout Detection:
  risk = f(daily_hours > 8, consecutive_days ≥ 6, tasks > 6)

Spaced Repetition:
  Revision sessions: 21, 14, 7, 3, 1 days before exam

Rest Days:
  Auto-enforced every 7th consecutive study day
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/users` | Create user |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id` | Update user |
| POST | `/api/users/:id/xp` | Award XP + update streak |
| GET | `/api/subjects/:userId` | List subjects |
| POST | `/api/subjects` | Add subject |
| PUT | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |
| POST | `/api/timetable/generate/:userId` | **Generate AI timetable** |
| GET | `/api/timetable/active/:userId` | Get active timetable |
| PATCH | `/api/timetable/:id/task/:d/:t/complete` | Toggle task complete |
| POST | `/api/timetable/:id/redistribute` | Reschedule missed tasks |
| GET | `/api/analytics/:userId` | Get analytics + insights |
| POST | `/api/analytics` | Log study session |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
# Set VITE_API_URL to your backend URL
```

### Backend → Railway / Render
```bash
# Set environment variables:
MONGO_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
```

'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   AI-Driven Adaptive Planning Engine
   Priority Formula: P = urgency × difficulty × weightage
───────────────────────────────────────────────────────────────────────────── */

function daysLeft(examDate) {
  if (!examDate) return 60;
  return Math.max(1, Math.ceil((new Date(examDate) - Date.now()) / 86400000));
}

function urgencyScore(days) {
  if (days <= 3)  return 10;
  if (days <= 7)  return 8;
  if (days <= 14) return 6;
  if (days <= 30) return 4;
  return 2;
}

function computePriority(subject) {
  const d = daysLeft(subject.examDate);
  return urgencyScore(d) * (subject.difficulty || 3) * (subject.weightage || 1);
}

function focusMode(difficulty) {
  if (difficulty >= 4) return 'deep-focus';
  if (difficulty === 3) return 'pomodoro';
  return 'light-review';
}

function sessionDuration(difficulty) {
  if (difficulty >= 4) return 90;
  if (difficulty === 3) return 50;
  return 30;
}

function burnoutRisk(dailyHours, consecutiveDays, taskCount) {
  let score = 0;
  if (dailyHours > 8) score += 3;
  else if (dailyHours > 6) score += 1;
  if (consecutiveDays >= 6) score += 3;
  else if (consecutiveDays >= 4) score += 1;
  if (taskCount > 6) score += 2;
  return score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
}

function spacedRepetitionDates(examDate) {
  const exam    = new Date(examDate);
  const now     = new Date();
  const results = [];
  for (const gap of [1, 3, 7, 14, 21]) {
    const d = new Date(exam);
    d.setDate(d.getDate() - gap);
    if (d > now && gap < daysLeft(examDate)) results.unshift(d);
  }
  return results;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total  = h * 60 + m + mins;
  const hh     = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const mm     = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

function timeSlotsForDay(preferredTime, dailyHours) {
  const bases = {
    morning:   ['06:00','07:30','09:00','10:30','12:00'],
    afternoon: ['13:00','14:30','16:00','17:30','19:00'],
    evening:   ['17:00','18:30','20:00','21:00','22:00'],
    night:     ['19:00','20:30','22:00','23:00','23:30'],
  };
  const times    = bases[preferredTime] || bases.morning;
  const maxSlots = Math.ceil((dailyHours * 60) / 90);
  return times.slice(0, maxSlots).map((t, i) => ({
    startTime: t,
    duration:  90,
    isPeak:    i === 0
  }));
}

function pickSubject(subjects, remaining, lastName, sameCount) {
  let pool = subjects.filter(s => (remaining[s.name] || 0) > 0.2);
  if (!pool.length) return null;
  if (sameCount >= 2 && pool.length > 1) pool = pool.filter(s => s.name !== lastName);
  pool.sort((a, b) => computePriority(b) - computePriority(a));
  return pool[0];
}

const CHAPTER_TITLES = [
  'Introduction & Fundamentals', 'Core Concepts', 'Key Theorems & Formulas',
  'Advanced Topics', 'Problem Solving Techniques', 'Applications & Examples',
  'Case Studies', 'Deep Dive Analysis', 'Practice Problems', 'Revision & Summary'
];

function chapterTitle(n) {
  return CHAPTER_TITLES[(n - 1) % CHAPTER_TITLES.length];
}

/* ─── Main Generator ─────────────────────────────────────────────────────── */
function generateTimetable(subjects, profile) {
  const { dailyHours = 4, preferredTime = 'morning' } = profile;
  const totalDays = 14;

  // Sort by priority
  const scored = subjects
    .map(s => ({ ...s.toObject ? s.toObject() : s, score: computePriority(s) }))
    .sort((a, b) => b.score - a.score);

  // Hour allocation weighted by priority score
  const totalScore = scored.reduce((s, x) => s + x.score, 0) || 1;
  const subjectAllocation = scored.map(s => ({
    subjectId:      s._id,
    subjectName:    s.name,
    color:          s.color || '#a78bfa',
    allocatedHours: Math.max(1, Math.round((s.score / totalScore) * dailyHours * totalDays * 10) / 10)
  }));

  // Remaining pool (hours)
  const remaining = {};
  subjectAllocation.forEach(sa => { remaining[sa.subjectName] = sa.allocatedHours; });

  // Chapter tracking
  const chapProgress = {};
  scored.forEach(s => { chapProgress[s.name] = 1; });

  const plan        = [];
  let consecutive   = 0;

  for (let day = 0; day < totalDays; day++) {
    const date      = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Rest day every 7th consecutive study day
    const isRestDay = consecutive >= 6;
    if (isRestDay) consecutive = 0; else consecutive++;

    const tasks        = [];
    let hoursUsed      = 0;
    const effectiveHrs = isRestDay ? 0.5 : dailyHours;

    if (!isRestDay) {
      const slots = timeSlotsForDay(preferredTime, effectiveHrs);
      let lastName  = null;
      let sameCount = 0;

      for (const slot of slots) {
        if (hoursUsed >= effectiveHrs) break;
        const sub = pickSubject(scored, remaining, lastName, sameCount);
        if (!sub) continue;

        const mode     = focusMode(sub.difficulty);
        const dur      = Math.min(slot.duration, sessionDuration(sub.difficulty));
        const chapNum  = chapProgress[sub.name] || 1;

        tasks.push({
          subject:       sub.name,
          subjectId:     sub._id,
          subjectColor:  sub.color || '#a78bfa',
          chapter:       `Ch. ${chapNum} – ${chapterTitle(chapNum)}`,
          chapterNumber: chapNum,
          duration:      dur,
          type:          'study',
          focusMode:     mode,
          startTime:     slot.startTime,
          endTime:       addMinutes(slot.startTime, dur),
          completed:     false,
          notes:         ''
        });

        remaining[sub.name] = Math.max(0, remaining[sub.name] - dur / 60);
        hoursUsed += dur / 60;

        // Advance chapter roughly every 2 sessions
        if (Math.random() > 0.5 && chapProgress[sub.name] < sub.chapters) {
          chapProgress[sub.name]++;
        }

        if (lastName === sub.name) sameCount++; else { lastName = sub.name; sameCount = 1; }
      }

      // Urgent revision slot (exam ≤ 7 days away)
      const urgentSub = scored.find(s => s.examDate && daysLeft(s.examDate) <= 7);
      if (urgentSub && hoursUsed + 0.5 <= effectiveHrs) {
        tasks.push({
          subject:      urgentSub.name,
          subjectId:    urgentSub._id,
          subjectColor: urgentSub.color || '#a78bfa',
          chapter:      '🔄 Rapid Revision – Key Concepts',
          duration:     30,
          type:         'revision',
          focusMode:    'light-review',
          startTime:    addMinutes(tasks.at(-1)?.endTime || '18:00', 10),
          endTime:      addMinutes(tasks.at(-1)?.endTime || '18:00', 40),
          completed:    false,
          notes:        'Exam approaching!'
        });
      }
    } else {
      // Rest day – one light review block
      tasks.push({
        subject:    '🌿 Rest & Light Review',
        chapter:    'Review your notes lightly, no pressure',
        duration:   30,
        type:       'break',
        focusMode:  'light-review',
        startTime:  '10:00',
        endTime:    '10:30',
        completed:  false,
        notes:      'Rest day – be kind to yourself'
      });
    }

    const risk = burnoutRisk(hoursUsed, consecutive, tasks.length);

    plan.push({
      date,
      dayOfWeek,
      totalHours:  Math.round(hoursUsed * 10) / 10,
      burnoutRisk: risk,
      tasks,
      isRestDay
    });
  }

  return { plan, subjectAllocation };
}

function generateInsights(analyticsArr) {
  const insights = [];
  if (!analyticsArr?.length) return ['📚 Start completing tasks to unlock AI insights!'];

  const avgRate = analyticsArr.reduce(
    (s, a) => s + a.completedHours / Math.max(a.plannedHours, 0.1), 0
  ) / analyticsArr.length;

  if (avgRate < 0.5) insights.push('⚠️ Completion rate below 50% — consider reducing daily targets.');
  else if (avgRate >= 0.9) insights.push('🎯 Outstanding completion rate — you\'re ahead of schedule!');
  else insights.push('👍 Good progress — aim for 90% completion to unlock streak bonuses.');

  const activeDays = analyticsArr.filter(a => a.completedHours > 0).length;
  if (activeDays >= 7) insights.push(`🔥 ${activeDays}-day study streak — incredible consistency!`);

  insights.push('💡 Tip: Schedule hardest subjects during your peak energy window.');
  insights.push('🧠 Spaced repetition is auto-scheduled 1, 3, 7, 14 days before exams.');

  return insights;
}

module.exports = { generateTimetable, computePriority, spacedRepetitionDates, generateInsights, burnoutRisk };

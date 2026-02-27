import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RefreshCw, CheckCircle2, Flame, Zap, BookOpen, Calendar, TrendingUp, Clock, Loader2 } from 'lucide-react';

const FOCUS_EMOJI = { 'deep-focus':'🎯', 'pomodoro':'🍅', 'light-review':'📖', break:'☕', revision:'🔄' };

function StatCard({ icon: Icon, label, value, sub, accent = '#c9a227' }) {
  return (
    <div className="glass-card" style={{ padding: '20px', transition: 'all 0.3s ease', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 44, height: 44,
          background: `linear-gradient(135deg, ${accent}22, ${accent}33)`,
          border: `1px solid ${accent}44`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 12px ${accent}22`,
        }}>
          <Icon style={{ width: 18, height: 18, color: accent }} />
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono"', fontSize: '1.6rem', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1 }}>{value}</div>
          <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--muted-gold)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          {sub && <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, subjects, timetable, generateTimetable, completeTask, redistributeMissed, loading } = useApp();
  const navigate = useNavigate();

  const today = new Date(); today.setHours(0,0,0,0);
  const todayPlan = timetable?.plan?.find(p => {
    const d = new Date(p.date); d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  });
  const dayIndex = timetable?.plan?.findIndex(p => {
    const d = new Date(p.date); d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  }) ?? -1;

  const totalTasks = todayPlan?.tasks?.length || 0;
  const doneTasks  = todayPlan?.tasks?.filter(t => t.completed).length || 0;
  const pct        = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;

  const xp     = user?.gamification?.xp     || 0;
  const level  = user?.gamification?.level  || 1;
  const streak = user?.gamification?.streak || 0;

  const upcomingExams = subjects
    .filter(s => s.examDate)
    .map(s => ({ ...s, daysLeft: Math.ceil((new Date(s.examDate) - Date.now()) / 86400000) }))
    .filter(s => s.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  const handleComplete = async (taskIndex) => {
    if (dayIndex === -1 || !timetable?._id) return;
    await completeTask(timetable._id, dayIndex, taskIndex);
  };
  const handleRedistribute = async () => {
    if (dayIndex === -1 || !timetable?._id) return;
    await redistributeMissed(timetable._id, dayIndex);
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', letterSpacing: '0.2em', color: 'rgba(201,162,39,0.5)', textTransform: 'uppercase', marginBottom: 6 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '0.05em' }}>
            <span style={{ color: 'rgba(245,240,232,0.6)' }}>{greeting()}, </span>
            <span className="gold-text-static">{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
        <button onClick={generateTimetable} disabled={loading || subjects.length === 0} className="btn-outline-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', padding: '10px 20px' }}>
          {loading ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <RefreshCw style={{ width: 14, height: 14 }} />}
          Regenerate Plan
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon={Flame}        label="Day Streak"   value={`${streak}d`}              sub="Keep it going!"     accent="#fb923c" />
        <StatCard icon={Zap}          label="Total XP"     value={xp.toLocaleString()}        sub={`Level ${level}`}   accent="#c9a227" />
        <StatCard icon={CheckCircle2} label="Today"        value={`${doneTasks}/${totalTasks}`} sub={`${pct}% complete`} accent="#2dd4bf" />
        <StatCard icon={BookOpen}     label="Subjects"     value={subjects.length}            sub="being studied"      accent="#8b5cf6" />
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Today's Plan */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ivory)' }}>Today's Discipline Plan</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {dayIndex >= 0 && doneTasks < totalTasks && (
                <button onClick={handleRedistribute} className="btn-ghost" style={{ fontSize: '0.7rem' }}>
                  <RefreshCw style={{ width: 12, height: 12 }} /> Reschedule
                </button>
              )}
            </div>
          </div>

          {!timetable && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, border: '1px solid rgba(201,162,39,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>
                <Calendar style={{ width: 28, height: 28, color: '#c9a227' }} />
              </div>
              <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.5)', marginBottom: 20 }}>No plan yet. Generate your sacred timetable!</p>
              <button onClick={generateTimetable} disabled={loading || subjects.length === 0} className="btn-gold" style={{ padding: '12px 28px', fontSize: '0.8rem' }}>
                {loading ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Generating…</> : '✦ Generate Plan'}
              </button>
              {subjects.length === 0 && <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', color: 'rgba(201,162,39,0.4)', marginTop: 10 }}>Add subjects in the Planner first</p>}
            </div>
          )}

          {todayPlan?.isRestDay && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px', background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌿</div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#5eead4', marginBottom: 8 }}>Rest Day</h3>
              <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)', fontSize: '0.95rem' }}>Your mind needs recovery. Light review only today.</p>
            </div>
          )}

          {todayPlan && !todayPlan.isRestDay && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', color: 'var(--muted-gold)' }}>
                  <span>{doneTasks} of {totalTasks} tasks complete</span>
                  <span style={{ color: '#c9a227' }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todayPlan.tasks.map((task, i) => (
                  <div key={i} onClick={() => handleComplete(i)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(201,162,39,0.03)',
                    border: `1px solid ${task.completed ? 'rgba(255,255,255,0.06)' : 'rgba(201,162,39,0.15)'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    opacity: task.completed ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { if (!task.completed) e.currentTarget.style.borderColor = 'rgba(201,162,39,0.35)'; }}
                    onMouseLeave={e => { if (!task.completed) e.currentTarget.style.borderColor = 'rgba(201,162,39,0.15)'; }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: `2px solid ${task.completed ? '#2dd4bf' : 'rgba(201,162,39,0.3)'}`,
                      background: task.completed ? '#2dd4bf' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {task.completed && <CheckCircle2 style={{ width: 12, height: 12, color: '#020510' }} />}
                    </div>
                    <div style={{ width: 3, height: 36, borderRadius: 99, flexShrink: 0, backgroundColor: task.subjectColor || '#8b5cf6' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: '"Cinzel", serif', fontSize: '0.75rem', letterSpacing: '0.05em', color: task.completed ? 'rgba(245,240,232,0.3)' : 'var(--ivory)', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: 2 }}>{task.subject}</p>
                      <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.85rem', color: 'rgba(245,240,232,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.chapter}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span className="badge-gold" style={{ fontSize: '0.6rem' }}>{FOCUS_EMOJI[task.focusMode]} {task.focusMode?.replace('-', ' ')}</span>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', color: '#c9a227' }}>{task.startTime}</p>
                        <p style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'rgba(245,240,232,0.3)' }}>{task.duration}m</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming Exams */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 16, textTransform: 'uppercase' }}>Upcoming Exams</h2>
            {upcomingExams.length === 0
              ? <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.35)', fontSize: '0.9rem' }}>No exam dates set yet.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upcomingExams.map(ex => (
                    <div key={ex._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 3, height: 36, borderRadius: 99, flexShrink: 0, backgroundColor: ex.color }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--ivory)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
                        <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)' }}>{new Date(ex.examDate).toLocaleDateString()}</p>
                      </div>
                      <span style={{
                        fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', fontWeight: 600,
                        padding: '3px 8px', borderRadius: 6,
                        background: ex.daysLeft <= 3 ? 'rgba(239,68,68,0.15)' : ex.daysLeft <= 7 ? 'rgba(251,146,60,0.15)' : 'rgba(45,212,191,0.12)',
                        border: `1px solid ${ex.daysLeft <= 3 ? 'rgba(239,68,68,0.3)' : ex.daysLeft <= 7 ? 'rgba(251,146,60,0.3)' : 'rgba(45,212,191,0.25)'}`,
                        color: ex.daysLeft <= 3 ? '#fca5a5' : ex.daysLeft <= 7 ? '#fdba74' : '#5eead4',
                      }}>{ex.daysLeft}d</span>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Priority Scores */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 16, textTransform: 'uppercase' }}>Priority Scores</h2>
            {subjects.length === 0
              ? <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.35)', fontSize: '0.9rem' }}>Add subjects in the Planner.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[...subjects].sort((a, b) => (b.priority || 0) - (a.priority || 0)).slice(0, 4).map((s, i) => (
                    <div key={s._id}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'rgba(201,162,39,0.4)' }}>#{i + 1}</span>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                          <span style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.9rem', color: 'var(--ivory)' }}>{s.name}</span>
                        </div>
                        <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'var(--muted-gold)' }}>D:{s.difficulty}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min(100, (s.priority || 5) * 3)}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }} />
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 14, textTransform: 'uppercase' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'View Timetable',  path: '/timetable',  icon: Calendar,   accent: '#38bdf8' },
                { label: 'Manage Subjects', path: '/planner',    icon: BookOpen,   accent: '#8b5cf6' },
                { label: 'See Analytics',   path: '/analytics',  icon: TrendingUp, accent: '#2dd4bf' },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px',
                  background: `${a.accent}11`,
                  border: `1px solid ${a.accent}22`,
                  borderRadius: 10,
                  fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.06em',
                  color: a.accent,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.accent}22`; e.currentTarget.style.borderColor = `${a.accent}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${a.accent}11`; e.currentTarget.style.borderColor = `${a.accent}22`; }}
                >
                  <a.icon style={{ width: 14, height: 14 }} /> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

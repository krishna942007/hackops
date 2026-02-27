import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Plus, Trash2, User, BookOpen, Clock, Rocket, Loader2 } from 'lucide-react';

const COLORS = ['#8b5cf6','#38bdf8','#2dd4bf','#fb923c','#f472b6','#34d399','#60a5fa','#f59e0b','#e879f9','#4ade80'];
const DIFF   = { 1:'Very Easy', 2:'Easy', 3:'Medium', 4:'Hard', 5:'Very Hard' };
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const STEPS = [
  { id:1, label:'Profile',     icon:User },
  { id:2, label:'Subjects',    icon:BookOpen },
  { id:3, label:'Preferences', icon:Clock },
  { id:4, label:'Launch',      icon:Rocket },
];

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        const Icon = s.icon;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Cinzel", serif',
                fontSize: '0.7rem',
                transition: 'all 0.3s ease',
                background: done ? 'linear-gradient(135deg, #1a7a5e, #2dd4bf)' :
                            active ? 'linear-gradient(135deg, #a07c15, #c9a227, #f5d76e)' :
                            'rgba(255,255,255,0.04)',
                border: done ? '1px solid rgba(45,212,191,0.4)' :
                        active ? '1px solid rgba(245,215,110,0.5)' :
                        '1px solid rgba(255,255,255,0.08)',
                color: done || active ? '#020510' : 'rgba(245,240,232,0.3)',
                boxShadow: active ? '0 0 20px rgba(201,162,39,0.3)' : done ? '0 0 12px rgba(45,212,191,0.2)' : 'none',
              }}>
                {done ? '✓' : <Icon style={{ width: 16, height: 16 }} />}
              </div>
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                marginTop: 6,
                color: active ? '#c9a227' : done ? '#2dd4bf' : 'rgba(245,240,232,0.25)',
                textTransform: 'uppercase',
              }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 60, height: 1, margin: '0 4px 20px',
                background: done ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.06)',
                transition: 'all 0.4s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const { createUser, addSubject, generateTimetable, loading } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({ name:'', email:'', studyGoal:'' });
  const [subjects, setSubjects] = useState([{ name:'', difficulty:3, chapters:10, completedChapters:0, examDate:'', color:COLORS[0], weightage:3 }]);
  const [prefs, setPrefs] = useState({ dailyHours:4, preferredTime:'morning', fixedCommitments:[] });
  const [commit, setCommit] = useState({ name:'', startTime:'09:00', endTime:'17:00', days:[] });

  const setSub = (i, k, v) => setSubjects(prev => prev.map((s,j) => j===i ? {...s,[k]:v} : s));
  const addSub = () => setSubjects(prev => [...prev, { name:'', difficulty:3, chapters:10, completedChapters:0, examDate:'', color:COLORS[prev.length % COLORS.length], weightage:3 }]);
  const delSub = i => setSubjects(prev => prev.filter((_,j) => j!==i));

  const toggleDay = d => setCommit(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x=>x!==d) : [...p.days,d] }));
  const addCommit = () => {
    if (!commit.name.trim()) return;
    setPrefs(p => ({ ...p, fixedCommitments: [...p.fixedCommitments, {...commit}] }));
    setCommit({ name:'', startTime:'09:00', endTime:'17:00', days:[] });
  };
  const delCommit = i => setPrefs(p => ({ ...p, fixedCommitments: p.fixedCommitments.filter((_,j) => j!==i) }));

  const canNext = () => {
    if (step===1) return profile.name.trim().length >= 2;
    if (step===2) return subjects.some(s => s.name.trim());
    return true;
  };

  const handleFinish = async () => {
    try {
      const user = await createUser({
        name: profile.name.trim(),
        email: profile.email?.trim() || undefined,
        profile: { dailyHours: prefs.dailyHours, preferredTime: prefs.preferredTime, studyGoal: profile.studyGoal, fixedCommitments: prefs.fixedCommitments },
      });
      for (const s of subjects.filter(x => x.name.trim())) {
        await addSubject({ ...s, userId: user._id });
      }
      await generateTimetable();
      navigate('/dashboard');
    } catch (err) { console.error('Onboarding error:', err); }
  };

  // Inline styles used throughout
  const sectionTitle = {
    fontFamily: '"Cinzel", serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--ivory)',
    marginBottom: 6,
  };
  const sectionSub = {
    fontFamily: '"Crimson Pro", serif',
    fontSize: '1rem',
    color: 'rgba(245,240,232,0.45)',
    marginBottom: 24,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, border: '1.5px solid rgba(201,162,39,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(201,162,39,0.2)' }}>
            <div style={{ width: 24, height: 24, border: '1px solid rgba(201,162,39,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 7, height: 7, background: '#c9a227', borderRadius: '50%' }} />
            </div>
          </div>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 8 }} className="gold-text">AANUSHASAN</h1>
          <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.45)', letterSpacing: '0.1em' }}>Begin Your Sacred Study Path</p>
        </div>

        <StepBar current={step} />

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px', animation: 'fadeIn 0.4s ease-out' }}>

          {/* STEP 1: Profile */}
          {step === 1 && (
            <div>
              <h2 style={sectionTitle}>Your Profile</h2>
              <p style={sectionSub}>Personalise your discipline journey</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" placeholder="e.g. Sumit Barve" value={profile.name}
                    onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Email (optional)</label>
                  <input className="input" type="email" placeholder="you@email.com" value={profile.email}
                    onChange={e => setProfile(p => ({...p, email: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Study Goal</label>
                  <input className="input" placeholder="e.g. Clear semester with 8+ CGPA" value={profile.studyGoal}
                    onChange={e => setProfile(p => ({...p, studyGoal: e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subjects */}
          {step === 2 && (
            <div>
              <h2 style={sectionTitle}>Your Subjects</h2>
              <p style={sectionSub}>Add all subjects you need to master</p>
              <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4 }} className="scroll-thin">
                {subjects.map((s, i) => (
                  <div key={i} style={{ background: 'rgba(13,21,48,0.6)', border: '1px solid rgba(201,162,39,0.15)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: s.color, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0, transition: 'transform 0.2s' }}
                        onClick={() => setSub(i, 'color', COLORS[(COLORS.indexOf(s.color)+1)%COLORS.length])} />
                      <input className="input" style={{ flex: 1 }} placeholder="Subject name *" value={s.name}
                        onChange={e => setSub(i,'name',e.target.value)} />
                      {subjects.length > 1 && (
                        <button onClick={() => delSub(i)} style={{ padding: 6, color: '#f87171', background: 'rgba(248,113,113,0.1)', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer' }}>
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div>
                        <label className="label">Difficulty</label>
                        <select className="select" style={{ fontSize: '0.85rem' }} value={s.difficulty} onChange={e => setSub(i,'difficulty',+e.target.value)}>
                          {[1,2,3,4,5].map(d => <option key={d} value={d}>{d} – {DIFF[d]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Chapters</label>
                        <input className="input" style={{ fontSize: '0.85rem' }} type="number" min="1" value={s.chapters}
                          onChange={e => setSub(i,'chapters',+e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Exam Date</label>
                        <input className="input" style={{ fontSize: '0.85rem' }} type="date" value={s.examDate}
                          onChange={e => setSub(i,'examDate',e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="label">Importance (1 = low · 5 = critical)</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[1,2,3,4,5].map(w => (
                          <button key={w} onClick={() => setSub(i,'weightage',w)} style={{
                            flex: 1, padding: '6px 0',
                            borderRadius: 8,
                            fontFamily: '"JetBrains Mono"', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            background: s.weightage===w ? 'linear-gradient(135deg, #a07c15, #c9a227)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${s.weightage===w ? 'rgba(201,162,39,0.6)' : 'rgba(255,255,255,0.08)'}`,
                            color: s.weightage===w ? '#020510' : 'rgba(245,240,232,0.4)',
                            boxShadow: s.weightage===w ? '0 0 12px rgba(201,162,39,0.25)' : 'none',
                          }}>{w}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addSub} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#c9a227', background: 'none', border: 'none', cursor: 'pointer', marginTop: 14, padding: '8px 0' }}>
                <Plus style={{ width: 14, height: 14 }} /> Add Another Subject
              </button>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div>
              <h2 style={sectionTitle}>Study Preferences</h2>
              <p style={sectionSub}>Shape the plan around your life</p>

              <div style={{ marginBottom: 24 }}>
                <label className="label">Daily Study Hours: <span style={{ color: '#c9a227', fontFamily: '"JetBrains Mono"' }}>{prefs.dailyHours}h / day</span></label>
                <input type="range" min="1" max="12" step="0.5" value={prefs.dailyHours}
                  onChange={e => setPrefs(p => ({...p, dailyHours: +e.target.value}))}
                  style={{ width: '100%', marginTop: 8, accentColor: '#c9a227' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'rgba(201,162,39,0.4)', marginTop: 4 }}>
                  <span>1h</span><span>6h</span><span>12h</span>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label">Preferred Study Time</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    {v:'morning',   e:'🌅', l:'Morning',   s:'6am–12pm'},
                    {v:'afternoon', e:'☀️', l:'Afternoon', s:'12pm–5pm'},
                    {v:'evening',   e:'🌆', l:'Evening',   s:'5pm–9pm'},
                    {v:'night',     e:'🌙', l:'Night',     s:'9pm–12am'},
                  ].map(t => (
                    <button key={t.v} onClick={() => setPrefs(p => ({...p, preferredTime: t.v}))} style={{
                      padding: 14,
                      border: `1px solid ${prefs.preferredTime===t.v ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 12,
                      background: prefs.preferredTime===t.v ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.02)',
                      textAlign: 'left', cursor: 'pointer',
                      boxShadow: prefs.preferredTime===t.v ? '0 0 16px rgba(201,162,39,0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{t.e}</div>
                      <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.75rem', letterSpacing: '0.06em', color: prefs.preferredTime===t.v ? '#c9a227' : 'var(--ivory)', marginBottom: 2 }}>{t.l}</div>
                      <div style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'rgba(245,240,232,0.3)' }}>{t.s}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Fixed Commitments (college, gym, etc.)</label>
                {prefs.fixedCommitments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '8px 12px' }}>
                    <span style={{ flex: 1, fontFamily: '"Crimson Pro", serif', fontSize: '0.9rem', color: '#7dd3fc' }}>{c.name} · {c.startTime}–{c.endTime}</span>
                    <button onClick={() => delCommit(i)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 style={{ width: 14, height: 14 }} /></button>
                  </div>
                ))}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  <input className="input" style={{ flex: '1 1 120px', fontSize: '0.85rem' }} placeholder="Commitment name" value={commit.name}
                    onChange={e => setCommit(p => ({...p, name: e.target.value}))} />
                  <input className="input" style={{ width: 110, fontSize: '0.85rem' }} type="time" value={commit.startTime}
                    onChange={e => setCommit(p => ({...p, startTime: e.target.value}))} />
                  <input className="input" style={{ width: 110, fontSize: '0.85rem' }} type="time" value={commit.endTime}
                    onChange={e => setCommit(p => ({...p, endTime: e.target.value}))} />
                  <button onClick={addCommit} className="btn-outline-gold" style={{ padding: '10px 16px', fontSize: '0.7rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {DAYS.map(d => (
                    <button key={d} onClick={() => toggleDay(d)} style={{
                      padding: '5px 12px', borderRadius: 8,
                      fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      background: commit.days.includes(d) ? 'linear-gradient(135deg, #a07c15, #c9a227)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${commit.days.includes(d) ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: commit.days.includes(d) ? '#020510' : 'rgba(245,240,232,0.3)',
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Launch */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, border: '1.5px solid rgba(201,162,39,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(201,162,39,0.2)', animation: 'float 4s ease-in-out infinite' }}>
                <Rocket style={{ width: 32, height: 32, color: '#c9a227' }} />
              </div>
              <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ivory)', marginBottom: 8 }}>
                You're Ready, <span className="gold-text-static">{profile.name}</span>!
              </h2>
              <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.45)', marginBottom: 28 }}>Your personalised discipline plan will include:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
                {[
                  { e:'📚', t:`${subjects.filter(s=>s.name).length} Subjects`, s: subjects.filter(s=>s.name).map(s=>s.name).join(', ') || 'None' },
                  { e:'⏰', t:`${prefs.dailyHours}h/day`, s:`Preferred: ${prefs.preferredTime}` },
                  { e:'🗓', t:'14-Day Plan', s:'Auto-generated smart timetable' },
                  { e:'🧠', t:'AI Priority Scores', s:'Urgency × Difficulty × Weightage' },
                  { e:'🔄', t:'Spaced Repetition', s:'1, 3, 7, 14 days before exams' },
                  { e:'🏆', t:'Gamification', s:'XP, levels, streaks & badges' },
                ].map(item => (
                  <div key={item.t} style={{ background: 'rgba(201,162,39,0.05)', border: '1px solid rgba(201,162,39,0.15)', borderRadius: 12, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span>{item.e}</span>
                      <span style={{ fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.06em', color: '#c9a227' }}>{item.t}</span>
                    </div>
                    <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', color: 'rgba(245,240,232,0.35)', paddingLeft: 24 }}>{item.s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(201,162,39,0.1)' }}>
            <button onClick={() => step > 1 ? setStep(s=>s-1) : navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--muted-gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <ChevronLeft style={{ width: 16, height: 16 }} />
              {step > 1 ? 'Back' : 'Home'}
            </button>

            {step < 4 ? (
              <button onClick={() => setStep(s=>s+1)} disabled={!canNext()} className="btn-gold" style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8 }}>
                Continue <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={loading} className="btn-gold" style={{ minWidth: 180, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Generating…</>
                  : <><Rocket style={{ width: 14, height: 14 }} /> Generate My Plan</>
                }
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'rgba(201,162,39,0.25)', marginTop: 16, letterSpacing: '0.08em' }}>
          YOUR DATA IS STORED IN YOUR OWN MONGODB — WE NEVER SELL IT
        </p>
      </div>
    </div>
  );
}

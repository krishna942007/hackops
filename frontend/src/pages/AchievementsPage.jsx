import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Star, Zap, Trophy } from 'lucide-react';

const BADGES = [
  { name:'First Step',     icon:'👶', desc:'Complete your first study session',       xp:50,   condition: u => (u?.gamification?.xp||0) > 0 },
  { name:'Week Warrior',   icon:'⚔️', desc:'Study 7 days in a row',                  xp:200,  condition: u => (u?.gamification?.streak||0) >= 7 },
  { name:'Marathon Mind',  icon:'🏃', desc:'Study 30 consecutive days',              xp:1000, condition: u => (u?.gamification?.streak||0) >= 30 },
  { name:'Night Owl',      icon:'🦉', desc:'Complete 5 late-night sessions',         xp:150,  condition: _ => false },
  { name:'Early Bird',     icon:'🐦', desc:'Study before 7am ten times',             xp:150,  condition: _ => false },
  { name:'Chapter Master', icon:'📖', desc:'Complete 50 chapters',                   xp:500,  condition: _ => false },
  { name:'Focus Guru',     icon:'🧘', desc:'Complete 20 deep-focus sessions',        xp:300,  condition: _ => false },
  { name:'Exam Crusher',   icon:'💪', desc:'Score 90%+ in any subject',              xp:750,  condition: _ => false },
  { name:'Perfect Week',   icon:'✨', desc:'Complete 100% of tasks in a week',       xp:400,  condition: _ => false },
  { name:'Polymath',       icon:'🧠', desc:'Study 5 different subjects in one day',  xp:200,  condition: _ => false },
  { name:'No Burnout',     icon:'❄️', desc:'Low burnout risk for 14 days straight',  xp:300,  condition: _ => false },
  { name:'Legend',         icon:'👑', desc:'Reach Level 10',                          xp:2000, condition: u => (u?.gamification?.level||1) >= 10 },
];

const LEVEL_TITLES = ['','Beginner','Learner','Student','Scholar','Academic','Expert','Master','Genius','Prodigy','Legend'];

const XP_ACTIONS = [
  { e:'✅', a:'Complete a task',            xp:25 },
  { e:'🎯', a:'Finish all daily tasks',     xp:100 },
  { e:'🔥', a:'7-day streak',              xp:200 },
  { e:'📖', a:'Complete a chapter',         xp:50 },
  { e:'✨', a:'Perfect week (100%)',        xp:400 },
  { e:'🏅', a:'Earn an achievement badge',  xp:150 },
];

export default function AchievementsPage() {
  const { user } = useApp();
  const g     = user?.gamification || {};
  const xp    = g.xp     || 0;
  const level = g.level  || 1;
  const streak= g.streak || 0;
  const pct   = ((xp % 500) / 500) * 100;
  const title = LEVEL_TITLES[Math.min(level, 10)] || 'Legend';
  const earned = BADGES.filter(b => b.condition(user));
  const levels = Array.from({length:10},(_,i)=>i+1);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }} className="gold-text-static">Achievements</h1>
        <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)', fontSize: '1rem' }}>Earn XP, level up, and collect sacred badges</p>
      </div>

      {/* Hero banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(201,162,39,0.1), rgba(56,189,248,0.06))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div style={{ width: 80, height: 80, border: '1.5px solid rgba(201,162,39,0.5)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 0 24px rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.06)', position: 'relative' }}>
              {level>=10?'👑':level>=7?'🎓':level>=5?'🌟':level>=3?'📚':'🌱'}
              <div style={{ position: 'absolute', bottom: -10, right: -10, background: 'linear-gradient(135deg, #a07c15, #c9a227)', borderRadius: 99, padding: '3px 8px', fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', fontWeight: 600, color: '#020510' }}>Lvl {level}</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ivory)', marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.45)', marginBottom: 14 }}>{title} · {earned.length}/{BADGES.length} badges earned</p>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', color: 'var(--muted-gold)', marginBottom: 6 }}>
                <span>{xp} XP</span><span>{level*500} XP (Level {level+1})</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Flame style={{ width: 24, height: 24, color: '#fb923c' }} />
              <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '2.5rem', fontWeight: 600, color: '#fdba74' }}>{streak}</span>
            </div>
            <span style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem' }}>day streak</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { icon: Star,   label: 'Total XP',  value: xp.toLocaleString(), accent: '#fb923c' },
          { icon: Trophy, label: 'Badges',    value: `${earned.length}/${BADGES.length}`, accent: '#c9a227' },
          { icon: Zap,    label: 'Level',     value: level, accent: '#38bdf8' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, background: `${s.accent}22`, border: `1px solid ${s.accent}33`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <s.icon style={{ width: 18, height: 18, color: s.accent }} />
            </div>
            <div style={{ fontFamily: '"JetBrains Mono"', fontSize: '1.8rem', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-gold)', marginTop: 6, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Level progression */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 20, textTransform: 'uppercase' }}>Level Progression</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, paddingBottom: 8, minWidth: 'max-content' }}>
          {levels.map((l, i) => {
            const done = l < level, active = l === level;
            return (
              <React.Fragment key={l}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"JetBrains Mono"', fontSize: '0.7rem', fontWeight: 600,
                    background: done ? 'linear-gradient(135deg, #a07c15, #c9a227)' : active ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${done ? 'rgba(201,162,39,0.6)' : active ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: done ? '#020510' : active ? '#c9a227' : 'rgba(245,240,232,0.25)',
                    boxShadow: active ? '0 0 16px rgba(201,162,39,0.25)' : 'none',
                  }}>
                    {done ? '✓' : l}
                  </div>
                  <span style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.65rem', color: active ? '#c9a227' : done ? 'rgba(201,162,39,0.6)' : 'rgba(245,240,232,0.2)', textAlign: 'center', width: 52 }}>{LEVEL_TITLES[l]}</span>
                </div>
                {i < levels.length - 1 && (
                  <div style={{ flex: 1, height: 1, marginBottom: 26, minWidth: 20, background: done ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.05)' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Badge gallery */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 20, textTransform: 'uppercase' }}>Sacred Badges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {BADGES.map(badge => {
            const isEarned = badge.condition(user);
            return (
              <div key={badge.name} style={{
                borderRadius: 14, border: `1px solid ${isEarned ? 'rgba(201,162,39,0.35)' : 'rgba(255,255,255,0.05)'}`,
                padding: '18px 14px', textAlign: 'center',
                background: isEarned ? 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(245,215,110,0.04))' : 'rgba(255,255,255,0.02)',
                opacity: isEarned ? 1 : 0.4,
                filter: isEarned ? 'none' : 'grayscale(0.7)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                boxShadow: isEarned ? '0 0 16px rgba(201,162,39,0.1)' : 'none',
              }}
                onMouseEnter={e => { if (isEarned) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,162,39,0.2)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isEarned ? '0 0 16px rgba(201,162,39,0.1)' : 'none'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{badge.icon}</div>
                <p style={{ fontFamily: '"Cinzel", serif', fontSize: '0.65rem', letterSpacing: '0.06em', color: isEarned ? 'var(--ivory)' : 'rgba(245,240,232,0.3)', marginBottom: 6 }}>{badge.name}</p>
                <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.8rem', color: 'rgba(245,240,232,0.35)', marginBottom: 10, lineHeight: 1.4 }}>{badge.desc}</p>
                <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.6rem', padding: '3px 8px', borderRadius: 99, background: isEarned ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isEarned ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.08)'}`, color: isEarned ? '#c9a227' : 'rgba(245,240,232,0.25)' }}>+{badge.xp} XP</span>
                {isEarned && <p style={{ fontFamily: '"Cinzel", serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#2dd4bf', marginTop: 10 }}>✓ EARNED</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Guide */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 18, textTransform: 'uppercase' }}>How to Earn XP</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {XP_ACTIONS.map(a => (
            <div key={a.a} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(201,162,39,0.04)', border: '1px solid rgba(201,162,39,0.1)', borderRadius: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>{a.e}</span>
              <span style={{ fontFamily: '"Crimson Pro", serif', flex: 1, color: 'rgba(245,240,232,0.6)', fontSize: '0.95rem' }}>{a.a}</span>
              <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', fontWeight: 600, color: '#c9a227', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 99, padding: '3px 8px' }}>+{a.xp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiAPI } from '../utils/aiApi';
import { Brain, Loader2, TrendingUp, AlertTriangle, CheckCircle2, Target, Zap, RefreshCw } from 'lucide-react';

function ScoreRing({ score }) {
  const r = 54, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  const color = score >= 70 ? '#2dd4bf' : score >= 40 ? '#fb923c' : '#f87171';
  return (
    <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.5s ease', filter: `drop-shadow(0 0 8px ${color}88)` }} />
      <text x="70" y="74" textAnchor="middle" style={{ transform: 'rotate(90deg)', transformOrigin: '70px 70px', fontFamily: '"JetBrains Mono"', fontSize: 26, fontWeight: 700, fill: color }}>{score}</text>
      <text x="70" y="90" textAnchor="middle" style={{ transform: 'rotate(90deg)', transformOrigin: '70px 70px', fontFamily: '"Cinzel"', fontSize: 9, fill: 'rgba(245,240,232,0.4)', letterSpacing: 2 }}>SCORE</text>
    </svg>
  );
}

const RISK_STYLES = {
  low:    { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)',  border: 'rgba(45,212,191,0.3)',  label: 'LOW RISK' },
  medium: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.3)',  label: 'MEDIUM RISK' },
  high:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', label: 'HIGH RISK' },
};

export default function AIAnalysisPage() {
  const { user, subjects, timetable } = useApp();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const todayPlan = timetable?.plan?.find(p => {
    const d = new Date(p.date); d.setHours(0,0,0,0);
    const t = new Date();       t.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  });
  const totalTasks = todayPlan?.tasks?.length || 0;
  const doneTasks  = todayPlan?.tasks?.filter(t => t.completed).length || 0;
  const completionRate = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await aiAPI.analyse(user._id, { completionRate, missedTasks: totalTasks - doneTasks });
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please check your Gemini API key and try again.');
    } finally { setLoading(false); }
  };

  const risk = result ? RISK_STYLES[result.burnoutRisk] || RISK_STYLES.low : null;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }} className="gold-text-static">AI Study Analysis</h1>
          <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)', fontSize: '1rem' }}>Deep behavioural insights powered by Gemini AI</p>
        </div>
        <button onClick={runAnalysis} disabled={loading} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: '0.8rem' }}>
          {loading ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Analysing…</> : <><Brain style={{ width: 16, height: 16 }} /> Run Analysis</>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '16px 20px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 14, fontFamily: '"Crimson Pro", serif', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, border: '1.5px solid rgba(201,162,39,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'float 4s ease-in-out infinite' }}>
            <Brain style={{ width: 32, height: 32, color: '#c9a227' }} />
          </div>
          <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.2rem', letterSpacing: '0.08em', color: 'var(--ivory)', marginBottom: 12 }}>Ready to Analyse Your Journey</h2>
          <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)', fontSize: '1rem', maxWidth: 400, margin: '0 auto 32px' }}>
            The AI will examine your subjects, completion rates, streaks, and study patterns to generate a personalised report.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, maxWidth: 600, margin: '0 auto' }}>
            {[
              { label: 'Subjects', value: subjects.length, icon: '📚' },
              { label: 'Today Completion', value: `${completionRate}%`, icon: '✅' },
              { label: 'Streak', value: `${user?.gamification?.streak || 0}d`, icon: '🔥' },
              { label: 'Level', value: user?.gamification?.level || 1, icon: '⭐' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(201,162,39,0.05)', border: '1px solid rgba(201,162,39,0.15)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: '"JetBrains Mono"', fontSize: '1.2rem', fontWeight: 600, color: '#c9a227' }}>{s.value}</div>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.35)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, border: '2px solid rgba(201,162,39,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'rotateSlow 2s linear infinite' }}>
            <Brain style={{ width: 32, height: 32, color: '#c9a227' }} />
          </div>
          <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.1rem', letterSpacing: '0.1em', color: 'var(--ivory)', marginBottom: 12 }}>Gemini AI is Analysing Your Path…</h2>
          <p style={{ fontFamily: '"Crimson Pro", serif', color: 'rgba(245,240,232,0.4)' }}>Reading your study patterns, subjects, and performance data</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Score + Burnout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Overall Score */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: 24 }}>
              <ScoreRing score={result.overallScore} />
              <div>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--muted-gold)', textTransform: 'uppercase', marginBottom: 8 }}>Overall Score</div>
                <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.1rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.5 }}>
                  {result.overallScore >= 70 ? 'Excellent discipline and consistency.' : result.overallScore >= 40 ? 'Good progress, room to improve.' : 'Needs immediate attention and restructuring.'}
                </div>
                <button onClick={runAnalysis} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Cinzel", serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--muted-gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <RefreshCw style={{ width: 12, height: 12 }} /> Re-analyse
                </button>
              </div>
            </div>

            {/* Burnout Risk */}
            <div className="glass-card" style={{ padding: '28px', background: risk.bg, borderColor: risk.border }}>
              <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--muted-gold)', textTransform: 'uppercase', marginBottom: 16 }}>Burnout Risk</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <AlertTriangle style={{ width: 32, height: 32, color: risk.color }} />
                <span style={{ fontFamily: '"Cinzel", serif', fontSize: '1.4rem', fontWeight: 700, color: risk.color }}>{risk.label}</span>
              </div>
              <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.6 }}>{result.burnoutReason}</p>
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#2dd4bf', textTransform: 'uppercase', marginBottom: 16 }}>✦ Strengths</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.strengths?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: '#2dd4bf', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.5 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fb923c', textTransform: 'uppercase', marginBottom: 16 }}>⚠ Weaknesses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.weaknesses?.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: '#fb923c', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.5 }}>{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Strategy */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', textTransform: 'uppercase', marginBottom: 18 }}>✦ 7-Day Action Strategy</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {result.weeklyStrategy?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(201,162,39,0.04)', border: '1px solid rgba(201,162,39,0.1)', borderRadius: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, rgba(160,124,21,0.4), rgba(201,162,39,0.2))', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono"', fontSize: '0.65rem', color: '#c9a227', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.55 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Focus + Motivational */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ivory)', textTransform: 'uppercase', marginBottom: 14 }}>
                <Target style={{ width: 14, height: 14, display: 'inline', marginRight: 8, color: '#c9a227' }} />
                Subject Focus
              </h3>
              <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.05rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.6 }}>{result.subjectFocus}</p>
            </div>
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(245,215,110,0.04))', borderColor: 'rgba(201,162,39,0.3)' }}>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a227', textTransform: 'uppercase', marginBottom: 14 }}>
                <Zap style={{ width: 14, height: 14, display: 'inline', marginRight: 8 }} />
                For You
              </h3>
              <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.05rem', color: 'rgba(245,240,232,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>"{result.motivationalMessage}"</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

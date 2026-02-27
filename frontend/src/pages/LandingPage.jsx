import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Shield, Clock, Award, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

const FEATURES = [
  { icon: Brain,    label: 'AI Priority Engine',    desc: 'Formula: Urgency × Difficulty × Weightage scores every subject with divine precision.',    accent: '#8b5cf6' },
  { icon: Target,   label: 'Adaptive Replanning',   desc: 'Miss a session? Tasks auto-redistribute to keep you firmly on the path.',                  accent: '#38bdf8' },
  { icon: Shield,   label: 'Burnout Prevention',    desc: 'Detects overload, enforces rest days, shows risk levels. Balance in all things.',           accent: '#2dd4bf' },
  { icon: Clock,    label: 'Spaced Repetition',     desc: 'Revision auto-scheduled 1, 3, 7, 14 days before every exam. Ancient wisdom, modern AI.',    accent: '#fb923c' },
  { icon: Award,    label: 'Gamification',          desc: 'XP, levels, streaks & badges keep the flame of motivation eternal.',                       accent: '#f472b6' },
  { icon: Sparkles, label: 'Focus Mode AI',         desc: 'Pomodoro, Deep Focus, or Light Review — AI assigns the best mode for your state.',          accent: '#c9a227' },
];

const STEPS = [
  { n: '01', t: 'Set Up Your Scroll', d: 'Add subjects, exam dates, difficulty, daily hours, and fixed commitments. Your profile becomes your discipline charter.' },
  { n: '02', t: 'AI Generates the Path', d: 'The intelligence computes priority scores and builds an optimised timetable in seconds. Ancient strategy, modern speed.' },
  { n: '03', t: 'Study with Intention', d: 'Each task is assigned a mode — Deep Focus, Pomodoro, or Light Review — based on difficulty and your current energy.' },
  { n: '04', t: 'Track, Adapt & Ascend', d: 'Missed sessions auto-reschedule. Earn XP, maintain streaks, and unlock badges as you rise through the levels.' },
];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ students: 0, plans: 0, xp: 0 });
  const statsRef = useRef(null);
  useScrollReveal();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 2000;
        const targets = { students: 12400, plans: 87000, xp: 4200000 };
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts({
            students: Math.floor(ease * targets.students),
            plans: Math.floor(ease * targets.plans),
            xp: Math.floor(ease * targets.xp),
          });
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(2,5,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,162,39,0.12)',
      }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mandala logo */}
            <div style={{ width: 36, height: 36, border: '1.5px solid rgba(201,162,39,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(201,162,39,0.2)' }}>
              <div style={{ width: 18, height: 18, border: '1px solid rgba(201,162,39,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 5, height: 5, background: '#c9a227', borderRadius: '50%' }} />
              </div>
            </div>
            <div>
              <span style={{ fontFamily: '"Cinzel", serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.12em' }} className="gold-text-static">AANUSHASAN</span>
            </div>
          </div>
          <button onClick={() => navigate('/onboarding')} className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.75rem' }}>
            Begin Your Journey <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '96px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Radial glow backgrounds */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(201,162,39,0.08)',
          border: '1px solid rgba(201,162,39,0.25)',
          borderRadius: 99,
          padding: '8px 18px',
          marginBottom: 32,
          animation: 'fadeIn 0.8s ease-out',
        }}>
          <Sparkles style={{ width: 14, height: 14, color: '#c9a227' }} />
          <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--gold-bright)', textTransform: 'uppercase' }}>AI-Driven Adaptive Study Planning</span>
        </div>

        <div style={{ animation: 'fadeUp 0.8s ease-out 0.2s both' }}>
          <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.9rem', letterSpacing: '0.3em', color: 'rgba(201,162,39,0.5)', marginBottom: 16 }}>
            परम्परा · प्रतिष्ठा · अनुशासन
          </div>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '0.05em' }}>
            <span style={{ color: 'var(--ivory)' }}>Ancient Discipline.</span>
            <br />
            <span className="gold-text">Modern Intelligence.</span>
          </h1>
          <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.25rem', lineHeight: 1.7, color: 'rgba(245,240,232,0.6)', maxWidth: 560, margin: '0 auto 40px' }}>
            Your personal academic advisor that builds adaptive schedules, prevents burnout,
            and keeps motivation eternal — powered by AI, guided by the principles of ancient discipline.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', animation: 'fadeUp 0.8s ease-out 0.4s both' }}>
          <button onClick={() => navigate('/onboarding')} className="btn-gold" style={{ padding: '14px 36px', fontSize: '0.875rem' }}>
            Build My Study Plan <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
          <button onClick={() => navigate('/onboarding')} className="btn-outline-gold" style={{ padding: '14px 28px', fontSize: '0.875rem' }}>
            See How It Works
          </button>
        </div>

        {/* Feature pills */}
        <div style={{ marginTop: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, animation: 'fadeUp 0.8s ease-out 0.6s both' }}>
          {['🧠 AI Priority Engine', '📅 14-Day Smart Plan', '🔥 Streak Tracking', '📊 Real Analytics', '🛡️ Burnout Guard'].map(t => (
            <span key={t} style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,162,39,0.2)',
              borderRadius: 99,
              fontFamily: '"JetBrains Mono"',
              fontSize: '0.7rem',
              color: 'var(--muted-gold)',
              letterSpacing: '0.05em',
            }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          background: 'rgba(7,12,30,0.8)',
          border: '1px solid rgba(201,162,39,0.2)',
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}>
          {[
            { val: counts.students.toLocaleString(), label: 'Students Disciplined', suffix: '+' },
            { val: counts.plans.toLocaleString(), label: 'Plans Generated', suffix: '+' },
            { val: (counts.xp / 1000000).toFixed(1) + 'M', label: 'XP Earned', suffix: '' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '32px 24px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(201,162,39,0.1)' : 'none',
            }}>
              <div style={{ fontFamily: '"JetBrains Mono"', fontSize: '2rem', fontWeight: 600, marginBottom: 8 }} className="gold-text">
                {s.val}{s.suffix}
              </div>
              <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.9rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }} className="reveal" style2={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.7s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 56, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.7s ease' }} className="reveal">
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: 12, letterSpacing: '0.06em' }}>
              <span style={{ color: 'var(--ivory)' }}>Everything to </span>
              <span className="gold-text-static">Ace Your Exams</span>
            </h2>
            <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.1rem', color: 'rgba(245,240,232,0.45)', letterSpacing: '0.05em' }}>Powered by adaptive AI that understands your pace</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, label, desc, accent }, i) => (
            <div key={label} className="glass-card reveal" style={{
              padding: '28px',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: `all 0.7s ease ${i * 0.1}s`,
              cursor: 'default',
            }}>
              <div style={{
                width: 48, height: 48,
                background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
                border: `1px solid ${accent}44`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                boxShadow: `0 0 16px ${accent}22`,
                transition: 'transform 0.3s ease',
              }}>
                <Icon style={{ width: 20, height: 20, color: accent }} />
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--ivory)', marginBottom: 10 }}>{label}</h3>
              <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', lineHeight: 1.6, color: 'rgba(245,240,232,0.5)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        <h2 className="reveal" style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: 56, letterSpacing: '0.06em', color: 'var(--ivory)', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.7s ease' }}>
          The Path Forward
        </h2>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 23, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, rgba(201,162,39,0.4), transparent)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} className="reveal" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', opacity: 0, transform: 'translateY(20px)', transition: `all 0.7s ease ${i * 0.15}s` }}>
                <div style={{
                  width: 48, height: 48,
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(160,124,21,0.4), rgba(201,162,39,0.2))',
                  border: '1px solid rgba(201,162,39,0.4)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"JetBrains Mono"', fontWeight: 600, fontSize: '0.75rem',
                  color: '#c9a227',
                  zIndex: 1,
                  boxShadow: '0 0 16px rgba(201,162,39,0.15)',
                }}>
                  {step.n}
                </div>
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ivory)', marginBottom: 8 }}>{step.t}</h3>
                  <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', lineHeight: 1.65, color: 'rgba(245,240,232,0.5)' }}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div className="reveal glass-card" style={{
          padding: '48px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(56,189,248,0.04))',
          opacity: 0, transform: 'translateY(20px)', transition: 'all 0.7s ease',
        }}>
          <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.85rem', letterSpacing: '0.3em', color: 'rgba(201,162,39,0.6)', marginBottom: 16 }}>
            अनुशासनमूलं सफलता
          </div>
          <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ivory)', marginBottom: 14 }}>
            Ready to Transform How You Study?
          </h2>
          <p style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.1rem', color: 'rgba(245,240,232,0.55)', marginBottom: 36 }}>
            Set up in under 3 minutes. Begin your ascent today.
          </p>
          <button onClick={() => navigate('/onboarding')} className="btn-gold" style={{ padding: '16px 44px', fontSize: '0.875rem' }}>
            Begin Your Journey <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(201,162,39,0.1)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(168,144,96,0.5)' }}>
          AANUSHASAN · परम्परा · प्रतिष्ठा · अनुशासन · Built for students who seek excellence
        </div>
      </footer>
    </div>
  );
}

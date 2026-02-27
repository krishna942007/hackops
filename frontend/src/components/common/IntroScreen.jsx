import React, { useEffect, useRef, useState } from 'react';

const TITLE = 'AANUSHASAN';

export default function IntroScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  // phase 0: initial, 1: particles active, 2: letters reveal, 3: tagline, 4: exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3800),
      setTimeout(() => onComplete(), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      da: (Math.random() - 0.5) * 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha > 0.7 || p.alpha < 0.05) p.da *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grd.addColorStop(0, `rgba(201,162,39,${p.alpha})`);
        grd.addColorStop(1, 'rgba(201,162,39,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#020510',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: phase === 4 ? 0 : 1,
        transform: phase === 4 ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: phase === 4 ? 'none' : 'all',
      }}
    >
      {/* Canvas particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Mandala rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[320, 480, 640, 800].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size,
            border: '1px solid rgba(201,162,39,0.12)',
            borderRadius: '50%',
            animation: `rotateSlow ${15 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 1s ease',
            transitionDelay: `${i * 0.2}s`,
          }} />
        ))}
        {/* Inner ornamental dots */}
        {[360, 520].map((size, i) => (
          <div key={`d-${size}`} style={{
            position: 'absolute',
            width: size, height: size,
            border: '1px dashed rgba(201,162,39,0.08)',
            borderRadius: '50%',
            animation: `rotateSlow ${25 + i * 8}s linear infinite ${i % 2 !== 0 ? '' : 'reverse'}`,
            opacity: phase >= 1 ? 0.6 : 0,
            transition: 'opacity 1s ease',
            transitionDelay: `${0.3 + i * 0.15}s`,
          }} />
        ))}
      </div>

      {/* Corner ornaments */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <svg key={i} width="48" height="48" style={{
          position: 'absolute',
          ...Object.fromEntries(pos.split(' ').map(p => {
            const [dir, val] = p.split('-');
            return [dir, `${val === '6' ? 24 : parseInt(val)}px`];
          })),
          opacity: phase >= 1 ? 0.4 : 0,
          transition: 'opacity 1.2s ease',
          transitionDelay: `${0.5 + i * 0.1}s`,
          transform: i === 1 ? 'scaleX(-1)' : i === 2 ? 'scaleY(-1)' : i === 3 ? 'scale(-1,-1)' : 'none',
        }} viewBox="0 0 48 48" fill="none">
          <path d="M2 2 L18 2 L2 18" stroke="rgba(201,162,39,0.6)" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="2" cy="2" r="2" fill="rgba(201,162,39,0.5)"/>
          <path d="M24 2 L26 2" stroke="rgba(201,162,39,0.3)" strokeWidth="0.5"/>
        </svg>
      ))}

      {/* Sanskrit line */}
      <div style={{
        fontFamily: '"Crimson Pro", serif',
        fontSize: '0.9rem',
        letterSpacing: '0.3em',
        color: 'rgba(201,162,39,0.6)',
        marginBottom: '32px',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.8s ease',
      }}>
        परम्परा · प्रतिष्ठा · अनुशासन
      </div>

      {/* AANUSHASAN title - letter by letter */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {TITLE.split('').map((letter, i) => (
          <span key={i} style={{
            fontFamily: '"Cinzel", serif',
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #c9a227 0%, #f5d76e 50%, #c9a227 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: phase >= 2 ? `shimmerGold 3s ease-in-out infinite, fadeUp 0.5s ease-out ${i * 0.08}s both` : 'none',
            opacity: phase >= 2 ? undefined : 0,
          }}>
            {letter}
          </span>
        ))}
      </div>

      {/* Animated underline */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #c9a227, #f5d76e, #c9a227, transparent)',
        marginBottom: '24px',
        animation: phase >= 2 ? 'expandLine 0.8s ease-out 0.9s both' : 'none',
        width: phase >= 2 ? undefined : '0%',
        minWidth: phase >= 2 ? undefined : 0,
        maxWidth: '400px',
        alignSelf: 'center',
      }}
        className={phase >= 2 ? 'animate-expand-line' : ''}
        style2={{ width: phase >= 2 ? '400px' : '0px', transition: 'width 0.8s ease 0.9s', height: '2px', background: 'linear-gradient(90deg, transparent, #c9a227, #f5d76e, #c9a227, transparent)', marginBottom: '24px' }}
      />
      {/* Separate underline element */}
      <div style={{
        width: phase >= 2 ? '400px' : '0px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #c9a227, #f5d76e, #c9a227, transparent)',
        marginBottom: '24px',
        transition: 'width 0.8s ease 0.9s',
        boxShadow: '0 0 12px rgba(201,162,39,0.5)',
      }} />

      {/* Tagline */}
      <div style={{
        fontFamily: '"Crimson Pro", serif',
        fontSize: '1.15rem',
        letterSpacing: '0.25em',
        color: 'rgba(245,240,232,0.7)',
        textTransform: 'uppercase',
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.8s ease',
        marginBottom: '48px',
      }}>
        Discipline Powered by Intelligence
      </div>

      {/* Progress bar */}
      <div style={{
        width: '200px',
        height: '2px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '99px',
        overflow: 'hidden',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #a07c15, #f5d76e)',
          borderRadius: '99px',
          width: phase === 4 ? '100%' : phase === 3 ? '85%' : phase === 2 ? '60%' : phase === 1 ? '30%' : '0%',
          transition: 'width 0.8s ease',
          boxShadow: '0 0 8px rgba(201,162,39,0.5)',
        }} />
      </div>
    </div>
  );
}

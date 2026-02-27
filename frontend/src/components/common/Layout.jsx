import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Calendar, BookOpen, BarChart3, Trophy, LogOut, Menu, X, Flame, Star, Brain, Sparkles } from 'lucide-react';
import AIChatWidget from './AIChatWidget';

const NAV = [
  { to:'/dashboard',    icon:LayoutDashboard, label:'Dashboard' },
  { to:'/timetable',    icon:Calendar,        label:'Timetable' },
  { to:'/planner',      icon:BookOpen,        label:'Study Planner' },
  { to:'/analytics',    icon:BarChart3,       label:'Analytics' },
  { to:'/achievements', icon:Trophy,          label:'Achievements' },
];

const AI_NAV = [
  { to:'/ai-analysis',  icon:Brain,    label:'AI Analysis' },
  { to:'/ai-strategy',  icon:Sparkles, label:'AI Strategy' },
];

export default function Layout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const g   = user?.gamification || {};
  const xp  = g.xp    || 0;
  const lvl = g.level  || 1;
  const str = g.streak || 0;
  const pct = ((xp % 500) / 500) * 100;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col scroll-thin transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}
        style={{ background: 'rgba(4,7,26,0.97)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(201,162,39,0.15)' }}>

        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(201,162,39,0.1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width:36, height:36, border:'1.5px solid rgba(201,162,39,0.6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 12px rgba(201,162,39,0.2)' }}>
                <div style={{ width:20, height:20, border:'1px solid rgba(201,162,39,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:6, height:6, background:'#c9a227', borderRadius:'50%' }} />
                </div>
              </div>
              <div>
                <p style={{ fontFamily:'"Cinzel",serif', fontWeight:700, fontSize:'1rem', letterSpacing:'0.1em', lineHeight:1 }} className="gold-text-static">AANUSHASAN</p>
                <p style={{ fontFamily:'"Crimson Pro",serif', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(168,144,96,0.7)', marginTop:3, textTransform:'uppercase' }}>Discipline · Intelligence</p>
              </div>
            </div>
            <button className="lg:hidden p-1" onClick={() => setOpen(false)} style={{ color:'var(--muted-gold)' }}><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4">
          <div style={{ background:'linear-gradient(135deg,rgba(201,162,39,0.08),rgba(245,215,110,0.04))', border:'1px solid rgba(201,162,39,0.2)', borderRadius:12, padding:14 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width:40, height:40, background:'linear-gradient(135deg,#a07c15,#c9a227)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Cinzel",serif', fontWeight:700, color:'#020510', fontSize:'1.1rem' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily:'"Cinzel",serif', fontWeight:600, fontSize:'0.8rem', letterSpacing:'0.05em', color:'var(--ivory)' }} className="truncate">{user?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3" style={{ color:'#c9a227', fill:'#c9a227' }} />
                  <span style={{ fontFamily:'"JetBrains Mono"', fontSize:'0.65rem', color:'var(--muted-gold)' }}>Level {lvl}</span>
                </div>
              </div>
              {str > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(251,146,60,0.12)', border:'1px solid rgba(251,146,60,0.25)', borderRadius:8, padding:'4px 8px' }}>
                  <Flame className="w-3 h-3" style={{ color:'#fb923c' }} />
                  <span style={{ fontFamily:'"JetBrains Mono"', fontSize:'0.65rem', fontWeight:600, color:'#fdba74' }}>{str}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1" style={{ fontFamily:'"JetBrains Mono"', fontSize:'0.6rem', color:'var(--muted-gold)' }}>
                <span>{xp} XP</span><span>{lvl*500} XP</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto scroll-thin py-2" style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Icon className="w-4 h-4 flex-shrink-0" /><span className="flex-1">{label}</span>
            </NavLink>
          ))}

          {/* AI Section divider */}
          <div style={{ margin:'12px 4px 8px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1, height:1, background:'rgba(201,162,39,0.15)' }} />
            <span style={{ fontFamily:'"JetBrains Mono"', fontSize:'0.55rem', letterSpacing:'0.15em', color:'rgba(201,162,39,0.4)' }}>AI POWERED</span>
            <div style={{ flex:1, height:1, background:'rgba(201,162,39,0.15)' }} />
          </div>

          {AI_NAV.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color:'#c9a227' }} />
              <span className="flex-1">{label}</span>
              <span style={{ fontFamily:'"JetBrains Mono"', fontSize:'0.5rem', padding:'2px 6px', background:'rgba(201,162,39,0.12)', border:'1px solid rgba(201,162,39,0.25)', borderRadius:99, color:'#c9a227', letterSpacing:'0.1em' }}>AI</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop:'1px solid rgba(201,162,39,0.1)' }}>
          <button onClick={() => { logout(); navigate('/'); }} className="w-full btn-danger flex items-center gap-3 px-4 py-3 rounded-xl">
            <LogOut className="w-4 h-4" />
            <span style={{ fontFamily:'"Cinzel",serif', fontSize:'0.7rem', letterSpacing:'0.08em' }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3" style={{ borderBottom:'1px solid rgba(201,162,39,0.12)', background:'rgba(4,7,26,0.9)', backdropFilter:'blur(12px)' }}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl" style={{ color:'var(--muted-gold)', border:'1px solid rgba(201,162,39,0.2)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <span style={{ fontFamily:'"Cinzel",serif', fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em' }} className="gold-text-static">AANUSHASAN</span>
        </header>
        <main className="flex-1 overflow-y-auto scroll-thin">
          <div className="max-w-7xl mx-auto p-6"><Outlet /></div>
        </main>
      </div>

      {/* Floating AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}

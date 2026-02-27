import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const STYLES = {
  success: { icon: CheckCircle2, accent: '#2dd4bf', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.25)' },
  error:   { icon: AlertCircle,  accent: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
  info:    { icon: Info,         accent: '#c9a227', bg: 'rgba(201,162,39,0.08)',  border: 'rgba(201,162,39,0.25)' },
};

export default function Toast({ message, type = 'success' }) {
  const s = STYLES[type] || STYLES.success;
  const Icon = s.icon;
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px',
      background: 'rgba(7,12,30,0.95)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${s.border}`,
      borderLeft: `3px solid ${s.accent}`,
      borderRadius: 14,
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${s.accent}22`,
      maxWidth: 360,
      animation: 'fadeUp 0.4s ease-out',
    }}>
      <Icon style={{ width: 18, height: 18, color: s.accent, flexShrink: 0 }} />
      <span style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1rem', color: 'var(--ivory)' }}>{message}</span>
    </div>
  );
}

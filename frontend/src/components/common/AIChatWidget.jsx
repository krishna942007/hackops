import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiAPI } from '../../utils/aiApi';

export default function AIChatWidget() {
  const { user } = useApp();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Namaste, ${user?.name?.split(' ')[0] || 'Scholar'}! 🙏\nI am your AANUSHASAN AI guide. Ask me anything about your studies, strategy, or motivation.` }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const { data } = await aiAPI.chat(userMsg, user?._id);
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'My apologies, I encountered an issue. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #a07c15, #c9a227, #f5d76e)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(201,162,39,0.5)',
        animation: 'pulseGold 2s ease-in-out infinite',
        transition: 'transform 0.2s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open
          ? <X style={{ width: 22, height: 22, color: '#020510' }} />
          : <Sparkles style={{ width: 22, height: 22, color: '#020510' }} />
        }
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 999,
          width: 360, height: 500,
          background: 'rgba(4,7,26,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(201,162,39,0.3)',
          borderRadius: 20,
          boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 40px rgba(201,162,39,0.15)',
          display: 'flex', flexDirection: 'column',
          animation: 'scaleIn 0.3s ease-out',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(201,162,39,0.15)',
            background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(245,215,110,0.04))',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(201,162,39,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(201,162,39,0.2)' }}>
              <Sparkles style={{ width: 16, height: 16, color: '#c9a227' }} />
            </div>
            <div>
              <div style={{ fontFamily: '"Cinzel", serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f5d76e' }}>AANUSHASAN AI</div>
              <div style={{ fontFamily: '"Crimson Pro", serif', fontSize: '0.75rem', color: 'rgba(201,162,39,0.5)' }}>Your Discipline Guide</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 8px rgba(45,212,191,0.6)' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }} className="scroll-thin">
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #a07c15, #c9a227)'
                    : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(201,162,39,0.15)',
                  fontFamily: '"Crimson Pro", serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  color: msg.role === 'user' ? '#020510' : 'rgba(245,240,232,0.85)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.15)', display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a227', animation: `pulseGold 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(201,162,39,0.15)', display: 'flex', gap: 10 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your AI guide..."
              rows={1}
              style={{
                flex: 1, resize: 'none',
                background: 'rgba(13,21,48,0.8)',
                border: '1px solid rgba(201,162,39,0.2)',
                borderRadius: 12,
                padding: '10px 14px',
                fontFamily: '"Crimson Pro", serif',
                fontSize: '0.95rem',
                color: 'var(--ivory)',
                outline: 'none',
              }}
            />
            <button onClick={send} disabled={!input.trim() || loading} style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end',
              background: input.trim() ? 'linear-gradient(135deg, #a07c15, #c9a227)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,162,39,0.3)',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              {loading
                ? <Loader2 style={{ width: 16, height: 16, color: '#c9a227' }} className="animate-spin" />
                : <Send style={{ width: 15, height: 15, color: input.trim() ? '#020510' : 'rgba(201,162,39,0.3)' }} />
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
}

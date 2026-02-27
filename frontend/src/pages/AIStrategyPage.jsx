import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { aiAPI } from "../utils/aiApi";
import {
  Sparkles,
  Loader2,
  Clock,
  BookOpen,
  Target,
  Calendar
} from "lucide-react";

export default function AIStrategyPage() {

  const { user } = useApp();

  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weakAreas, setWeakAreas] = useState("");

  /* ===============================
     GENERATE STRATEGY
  =============================== */

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await aiAPI.strategy({
        userId: user._id,
        weakAreas
      });

      setStrategy(data);

    } catch (err) {
      console.error(err);
      setError("Strategy generation failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     URGENCY COLORS
  =============================== */

  const URGENCY_STYLE = {
    high: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
    medium: { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)" },
    low: { color: "#2dd4bf", bg: "rgba(45,212,191,0.1)", border: "rgba(45,212,191,0.3)" }
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="gold-text-static">AI Study Strategy</h1>

        <button onClick={generate} disabled={loading} className="btn-gold">
          {loading
            ? <Loader2 className="animate-spin" />
            : <Sparkles />}
          Generate Strategy
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* EMPTY STATE */}
      {!strategy && !loading && (
        <div className="glass-card" style={{ textAlign: "center", padding: 40 }}>
          <input
            className="input"
            placeholder="Weak areas (optional)"
            value={weakAreas}
            onChange={(e) => setWeakAreas(e.target.value)}
          />

          <button onClick={generate} className="btn-gold">
            Generate My Strategy
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
          <Loader2 className="animate-spin" size={40} />
          <p>AI crafting your discipline path...</p>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {strategy && !loading && (

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* OVERALL STRATEGY */}
          <div className="glass-card">
            <h3>Your Overall Strategy</h3>
            <p>{strategy.overallStrategy}</p>
          </div>

          {/* DAILY ROUTINE */}
          <div className="glass-card">
            <h3><Clock size={16}/> Daily Routine</h3>

            {strategy.dailyRoutine?.map((item, i) => (
              <div key={i}>
                <b>{item.time}</b> — {item.activity}
                ({item.duration})
              </div>
            ))}
          </div>

          {/* SUBJECT PRIORITY */}
          <div className="glass-card">
            <h3><BookOpen size={16}/> Subject Priority</h3>

            {strategy.subjectPriority?.map((s, i) => (
              <div key={i}>
                <b>{s.subject}</b> —
                {s.hoursPerWeek} hrs/week
                ({s.technique})
              </div>
            ))}
          </div>

          {/* WEEKLY MILESTONES */}
          <div className="glass-card">
            <h3><Target size={16}/> Weekly Milestones</h3>

            {strategy.weeklyMilestones?.map((m, i) => (
              <p key={i}>✅ {m}</p>
            ))}
          </div>

          {/* EXAM COUNTDOWN */}
          <div className="glass-card">
            <h3><Calendar size={16}/> Exam Countdown</h3>

            {strategy.examCountdown?.map((e, i) => {
              const s = URGENCY_STYLE[e.urgency] || URGENCY_STYLE.low;

              return (
                <div key={i}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    padding: 10,
                    marginBottom: 8
                  }}>
                  {e.subject} — {e.daysLeft} days
                </div>
              );
            })}
          </div>

          {/* REGENERATE */}
          <div style={{ textAlign: "center" }}>
            <button onClick={generate} className="btn-outline-gold">
              <Sparkles size={14}/> Regenerate Strategy
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
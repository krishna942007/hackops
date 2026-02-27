import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

const FOCUS_EMOJI = { 'deep-focus':'🎯','pomodoro':'🍅','light-review':'📖','break':'☕' };
const TYPE_EMOJI  = { study:'📚', revision:'🔄', practice:'✏️', break:'☕' };

export default function TimetablePage() {
  const { timetable, generateTimetable, completeTask, subjects, loading } = useApp();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);

  const plan = timetable?.plan || [];
  const weekDays = plan.slice(weekOffset * 7, weekOffset * 7 + 7);
  const todayStr = new Date().toDateString();

  const colorMap = {};
  subjects.forEach(s => { colorMap[s.name] = s.color; });

  const handleComplete = async (day, taskIndex) => {
    if (!timetable?._id) return;
    const globalDayIndex = plan.findIndex(p => new Date(p.date).toDateString() === new Date(day.date).toDateString());
    if (globalDayIndex === -1) return;
    await completeTask(timetable._id, globalDayIndex, taskIndex);
  };

  if (!timetable) return (
    <div className="page flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-20 h-20 bg-soft-lavender rounded-3xl flex items-center justify-center animate-float text-4xl">📅</div>
      <h2 className="font-display text-2xl font-bold text-gray-700">No timetable yet</h2>
      <p className="text-gray-400">Generate a plan to see your schedule</p>
      <button onClick={generateTimetable} disabled={loading} className="btn-primary">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : 'Generate Timetable'}
      </button>
    </div>
  );

  const selectedDay = selectedDayIdx !== null ? weekDays[selectedDayIdx] : null;

  return (
    <div className="page space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Smart Timetable</h1>
          <p className="text-gray-400 text-sm mt-1">Click a day to see detailed tasks · Click a task to mark complete</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-2xl border border-indigo-50 p-1">
            <button onClick={() => { setWeekOffset(o => Math.max(0,o-1)); setSelectedDayIdx(null); }}
              disabled={weekOffset===0} className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-medium text-gray-600">Week {weekOffset+1}</span>
            <button onClick={() => { setWeekOffset(o => Math.min(1,o+1)); setSelectedDayIdx(null); }}
              disabled={weekOffset>=1} className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button onClick={generateTimetable} disabled={loading} className="btn-secondary text-sm gap-2">
            <RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`} /> Regenerate
          </button>
        </div>
      </div>

      {/* Allocation bar */}
      {timetable.subjectAllocation?.length > 0 && (
        <div className="card-sm">
          <p className="text-sm font-semibold text-gray-600 mb-3">Subject Time Allocation (14 days)</p>
          <div className="flex gap-4 flex-wrap mb-3">
            {timetable.subjectAllocation.map(sa => (
              <div key={sa.subjectName} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor:sa.color}} />
                <span className="text-sm text-gray-600">{sa.subjectName}: <strong>{sa.allocatedHours}h</strong></span>
              </div>
            ))}
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
            {(() => {
              const total = timetable.subjectAllocation.reduce((s,x)=>s+x.allocatedHours,0);
              return timetable.subjectAllocation.map(sa => (
                <div key={sa.subjectName} style={{width:`${(sa.allocatedHours/total)*100}%`, backgroundColor:sa.color}} />
              ));
            })()}
          </div>
        </div>
      )}

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const isToday   = new Date(day.date).toDateString() === todayStr;
          const isSelected = selectedDayIdx === i;
          const done  = day.tasks?.filter(t=>t.completed).length || 0;
          const total = day.tasks?.length || 0;
          const pct   = total > 0 ? Math.round(done/total*100) : 0;

          return (
            <div key={i} onClick={() => setSelectedDayIdx(isSelected ? null : i)}
              className={`cursor-pointer rounded-2xl p-3 border transition-all duration-200 hover:shadow-card ${
                isSelected ? 'border-primary-400 bg-soft-lavender ring-2 ring-primary-300 ring-offset-1' :
                isToday    ? 'border-primary-300 bg-white ring-2 ring-primary-200' :
                day.isRestDay ? 'border-teal-200 bg-soft-mint' :
                'border-indigo-50 bg-white hover:border-primary-200'
              }`}>
              <div className="text-center mb-2">
                <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">{new Date(day.date).toLocaleDateString('en-US',{weekday:'short'})}</p>
                <p className={`text-xl font-bold mt-0.5 ${isToday?'text-primary-600':'text-gray-700'}`}>{new Date(day.date).getDate()}</p>
              </div>
              {day.isRestDay
                ? <div className="text-center"><div className="text-2xl">😌</div><p className="text-xs text-gray-400 mt-1">Rest</p></div>
                : <div className="space-y-1.5">
                    <span className={`text-xs ${day.burnoutRisk==='low'?'text-teal-600':day.burnoutRisk==='medium'?'text-orange-500':'text-red-500'} font-medium`}>
                      {day.burnoutRisk==='low'?'😊':day.burnoutRisk==='medium'?'⚠️':'🔥'} {day.burnoutRisk}
                    </span>
                    <p className="text-xs text-gray-400">{total} tasks</p>
                    <div className="progress-bar h-1.5">
                      <div className="progress-fill bg-gradient-to-r from-primary-400 to-accent-teal" style={{width:`${pct}%`}} />
                    </div>
                    <p className="text-xs text-center font-medium text-gray-500">{pct}%</p>
                  </div>
              }
            </div>
          );
        })}
      </div>

      {/* Day detail */}
      {selectedDay && (
        <div className="card animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900">
                {new Date(selectedDay.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
              </h2>
              <p className="text-sm text-gray-400">{selectedDay.totalHours?.toFixed(1)}h planned · {selectedDay.tasks?.length} tasks</p>
            </div>
            <span className={`badge ${selectedDay.burnoutRisk==='low'?'badge-teal':selectedDay.burnoutRisk==='medium'?'badge-orange':'badge-red'}`}>
              {selectedDay.burnoutRisk==='low'?'😊 Low':selectedDay.burnoutRisk==='medium'?'⚠️ Medium':'🔥 High'} burnout risk
            </span>
          </div>
          {selectedDay.isRestDay
            ? <div className="flex flex-col items-center py-10 bg-soft-mint rounded-2xl"><div className="text-5xl mb-3">🌿</div><p className="font-semibold text-gray-600">Rest & Recovery Day</p><p className="text-gray-400 text-sm mt-1">Light review only — be kind to yourself.</p></div>
            : <div className="space-y-3">
                {selectedDay.tasks?.map((task, i) => {
                  const done = task.completed;
                  return (
                    <div key={i} onClick={() => handleComplete(selectedDay, i)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        done ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-indigo-50 hover:border-primary-200 hover:shadow-card'
                      }`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${done?'border-teal-400 bg-teal-400':'border-gray-200 hover:border-primary-400'}`}>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{backgroundColor: task.subjectColor || colorMap[task.subject] || '#8b5cf6'}} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${done?'line-through text-gray-400':'text-gray-800'}`}>{task.subject}</p>
                        <p className="text-xs text-gray-400 truncate">{task.chapter}</p>
                        {task.notes && <p className="text-xs text-blue-500 mt-0.5">📌 {task.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="badge-purple text-xs">{FOCUS_EMOJI[task.focusMode]} {task.focusMode?.replace('-',' ')}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-600">{task.startTime}–{task.endTime}</p>
                          <p className="text-xs text-gray-400">{task.duration}min</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}
    </div>
  );
}

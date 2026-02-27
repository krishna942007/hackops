import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, Clock, Zap, Lightbulb } from 'lucide-react';

const PASTEL = ['#8b5cf6','#38bdf8','#2dd4bf','#fb923c','#f472b6','#34d399','#60a5fa','#f59e0b'];

function buildChartData(timetable) {
  if (!timetable?.plan) return [];
  return timetable.plan.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}),
    planned: day.totalHours || 0,
    completed: day.isRestDay ? 0 : +(day.tasks?.filter(t=>t.completed).length / Math.max(day.tasks?.length,1) * (day.totalHours||0)).toFixed(1),
    focus: day.isRestDay ? 0 : Math.round(50 + (day.tasks?.filter(t=>t.completed).length / Math.max(day.tasks?.length,1)) * 50),
    risk: day.burnoutRisk,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl p-3 shadow-xl border border-indigo-50 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{color:p.color}}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
};

export default function AnalyticsPage() {
  const { analytics, timetable, subjects, user } = useApp();
  const [tab, setTab] = useState('overview');

  const chartData = buildChartData(timetable);
  const xp     = user?.gamification?.xp     || 0;
  const streak = user?.gamification?.streak || 0;

  const summary = analytics?.summary || {
    totalPlanned: timetable?.plan?.reduce((s,d)=>s+(d.totalHours||0),0)||0,
    totalCompleted: 0, completionRate: 0, consistencyScore: 0, studyDays: 0
  };

  const subjectBreakdown = analytics?.subjectBreakdown?.length
    ? analytics.subjectBreakdown
    : timetable?.subjectAllocation?.map((sa,i) => ({
        name: sa.subjectName, minutes: Math.round(sa.allocatedHours*60), color: sa.color || PASTEL[i]
      })) || [];

  const insights = analytics?.insights || [
    '📊 Complete tasks daily to unlock AI-powered insights',
    '⏰ Your timetable is optimised for your preferred study time',
    '🎯 Spaced repetition is auto-scheduled before every exam',
  ];

  const burnoutCounts = { low:0, medium:0, high:0 };
  timetable?.plan?.forEach(d => { if(d.burnoutRisk) burnoutCounts[d.burnoutRisk]++; });
  const burnoutData = [
    { name:'Low',    value:burnoutCounts.low,    fill:'#2dd4bf' },
    { name:'Medium', value:burnoutCounts.medium, fill:'#fb923c' },
    { name:'High',   value:burnoutCounts.high,   fill:'#f87171' },
  ];

  return (
    <div className="page space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Track progress and optimise your study patterns</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {['overview','subjects','burnout','insights'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab===t?'bg-white text-primary-600 shadow':'text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {tab==='overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon:Target,    label:'Completion Rate',  value:`${summary.completionRate}%`,    sub:'planned vs done',    c:'bg-soft-lavender text-primary-500' },
              { icon:TrendingUp,label:'Consistency',      value:`${summary.consistencyScore}%`,  sub:'active days ratio',  c:'bg-soft-mint text-teal-500' },
              { icon:Clock,     label:'Total Planned',    value:`${Math.round(summary.totalPlanned)}h`, sub:'14-day window', c:'bg-soft-sky text-blue-500' },
              { icon:Zap,       label:'Streak',           value:`${streak}d`,                    sub:'consecutive days',   c:'bg-soft-peach text-orange-500' },
            ].map(s=>(
              <div key={s.label} className="card-sm hover:shadow-card-hover transition-all">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${s.c}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="font-display text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-5">Planned vs Completed Hours</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gPlanned" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gDone"    x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25}/><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="planned"   name="Planned (h)"   stroke="#8b5cf6" fill="url(#gPlanned)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="completed" name="Completed (h)"  stroke="#2dd4bf" fill="url(#gDone)"    strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-5">Daily Focus Score</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize:10}} />
                <YAxis domain={[0,100]} tick={{fontSize:10}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="focus" name="Focus Score" radius={[4,4,0,0]}>
                  {chartData.map((_,i)=><Cell key={i} fill={`hsl(${200+i*10},70%,70%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subjects */}
      {tab==='subjects' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-5">Time Distribution</h3>
            {subjectBreakdown.length===0
              ? <p className="text-gray-400 text-sm">Generate a timetable to see breakdown.</p>
              : <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={subjectBreakdown} dataKey="minutes" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={40} paddingAngle={3}
                      label={({name,percent})=>`${name} ${Math.round(percent*100)}%`} labelLine={false}>
                      {subjectBreakdown.map((e,i)=><Cell key={i} fill={e.color||PASTEL[i%PASTEL.length]} />)}
                    </Pie>
                    <Tooltip formatter={v=>[`${Math.floor(v/60)}h ${v%60}m`,'Time']} contentStyle={{borderRadius:'12px',border:'none'}} />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-5">Subject Progress</h3>
            <div className="space-y-5">
              {subjects.map(s=>{
                const pct = s.chapters>0 ? (s.completedChapters/s.chapters)*100 : 0;
                const dl  = s.examDate ? Math.ceil((new Date(s.examDate)-Date.now())/86400000) : null;
                return (
                  <div key={s._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:s.color}} />
                        <span className="text-sm font-medium text-gray-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {dl && <span className={dl<=7?'text-red-500 font-semibold':''}>{dl}d left</span>}
                        <span>{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width:`${pct}%`,backgroundColor:s.color}} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.completedChapters}/{s.chapters} chapters</p>
                  </div>
                );
              })}
              {subjects.length===0 && <p className="text-gray-400 text-sm">Add subjects in the Planner.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Burnout */}
      {tab==='burnout' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-5">14-Day Burnout Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={burnoutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {burnoutData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:'12px',border:'none'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Risk Indicators</h3>
            <div className="space-y-4">
              {[
                { label:'Daily Study Load', val:`${user?.profile?.dailyHours||4}h/day`, risk: (user?.profile?.dailyHours||4)>8?'high':(user?.profile?.dailyHours||4)>6?'medium':'low' },
                { label:'Rest Days Planned', val:`${burnoutCounts.low} easy days`, risk: burnoutCounts.low>=2?'low':'medium' },
                { label:'High-Risk Days',    val:`${burnoutCounts.high} flagged`,  risk: burnoutCounts.high>2?'high':'low' },
              ].map(item=>(
                <div key={item.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.risk==='high'?'bg-red-400':item.risk==='medium'?'bg-orange-400':'bg-teal-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.val}</p>
                  </div>
                  <span className={`badge text-xs ${item.risk==='high'?'badge-red':item.risk==='medium'?'badge-orange':'badge-teal'}`}>{item.risk}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-soft-mint rounded-2xl">
              <p className="text-sm font-semibold text-teal-700 mb-1">💡 Burnout Prevention Tips</p>
              <ul className="text-xs text-teal-600 space-y-1 list-disc list-inside">
                <li>Rest days are auto-enforced every 7th day</li>
                <li>Keep daily study under 8h for sustainable progress</li>
                <li>High burnout risk days are automatically lightened</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {tab==='insights' && (
        <div className="space-y-5">
          <div className="card bg-gradient-to-br from-soft-lavender to-soft-sky border-primary-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary-500" />
              <h3 className="font-display text-lg font-bold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.map((ins,i)=>(
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-indigo-50">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-sm text-gray-600">{ins}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Study Science Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { e:'🍅', t:'Pomodoro Technique',     d:'50-min focus, 10-min break for medium difficulty subjects' },
                { e:'🎯', t:'Deep Work Blocks',        d:'90-min sessions for hard subjects — no phone, no interruptions' },
                { e:'🔄', t:'Active Recall',           d:'Test yourself after each chapter to boost retention by 50%' },
                { e:'💤', t:'Sleep for Memory',        d:'7-8 hours consolidates what you studied — never skip sleep' },
                { e:'📝', t:'Feynman Technique',       d:'Explain the concept simply — if you can\'t, review again' },
                { e:'🧘', t:'Mindful Breaks',          d:'5-min walks between sessions improve focus by 23%' },
              ].map(r=>(
                <div key={r.t} className="flex gap-3 p-3 bg-gray-50 rounded-2xl">
                  <span className="text-xl flex-shrink-0">{r.e}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{r.t}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

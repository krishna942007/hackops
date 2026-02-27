import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit3, X, BookOpen, Layers, RefreshCw, Check, Loader2 } from 'lucide-react';

const COLORS = ['#8b5cf6','#38bdf8','#2dd4bf','#fb923c','#f472b6','#34d399','#60a5fa','#f59e0b','#e879f9','#4ade80'];
const DIFF = {1:'Very Easy',2:'Easy',3:'Medium',4:'Hard',5:'Very Hard'};
const DIFF_COLOR = {1:'badge-teal',2:'badge-blue',3:'badge-purple',4:'badge-orange',5:'badge-red'};

function Modal({ subject, onSave, onClose }) {
  const [form, setForm] = useState(subject ? {
    name: subject.name, difficulty: subject.difficulty, chapters: subject.chapters,
    completedChapters: subject.completedChapters, examDate: subject.examDate ? new Date(subject.examDate).toISOString().slice(0,10) : '',
    color: subject.color, weightage: subject.weightage
  } : { name:'', difficulty:3, chapters:10, completedChapters:0, examDate:'', color:COLORS[0], weightage:3 });

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-gray-900">{subject ? 'Edit' : 'Add'} Subject</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Subject Name *</label>
            <input className="input" placeholder="e.g. Mathematics" value={form.name} onChange={e=>set('name',e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Difficulty</label>
              <select className="select" value={form.difficulty} onChange={e=>set('difficulty',+e.target.value)}>
                {[1,2,3,4,5].map(d=><option key={d} value={d}>{d} – {DIFF[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Weightage</label>
              <input className="input" type="number" min="1" max="5" value={form.weightage} onChange={e=>set('weightage',+e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Total Chapters</label>
              <input className="input" type="number" min="1" value={form.chapters} onChange={e=>set('chapters',+e.target.value)} />
            </div>
            <div>
              <label className="label">Completed</label>
              <input className="input" type="number" min="0" max={form.chapters} value={form.completedChapters} onChange={e=>set('completedChapters',+e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Exam Date</label>
            <input className="input" type="date" value={form.examDate} onChange={e=>set('examDate',e.target.value)} />
          </div>
          <div>
            <label className="label">Colour (click to select)</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c=>(
                <button key={c} onClick={()=>set('color',c)}
                  className={`w-8 h-8 rounded-full transition-all ${form.color===c?'scale-125 ring-2 ring-offset-2 ring-gray-400':'hover:scale-110'}`}
                  style={{backgroundColor:c}} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={()=>{ if(form.name.trim()) onSave(form); }} className="btn-primary flex-1">
            {subject ? 'Update' : 'Add'} Subject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const { subjects, addSubject, updateSubject, deleteSubject, timetable, generateTimetable, loading } = useApp();
  const [tab, setTab] = useState('subjects');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd  = () => { setEditing(null); setModal(true); };
  const openEdit = (s)=> { setEditing(s);   setModal(true); };

  const handleSave = async (data) => {
    if (editing) await updateSubject(editing._id, data);
    else         await addSubject(data);
    setModal(false);
  };

  // Micro-tasks from timetable
  const tasksBySubject = {};
  timetable?.plan?.forEach(day => {
    day.tasks?.filter(t=>t.type==='study').forEach(t => {
      if (!tasksBySubject[t.subject]) tasksBySubject[t.subject] = [];
      tasksBySubject[t.subject].push({...t, date: day.date, dayOfWeek: day.dayOfWeek});
    });
  });

  return (
    <div className="page space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Study Planner</h1>
          <p className="text-gray-400 text-sm mt-1">Manage subjects and explore micro-task breakdown</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generateTimetable} disabled={loading||subjects.length===0} className="btn-secondary text-sm gap-2">
            <RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`} /> Regenerate
          </button>
          <button onClick={openAdd} className="btn-primary text-sm gap-2">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {[{id:'subjects',icon:BookOpen,label:'Subjects'},{id:'microtasks',icon:Layers,label:'Micro-Tasks'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab===t.id?'bg-white text-primary-600 shadow':'text-gray-500 hover:text-gray-700'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* Subject grid */}
      {tab==='subjects' && (
        subjects.length===0
          ? <div className="flex flex-col items-center py-24">
              <div className="w-20 h-20 bg-soft-lavender rounded-3xl flex items-center justify-center mb-4 animate-float"><BookOpen className="w-10 h-10 text-primary-400" /></div>
              <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No subjects yet</h3>
              <p className="text-gray-400 mb-6">Add your first subject to start building your plan</p>
              <button onClick={openAdd} className="btn-primary gap-2"><Plus className="w-4 h-4" /> Add Subject</button>
            </div>
          : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subjects.map(s => {
                const progress = s.chapters>0 ? (s.completedChapters/s.chapters)*100 : 0;
                const daysLeft = s.examDate ? Math.ceil((new Date(s.examDate)-Date.now())/86400000) : null;
                return (
                  <div key={s._id} className="card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor:s.color}} />
                        <h3 className="font-display font-semibold text-gray-900">{s.name}</h3>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-primary-500"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={()=>deleteSubject(s._id)} className="p-1.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className={`badge text-xs ${DIFF_COLOR[s.difficulty]}`}>{DIFF[s.difficulty]}</span>
                      {daysLeft!==null && <span className={`badge text-xs ${daysLeft<=7?'badge-red':'badge-purple'}`}>📅 {daysLeft}d left</span>}
                      <span className="badge-blue text-xs">W:{s.weightage}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Chapters {s.completedChapters}/{s.chapters}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width:`${progress}%`,backgroundColor:s.color}} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Update progress:</span>
                      <button onClick={()=>updateSubject(s._id,{completedChapters:Math.max(0,s.completedChapters-1)})}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-red-100 hover:text-red-500">−</button>
                      <span className="text-sm font-semibold w-5 text-center">{s.completedChapters}</span>
                      <button onClick={()=>updateSubject(s._id,{completedChapters:Math.min(s.chapters,s.completedChapters+1)})}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-teal-100 hover:text-teal-600">+</button>
                    </div>
                    {s.revisionSchedule?.length>0 && (
                      <p className="text-xs text-primary-400 mt-2">🔄 {s.revisionSchedule.filter(r=>!r.done).length} revision sessions scheduled</p>
                    )}
                  </div>
                );
              })}
              <button onClick={openAdd}
                className="border-2 border-dashed border-indigo-100 rounded-3xl flex flex-col items-center justify-center gap-2 p-8 text-gray-300 hover:border-primary-300 hover:text-primary-400 hover:bg-soft-lavender transition-all cursor-pointer">
                <Plus className="w-8 h-8" /><span className="text-sm font-medium">Add Subject</span>
              </button>
            </div>
      )}

      {/* Micro-tasks */}
      {tab==='microtasks' && (
        Object.keys(tasksBySubject).length===0
          ? <div className="flex flex-col items-center py-16"><p className="text-gray-400">Generate a timetable to see your micro-task breakdown.</p></div>
          : <div className="space-y-5">
              {Object.entries(tasksBySubject).map(([subName, tasks])=>{
                const sub = subjects.find(s=>s.name===subName);
                const done = tasks.filter(t=>t.completed).length;
                return (
                  <div key={subName} className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3.5 h-3.5 rounded-full" style={{backgroundColor:sub?.color||'#8b5cf6'}} />
                      <h3 className="font-display text-lg font-bold text-gray-900">{subName}</h3>
                      <span className="badge-purple text-xs">{tasks.length} sessions</span>
                      <span className="badge-teal text-xs">{done} done</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scroll-thin">
                      {tasks.map((task,i)=>(
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${task.completed?'bg-gray-50 border-gray-100 opacity-70':'bg-white border-indigo-50'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${task.completed?'border-teal-400 bg-teal-400':'border-gray-200'}`}>
                            {task.completed && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`flex-1 truncate ${task.completed?'line-through text-gray-400':'text-gray-700'}`}>{task.chapter}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                            <span>{task.dayOfWeek?.slice(0,3)}</span>
                            <span>·</span>
                            <span>{task.duration}min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
      )}

      {modal && <Modal subject={editing} onSave={handleSave} onClose={()=>setModal(false)} />}
    </div>
  );
}

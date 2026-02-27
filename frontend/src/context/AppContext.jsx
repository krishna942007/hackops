import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usersAPI, subjectsAPI, timetableAPI, analyticsAPI } from '../utils/api';

const Ctx = createContext(null);

const LS_USER = 'sf_user_v2';

export function AppProvider({ children }) {
  /* ── State ──────────────────────────────────────────────────────────── */
  const [user,       setUser]       = useState(() => { try { return JSON.parse(localStorage.getItem(LS_USER)) } catch { return null } });
  const [subjects,   setSubjects]   = useState([]);
  const [timetable,  setTimetable]  = useState(null);
  const [analytics,  setAnalytics]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [toast,      setToast]      = useState(null);

  /* ── Toast ──────────────────────────────────────────────────────────── */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── Persist user ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else      localStorage.removeItem(LS_USER);
  }, [user]);

  /* ── Auto-load on login ─────────────────────────────────────────────── */
  useEffect(() => {
    if (user?._id) {
      loadSubjects();
      loadTimetable();
      loadAnalytics();
    }
  }, [user?._id]);

  /* ── Users ──────────────────────────────────────────────────────────── */
  const createUser = async (payload) => {
    setLoading(true);
    try {
      const { data } = await usersAPI.create(payload);
      setUser(data);
      showToast(`Welcome, ${data.name}! 🎉`);
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally { setLoading(false); }
  };

  const updateUser = async (patch) => {
    try {
      const { data } = await usersAPI.update(user._id, patch);
      setUser(data);
      return data;
    } catch (err) { showToast(err.message, 'error'); }
  };

  const awardXP = async (xp, badge) => {
    try {
      const { data } = await usersAPI.addXP(user._id, { xp, badge });
      setUser(prev => ({ ...prev, gamification: data }));
      showToast(`+${xp} XP earned! 🎯`);
    } catch {}
  };

  /* ── Subjects ───────────────────────────────────────────────────────── */
  const loadSubjects = async () => {
    try {
      const { data } = await subjectsAPI.list(user._id);
      setSubjects(data);
    } catch {}
  };

  const addSubject = async (payload) => {
    try {
      const { data } = await subjectsAPI.create({ ...payload, userId: user._id });
      setSubjects(prev => [...prev, data]);
      showToast(`${payload.name} added! 📚`);
      return data;
    } catch (err) { showToast(err.message, 'error'); throw err; }
  };

  const updateSubject = async (id, patch) => {
    try {
      const { data } = await subjectsAPI.update(id, patch);
      setSubjects(prev => prev.map(s => s._id === id ? data : s));
      return data;
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteSubject = async (id) => {
    try {
      await subjectsAPI.delete(id);
      setSubjects(prev => prev.filter(s => s._id !== id));
      showToast('Subject removed');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Timetable ──────────────────────────────────────────────────────── */
  const generateTimetable = async () => {
    setLoading(true);
    try {
      const { data } = await timetableAPI.generate(user._id);
      setTimetable(data);
      showToast('Smart timetable generated! 🗓️');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally { setLoading(false); }
  };

  const loadTimetable = async () => {
    try {
      const { data } = await timetableAPI.getActive(user._id);
      setTimetable(data);
    } catch {}
  };

  const completeTask = async (timetableId, dayIndex, taskIndex) => {
    try {
      const { data } = await timetableAPI.completeTask(timetableId, dayIndex, taskIndex);
      if (data.completed) awardXP(25);
      await loadTimetable();
      return data;
    } catch (err) { showToast(err.message, 'error'); }
  };

  const redistributeMissed = async (timetableId, dayIndex) => {
    try {
      await timetableAPI.redistribute(timetableId, { dayIndex });
      await loadTimetable();
      showToast('Missed tasks rescheduled 📌');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Analytics ──────────────────────────────────────────────────────── */
  const loadAnalytics = async () => {
    try {
      const { data } = await analyticsAPI.get(user._id, 14);
      setAnalytics(data);
    } catch {}
  };

  /* ── Auth ───────────────────────────────────────────────────────────── */
  const logout = () => {
    setUser(null); setSubjects([]); setTimetable(null); setAnalytics(null);
  };

  return (
    <Ctx.Provider value={{
      user, subjects, timetable, analytics, loading, toast,
      createUser, updateUser, awardXP,
      addSubject, updateSubject, deleteSubject, loadSubjects,
      generateTimetable, loadTimetable, completeTask, redistributeMissed,
      loadAnalytics, logout, showToast
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);

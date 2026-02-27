import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Toast from './components/common/Toast';
import Layout from './components/common/Layout';
import IntroScreen from './components/common/IntroScreen';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import OnboardingPage   from './pages/OnboardingPage';
import DashboardPage    from './pages/DashboardPage';
import TimetablePage    from './pages/TimetablePage';
import PlannerPage      from './pages/PlannerPage';
import AnalyticsPage    from './pages/AnalyticsPage';
import AchievementsPage from './pages/AchievementsPage';

function Guard({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user, toast } = useApp();
  return (
    <>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} />}
      <Routes>
        <Route path="/"           element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login"      element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<Guard><Layout /></Guard>}>
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/timetable"    element={<TimetablePage />} />
          <Route path="/planner"      element={<PlannerPage />} />
          <Route path="/analytics"    element={<AnalyticsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('aanushasan_intro_shown'));

  const handleIntroComplete = () => {
    sessionStorage.setItem('aanushasan_intro_shown', '1');
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      <AppProvider>
        {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

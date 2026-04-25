import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('resonance_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        setView('dashboard');
      } catch {
        localStorage.removeItem('resonance_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('resonance_user', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('resonance_user');
    localStorage.removeItem('resonance_token');
    setView('landing');
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('auth')} onLogin={() => setView('auth')} />;
  }
  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} onBack={() => setView('landing')} />;
  }
  return <DashboardPage user={user} onLogout={handleLogout} />;
}

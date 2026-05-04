import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Signal from './pages/Signal';
import Inbox from './pages/Inbox';
import Rewards from './pages/Rewards';
import NavBar from './components/NavBar';
import './App.css';

function AppInner() {
  const { state } = useApp();
  const [page, setPage] = useState('dashboard');

  if (!state.isOnboarded) {
    return <Onboarding />;
  }

  function renderPage() {
    switch (page) {
      case 'signal':  return <Signal  onNavigate={setPage} />;
      case 'inbox':   return <Inbox   onNavigate={setPage} />;
      case 'rewards': return <Rewards onNavigate={setPage} />;
      default:        return <Dashboard onNavigate={setPage} />;
    }
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {renderPage()}
      </main>
      <NavBar current={page} onNavigate={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

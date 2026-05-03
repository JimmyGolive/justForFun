import React from 'react';
import { useApp } from '../context/AppContext';
import './NavBar.css';

const TABS = [
  { id: 'dashboard', icon: '🏠', label: '首頁' },
  { id: 'signal',    icon: '💌', label: '傳送' },
  { id: 'inbox',     icon: '🔔', label: '收件' },
  { id: 'rewards',   icon: '🎁', label: '獎勵' },
];

export default function NavBar({ current, onNavigate }) {
  const { state } = useApp();
  const hasInbox = state.pendingSignal && state.pendingSignal.from !== state.activeUser;

  return (
    <nav className="navbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`nav-item ${current === t.id ? 'active' : ''}`}
          onClick={() => onNavigate(t.id)}
        >
          <span className="nav-icon">
            {t.icon}
            {t.id === 'inbox' && hasInbox && <span className="nav-badge" />}
          </span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

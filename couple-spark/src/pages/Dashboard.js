import React from 'react';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

const REWARD_TIERS = [
  { id: 'r1', label: '浪漫燭光晚餐 🕯️', cost: 50,  desc: '一起享用一頓安靜的燭光晚餐' },
  { id: 'r2', label: '泡澡 SPA 之夜 🛁', cost: 100, desc: '為對方準備芳香泡澡，完全放鬆' },
  { id: 'r3', label: '週末短旅行 🏖️',   cost: 200, desc: '計劃一次說走就走的兩人小旅行' },
  { id: 'r4', label: '驚喜禮物 🎁',      cost: 80,  desc: '送給對方一份精心準備的驚喜' },
];

export default function Dashboard({ onNavigate }) {
  const { state, dispatch, ACHIEVEMENTS_DEF } = useApp();
  const { partner1, partner2, activeUser, points, streak, signalHistory, achievements, moods } = state;

  const activePartner = activeUser === 'partner1' ? partner1 : partner2;
  const otherPartner  = activeUser === 'partner1' ? partner2 : partner1;

  const acceptedCount = signalHistory.filter((h) => h.status === 'accept').length;
  const today = new Date().toISOString().split('T')[0];
  const todayMood = moods[today]?.[activeUser];

  function handleMood(val) {
    dispatch({ type: 'RECORD_MOOD', mood: val });
  }

  const nextReward = REWARD_TIERS.find((r) => !state.redeemedRewards.includes(r.id) && r.cost > points);
  const progressToNext = nextReward ? Math.min((points / nextReward.cost) * 100, 100) : 100;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="partner-switcher">
          <button
            className={`partner-tab ${activeUser === 'partner1' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SWITCH_USER', user: 'partner1' })}
          >
            {partner1.emoji} {partner1.name || 'Partner 1'}
          </button>
          <button
            className={`partner-tab ${activeUser === 'partner2' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SWITCH_USER', user: 'partner2' })}
          >
            {partner2.emoji} {partner2.name || 'Partner 2'}
          </button>
        </div>
      </div>

      {/* Hero stats */}
      <div className="stats-row">
        <div className="stat-card flame">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">連續天數</div>
        </div>
        <div className="stat-card spark">
          <div className="stat-icon">✨</div>
          <div className="stat-value">{points}</div>
          <div className="stat-label">火花積分</div>
        </div>
        <div className="stat-card heart">
          <div className="stat-icon">💞</div>
          <div className="stat-value">{acceptedCount}</div>
          <div className="stat-label">共鳴次數</div>
        </div>
      </div>

      {/* Progress to next reward */}
      {nextReward && (
        <div className="progress-section">
          <div className="progress-header">
            <span>下一個獎勵：{nextReward.label}</span>
            <span>{points} / {nextReward.cost} pts</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
          </div>
        </div>
      )}

      {/* Today's mood */}
      <div className="mood-section">
        <h3>今天的狀態 <span className="partner-name">{activePartner.emoji} {activePartner.name}</span></h3>
        <div className="mood-row">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              className={`mood-btn ${todayMood === v ? 'selected' : ''}`}
              onClick={() => handleMood(v)}
            >
              {['😴', '😔', '😊', '😄', '🥰'][v - 1]}
              <span>{['很累', '普通', '還好', '不錯', '很好'][v - 1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Signal / Inbox buttons */}
      <div className="action-row">
        <button className="action-btn signal-btn" onClick={() => onNavigate('signal')}>
          <span className="action-icon">💌</span>
          <span className="action-label">發送心動</span>
          <span className="action-sub">傳遞你的感受</span>
        </button>
        {state.pendingSignal && state.pendingSignal.from !== activeUser && (
          <button className="action-btn inbox-btn" onClick={() => onNavigate('inbox')}>
            <span className="action-icon">🔔</span>
            <span className="action-label">收到心動</span>
            <span className="action-sub">來自 {otherPartner.emoji} {otherPartner.name}</span>
            <span className="badge">1</span>
          </button>
        )}
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>成就勳章</h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS_DEF.map((a) => (
            <div key={a.id} className={`achievement-chip ${achievements.includes(a.id) ? 'unlocked' : 'locked'}`}>
              <span>{achievements.includes(a.id) ? a.label : '🔒 ' + a.label.split(' ').slice(0, 2).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {signalHistory.length > 0 && (
        <div className="history-section">
          <h3>最近記錄</h3>
          {signalHistory.slice(0, 5).map((h, i) => {
            const from = h.from === 'partner1' ? partner1 : partner2;
            const to   = h.from === 'partner1' ? partner2 : partner1;
            return (
              <div key={i} className={`history-item ${h.status}`}>
                <span className="history-icon">
                  {h.status === 'accept' ? '💞' : h.status === 'schedule' ? '📅' : '💤'}
                </span>
                <div className="history-info">
                  <span className="history-names">{from.emoji} → {to.emoji}</span>
                  <span className="history-type">{SIGNAL_LABELS[h.type] || h.type}</span>
                </div>
                <span className="history-time">
                  {new Date(h.sentAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Rewards button */}
      <button className="rewards-nav-btn" onClick={() => onNavigate('rewards')}>
        🎁 查看所有獎勵
      </button>
    </div>
  );
}

const SIGNAL_LABELS = {
  tender:   '溫柔相擁',
  romantic: '浪漫約會',
  playful:  '輕鬆嬉戲',
  intimate: '親密時光',
  chat:     '悄悄話',
};

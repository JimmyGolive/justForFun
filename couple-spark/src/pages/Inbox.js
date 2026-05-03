import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Inbox.css';

const SIGNAL_META = {
  tender:   { emoji: '🤗', label: '溫柔相擁',  color: '#a78bfa' },
  romantic: { emoji: '🌹', label: '浪漫約會',  color: '#ff6b9d' },
  playful:  { emoji: '😜', label: '輕鬆嬉戲',  color: '#34d399' },
  intimate: { emoji: '🔥', label: '親密時光',  color: '#fb923c' },
  chat:     { emoji: '💬', label: '悄悄話',    color: '#60a5fa' },
};

export default function Inbox({ onNavigate }) {
  const { state, dispatch } = useApp();
  const { partner1, partner2, activeUser, pendingSignal } = state;

  const otherPartner  = activeUser === 'partner1' ? partner2 : partner1;

  const [scheduleTime, setScheduleTime] = useState('');
  const [responded, setResponded] = useState(null);

  const signal = pendingSignal;

  // If the signal is FROM the current user, they shouldn't be here
  if (!signal || signal.from === activeUser) {
    return (
      <div className="inbox-page">
        <div className="inbox-empty">
          <div className="empty-icon">📭</div>
          <h2>沒有新的心動</h2>
          <p>還沒有收到來自 {otherPartner.emoji} {otherPartner.name} 的訊號</p>
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← 返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (responded) {
    const isAccept = responded === 'accept';
    const isSchedule = responded === 'schedule';
    return (
      <div className="inbox-page">
        <div className="inbox-responded">
          <div className="responded-icon">{isAccept ? '💞' : isSchedule ? '📅' : '💤'}</div>
          <h2>{isAccept ? '太棒了！' : isSchedule ? '已約好時間！' : '感謝告知～'}</h2>
          <p>
            {isAccept && '你們的心動已同步，積分已增加 🎉'}
            {isSchedule && `約定時間已記錄。期待那一刻的到來 💫`}
            {responded === 'decline' && '沒關係，下次有機會再接住對方的心動 🌙'}
          </p>
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← 返回首頁
          </button>
        </div>
      </div>
    );
  }

  const meta = SIGNAL_META[signal.type] || { emoji: '💌', label: signal.type, color: '#ff6b9d' };
  const sentTime = new Date(signal.sentAt);
  const timeStr = sentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

  function respond(response) {
    dispatch({ type: 'RESPOND_SIGNAL', response, scheduledFor: response === 'schedule' ? scheduleTime : null });
    setResponded(response);
  }

  return (
    <div className="inbox-page">
      <div className="inbox-header">
        <button className="back-icon" onClick={() => onNavigate('dashboard')}>←</button>
        <div>
          <h2>來自 {otherPartner.emoji} {otherPartner.name}</h2>
          <p>{timeStr} 傳送</p>
        </div>
      </div>

      <div className="signal-card" style={{ '--accent': meta.color }}>
        <div className="sc-emoji">{meta.emoji}</div>
        <div className="sc-type">{meta.label}</div>
        {signal.message && (
          <blockquote className="sc-message">「{signal.message}」</blockquote>
        )}
        <div className="sc-from">{otherPartner.emoji} {otherPartner.name} 正在等待你的回應…</div>
      </div>

      <div className="response-section">
        <p className="response-hint">你現在的感受是？</p>

        <button className="resp-btn accept" onClick={() => respond('accept')}>
          <span>💞</span>
          <div>
            <strong>好！我也這樣想</strong>
            <span>接受這個心動，現在就開始</span>
          </div>
        </button>

        <div className="schedule-group">
          <button
            className="resp-btn schedule"
            onClick={() => scheduleTime && respond('schedule')}
            disabled={!scheduleTime}
          >
            <span>📅</span>
            <div>
              <strong>我想，但先安排時間</strong>
              <span>選個你方便的時間</span>
            </div>
          </button>
          <input
            type="datetime-local"
            className="time-picker"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        </div>

        <button className="resp-btn decline" onClick={() => respond('decline')}>
          <span>💤</span>
          <div>
            <strong>今天真的不行</strong>
            <span>先休息，下次繼續加油</span>
          </div>
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Signal.css';

const SIGNAL_TYPES = [
  { id: 'tender',   emoji: '🤗', label: '溫柔相擁',  desc: '只想靠近你，給我一個擁抱',         color: '#a78bfa' },
  { id: 'romantic', emoji: '🌹', label: '浪漫約會',  desc: '我們今晚來製造一點浪漫吧',         color: '#ff6b9d' },
  { id: 'playful',  emoji: '😜', label: '輕鬆嬉戲',  desc: '有點想跟你玩玩，不必太嚴肅',       color: '#34d399' },
  { id: 'intimate', emoji: '🔥', label: '親密時光',  desc: '我想和你更靠近… 你懂我的意思',     color: '#fb923c' },
  { id: 'chat',     emoji: '💬', label: '悄悄話',    desc: '有些話只想輕輕告訴你一個人聽',     color: '#60a5fa' },
];

export default function Signal({ onNavigate }) {
  const { state, dispatch } = useApp();
  const { partner1, partner2, activeUser, pendingSignal } = state;

  const activePartner = activeUser === 'partner1' ? partner1 : partner2;
  const otherPartner  = activeUser === 'partner1' ? partner2 : partner1;

  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // If the pending signal is already from me, show a "waiting" view
  const alreadySent = pendingSignal && pendingSignal.from === activeUser;

  function handleSend() {
    if (!selected) return;
    dispatch({ type: 'SEND_SIGNAL', signalType: selected.id, message: message.trim() });
    setSent(true);
  }

  if (sent || alreadySent) {
    return (
      <div className="signal-page">
        <div className="signal-sent-card">
          <div className="sent-anim">💌</div>
          <h2>心動已傳送！</h2>
          <p>
            等待 <strong>{otherPartner.emoji} {otherPartner.name}</strong> 的回應…
          </p>
          <p className="sent-sub">切換到對方的帳號來回應這個心動訊號</p>
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← 返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signal-page">
      <div className="signal-header">
        <button className="back-icon" onClick={() => onNavigate('dashboard')}>←</button>
        <div className="signal-title">
          <h2>傳送心動</h2>
          <p>{activePartner.emoji} {activePartner.name} → {otherPartner.emoji} {otherPartner.name}</p>
        </div>
      </div>

      <p className="signal-hint">選擇一種心動類型</p>

      <div className="signal-types">
        {SIGNAL_TYPES.map((s) => (
          <button
            key={s.id}
            className={`signal-type-btn ${selected?.id === s.id ? 'selected' : ''}`}
            style={selected?.id === s.id ? { '--accent': s.color } : {}}
            onClick={() => setSelected(s)}
          >
            <span className="stype-emoji">{s.emoji}</span>
            <div className="stype-info">
              <span className="stype-label">{s.label}</span>
              <span className="stype-desc">{s.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="message-section fade-in">
          <label className="msg-label">附上一句悄悄話（可選）</label>
          <textarea
            className="msg-input"
            placeholder={`「${selected.desc}」`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={120}
            rows={3}
          />
          <div className="char-count">{message.length} / 120</div>
        </div>
      )}

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!selected}
      >
        💌 傳送心動
      </button>
    </div>
  );
}

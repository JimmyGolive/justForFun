import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Onboarding.css';

const EMOJIS_P1 = ['🌸', '🌺', '💜', '🦋', '🌙', '⭐', '🍀', '🌊'];
const EMOJIS_P2 = ['🔥', '⚡', '🦁', '🌿', '🎸', '🚀', '🏔️', '🎯'];

export default function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [p1Name, setP1Name] = useState('');
  const [p1Emoji, setP1Emoji] = useState('🌸');
  const [p2Name, setP2Name] = useState('');
  const [p2Emoji, setP2Emoji] = useState('🔥');

  function handleFinish() {
    if (!p1Name.trim() || !p2Name.trim()) return;
    dispatch({ type: 'COMPLETE_ONBOARDING', p1Name: p1Name.trim(), p1Emoji, p2Name: p2Name.trim(), p2Emoji });
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {step === 0 && (
          <div className="onboarding-step fade-in">
            <div className="onboarding-logo">💑</div>
            <h1>CoupleSpark</h1>
            <p className="onboarding-sub">讓感情保持溫度的小遊戲</p>
            <p className="onboarding-desc">
              透過有趣的方式，讓你們隨時保持心靈相通，
              建立屬於你們的愛情默契與浪漫積分。
            </p>
            <button className="btn-primary" onClick={() => setStep(1)}>
              開始設定 ✨
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-step fade-in">
            <div className="step-indicator">1 / 2</div>
            <h2>第一位伴侶</h2>
            <p>請輸入你的名字，並選擇你的專屬符號</p>
            <input
              className="name-input"
              placeholder="你的名字"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              maxLength={20}
            />
            <div className="emoji-grid">
              {EMOJIS_P1.map((e) => (
                <button
                  key={e}
                  className={`emoji-btn ${p1Emoji === e ? 'selected' : ''}`}
                  onClick={() => setP1Emoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              disabled={!p1Name.trim()}
            >
              下一步 →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step fade-in">
            <div className="step-indicator">2 / 2</div>
            <h2>第二位伴侶</h2>
            <p>請輸入你的名字，並選擇你的專屬符號</p>
            <input
              className="name-input"
              placeholder="你的名字"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              maxLength={20}
            />
            <div className="emoji-grid">
              {EMOJIS_P2.map((e) => (
                <button
                  key={e}
                  className={`emoji-btn ${p2Emoji === e ? 'selected' : ''}`}
                  onClick={() => setP2Emoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                ← 返回
              </button>
              <button
                className="btn-primary"
                onClick={handleFinish}
                disabled={!p2Name.trim()}
              >
                出發！🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

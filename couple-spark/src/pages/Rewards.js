import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_DEF } from '../context/AppContext';
import './Rewards.css';

const REWARDS = [
  { id: 'r1', emoji: '🕯️', label: '浪漫燭光晚餐', cost: 50,  desc: '一起享用一頓安靜的燭光晚餐，關掉手機，只有彼此' },
  { id: 'r2', emoji: '🛁', label: '泡澡 SPA 之夜', cost: 80,  desc: '為對方準備芳香泡澡，點好蠟燭，讓身心完全放鬆' },
  { id: 'r3', emoji: '🎁', label: '驚喜小禮物',   cost: 100, desc: '送給對方一份精心準備的驚喜，不一定要貴重，重在心意' },
  { id: 'r4', emoji: '💆', label: '全身按摩服務', cost: 120, desc: '為對方進行 30 分鐘全身按摩，完全由對方指定手法' },
  { id: 'r5', emoji: '🏖️', label: '週末小旅行',   cost: 200, desc: '計劃一次說走就走的兩人小旅行，一起創造新回憶' },
  { id: 'r6', emoji: '🍽️', label: '精心料理大餐', cost: 150, desc: '親手為對方做一頓心意滿滿的料理，可以是早午晚餐' },
  { id: 'r7', emoji: '🎬', label: '電影約會之夜', cost: 60,  desc: '選一部對方喜歡的電影，備好零食，享受家庭電影院' },
  { id: 'r8', emoji: '⭐', label: '終極願望卡',   cost: 300, desc: '一張無限制的願望卡，對方可以用來兌換任何想要的事' },
];

export default function Rewards({ onNavigate }) {
  const { state, dispatch } = useApp();
  const { points, redeemedRewards, achievements } = state;

  function handleRedeem(reward) {
    if (points < reward.cost || redeemedRewards.includes(reward.id)) return;
    dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id, cost: reward.cost });
  }

  return (
    <div className="rewards-page">
      <div className="rewards-header">
        <button className="back-icon" onClick={() => onNavigate('dashboard')}>←</button>
        <div>
          <h2>獎勵兌換</h2>
          <p>你的積分：<strong>{points} ✨</strong></p>
        </div>
      </div>

      <h3 className="section-title">🎁 可兌換獎勵</h3>
      <div className="rewards-grid">
        {REWARDS.map((r) => {
          const redeemed = redeemedRewards.includes(r.id);
          const canAfford = points >= r.cost;
          return (
            <div key={r.id} className={`reward-card ${redeemed ? 'redeemed' : ''} ${!canAfford && !redeemed ? 'locked' : ''}`}>
              <div className="reward-emoji">{redeemed ? '✅' : r.emoji}</div>
              <div className="reward-info">
                <span className="reward-label">{r.label}</span>
                <span className="reward-desc">{r.desc}</span>
                <div className="reward-footer">
                  <span className="reward-cost">{r.cost} pts</span>
                  {!redeemed && (
                    <button
                      className={`redeem-btn ${canAfford ? 'can-afford' : 'cant-afford'}`}
                      onClick={() => handleRedeem(r)}
                      disabled={!canAfford}
                    >
                      {canAfford ? '兌換' : `還差 ${r.cost - points}`}
                    </button>
                  )}
                  {redeemed && <span className="redeemed-badge">已兌換</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="section-title">🏆 成就勳章</h3>
      <div className="achievements-list">
        {ACHIEVEMENTS_DEF.map((a) => {
          const unlocked = achievements.includes(a.id);
          return (
            <div key={a.id} className={`achievement-row ${unlocked ? 'unlocked' : 'locked'}`}>
              <span className="ach-icon">{unlocked ? '🏅' : '🔒'}</span>
              <div className="ach-info">
                <span className="ach-label">{a.label}</span>
                <span className="ach-desc">{a.desc}</span>
              </div>
              {unlocked && <span className="ach-done">達成！</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

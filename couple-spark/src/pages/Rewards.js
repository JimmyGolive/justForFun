import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_DEF } from '../context/AppContext';
import { REWARDS } from '../constants';
import './Rewards.css';

export default function Rewards({ onNavigate }) {
  const { state, dispatch } = useApp();
  const { points, redeemedRewards, achievements } = state;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleRedeem(reward) {
    if (points < reward.cost) return;
    dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id, cost: reward.cost });
  }

  function handleReset() {
    dispatch({ type: 'RESET_STATE' });
    setShowResetConfirm(false);
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
          const redeemCount = redeemedRewards[r.id] || 0;
          const canAfford = points >= r.cost;
          return (
            <div key={r.id} className={`reward-card ${!canAfford ? 'locked' : ''}`}>
              <div className="reward-emoji">{r.emoji}</div>
              <div className="reward-info">
                <span className="reward-label">{r.label}</span>
                <span className="reward-desc">{r.desc}</span>
                <div className="reward-footer">
                  <span className="reward-cost">{r.cost} pts</span>
                  <div className="reward-footer-right">
                    {redeemCount > 0 && (
                      <span className="redeemed-count">已兌換 {redeemCount} 次</span>
                    )}
                    <button
                      className={`redeem-btn ${canAfford ? 'can-afford' : 'cant-afford'}`}
                      onClick={() => handleRedeem(r)}
                      disabled={!canAfford}
                    >
                      {canAfford ? '兌換' : `還差 ${r.cost - points}`}
                    </button>
                  </div>
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

      <div className="reset-section">
        {!showResetConfirm ? (
          <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>
            🔄 重置所有資料
          </button>
        ) : (
          <div className="reset-confirm">
            <p>確定要清除所有資料並重新開始嗎？</p>
            <div className="reset-confirm-btns">
              <button className="reset-confirm-yes" onClick={handleReset}>確定重置</button>
              <button className="reset-confirm-no" onClick={() => setShowResetConfirm(false)}>取消</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

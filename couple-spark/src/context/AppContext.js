import React, { createContext, useContext, useReducer, useEffect } from 'react';

const INITIAL_STATE = {
  // Onboarding
  isOnboarded: false,
  partner1: { name: '', emoji: '🌸' },
  partner2: { name: '', emoji: '🔥' },
  activeUser: 'partner1', // who is currently viewing

  // Signals inbox
  pendingSignal: null,   // { from, type, message, sentAt }
  signalHistory: [],

  // Gamification
  points: 0,
  streak: 0,
  lastConnectionDate: null,
  achievements: [],
  redeemedRewards: {}, // { rewardId: count } — allows repeatable redemption

  // Mood tracking
  moods: {}, // { 'YYYY-MM-DD': { partner1: 3, partner2: 4 } }
};

const ACHIEVEMENTS_DEF = [
  { id: 'first_spark',  label: 'First Spark 🌟',      desc: 'Send your very first signal',    condition: (s) => s.signalHistory.length >= 1 },
  { id: 'first_redeem', label: 'Treat Time 🎉',        desc: 'Redeem your first reward',       condition: (s) => Object.values(s.redeemedRewards).reduce((a, b) => a + b, 0) >= 1 },
  { id: 'streak_3',     label: 'Three-Peat 🔥',        desc: '3-day connection streak',        condition: (s) => s.streak >= 3 },
  { id: 'streak_7',     label: 'Week Warmth 🌈',       desc: '7-day connection streak',        condition: (s) => s.streak >= 7 },
  { id: 'streak_30',    label: 'Monthly Flame 💑',     desc: '30-day connection streak',       condition: (s) => s.streak >= 30 },
  { id: 'points_50',    label: 'Spark Collector ✨',   desc: 'Earn 50 points',                 condition: (s) => s.points >= 50 },
  { id: 'points_200',   label: 'Flame Keeper 💎',      desc: 'Earn 200 points',                condition: (s) => s.points >= 200 },
  { id: 'historian',    label: 'Memory Maker 📸',      desc: '10 connections total',           condition: (s) => s.signalHistory.filter(h => h.status === 'accept').length >= 10 },
  { id: 'mood_7',       label: 'Mood Tracker 😊',      desc: 'Record mood on 7 different days', condition: (s) => Object.keys(s.moods).length >= 7 },
];

function checkAchievements(state) {
  const newAchievements = [...state.achievements];
  ACHIEVEMENTS_DEF.forEach((a) => {
    if (!newAchievements.includes(a.id) && a.condition(state)) {
      newAchievements.push(a.id);
    }
  });
  return newAchievements;
}

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      next = {
        ...state,
        isOnboarded: true,
        partner1: { ...state.partner1, name: action.p1Name, emoji: action.p1Emoji },
        partner2: { ...state.partner2, name: action.p2Name, emoji: action.p2Emoji },
      };
      return next;

    case 'SWITCH_USER':
      return { ...state, activeUser: action.user };

    case 'SEND_SIGNAL':
      return {
        ...state,
        pendingSignal: {
          from: state.activeUser,
          type: action.signalType,
          message: action.message,
          sentAt: new Date().toISOString(),
        },
      };

    case 'RESPOND_SIGNAL': {
      const accepted = action.response === 'accept';
      const today = new Date().toDateString();
      const lastDate = state.lastConnectionDate;
      const isToday = lastDate && new Date(lastDate).toDateString() === today;
      const wasYesterday = lastDate && new Date(lastDate).toDateString() === new Date(Date.now() - 86400000).toDateString();
      const newStreak = accepted
        ? (isToday ? state.streak : wasYesterday || !lastDate ? state.streak + 1 : 1)
        : state.streak;
      const pointsEarned = accepted ? 10 + newStreak * 2 : 0;
      const historyEntry = {
        ...state.pendingSignal,
        status: action.response,
        respondedAt: new Date().toISOString(),
        scheduledFor: action.scheduledFor || null,
      };
      const newState = {
        ...state,
        pendingSignal: null,
        signalHistory: [historyEntry, ...state.signalHistory],
        points: state.points + pointsEarned,
        streak: newStreak,
        lastConnectionDate: accepted ? today : state.lastConnectionDate,
      };
      newState.achievements = checkAchievements(newState);
      return newState;
    }

    case 'DISMISS_SIGNAL':
      return { ...state, pendingSignal: null };

    case 'REDEEM_REWARD':
      if (state.points < action.cost) return state;
      {
        const newState = {
          ...state,
          points: state.points - action.cost,
          redeemedRewards: {
            ...state.redeemedRewards,
            [action.rewardId]: (state.redeemedRewards[action.rewardId] || 0) + 1,
          },
        };
        newState.achievements = checkAchievements(newState);
        return newState;
      }

    case 'RECORD_MOOD': {
      const dateKey = new Date().toISOString().split('T')[0];
      const newState = {
        ...state,
        moods: {
          ...state.moods,
          [dateKey]: {
            ...(state.moods[dateKey] || {}),
            [state.activeUser]: action.mood,
          },
        },
      };
      newState.achievements = checkAchievements(newState);
      return newState;
    }

    case 'RESET_STATE':
      return { ...INITIAL_STATE };

    case 'LOAD_STATE': {
      const payload = { ...action.payload };
      // Migrate redeemedRewards from old array format to object format
      if (Array.isArray(payload.redeemedRewards)) {
        payload.redeemedRewards = Object.fromEntries(
          payload.redeemedRewards.map((id) => [id, 1])
        );
      }
      return { ...INITIAL_STATE, ...payload };
    }

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) => {
    try {
      const saved = localStorage.getItem('coupleSpark');
      if (!saved) return init;
      const parsed = JSON.parse(saved);
      // Migrate redeemedRewards from old array format to object format
      if (Array.isArray(parsed.redeemedRewards)) {
        parsed.redeemedRewards = Object.fromEntries(
          parsed.redeemedRewards.map((id) => [id, 1])
        );
      }
      return { ...init, ...parsed };
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('coupleSpark', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, ACHIEVEMENTS_DEF }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export { ACHIEVEMENTS_DEF };

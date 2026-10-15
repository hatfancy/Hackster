import { useEffect } from 'react';
import type { Achievement } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

interface Props {
  achievement: Achievement;
}

export default function AchievementToast({ achievement }: Props) {
  const dismiss = useGameStore((s) => s.dismissAchievement);

  useEffect(() => {
    playSound('rankUp');
    const timer = setTimeout(() => {
      dismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievement, dismiss]);

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 20px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--gold)',
        borderRadius: 'var(--r-md)',
        boxShadow: '0 0 20px var(--gold-glow)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: 380,
      }}
    >
      <div
        style={{
          fontSize: '2rem',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 8px var(--gold))',
        }}
      >
        {achievement.icon || '🏆'}
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            color: 'var(--gold)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          ★ ACHIEVEMENT UNLOCKED ★
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {achievement.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginTop: 2,
          }}
        >
          {achievement.description}
        </div>
      </div>
    </div>
  );
}

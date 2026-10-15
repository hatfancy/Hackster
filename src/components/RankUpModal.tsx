import { useEffect } from 'react';
import type { Rank } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

interface Props {
  rank: Rank;
}

export default function RankUpModal({ rank }: Props) {
  const dismiss = useGameStore((s) => s.dismissRankUp);

  useEffect(() => {
    playSound('rankUp');
  }, [rank]);

  const getRankDescription = (r: Rank) => {
    switch (r) {
      case 'PRO HACKER':
        return 'Advanced terminal privileges granted. Threat detection avoidance elevated.';
      case 'ELITE HACKER':
        return 'Sub-level access cleared. Black ICE counter-protocols synchronized.';
      case 'MASTER HACKER':
        return 'Total root network dominance achieved. Helix Corp central mainframe unlocked.';
      default:
        return 'Operative clearance recognized.';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        backgroundColor: 'rgba(2, 2, 10, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="card-glow anim-fade-in"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          position: 'relative',
          border: '1px solid var(--purple)',
          boxShadow: '0 0 30px var(--purple-glow-md)',
          background: 'var(--bg-panel)',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--cyan)',
            letterSpacing: '0.3em',
            marginBottom: 8,
          }}
        >
          ◈ PROMOTION PROTOCOL ACTIVATED ◈
        </div>

        <h2
          className="neon-purple"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}
        >
          {rank}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          {getRankDescription(rank)}
        </p>

        <button
          className="btn btn-purple"
          style={{ width: '100%', padding: '12px 24px', fontSize: '1rem' }}
          onClick={() => {
            playSound('click');
            dismiss();
          }}
        >
          ACKNOWLEDGE PROMOTION
        </button>
      </div>
    </div>
  );
}

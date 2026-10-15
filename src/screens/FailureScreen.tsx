import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../data/levels';
import { playSound } from '../lib/sounds';

export default function FailureScreen() {
  const currentLevelId = useGameStore((s) => s.currentLevel);
  const failureReason = useGameStore((s) => s.failureReason);
  const retryLevel = useGameStore((s) => s.retryLevel);
  const navigate = useGameStore((s) => s.navigateTo);

  useEffect(() => {
    playSound('failure');
  }, []);

  const level = getLevelById(currentLevelId);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="card-glow anim-fade-in"
        style={{
          maxWidth: 520,
          width: '100%',
          padding: '36px 28px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--red)',
          boxShadow: '0 0 30px var(--red-glow)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
        }}
      >
        <span
          className="badge badge-red"
          style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: 16 }}
        >
          ◈ INTRUSION ABORTED ◈
        </span>

        <h1 className="neon-red" style={{ fontSize: '2.4rem', marginBottom: 8 }}>
          ACCESS DENIED
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            marginBottom: 24,
          }}
        >
          SECTOR {currentLevelId.toString().padStart(2, '0')}: {level?.title || 'FIREWALL BREACH FAILED'}
        </p>

        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 34, 68, 0.08)',
            border: '1px solid rgba(255, 34, 68, 0.25)',
            borderRadius: 'var(--r-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--red)',
            marginBottom: 32,
            lineHeight: 1.5,
          }}
        >
          ⚠ {failureReason || 'SECURITY DEFENSE TRIGGERED: SYSTEM LOCKDOWN'}
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('level-select');
            }}
            style={{ flex: 1, padding: '12px 18px', fontSize: '0.9rem' }}
          >
            ← SECTOR GRID
          </button>
          <button
            className="btn btn-red"
            onClick={() => {
              playSound('click');
              retryLevel();
            }}
            style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}
          >
            RETRY HACK ↺
          </button>
        </div>
      </div>
    </div>
  );
}

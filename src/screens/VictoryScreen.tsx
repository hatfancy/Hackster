import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';
import { formatScore } from '../lib/scoring';

export default function VictoryScreen() {
  const profile = useGameStore((s) => s.profile);
  const stats = useGameStore((s) => s.stats);
  const navigate = useGameStore((s) => s.navigateTo);

  useEffect(() => {
    playSound('victory');
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="card-glow anim-fade-in"
        style={{
          maxWidth: 640,
          width: '100%',
          padding: '44px 32px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--gold)',
          boxShadow: '0 0 40px var(--gold-glow)',
          borderRadius: 'var(--r-xl)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
        }}
      >
        <span
          className="badge badge-gold"
          style={{ fontSize: '0.8rem', letterSpacing: '0.25em', marginBottom: 16 }}
        >
          ★ OVERWATCH OVERTHROWN ★
        </span>

        <h1
          className="neon-gold"
          style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          ROOT CONTROL ACQUIRED
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            color: 'var(--cyan)',
            marginBottom: 28,
            letterSpacing: '0.1em',
          }}
        >
          CONGRATULATIONS, MASTER HACKER {profile.name || 'OPERATIVE'}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          Helix Corporation's global neural security citadel has been dismantled. You navigated the
          ancient Caesar ciphers, decoded binary streams, solved algorithmic locks, and breached the
          autonomous AI core. The shadow network is liberated.
        </p>

        {/* Final stats summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            background: 'rgba(2, 2, 10, 0.6)',
            padding: '20px',
            borderRadius: 'var(--r-md)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            marginBottom: 36,
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              FINAL SCORE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 700 }}>
              {formatScore(stats.totalScore)} PTS
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              TOTAL XP
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--cyan)', fontWeight: 700 }}>
              {stats.totalXP.toLocaleString()} XP
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('dashboard');
            }}
            style={{ flex: 1, padding: '14px 20px', fontSize: '0.95rem' }}
          >
            VIEW DOSSIER 📊
          </button>
          <button
            className="btn btn-gold"
            onClick={() => {
              playSound('click');
              navigate('level-select');
            }}
            style={{ flex: 1, padding: '14px 20px', fontSize: '0.95rem' }}
          >
            SECTOR GRID →
          </button>
        </div>
      </div>
    </div>
  );
}

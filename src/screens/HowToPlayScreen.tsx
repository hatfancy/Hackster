import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

export default function HowToPlayScreen() {
  const navigate = useGameStore((s) => s.navigateTo);

  const sections = [
    {
      title: '01 // OBJECTIVE',
      badge: 'MISSION',
      badgeColor: 'badge-cyan',
      desc: 'Infiltrate Helix Corp by solving 10 progressive cyber-security encryption puzzles. Each level introduces real cryptographic concepts, logic algorithms, and binary protocols.',
    },
    {
      title: '02 // THE CLOCK & PENALTIES',
      badge: 'TIME SYSTEM',
      badgeColor: 'badge-purple',
      desc: 'Every terminal has an intrusion counter. Entering an incorrect decryption key deducts 10 SECONDS directly from your remaining time. Running out of time causes lock-out.',
    },
    {
      title: '03 // HINTS & SCORING',
      badge: 'INTEL SUPPORT',
      badgeColor: 'badge-green',
      desc: 'You can tap up to 3 Intel Decryption hints per level. Each hint expends tactical time (-15s), but guides you closer to the bypass string. Complete levels quickly without hints to score max points.',
    },
    {
      title: '04 // RANKS & ACHIEVEMENTS',
      badge: 'PROGRESSION',
      badgeColor: 'badge-cyan',
      desc: 'Climb the ranks from ROOKIE HACKER to MASTER HACKER as you conquer sectors. Unlock 10 secret achievements by mastering challenges and maintaining win streaks.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '40px 20px',
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span
          className="badge badge-cyan"
          style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: 12 }}
        >
          ◈ PROTOCOL MANUAL ◈
        </span>
        <h1 className="neon-cyan" style={{ fontSize: '2.4rem', marginBottom: 8 }}>
          OPERATIVE FIELD MANUAL
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}
        >
          Rules of engagement for shadow network penetration
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 36 }}>
        {sections.map((sec, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '24px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--cyan)' }}>{sec.title}</h3>
              <span className={`badge ${sec.badgeColor}`}>{sec.badge}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {sec.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button
          className="btn btn-cyan"
          style={{ minWidth: 200, padding: '12px 24px' }}
          onClick={() => {
            playSound('click');
            navigate('title');
          }}
        >
          ← RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
}

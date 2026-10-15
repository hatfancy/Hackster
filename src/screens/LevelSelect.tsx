import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels';
import { playSound } from '../lib/sounds';

export default function LevelSelect() {
  const highestUnlocked = useGameStore((s) => s.highestUnlockedLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const levelResults = useGameStore((s) => s.levelResults);
  const rank = useGameStore((s) => s.rank);
  const profile = useGameStore((s) => s.profile);
  const startLevel = useGameStore((s) => s.startLevel);
  const navigate = useGameStore((s) => s.navigateTo);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'badge-cyan';
      case 'Easy': return 'badge-green';
      case 'Intermediate': return 'badge-purple';
      case 'Hard': return 'badge-purple';
      case 'Expert': return 'badge-red';
      case 'Master': return 'badge-gold';
      default: return 'badge-cyan';
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '32px 20px',
        maxWidth: 1040,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 className="neon-cyan" style={{ fontSize: '2rem' }}>
              SECTOR GRID
            </h1>
            <span className="badge badge-purple">{rank}</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            OPERATIVE: <span style={{ color: 'var(--cyan)' }}>{profile.name || 'UNKNOWN'}</span> | COMPLETED: {completedLevels.length}/10
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('dashboard');
            }}
          >
            📊 STATS HUB
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('settings');
            }}
          >
            ⚙ SETTINGS
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('title');
            }}
          >
            ← TITLE
          </button>
        </div>
      </div>

      {/* Grid of 10 levels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {LEVELS.map((lvl) => {
          const isUnlocked = lvl.id <= highestUnlocked;
          const isCompleted = completedLevels.includes(lvl.id);
          const result = levelResults[lvl.id];

          return (
            <div
              key={lvl.id}
              className={`card ${isUnlocked ? 'cursor-pointer' : ''}`}
              style={{
                position: 'relative',
                padding: '24px 20px',
                background: isCompleted
                  ? 'rgba(0, 255, 136, 0.04)'
                  : isUnlocked
                  ? 'var(--bg-glass)'
                  : 'rgba(10, 10, 20, 0.4)',
                border: isCompleted
                  ? '1px solid rgba(0, 255, 136, 0.4)'
                  : isUnlocked
                  ? '1px solid var(--border)'
                  : '1px solid rgba(255,255,255,0.05)',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'all var(--t-normal)',
                transform: isUnlocked ? 'none' : 'scale(0.98)',
              }}
              onClick={() => {
                if (isUnlocked) {
                  playSound('click');
                  startLevel(lvl.id);
                } else {
                  playSound('wrongAnswer');
                }
              }}
            >
              {/* Badge row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: isCompleted ? 'var(--green)' : 'var(--cyan)',
                  }}
                >
                  LEVEL {lvl.id.toString().padStart(2, '0')}
                </span>
                <span className={`badge ${getDifficultyColor(lvl.difficulty)}`}>
                  {lvl.difficulty}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                {lvl.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 16,
                }}
              >
                {lvl.subtitle}
              </p>

              {/* Status / Score bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {isCompleted ? (
                  <>
                    <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ✓ INFILTRATED
                    </span>
                    <span style={{ color: 'var(--gold)' }}>
                      {result?.score ?? 0} PTS
                    </span>
                  </>
                ) : isUnlocked ? (
                  <>
                    <span style={{ color: 'var(--cyan)' }}>READY</span>
                    <span style={{ color: 'var(--text-secondary)' }}>⏱ {lvl.timeLimit}s</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>🔒 ENCRYPTED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

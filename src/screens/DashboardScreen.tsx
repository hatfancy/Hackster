import { useGameStore } from '../store/gameStore';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { playSound } from '../lib/sounds';
import { formatScore } from '../lib/scoring';

export default function DashboardScreen() {
  const profile = useGameStore((s) => s.profile);
  const rank = useGameStore((s) => s.rank);
  const stats = useGameStore((s) => s.stats);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const userAchievements = useGameStore((s) => s.achievements);
  const navigate = useGameStore((s) => s.navigateTo);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const statCards = [
    { label: 'TOTAL SCORE', val: formatScore(stats.totalScore), color: 'var(--green)' },
    { label: 'TOTAL XP', val: stats.totalXP.toLocaleString(), color: 'var(--cyan)' },
    { label: 'CURRENT STREAK', val: `${stats.currentStreak} 🔥`, color: 'var(--gold)' },
    { label: 'BEST STREAK', val: stats.bestStreak, color: 'var(--purple)' },
    { label: 'ATTEMPTS', val: stats.totalAttempts, color: 'var(--text-primary)' },
    { label: 'WRONG GUESSES', val: stats.totalWrongAnswers, color: 'var(--red)' },
    { label: 'HINTS EXPENDED', val: stats.totalHintsUsed, color: 'var(--gold)' },
    { label: 'TIME PLAYED', val: formatTime(stats.totalTimePlayed), color: 'var(--cyan)' },
  ];

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '36px 20px',
        maxWidth: 1000,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
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
            <h1 className="neon-cyan" style={{ fontSize: '2.2rem' }}>
              OPERATIVE DOSSIER
            </h1>
            <span className="badge badge-purple">{rank}</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ALIAS: <span style={{ color: 'var(--cyan)' }}>{profile.name || 'UNKNOWN'}</span> | SECTORS INFILTRATED: {completedLevels.length}/10
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            playSound('click');
            navigate('level-select');
          }}
        >
          ← BACK TO SECTORS
        </button>
      </div>

      {/* Stats Grid */}
      <h3 style={{ fontSize: '1.1rem', color: 'var(--cyan)', marginBottom: 16 }}>
        TELEMETRY & STATS
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {statCards.map((st, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}
            >
              {st.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: st.color,
              }}
            >
              {st.val}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--gold)' }}>
          HALL OF ACHIEVEMENTS ({userAchievements.length}/{ALL_ACHIEVEMENTS.length})
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {ALL_ACHIEVEMENTS.map((ach) => {
          const unlocked = userAchievements.some((u) => u.id === ach.id);
          return (
            <div
              key={ach.id}
              className="card"
              style={{
                display: 'flex',
                gap: 14,
                padding: '16px',
                background: unlocked ? 'rgba(255, 215, 0, 0.05)' : 'rgba(10, 10, 20, 0.4)',
                border: unlocked ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                opacity: unlocked ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  fontSize: '1.8rem',
                  lineHeight: 1,
                  filter: unlocked ? 'drop-shadow(0 0 6px var(--gold))' : 'grayscale(100%)',
                }}
              >
                {ach.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginBottom: 4,
                  }}
                >
                  {ach.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {ach.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

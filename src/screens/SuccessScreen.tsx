import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../data/levels';
import { playSound } from '../lib/sounds';
import { formatScore } from '../lib/scoring';

export default function SuccessScreen() {
  const result = useGameStore((s) => s.levelCompletionResult);
  const continueToNext = useGameStore((s) => s.continueToNext);
  const navigate = useGameStore((s) => s.navigateTo);

  useEffect(() => {
    playSound('levelComplete');
  }, []);

  if (!result) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>No completion data available.</p>
        <button className="btn btn-cyan" onClick={() => navigate('level-select')}>
          Back to Level Select
        </button>
      </div>
    );
  }

  const level = getLevelById(result.levelId);

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
          maxWidth: 580,
          width: '100%',
          padding: '36px 30px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--green)',
          boxShadow: '0 0 30px var(--green-glow)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
        }}
      >
        <span
          className="badge badge-green"
          style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: 16 }}
        >
          ◈ NODE INFILTRATION SUCCESSFUL ◈
        </span>

        <h1 className="neon-green" style={{ fontSize: '2.2rem', marginBottom: 6 }}>
          ACCESS GRANTED
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            marginBottom: 28,
          }}
        >
          SECTOR {result.levelId.toString().padStart(2, '0')}: {level?.title || 'FIREWALL BREACHED'}
        </p>

        {/* Score Breakdown Panel */}
        <div
          style={{
            background: 'rgba(2, 2, 10, 0.6)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 'var(--r-md)',
            padding: '20px 24px',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              marginBottom: 10,
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>TIME TAKEN:</span>
            <span style={{ color: 'var(--text-primary)' }}>{result.timeTaken} SECONDS</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              marginBottom: 10,
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>INTEL HINTS USED:</span>
            <span style={{ color: result.hintsUsed === 0 ? 'var(--green)' : 'var(--gold)' }}>
              {result.hintsUsed} {result.hintsUsed === 0 && '(NO HINT BONUS)'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              marginBottom: 16,
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>INCORRECT ATTEMPTS:</span>
            <span style={{ color: result.wrongAnswers === 0 ? 'var(--green)' : 'var(--red)' }}>
              {result.wrongAnswers} {result.wrongAnswers === 0 && '(PERFECT BONUS)'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--green)' }}>
              MISSION SCORE
            </span>
            <span
              className="neon-green"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.8rem',
                fontWeight: 700,
              }}
            >
              +{formatScore(result.score)}
            </span>
          </div>
        </div>

        {/* Solution explanation */}
        {level?.solutionExplanation && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              marginBottom: 28,
              lineHeight: 1.5,
              textAlign: 'left',
              borderLeft: '2px solid var(--green)',
            }}
          >
            <strong style={{ color: 'var(--green)' }}>SYSTEM ANALYSIS:</strong> {level.solutionExplanation}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 14 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('level-select');
            }}
            style={{ flex: 1, padding: '12px 18px', fontSize: '0.9rem' }}
          >
            SECTOR GRID
          </button>
          <button
            className="btn btn-green"
            onClick={() => {
              playSound('click');
              continueToNext();
            }}
            style={{ flex: 2, padding: '12px 20px', fontSize: '0.95rem' }}
          >
            NEXT INTRUSION →
          </button>
        </div>
      </div>
    </div>
  );
}

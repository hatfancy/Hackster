import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../data/levels';
import { playSound } from '../lib/sounds';
import { getRemainingTime } from '../lib/scoring';

export default function PuzzleScreen() {
  const currentLevelId = useGameStore((s) => s.currentLevel);
  const activeRun = useGameStore((s) => s.activeRun);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const useHint = useGameStore((s) => s.useHint);
  const pauseLevel = useGameStore((s) => s.pauseLevel);
  const resumeLevel = useGameStore((s) => s.resumeLevel);
  const failLevel = useGameStore((s) => s.failLevel);
  const navigate = useGameStore((s) => s.navigateTo);

  const level = getLevelById(currentLevelId);
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; type: 'error' | 'warning' } | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(level?.timeLimit ?? 120);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  // Sync remaining seconds from activeRun
  useEffect(() => {
    if (!activeRun) return;

    const tick = () => {
      if (activeRun.isPaused) {
        setRemainingSeconds(activeRun.remainingAtPause ?? 0);
        return;
      }
      const rem = getRemainingTime(
        activeRun.deadline,
        activeRun.remainingAtPause,
        activeRun.pausedAt,
        activeRun.isPaused
      );
      setRemainingSeconds(rem);

      if (rem <= 0) {
        playSound('failure');
        failLevel('INTRUSION COUNTER EXPIRED — LOCKOUT DETECTED');
      } else if (rem <= 10) {
        playSound('timerWarning');
      }
    };

    tick();
    timerRef.current = window.setInterval(tick, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeRun, failLevel]);

  // Keep revealed hints synced with activeRun.hintsUsed count
  useEffect(() => {
    if (activeRun && activeRun.hintsUsed > 0) {
      const arr = [];
      for (let i = 0; i < activeRun.hintsUsed; i++) arr.push(i);
      setRevealedHints(arr);
    }
  }, [activeRun?.hintsUsed]);

  if (!level || !activeRun) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>No active mission data found.</p>
        <button className="btn btn-cyan" onClick={() => navigate('level-select')}>
          Back to Level Select
        </button>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    playSound('click');
    const result = submitAnswer(answerInput, remainingSeconds);

    if (result === 'wrong') {
      playSound('wrongAnswer');
      setFeedback({ msg: 'ACCESS DENIED // 10s TIME PENALTY APPLIED', type: 'error' });
      setTimeout(() => setFeedback(null), 3000);
    } else if (result === 'already-complete') {
      setFeedback({ msg: 'NODE ALREADY COMPROMISED', type: 'warning' });
      setTimeout(() => setFeedback(null), 3000);
    }
    // If correct, store navigates automatically to 'success' or 'victory'
  };

  const handleUseHint = (hintIndex: number) => {
    if (revealedHints.includes(hintIndex)) return;
    playSound('hint');
    useHint(hintIndex, remainingSeconds);
    setRevealedHints((prev) => [...prev, hintIndex]);
  };

  const handleTogglePause = () => {
    playSound('click');
    if (activeRun.isPaused) {
      resumeLevel();
    } else {
      pauseLevel(remainingSeconds);
    }
  };

  // Timer format
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timerFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isUrgent = remainingSeconds <= 15;

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '24px 16px',
        maxWidth: 960,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Bar: Level Info & Live Timer */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 24px',
          marginBottom: 24,
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-cyan">LEVEL {level.id.toString().padStart(2, '0')}</span>
            <span className="badge badge-purple">{level.type.toUpperCase()}</span>
            <span className="badge badge-green">{level.difficulty}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', marginTop: 4 }}>{level.title}</h2>
        </div>

        {/* Timer display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: isUrgent ? 'var(--red)' : 'var(--cyan)',
                letterSpacing: '0.15em',
              }}
            >
              TIME REMAINING
            </span>
            <span
              className={isUrgent ? 'neon-red' : 'neon-cyan'}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                animation: isUrgent ? 'pulse 0.8s infinite' : 'none',
              }}
            >
              {timerFormatted}
            </span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleTogglePause}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            {activeRun.isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
        </div>
      </div>

      {/* Main Grid: Briefing/Clues & Input */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Left Column: Briefing & Clues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Briefing */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--cyan)',
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}
            >
              MISSION BRIEFING //
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
              }}
            >
              {level.briefing}
            </p>
          </div>

          {/* Objective & Clues */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-purple)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--purple)',
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}
            >
              INTERCEPTED CLUES //
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {level.clues.map((clue, idx) => (
                <li
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    background: 'rgba(2, 2, 10, 0.5)',
                    borderRadius: 'var(--r-sm)',
                    borderLeft: '3px solid var(--cyan)',
                  }}
                >
                  {clue}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Console Input & Hints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Decryption Input Card */}
          <div
            className="card-glow"
            style={{
              padding: '24px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--green)',
                letterSpacing: '0.15em',
                marginBottom: 12,
              }}
            >
              OVERRIDE CONSOLE //
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  className="input font-mono"
                  placeholder="ENTER DECRYPTION KEY..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value.toUpperCase())}
                  disabled={activeRun.isPaused}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1.1rem',
                    letterSpacing: '0.15em',
                    backgroundColor: 'rgba(2, 2, 10, 0.7)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

              {feedback && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    marginBottom: 16,
                    background: feedback.type === 'error' ? 'rgba(255, 34, 68, 0.15)' : 'rgba(255, 215, 0, 0.15)',
                    color: feedback.type === 'error' ? 'var(--red)' : 'var(--gold)',
                    border: feedback.type === 'error' ? '1px solid var(--red)' : '1px solid var(--gold)',
                  }}
                >
                  {feedback.msg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-cyan"
                disabled={activeRun.isPaused || !answerInput.trim()}
                style={{ width: '100%', padding: '14px 20px', fontSize: '1rem' }}
              >
                SUBMIT DECRYPTION KEY ↵
              </button>
            </form>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginTop: 16,
              }}
            >
              <span>INCORRECT GUESSES: {activeRun.wrongAnswers}</span>
              <span>WRONG ATTEMPT: −10s</span>
            </div>
          </div>

          {/* Tactical Hints Card */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.15em',
                }}
              >
                INTEL HINTS ({activeRun.hintsUsed}/3)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                −15s PER HINT
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {level.hints.map((hint, index) => {
                const isRevealed = revealedHints.includes(index);
                return (
                  <div
                    key={hint.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--r-sm)',
                      background: isRevealed ? 'rgba(255, 215, 0, 0.08)' : 'rgba(2, 2, 10, 0.4)',
                      border: isRevealed ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {isRevealed ? (
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          color: 'var(--gold)',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        💡 {hint.text}
                      </p>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleUseHint(index)}
                        disabled={activeRun.isPaused || (index > 0 && !revealedHints.includes(index - 1))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>UNLOCK INTEL HINT #{index + 1}</span>
                        <span style={{ color: 'var(--gold)' }}>−{hint.penaltySeconds}s</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Abort button */}
          <button
            className="btn btn-secondary"
            onClick={() => {
              playSound('click');
              navigate('level-select');
            }}
            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
          >
            ← ABORT TO LEVEL SELECT
          </button>
        </div>
      </div>
    </div>
  );
}

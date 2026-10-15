import { useState, type FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

export default function ProfileSetup() {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const startNewGame = useGameStore((s) => s.startNewGame);
  const navigate = useGameStore((s) => s.navigateTo);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = handle.trim();
    if (!clean) {
      setError('ALIAS CANNOT BE EMPTY');
      playSound('wrongAnswer');
      return;
    }
    if (clean.length < 2 || clean.length > 16) {
      setError('ALIAS MUST BE BETWEEN 2 AND 16 CHARACTERS');
      playSound('wrongAnswer');
      return;
    }
    playSound('success');
    startNewGame(clean);
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="card-glow anim-fade-in"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '40px 32px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
        }}
      >
        <span
          className="badge badge-cyan"
          style={{ fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: 16 }}
        >
          ◈ OPERATIVE IDENTIFICATION ◈
        </span>

        <h2
          className="neon-cyan"
          style={{
            fontSize: '1.8rem',
            marginBottom: 8,
          }}
        >
          CREATE OPERATIVE ALIAS
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: 32,
          }}
        >
          Initialize your cyber identity on the shadow network.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label
              htmlFor="handle-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--cyan)',
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}
            >
              OPERATIVE HANDLE //
            </label>
            <input
              id="handle-input"
              type="text"
              className="input font-mono"
              placeholder="e.g. ZERO_COOL, CIPHER_99"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              autoFocus
              maxLength={16}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                backgroundColor: 'rgba(2, 2, 10, 0.6)',
                border: error ? '1px solid var(--red)' : '1px solid var(--border)',
              }}
            />
            {error && (
              <p
                style={{
                  color: 'var(--red)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  marginTop: 6,
                  letterSpacing: '0.05em',
                }}
              >
                ⚠ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-cyan"
            style={{ width: '100%', padding: '14px 20px', fontSize: '1rem', marginBottom: 16 }}
          >
            INITIALIZE NEURAL LINK →
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem' }}
            onClick={() => {
              playSound('click');
              navigate('title');
            }}
          >
            ← BACK TO TITLE
          </button>
        </form>
      </div>
    </div>
  );
}

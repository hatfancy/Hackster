import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { hasSave } from '../lib/persistence';
import { playSound } from '../lib/sounds';

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 10, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff8830';
      ctx.font = '14px Share Tech Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(char, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const id = setInterval(draw, 50);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.4,
      }}
    />
  );
}

export default function TitleScreen() {
  const navigate = useGameStore((s) => s.navigateTo);
  const profile = useGameStore((s) => s.profile);
  const hasExistingSave = hasSave() && profile.name;

  const handlePlay = () => {
    playSound('click');
    if (hasExistingSave) {
      navigate('level-select');
    } else {
      navigate('profile-setup');
    }
  };

  const handleContinue = () => {
    playSound('click');
    navigate('level-select');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MatrixRain />

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,240,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="anim-fade-in"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '24px 16px',
          maxWidth: 600,
          width: '100%',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span
            className="badge badge-cyan"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}
          >
            ◈ SYSTEM ONLINE ◈
          </span>
        </div>

        <h1
          className="neon-cyan"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          HACK<span style={{ color: 'var(--purple)', textShadow: '0 0 20px var(--purple)' }}>
            //
          </span>BREAK
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            marginBottom: 48,
          }}
        >
          CYBERPUNK HACKING PUZZLE ADVENTURE
        </p>

        {/* Menu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 280,
            margin: '0 auto',
          }}
        >
          {hasExistingSave ? (
            <button className="btn btn-primary btn-lg" onClick={handleContinue}>
              ▶ CONTINUE
            </button>
          ) : null}

          <button
            className={`btn btn-${hasExistingSave ? 'secondary' : 'primary'} btn-lg`}
            onClick={handlePlay}
          >
            {hasExistingSave ? '⊕ NEW GAME' : '▶ PLAY'}
          </button>

          {hasExistingSave && (
            <button
              className="btn btn-secondary"
              onClick={() => { playSound('click'); navigate('level-select'); }}
            >
              ▤ LEVELS
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => { playSound('click'); navigate('how-to-play'); }}
          >
            ? HOW TO PLAY
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => { playSound('click'); navigate('settings'); }}
          >
            ⚙ SETTINGS
          </button>

          {hasExistingSave && (
            <button
              className="btn btn-ghost"
              onClick={() => { playSound('click'); navigate('dashboard'); }}
            >
              📊 DASHBOARD
            </button>
          )}
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: 48,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
          }}
        >
          ALL HACKING IS SIMULATED · NO REAL SYSTEMS ARE AFFECTED
        </p>
      </div>
    </div>
  );
}

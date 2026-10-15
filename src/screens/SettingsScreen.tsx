import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

export default function SettingsScreen() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const resetGame = useGameStore((s) => s.resetGame);
  const navigate = useGameStore((s) => s.navigateTo);

  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggleSound = () => {
    playSound('click');
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleMotion = () => {
    playSound('click');
    updateSettings({ reducedMotion: !settings.reducedMotion });
  };

  const handleToggleSaveIndicator = () => {
    playSound('click');
    updateSettings({ showSaveIndicator: !settings.showSaveIndicator });
  };

  const handleResetData = () => {
    if (!confirmReset) {
      playSound('wrongAnswer');
      setConfirmReset(true);
      return;
    }
    playSound('failure');
    resetGame();
  };

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
          maxWidth: 540,
          width: '100%',
          padding: '36px 30px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            className="badge badge-cyan"
            style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: 8 }}
          >
            ◈ CONFIGURATION ◈
          </span>
          <h2 className="neon-cyan" style={{ fontSize: '1.8rem' }}>
            SYSTEM SETTINGS
          </h2>
        </div>

        {/* Setting items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
          {/* Sound */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                AUDIO SYNTHESIS
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Procedural terminal sound effects
              </div>
            </div>
            <button
              className={`btn ${settings.soundEnabled ? 'btn-cyan' : 'btn-secondary'}`}
              onClick={handleToggleSound}
              style={{ minWidth: 90, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                REDUCED MOTION
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Disable scanlines and pulse animations
              </div>
            </div>
            <button
              className={`btn ${settings.reducedMotion ? 'btn-purple' : 'btn-secondary'}`}
              onClick={handleToggleMotion}
              style={{ minWidth: 90, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Save Indicator */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                AUTOSAVE TELEMETRY
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Visual indicator on state changes
              </div>
            </div>
            <button
              className={`btn ${settings.showSaveIndicator ? 'btn-green' : 'btn-secondary'}`}
              onClick={handleToggleSaveIndicator}
              style={{ minWidth: 90, padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {settings.showSaveIndicator ? 'SHOWN' : 'HIDDEN'}
            </button>
          </div>

          {/* Reset Progress */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              background: 'rgba(255, 34, 68, 0.05)',
              border: '1px solid rgba(255, 34, 68, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--red)' }}>
                  PURGE OPERATIVE DATA
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Irreversibly resets all levels and stats
                </div>
              </div>
              <button
                className="btn btn-red"
                onClick={handleResetData}
                style={{ minWidth: 90, padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {confirmReset ? 'CONFIRM PURGE?' : 'PURGE'}
              </button>
            </div>
            {confirmReset && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--red)',
                  marginTop: 10,
                }}
              >
                ⚠ Click again to confirm complete reset of all game progress!
              </p>
            )}
          </div>
        </div>

        <button
          className="btn btn-cyan"
          style={{ width: '100%', padding: '12px 20px', fontSize: '0.95rem' }}
          onClick={() => {
            playSound('click');
            navigate('level-select');
          }}
        >
          ← BACK TO SECTOR GRID
        </button>
      </div>
    </div>
  );
}

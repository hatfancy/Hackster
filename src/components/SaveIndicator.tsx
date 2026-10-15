import { useGameStore } from '../store/gameStore';

export default function SaveIndicator() {
  const saveStatus = useGameStore((s) => s.saveStatus);
  const showSetting = useGameStore((s) => s.settings.showSaveIndicator);

  if (!showSetting || saveStatus === 'idle') return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 'var(--r-sm)',
        background: 'rgba(8, 8, 20, 0.85)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: saveStatus === 'error' ? 'var(--red)' : 'var(--cyan)',
        boxShadow: saveStatus === 'error' ? '0 0 10px var(--red-glow)' : '0 0 10px var(--cyan-glow)',
        transition: 'all var(--t-normal)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: saveStatus === 'error' ? 'var(--red)' : 'var(--green)',
          boxShadow: saveStatus === 'saved' ? '0 0 8px var(--green)' : 'none',
        }}
      />
      <span>
        {saveStatus === 'saved' && 'PROGRESS SAVED'}
        {saveStatus === 'error' && 'SAVE FAILED'}
      </span>
    </div>
  );
}

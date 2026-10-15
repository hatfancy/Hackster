import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../lib/sounds';

export default function TutorialScreen() {
  const profile = useGameStore((s) => s.profile);
  const startLevel = useGameStore((s) => s.startLevel);
  const navigate = useGameStore((s) => s.navigateTo);
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'WELCOME TO THE RESISTANCE',
      badge: 'MISSION BRIEFING',
      content: `Welcome to the grid, Agent ${profile.name || 'OPERATIVE'}.\n\nHelix Corporation controls the global data grid through an automated security citadel known as THE OVERWATCH. Your objective is to crack all 10 security firewalls and extract the master root keys.`,
    },
    {
      title: 'THE TERMINAL INTERFACE',
      badge: 'INTERFACE INTEL',
      content: `Each level gives you:\n• Target Objective & Mission Briefing\n• Live Intrusion Timer (Act quickly for maximum XP & Rank)\n• Terminal Clues and Encrypted Telemetry\n• Emergency Intel Hints (deducts tactical time)\n• Decryption Key Input Console`,
    },
    {
      title: 'TIME & PENALTIES',
      badge: 'TACTICAL ALERT',
      content: `Security systems monitor every keystroke.\n\n• WRONG GUESS: Incurs an immediate −10s time penalty!\n• TIME RUN OUT: The terminal locks down and the mission fails.\n• ACCURACY: Clean, fast solutions unlock prestigious achievements and rank promotions.`,
    },
  ];

  const handleNext = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      playSound('success');
      startLevel(1);
    }
  };

  const handleSkip = () => {
    playSound('click');
    navigate('level-select');
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
          maxWidth: 620,
          width: '100%',
          padding: '40px 32px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span className="badge badge-cyan">{steps[step].badge}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            STEP {step + 1} / {steps.length}
          </span>
        </div>

        <h2 className="neon-cyan" style={{ fontSize: '1.6rem', marginBottom: 16 }}>
          {steps[step].title}
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-line',
            lineHeight: 1.7,
            minHeight: 140,
            marginBottom: 32,
            background: 'rgba(2, 2, 10, 0.4)',
            padding: 16,
            borderRadius: 'var(--r-sm)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          {steps[step].content}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary"
            onClick={handleSkip}
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            SKIP TUTORIAL
          </button>
          <button
            className="btn btn-cyan"
            onClick={handleNext}
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            {step < steps.length - 1 ? 'NEXT PROTOCOL →' : 'BEGIN MISSION 01 →'}
          </button>
        </div>
      </div>
    </div>
  );
}

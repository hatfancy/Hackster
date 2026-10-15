import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { setMuted } from './lib/sounds';

// Screens
import TitleScreen from './screens/TitleScreen';
import ProfileSetup from './screens/ProfileSetup';
import TutorialScreen from './screens/TutorialScreen';
import LevelSelect from './screens/LevelSelect';
import PuzzleScreen from './screens/PuzzleScreen';
import SuccessScreen from './screens/SuccessScreen';
import FailureScreen from './screens/FailureScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import VictoryScreen from './screens/VictoryScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';

// Global UI
import SaveIndicator from './components/SaveIndicator';
import AchievementToast from './components/AchievementToast';
import RankUpModal from './components/RankUpModal';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const settings = useGameStore((s) => s.settings);
  const initGame = useGameStore((s) => s.initGame);
  const newAchievement = useGameStore((s) => s.newAchievement);
  const showRankUp = useGameStore((s) => s.showRankUp);

  // Init on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Sync mute state
  useEffect(() => {
    setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Reduced-motion class on root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings.reducedMotion]);

  const renderScreen = () => {
    switch (screen) {
      case 'title':       return <TitleScreen />;
      case 'profile-setup': return <ProfileSetup />;
      case 'tutorial':    return <TutorialScreen />;
      case 'level-select': return <LevelSelect />;
      case 'puzzle':      return <PuzzleScreen />;
      case 'success':     return <SuccessScreen />;
      case 'failure':     return <FailureScreen />;
      case 'dashboard':   return <DashboardScreen />;
      case 'settings':    return <SettingsScreen />;
      case 'victory':     return <VictoryScreen />;
      case 'how-to-play': return <HowToPlayScreen />;
      default:            return <TitleScreen />;
    }
  };

  return (
    <div className="bg-grid scanlines" style={{ minHeight: '100dvh', position: 'relative' }}>
      {renderScreen()}
      <SaveIndicator />
      {newAchievement && <AchievementToast achievement={newAchievement} />}
      {showRankUp && <RankUpModal rank={showRankUp} />}
    </div>
  );
}

import type { Achievement } from '../types/game';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'FIRST BLOOD',
    description: 'Complete your first level.',
    icon: '🩸',
  },
  {
    id: 'no_hints_level',
    title: 'PURE LOGIC',
    description: 'Complete any level without using a single hint.',
    icon: '🧠',
  },
  {
    id: 'speed_demon',
    title: 'SPEED DEMON',
    description: 'Complete a level with more than 80% time remaining.',
    icon: '⚡',
  },
  {
    id: 'perfect_run',
    title: 'PERFECT DECRYPTION',
    description: 'Complete a level with no wrong answers and no hints.',
    icon: '💎',
  },
  {
    id: 'pro_hacker',
    title: 'GOING PRO',
    description: 'Earn the PRO HACKER rank by completing Level 4.',
    icon: '🔓',
  },
  {
    id: 'elite_hacker',
    title: 'ELITE STATUS',
    description: 'Earn the ELITE HACKER rank by completing Level 8.',
    icon: '🏆',
  },
  {
    id: 'master_hacker',
    title: 'MASTER OF THE NET',
    description: 'Earn MASTER HACKER by defeating the APEX Protocol.',
    icon: '👑',
  },
  {
    id: 'ten_complete',
    title: 'TEN LEVELS COMPLETE',
    description: 'Complete all 10 levels of HACK//BREAK.',
    icon: '🔟',
  },
  {
    id: 'no_hints_game',
    title: 'GHOST PROTOCOL',
    description: 'Complete the entire game without using any hints.',
    icon: '👻',
  },
  {
    id: 'comeback_kid',
    title: 'COMEBACK KID',
    description: 'Fail a level then come back and complete it.',
    icon: '🔄',
  },
  {
    id: 'collector',
    title: 'HINT COLLECTOR',
    description: 'Use all 3 hints on a single level.',
    icon: '💡',
  },
  {
    id: 'streak_3',
    title: 'ON A ROLL',
    description: 'Complete 3 levels in a row without failing.',
    icon: '🔥',
  },
];

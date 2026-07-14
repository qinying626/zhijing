import { create } from 'zustand';

interface GameStore {
  zone: string;
  battleState: 'idle' | 'fighting' | 'victory' | 'defeat';
  hp: number;
  monsterHp: number;
  monsterName: string;
  currentQuestionId: string;
  setZone: (zone: string) => void;
  setBattle: (state: Partial<GameStore>) => void;
  resetBattle: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  zone: 'math-hall',
  battleState: 'idle',
  hp: 100,
  monsterHp: 0,
  monsterName: '',
  currentQuestionId: '',
  setZone: (zone) => set({ zone }),
  setBattle: (state) => set(state),
  resetBattle: () => set({ battleState: 'idle', monsterHp: 0, monsterName: '', currentQuestionId: '' }),
}));

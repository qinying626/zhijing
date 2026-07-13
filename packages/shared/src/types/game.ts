export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';

export interface GameState {
  characterId: string;
  currentZone: string;
  hp: number;
  maxHp: number;
  battleState: BattleState;
  currentQuestion?: string;
}

export interface BattleResult {
  victory: boolean;
  experienceGained: number;
  drops: Drop[];
  hpRemaining: number;
}

export interface Drop {
  type: 'experience' | 'item';
  name: string;
  value: number;
}

export interface ZoneInfo {
  id: string;
  name: string;
  subject: string;
  description: string;
  requiredLevel: number;
  zones: ZoneInfo[];
}

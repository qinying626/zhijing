import { Schema, type } from '@colyseus/schema';

export class PlayerState extends Schema {
  @type('string') characterId: string = '';
  @type('string') name: string = '';
  @type('number') hp: number = 100;
  @type('number') maxHp: number = 100;
  @type('number') level: number = 1;
  @type('number') experience: number = 0;
  @type('string') currentZone: string = 'math-hall';
}

export class BattleState extends Schema {
  @type('string') state: 'idle' | 'fighting' | 'victory' | 'defeat' = 'idle';
  @type('string') currentQuestionId: string = '';
  @type('number') monsterHp: number = 100;
  @type('number') monsterMaxHp: number = 100;
  @type('string') monsterName: string = '';
}

export class GameRoomState extends Schema {
  @type(PlayerState) player = new PlayerState();
  @type(BattleState) battle = new BattleState();
}

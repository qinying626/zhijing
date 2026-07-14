import { Room, Client } from '@colyseus/core';
import { GameRoomState } from '../models/GameState';

const MONSTER_HP_MAP: Record<string, number> = { basic: 30, advanced: 60, challenge: 100 };

export class BattleRoom extends Room<GameRoomState> {
  maxClients = 1;

  onCreate(options: { characterId: string; name: string; level: number }) {
    this.setState(new GameRoomState());

    this.state.player.characterId = options.characterId;
    this.state.player.name = options.name;
    this.state.player.level = options.level;
    this.state.player.hp = 100;
    this.state.player.maxHp = 100;

    this.onMessage('start_battle', (client: Client, data: { monsterName: string; difficulty: string; questionId: string }) => {
      this.state.battle.state = 'fighting';
      this.state.battle.monsterName = data.monsterName;
      this.state.battle.monsterMaxHp = MONSTER_HP_MAP[data.difficulty] || 30;
      this.state.battle.monsterHp = this.state.battle.monsterMaxHp;
      this.state.battle.currentQuestionId = data.questionId;
    });

    this.onMessage('answer', (client: Client, data: { correct: boolean; experience: number }) => {
      if (this.state.battle.state !== 'fighting') return;

      if (data.correct) {
        const damage = Math.ceil(this.state.battle.monsterMaxHp * 0.3);
        this.state.battle.monsterHp = Math.max(0, this.state.battle.monsterHp - damage);
        this.state.player.experience += data.experience;

        if (this.state.battle.monsterHp <= 0) {
          this.state.battle.state = 'victory';
          this.broadcast('battle_result', { victory: true, experience: data.experience });
        }
      } else {
        const damage = 15;
        this.state.player.hp = Math.max(0, this.state.player.hp - damage);

        if (this.state.player.hp <= 0) {
          this.state.battle.state = 'defeat';
          this.broadcast('battle_result', { victory: false, experience: 0 });
        }
      }
    });

    this.onMessage('end_battle', () => {
      this.state.battle.state = 'idle';
      this.state.battle.currentQuestionId = '';
    });
  }

  onJoin(client: Client) {
    client.send('state', this.state.toJSON());
  }
}

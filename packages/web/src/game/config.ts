import { AUTO, type Types } from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';

export const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 640,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scene: [BootScene, MapScene, BattleScene],
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
};

import { Scene } from 'phaser';

export class BattleScene extends Scene {
  constructor() { super('Battle'); }

  create() {
    const zone = this.registry.get('currentZone') || 'math-hall';
    this.add.text(512, 40, `当前区域: ${zone}`, { fontSize: '24px', color: '#e2e8f0' }).setOrigin(0.5);

    // HP bar
    this.add.text(100, 100, '玩家 HP', { fontSize: '14px', color: '#94a3b8' });
    this.add.rectangle(200, 110, 200, 16, 0x22c55e).setOrigin(0, 0.5);

    // Monster
    this.add.rectangle(512, 250, 120, 120, 0xef4444);
    this.add.text(512, 320, '数学怪兽', { fontSize: '18px', color: '#e2e8f0' }).setOrigin(0.5);

    // Monster HP bar
    this.add.rectangle(412, 180, 200, 16, 0xef4444).setOrigin(0, 0.5);

    // Answer panel area (overlaid by React)
    this.add.text(512, 450, '答题区域 → React 覆盖层', { fontSize: '16px', color: '#94a3b8' }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(960, 40, '返回地图', { fontSize: '16px', color: '#3b82f6' }).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start('Map'));
  }
}

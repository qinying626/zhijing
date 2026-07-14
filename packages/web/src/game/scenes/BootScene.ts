import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() { super('Boot'); }

  create() {
    this.add.text(512, 280, '知境', { fontSize: '48px', color: '#e2e8f0' }).setOrigin(0.5);
    this.add.text(512, 340, '点击进入知境大陆', { fontSize: '20px', color: '#94a3b8' }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('Map');
    });
  }
}

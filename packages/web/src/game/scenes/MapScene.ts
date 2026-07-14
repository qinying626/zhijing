import { Scene } from 'phaser';

const ZONES = [
  { key: 'math-hall', label: '数理殿', x: 512, y: 200, color: 0x3b82f6 },
  { key: 'literature-pavilion', label: '文心阁', x: 300, y: 350, color: 0xef4444 },
  { key: 'spirit-forest', label: '灵语林', x: 724, y: 350, color: 0x22c55e },
  { key: 'world-map', label: '天地图', x: 300, y: 500, color: 0xf59e0b },
  { key: 'phenomena-court', label: '万象庭', x: 724, y: 500, color: 0xa855f7 },
  { key: 'plaza', label: '知行广场', x: 512, y: 400, color: 0x64748b },
];

export class MapScene extends Scene {
  constructor() { super('Map'); }

  create() {
    this.add.text(512, 50, '知境大陆', { fontSize: '32px', color: '#e2e8f0' }).setOrigin(0.5);

    for (const zone of ZONES) {
      const circle = this.add.circle(zone.x, zone.y, 50, zone.color).setInteractive({ useHandCursor: true });
      this.add.text(zone.x, zone.y + 70, zone.label, { fontSize: '16px', color: '#e2e8f0' }).setOrigin(0.5);

      circle.on('pointerdown', () => {
        this.registry.set('currentZone', zone.key);
        this.scene.start('Battle');
      });

      circle.on('pointerover', () => circle.setScale(1.2));
      circle.on('pointerout', () => circle.setScale(1));
    }
  }
}

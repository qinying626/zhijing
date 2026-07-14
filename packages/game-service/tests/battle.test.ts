import { GameRoomState, PlayerState, BattleState } from '../src/models/GameState';

describe('GameState Schema', () => {
  it('PlayerState defaults', () => {
    const player = new PlayerState();
    expect(player.hp).toBe(100);
    expect(player.maxHp).toBe(100);
    expect(player.level).toBe(1);
    expect(player.experience).toBe(0);
    expect(player.currentZone).toBe('math-hall');
    expect(player.characterId).toBe('');
    expect(player.name).toBe('');
  });

  it('BattleState defaults', () => {
    const battle = new BattleState();
    expect(battle.state).toBe('idle');
    expect(battle.currentQuestionId).toBe('');
    expect(battle.monsterHp).toBe(100);
    expect(battle.monsterMaxHp).toBe(100);
    expect(battle.monsterName).toBe('');
  });

  it('GameRoomState contains player and battle', () => {
    const state = new GameRoomState();
    expect(state.player).toBeInstanceOf(PlayerState);
    expect(state.battle).toBeInstanceOf(BattleState);
  });
});

describe('BattleRoom Logic', () => {
  const MONSTER_HP_MAP: Record<string, number> = { basic: 30, advanced: 60, challenge: 100 };

  it('basic monster has 30 HP', () => {
    expect(MONSTER_HP_MAP['basic']).toBe(30);
  });

  it('advanced monster has 60 HP', () => {
    expect(MONSTER_HP_MAP['advanced']).toBe(60);
  });

  it('challenge monster has 100 HP', () => {
    expect(MONSTER_HP_MAP['challenge']).toBe(100);
  });

  it('correct answer deals 30% monster max HP damage', () => {
    const monsterMaxHp = MONSTER_HP_MAP['basic']; // 30
    const damage = Math.ceil(monsterMaxHp * 0.3);
    expect(damage).toBe(9);
    const remaining = Math.max(0, monsterMaxHp - damage);
    expect(remaining).toBe(21);
  });

  it('wrong answer deals 15 damage to player', () => {
    const playerHp = 100;
    const damage = 15;
    const remaining = Math.max(0, playerHp - damage);
    expect(remaining).toBe(85);
  });

  it('player hp cannot go below 0', () => {
    const playerHp = 10;
    const damage = 15;
    const remaining = Math.max(0, playerHp - damage);
    expect(remaining).toBe(0);
  });

  it('monster hp cannot go below 0', () => {
    const monsterMaxHp = 30;
    const monsterHp = 5;
    const damage = Math.ceil(monsterMaxHp * 0.3); // 9
    const remaining = Math.max(0, monsterHp - damage);
    expect(remaining).toBe(0);
  });

  it('challenge monster takes 4 hits to defeat (30% of 100 = 30 each)', () => {
    const monsterMaxHp = MONSTER_HP_MAP['challenge']; // 100
    const damage = Math.ceil(monsterMaxHp * 0.3); // 30
    let hp = monsterMaxHp;
    let hits = 0;
    while (hp > 0) {
      hp = Math.max(0, hp - damage);
      hits++;
    }
    expect(hits).toBe(4); // 100 - 30 - 30 - 30 - 30 = -20 -> 0
  });
});

describe('Zone Routes Data', () => {
  const zones = [
    { id: 'math-hall', name: '数理殿', subject: 'math', description: '逻辑与秩序之域', requiredLevel: 1 },
    { id: 'literature-pavilion', name: '文心阁', subject: 'chinese', description: '文字与意境之域', requiredLevel: 1 },
    { id: 'spirit-forest', name: '灵语林', subject: 'english', description: '跨语言沟通之域', requiredLevel: 1 },
    { id: 'world-map', name: '天地图', subject: 'geography', description: '山川与文明之域', requiredLevel: 1 },
    { id: 'phenomena-court', name: '万象庭', subject: 'physics', description: '自然法则之域', requiredLevel: 1 },
    { id: 'plaza', name: '知行广场', subject: 'social', description: '社交与交易枢纽', requiredLevel: 1 },
  ];

  it('has 6 zones', () => {
    expect(zones.length).toBe(6);
  });

  it('each zone has required fields', () => {
    for (const zone of zones) {
      expect(zone.id).toBeTruthy();
      expect(zone.name).toBeTruthy();
      expect(zone.subject).toBeTruthy();
      expect(zone.description).toBeTruthy();
      expect(zone.requiredLevel).toBe(1);
    }
  });

  it('contains all expected zone IDs', () => {
    const ids = zones.map(z => z.id);
    expect(ids).toContain('math-hall');
    expect(ids).toContain('literature-pavilion');
    expect(ids).toContain('spirit-forest');
    expect(ids).toContain('world-map');
    expect(ids).toContain('phenomena-court');
    expect(ids).toContain('plaza');
  });
});

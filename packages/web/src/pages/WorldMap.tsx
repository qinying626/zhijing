import { useEffect, useRef } from 'react';
import { Game } from 'phaser';
import { gameConfig } from '../game/config';
import { AnswerPanel } from '../components/AnswerPanel';

export function WorldMap() {
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Game(gameConfig);
    }
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative">
      <div id="game-container" className="mx-auto" />
      <AnswerPanel />
    </div>
  );
}

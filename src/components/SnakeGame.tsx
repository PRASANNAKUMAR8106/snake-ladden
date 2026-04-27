/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, CANVAS_SIZE, INITIAL_SPEED } from '../constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  isPlayingMusic: boolean;
}

export default function SnakeGame({ onScoreUpdate, isPlayingMusic }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const timerRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause/start
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= CANVAS_SIZE / GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= CANVAS_SIZE / GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      const interval = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
      timerRef.current = window.setInterval(moveSnake, interval);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [moveSnake, isPaused, gameOver, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#09090b'; // zinc-950
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      // Dynamic color based on head/body and music pulse
      const alpha = isPlayingMusic ? 0.8 : 0.6;
      ctx.fillStyle = isHead ? `rgba(0, 243, 255, ${alpha + 0.2})` : `rgba(0, 243, 255, ${alpha - index * 0.05})`;
      
      // Neon glow effect for the head
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f3ff';
      } else {
        ctx.shadowBlur = 0;
      }

      const padding = 1;
      ctx.fillRect(
        segment.x * GRID_SIZE + padding,
        segment.y * GRID_SIZE + padding,
        GRID_SIZE - padding * 2,
        GRID_SIZE - padding * 2
      );
    });

    // Draw food
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
    
  }, [snake, food, isPlayingMusic]);

  return (
    <div className="relative group">
      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative profile-card bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
        />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-center p-6"
            >
              <div>
                {gameOver ? (
                  <>
                    <h2 className="text-4xl font-bold text-pink-500 neon-text-pink mb-2 font-mono">GAME OVER</h2>
                    <p className="text-zinc-400 mb-6 font-mono uppercase tracking-widest text-xs">System Failure Detected</p>
                    <button
                      onClick={resetGame}
                      className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
                    >
                      REBOOT SYSTEM
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-cyan-500 neon-text-cyan mb-2 font-mono">PAUSED</h2>
                    <p className="text-zinc-400 mb-6 font-mono uppercase tracking-widest text-xs">Waiting for Input...</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
                    >
                      RESUME SESSION
                    </button>
                    <p className="mt-4 text-[10px] text-zinc-500 uppercase tracking-tighter">Press SPACE to toggle</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Gamepad2, Headphones, Activity } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="scanline"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* Main Layout */}
      <main className="z-10 w-full max-w-6xl flex flex-col items-center gap-8 py-8 md:py-12">
        
        {/* Header Section */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <Headphones className="w-5 h-5 text-cyan-500 neon-text-cyan" />
              <div className="h-px w-8 bg-zinc-800"></div>
              <Gamepad2 className="w-5 h-5 text-pink-500 neon-text-pink" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
              NEON RHYTHM <span className="text-zinc-800 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]">SNAKE</span>
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] ml-1">Experimental Audio-Visual Synthesis v.1.0.4</p>
          </div>

          <div className="flex gap-4">
            <StatsDisplay label="CURRENT_SCORE" value={score.toString().padStart(4, '0')} color="cyan" />
            <StatsDisplay label="SESSION_MAX" value={highScore.toString().padStart(4, '0')} color="pink" />
          </div>
        </section>

        {/* Center Game Window */}
        <div className="relative">
          <div className="absolute -top-10 left-0 flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            Visual Stream Active
          </div>
          <SnakeGame onScoreUpdate={handleScoreUpdate} isPlayingMusic={isPlayingMusic} />
          <div className="absolute -bottom-10 right-0 text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">
            Control: ARROW_KEYS // Pause: SPACE_BAR
          </div>
        </div>

        {/* Music Interface */}
        <MusicPlayer onPlayStateChange={setIsPlayingMusic} />

        {/* Footer Hardware Info */}
        <footer className="w-full max-w-2xl px-4 flex justify-between items-center opacity-30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">A_G_S : TERMINAL_LINKED</span>
          </div>
          <div className="flex items-center gap-2">
             <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">CORE_TEMP : STABLE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatsDisplay({ label, value, color }: { label: string; value: string; color: 'cyan' | 'pink' }) {
  const colorClass = color === 'cyan' ? 'text-cyan-500 neon-text-cyan' : 'text-pink-500 neon-text-pink';
  const borderClass = color === 'cyan' ? 'border-cyan-500/20' : 'border-pink-500/20';

  return (
    <div className={`p-4 bg-zinc-900 border ${borderClass} rounded-xl min-w-[140px] relative overflow-hidden group`}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color === 'cyan' ? 'cyan' : 'pink'}-500 opacity-50`}></div>
      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-3xl font-mono font-bold tracking-tighter ${colorClass}`}>
        {value}
      </p>
      <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
        {color === 'cyan' ? <Activity className="w-12 h-12" /> : <Terminal className="w-12 h-12" />}
      </div>
    </div>
  );
}

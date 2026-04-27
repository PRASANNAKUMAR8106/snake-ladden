/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../constants';

interface MusicPlayerProps {
  onPlayStateChange: (isPlaying: boolean) => void;
}

export default function MusicPlayer({ onPlayStateChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    onPlayStateChange(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (dir: 'next' | 'prev') => {
    let nextIndex = dir === 'next' ? currentTrackIndex + 1 : currentTrackIndex - 1;
    if (nextIndex < 0) nextIndex = DUMMY_TRACKS.length - 1;
    if (nextIndex >= DUMMY_TRACKS.length) nextIndex = 0;
    
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Auto play next track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 10);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      {/* Hardware Accents */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
        onEnded={() => skipTrack('next')}
      />

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Album Art */}
        <div className="relative w-40 h-40 flex-shrink-0 group">
          <div className={`absolute -inset-2 bg-cyan-500/10 rounded-xl blur-lg transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className={`w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <div className="flex gap-[2px] items-end h-3 w-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-zinc-900"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Track Info & Controls */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white tracking-tight uppercase font-mono">{currentTrack.title}</h3>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 space-y-1">
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-600 tracking-tighter">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center md:justify-start gap-8">
            <button
              onClick={() => skipTrack('prev')}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-zinc-100 hover:bg-white text-zinc-900 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={() => skipTrack('next')}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            
            <div className="hidden lg:flex items-center gap-2 ml-4 text-zinc-600">
              <Volume2 className="w-4 h-4" />
              <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-zinc-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hardware labeling */}
      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-700">
        <div className="flex gap-4">
          <span>MODEL: NR-2026-SNAKE</span>
          <span>SRCH: AI_GEN_CORE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`}></div>
          <span>SIGNAL_READY</span>
        </div>
      </div>
    </div>
  );
}

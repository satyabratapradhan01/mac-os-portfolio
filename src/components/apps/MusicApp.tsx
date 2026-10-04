import React, { useState, useEffect, useRef } from 'react';
import { PLAYLIST } from '../../data/portfolioData';
import { SongItem } from '../../types';
import { sound } from '../../utils/sound';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music as MusicIcon,
  Heart,
  ListMusic,
  Disc,
  Radio
} from 'lucide-react';

interface MusicAppProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSongIndex: number;
  onSelectSong: (index: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  isPlaying,
  onTogglePlay,
  currentSongIndex,
  onSelectSong,
  volume,
  onVolumeChange,
}) => {
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const song = PLAYLIST[currentSongIndex] || PLAYLIST[0];

  // Track progress timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= song.duration) {
            onSelectSong((currentSongIndex + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, song.duration, currentSongIndex, onSelectSong]);

  // Audio spectrum visualizer animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (isPlaying) {
          height = Math.sin(phase + i * 0.4) * 20 + Math.cos(phase * 1.5 + i * 0.2) * 15 + 28;
        }

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth + 1.5,
          canvas.height - height,
          barWidth - 3,
          height
        );
      }

      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="music-app" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Header / Album Stage */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Album Artwork with Pulse */}
        <div className={`w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-gradient-to-tr ${song.coverGradient} p-6 flex flex-col justify-between shadow-2xl border border-white/20 relative overflow-hidden shrink-0 ${
          isPlaying ? 'scale-105 shadow-pink-500/20' : 'opacity-90'
        } transition-all duration-500`}>
          <Disc className={`w-8 h-8 text-white/80 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <div>
            <span className="text-[10px] uppercase font-bold text-white/75 tracking-wider">{song.genre}</span>
            <h2 className="text-base font-extrabold text-white mt-0.5 truncate">{song.album}</h2>
          </div>
        </div>

        {/* Track Info & Visualizer */}
        <div className="flex-1 max-w-md w-full space-y-4 text-center md:text-left">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-pink-300">
              Apple Music • Focus Radio
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2 truncate">
              {song.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">{song.artist}</p>
          </div>

          {/* Animated Spectrum Canvas */}
          <div className="h-16 bg-black/40 rounded-xl p-2 border border-white/10 flex items-center justify-center">
            <canvas ref={canvasRef} width={300} height={48} className="w-full h-full" />
          </div>

          {/* Scrubber */}
          <div className="space-y-1">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(progress / song.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Playlist Drawer */}
      <div className="bg-slate-900/90 border-t border-white/10 p-4 shrink-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectSong((currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => onSelectSong((currentSongIndex + 1) % PLAYLIST.length)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Playlist Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-md">
          {PLAYLIST.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onSelectSong(idx)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                currentSongIndex === idx
                  ? 'bg-pink-600 text-white font-semibold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

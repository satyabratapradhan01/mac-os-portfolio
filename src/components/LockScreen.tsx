import React, { useState, useEffect, useRef } from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { sound } from '../utils/sound';
import { ArrowRight, RotateCw, Power } from 'lucide-react';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ isLocked, onUnlock }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLocked) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isLocked]);

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playChime();
    onUnlock();
    setPassword('');
  };

  return (
    <div
      id="macos-lock-screen"
      className="fixed inset-0 z-[20000] bg-slate-950/80 backdrop-blur-3xl flex flex-col justify-between items-center py-16 px-4 text-white select-none animate-in fade-in duration-300"
    >
      {/* Top Clock */}
      <div className="text-center space-y-2">
        <div className="text-6xl sm:text-8xl font-thin tracking-tighter drop-shadow-lg font-sans">
          {time}
        </div>
        <div className="text-sm sm:text-base font-medium text-slate-300">
          {date}
        </div>
      </div>

      {/* Center User Profile & Unlock Field */}
      <div className="flex flex-col items-center max-w-xs w-full space-y-4">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
            <img
              src={DEVELOPER_PROFILE.avatar}
              alt={DEVELOPER_PROFILE.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
        </div>

        <div className="text-center">
          <h2 className="text-base font-bold text-white tracking-wide">
            {DEVELOPER_PROFILE.name}
          </h2>
          <span className="text-xs text-blue-300 font-medium">Touch ID or Enter Password</span>
        </div>

        <form onSubmit={handleUnlock} className="w-full relative">
          <input
            ref={inputRef}
            id="lock-screen-password"
            type="password"
            placeholder="Press Enter to Unlock..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/50 backdrop-blur-md text-center"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <span className="text-[10px] text-slate-400">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Enter</kbd> to unlock desktop
        </span>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-8 text-xs text-slate-300">
        <button
          onClick={() => {
            sound.playChime();
            onUnlock();
          }}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <RotateCw className="w-4 h-4" />
          </div>
          <span className="text-[10px]">Restart</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onUnlock();
          }}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Power className="w-4 h-4" />
          </div>
          <span className="text-[10px]">Shut Down</span>
        </button>
      </div>
    </div>
  );
};

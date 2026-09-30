import React from 'react';
import { sound } from '../utils/sound';
import {
  Wifi,
  Bluetooth,
  Radio,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Music,
  Tv,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { PLAYLIST } from '../data/portfolioData';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  onBrightnessChange: (val: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
  currentSongIndex: number;
  onNextSong: () => void;
  onOpenApp: (appId: any) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  brightness,
  onBrightnessChange,
  volume,
  onVolumeChange,
  isDarkMode,
  onToggleDarkMode,
  isPlayingMusic,
  onTogglePlayMusic,
  currentSongIndex,
  onNextSong,
  onOpenApp,
}) => {
  if (!isOpen) return null;

  const currentSong = PLAYLIST[currentSongIndex] || PLAYLIST[0];

  return (
    <div
      id="macos-control-center"
      className="fixed top-8 right-2 w-80 bg-slate-900/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-3.5 z-[9998] text-white animate-in fade-in slide-in-from-top-2 duration-150 select-none space-y-3"
    >
      {/* Top 2x2 Grid Modules */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Network & Comms Block */}
        <div className="bg-white/10 p-2.5 rounded-xl flex flex-col gap-2.5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => sound.playClick()}
              className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <Wifi className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold leading-tight">Wi-Fi</span>
              <span className="text-[9px] text-slate-300 truncate">DevFiber-5G</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => sound.playClick()}
              className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <Bluetooth className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold leading-tight">Bluetooth</span>
              <span className="text-[9px] text-slate-300">AirPods Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => sound.playClick()}
              className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <Radio className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold leading-tight">AirDrop</span>
              <span className="text-[9px] text-slate-300">Contacts Only</span>
            </div>
          </div>
        </div>

        {/* Right 2 Stacked Toggles (Focus & Dark Mode) */}
        <div className="flex flex-col gap-2.5">
          {/* Do Not Disturb / Focus */}
          <button
            onClick={() => sound.playClick()}
            className="flex-1 bg-white/10 hover:bg-white/15 p-2.5 rounded-xl flex items-center gap-2.5 text-left border border-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/80 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold leading-tight">Focus</span>
              <span className="text-[9px] text-slate-300">Code Deep Work</span>
            </div>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleDarkMode();
            }}
            className="flex-1 bg-white/10 hover:bg-white/15 p-2.5 rounded-xl flex items-center gap-2.5 text-left border border-white/5 transition-all"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-indigo-600' : 'bg-amber-500'
            }`}>
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold leading-tight">Appearance</span>
              <span className="text-[9px] text-slate-300">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sliders: Display Brightness */}
      <div className="bg-white/10 p-3 rounded-xl border border-white/5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-200">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Display
          </span>
          <span className="text-[10px] text-slate-400">{Math.round(brightness * 100)}%</span>
        </div>
        <input
          id="display-brightness-slider"
          type="range"
          min="0.4"
          max="1"
          step="0.05"
          value={brightness}
          onChange={(e) => onBrightnessChange(parseFloat(e.target.value))}
          className="w-full h-4 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>

      {/* Sliders: Sound Volume */}
      <div className="bg-white/10 p-3 rounded-xl border border-white/5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-200">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Sound
          </span>
          <span className="text-[10px] text-slate-400">{Math.round(volume * 100)}%</span>
        </div>
        <input
          id="sound-volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-4 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>

      {/* Now Playing Mini Player */}
      <div className="bg-white/10 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2.5">
        <div
          onClick={() => {
            sound.playClick();
            onOpenApp('music');
            onClose();
          }}
          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
        >
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${currentSong.coverGradient} flex items-center justify-center shrink-0 shadow-md`}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold truncate leading-tight">{currentSong.title}</div>
            <div className="text-[9px] text-slate-300 truncate">{currentSong.artist}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="control-play-pause-btn"
            onClick={() => {
              sound.playClick();
              onTogglePlayMusic();
            }}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>
          <button
            id="control-next-track-btn"
            onClick={() => {
              sound.playClick();
              onNextSong();
            }}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

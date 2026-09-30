import React from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { sound } from '../utils/sound';
import { Laptop, Cpu, HardDrive, Shield, Sparkles, X } from 'lucide-react';

interface AboutMacModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutMacModal: React.FC<AboutMacModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-mac-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
    >
      <div
        id="about-mac-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-slate-900/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 text-white text-center animate-in fade-in zoom-in-95 duration-150 relative select-none"
      >
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Laptop Graphic */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-slate-700 via-slate-800 to-black p-4 flex items-center justify-center border border-white/20 shadow-xl mb-4">
          <Laptop className="w-10 h-10 text-blue-400" />
        </div>

        <h2 className="text-base font-bold text-white tracking-tight">
          {DEVELOPER_PROFILE.systemSpecs.model}
        </h2>
        <span className="text-xs text-blue-400 font-medium block mt-0.5">
          {DEVELOPER_PROFILE.systemSpecs.os}
        </span>

        {/* Hardware details breakdown */}
        <div className="mt-5 space-y-2 bg-white/5 p-3.5 rounded-xl border border-white/10 text-left text-xs">
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Chip</span>
            <span className="text-white font-medium text-right">{DEVELOPER_PROFILE.systemSpecs.chip}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Memory</span>
            <span className="text-white font-medium">{DEVELOPER_PROFILE.systemSpecs.memory}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Storage</span>
            <span className="text-white font-medium">{DEVELOPER_PROFILE.systemSpecs.storage}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Uptime</span>
            <span className="text-emerald-400 font-mono">{DEVELOPER_PROFILE.systemSpecs.uptime}</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400">
          Crafted by <span className="text-white font-semibold">{DEVELOPER_PROFILE.name}</span>
        </div>
      </div>
    </div>
  );
};

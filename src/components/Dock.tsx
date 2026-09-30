import React, { useState, useRef } from 'react';
import { AppId, WindowState } from '../types';
import { sound } from '../utils/sound';
import { getAppIcon } from '../utils/icons';
import {
  Folder,
  Compass,
  Terminal,
  Code2,
  Image,
  FileText,
  FileBadge,
  Music,
  Calculator,
  Settings,
  MessageSquare,
  Trash2,
  Globe
} from 'lucide-react';

interface DockProps {
  windows: Record<AppId, WindowState>;
  onOpenApp: (id: AppId) => void;
  onCloseApp?: (id: AppId) => void;
  activeAppId: AppId | null;
}

interface DockItemDef {
  id: AppId;
  name: string;
  gradient: string;
  icon: any;
  customSvg?: React.ReactNode;
}

const DOCK_ITEMS: DockItemDef[] = [
  {
    id: 'finder',
    name: 'Finder',
    gradient: 'from-blue-400 via-blue-500 to-indigo-600',
    icon: Folder,
  },
  {
    id: 'safari',
    name: 'Articles',
    gradient: 'from-sky-400 via-blue-500 to-blue-600',
    icon: Compass,
  },
  {
    id: 'photos',
    name: 'Photos',
    gradient: 'from-amber-400 via-rose-500 to-purple-600',
    icon: Image,
  },
  {
    id: 'messages',
    name: 'Contact',
    gradient: 'from-amber-700 via-amber-800 to-yellow-900',
    icon: FileBadge,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    gradient: 'from-slate-800 via-slate-900 to-black',
    icon: Terminal,
  },
  {
    id: 'trash',
    name: 'Trash',
    gradient: 'from-slate-700 via-slate-800 to-zinc-900',
    icon: Trash2,
  },
];

export const Dock: React.FC<DockProps> = ({ windows, onOpenApp, onCloseApp, activeAppId }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleAppClick = (id: AppId) => {
    const win = windows[id];
    if (win && win.isOpen && !win.isMinimized) {
      sound.playClick();
      if (onCloseApp) {
        onCloseApp(id);
      } else {
        onOpenApp(id);
      }
    } else {
      sound.playWindowOpen();
      setBouncingApp(id);
      setTimeout(() => setBouncingApp(null), 1000);
      onOpenApp(id);
    }
  };

  return (
    <div
      id="macos-dock-container"
      className="fixed bottom-2 left-0 right-0 flex justify-center z-[9990] pointer-events-none px-4"
    >
      <div
        id="macos-dock"
        ref={dockRef}
        onMouseLeave={() => setHoveredIndex(null)}
        className="pointer-events-auto flex items-end gap-2 px-3.5 py-2 rounded-2xl bg-white/15 backdrop-blur-3xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all"
      >
        {DOCK_ITEMS.map((item, idx) => {
          const IconComp = item.icon;
          const iconSrc = getAppIcon(item.id);
          const isOpen = windows[item.id]?.isOpen;
          const isCurrentActive = activeAppId === item.id && isOpen;
          const isBouncing = bouncingApp === item.id;

          // Compute magnification scale
          let scale = 1;
          if (hoveredIndex !== null) {
            const distance = Math.abs(hoveredIndex - idx);
            if (distance === 0) scale = 1.38;
            else if (distance === 1) scale = 1.20;
            else if (distance === 2) scale = 1.08;
          }

          // Separator line before settings or trash
          const isSeparator = item.id === 'trash';

          return (
            <React.Fragment key={item.id}>
              {isSeparator && (
                <div className="w-[1px] h-9 bg-white/20 mx-1 self-center rounded-full" />
              )}
              <div
                className="relative group flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                {/* Tooltip */}
                <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                  {item.name}
                </div>

                {/* Dock Icon Button */}
                <button
                  id={`dock-icon-${item.id}`}
                  onClick={() => handleAppClick(item.id)}
                  style={{
                    transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 20 : 0}px)`,
                    transformOrigin: 'bottom center',
                  }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-150 relative active:brightness-90 ${
                    isBouncing ? 'animate-bounce' : ''
                  } ${!iconSrc ? `rounded-xl shadow-lg bg-gradient-to-tr ${item.gradient} border border-white/25` : ''}`}
                  title={item.name}
                >
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt={item.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] rounded-2xl hover:brightness-105"
                    />
                  ) : (
                    <IconComp className="w-6 h-6 text-white drop-shadow-md" />
                  )}
                </button>

                {/* Running App Dot Indicator */}
                <div className="h-1.5 flex items-center justify-center mt-1">
                  {isOpen ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isCurrentActive ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/60'
                        }`}
                    />
                  ) : (
                    <div className="w-1.5 h-1.5" />
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

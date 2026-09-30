import React, { useState, useEffect, useRef } from 'react';
import { AppId } from '../types';
import { sound } from '../utils/sound';
import {
  Wifi,
  Battery,
  BatteryCharging,
  Sliders,
  Sparkles,
  Volume2,
  Moon,
  Sun,
  RotateCw,
  Power,
  Lock,
  Info
} from 'lucide-react';

interface MenubarProps {
  activeAppId: AppId | null;
  onOpenApp: (id: AppId) => void;
  onToggleControlCenter: () => void;
  isControlCenterOpen: boolean;
  onLockScreen: () => void;
  onOpenAboutMac: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const APP_NAMES: Record<AppId, string> = {
  finder: 'Finder',
  safari: 'Safari',
  terminal: 'Terminal',
  vscode: 'Code',
  photos: 'Photos',
  notes: 'Notes',
  resume: 'Preview',
  music: 'Music',
  calculator: 'Calculator',
  messages: 'Messages',
  trash: 'Trash',
  aboutMac: 'About This Mac',
};

export const Menubar: React.FC<MenubarProps> = ({
  activeAppId,
  onOpenApp,
  onToggleControlCenter,
  isControlCenterOpen,
  onLockScreen,
  onOpenAboutMac,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showBatteryFlyout, setShowBatteryFlyout] = useState(false);

  const menubarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeOpts: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const dateOpts: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      setTimeString(now.toLocaleTimeString('en-US', timeOpts));
      setDateString(now.toLocaleDateString('en-US', dateOpts));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setShowBatteryFlyout(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    sound.playClick();
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
      setShowBatteryFlyout(false);
    }
  };

  const appTitle = activeAppId ? APP_NAMES[activeAppId] : 'Finder';

  return (
    <div
      id="macos-menubar"
      ref={menubarRef}
      className="fixed top-0 left-0 right-0 h-7 bg-slate-950/75 backdrop-blur-xl border-b border-white/10 z-[9999] px-3 flex items-center justify-between text-xs text-white/90 select-none shadow-sm"
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-1">
        {/* Apple Logo Dropdown */}
        <div className="relative">
          <button
            id="apple-menu-btn"
            onClick={() => toggleMenu('apple')}
            className={`px-2 py-0.5 rounded flex items-center justify-center hover:bg-white/20 transition-colors ${
              activeMenu === 'apple' ? 'bg-white/25' : ''
            }`}
          >
            {/* Apple Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-5.77-8.81-10.39-18.79-13.86-29.93-3.48-11.14-5.22-21.72-5.22-31.75 0-14.77 3.86-26.69 11.58-35.77 7.72-9.08 17.1-13.68 28.14-13.8 4.67 0 9.8 1.15 15.39 3.44 5.58 2.29 9.38 3.5 11.39 3.64 1.79-.14 5.76-1.39 11.91-3.76 6.16-2.37 11.34-3.43 15.54-3.18 13.9.72 24.62 5.86 32.17 15.42-12.19 7.37-18.17 17.51-17.93 30.41.24 10.37 4.14 18.99 11.71 25.86 7.57 6.87 16.59 10.66 27.06 11.37-2.61 7.72-5.69 15.11-9.24 22.18zM119.22 31.84c0-7.72 2.76-14.86 8.28-21.43 5.52-6.57 12.33-10.41 20.43-11.52.12 1.01.18 1.95.18 2.82 0 7.72-2.88 15.04-8.64 21.96-5.76 6.92-12.82 10.69-21.18 11.31-.24-1.01-.36-2.06-.36-3.14z" />
            </svg>
          </button>

          {/* Apple Dropdown */}
          {activeMenu === 'apple' && (
            <div className="absolute top-7 left-0 w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenAboutMac();
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About This Mac</span>
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenApp('finder');
                }}
                className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white"
              >
                <span>Open Finder</span>
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onLockScreen();
                }}
                className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Lock Screen
                </span>
                <span className="text-[10px] text-white/50">⌃⌘Q</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  sound.playChime();
                }}
                className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" /> Restart...
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onLockScreen();
                }}
                className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <Power className="w-3.5 h-3.5" /> Shut Down...
              </button>
            </div>
          )}
        </div>

        {/* Current Active App Name */}
        <span className="font-bold px-2 py-0.5 rounded text-white tracking-wide">
          {appTitle}
        </span>

        {/* Standard macOS Menu Items */}
        {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => toggleMenu(item)}
              className={`px-2 py-0.5 rounded hover:bg-white/20 transition-colors hidden sm:block ${
                activeMenu === item ? 'bg-white/25' : ''
              }`}
            >
              {item}
            </button>

            {activeMenu === item && (
              <div className="absolute top-7 left-0 w-48 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
                {item === 'File' && (
                  <>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('terminal');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>New Terminal</span>
                      <span className="text-[10px] text-white/50">⌘T</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('notes');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>New Note</span>
                      <span className="text-[10px] text-white/50">⌘N</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('resume');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Open Resume PDF</span>
                      <span className="text-[10px] text-white/50">⌘O</span>
                    </button>
                  </>
                )}
                {item === 'Edit' && (
                  <>
                    <div className="px-3 py-1 text-white/40 text-left">Undo (⌘Z)</div>
                    <div className="px-3 py-1 text-white/40 text-left">Redo (⇧⌘Z)</div>
                    <div className="h-px bg-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        setActiveMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Copy Portfolio Link</span>
                      <span className="text-[10px] text-white/50">⌘C</span>
                    </button>
                  </>
                )}
                {item === 'View' && (
                  <>
                    <button
                      onClick={() => {
                        onToggleDarkMode();
                        setActiveMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex items-center justify-between"
                    >
                      <span>Toggle Dark / Light</span>
                      {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => {
                        onToggleSound();
                        setActiveMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white flex items-center justify-between"
                    >
                      <span>Sound Effects</span>
                      <span>{soundEnabled ? '✓' : ''}</span>
                    </button>
                  </>
                )}
                {item === 'Window' && (
                  <>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('finder');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white"
                    >
                      Bring All to Front
                    </button>
                  </>
                )}
                {item === 'Help' && (
                  <>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('terminal');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white"
                    >
                      Terminal Quick Commands
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenApp('messages');
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-blue-600 hover:text-white"
                    >
                      Contact Developer
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Status & Control Section */}
      <div className="flex items-center gap-1 sm:gap-2 text-white/90">
        {/* Sound FX indicator */}
        <button
          id="sound-toggle-btn"
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className={`p-1 rounded hover:bg-white/20 transition-colors ${
            !soundEnabled ? 'opacity-40' : ''
          }`}
          title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>

        {/* Battery with Flyout */}
        <div className="relative">
          <button
            id="battery-btn"
            onClick={() => {
              sound.playClick();
              setShowBatteryFlyout(!showBatteryFlyout);
              setActiveMenu(null);
            }}
            className="flex items-center gap-1 px-1 py-0.5 rounded hover:bg-white/20 transition-colors"
            title="Battery: 100% (Power Adapter Connected)"
          >
            <span className="text-[11px] font-mono hidden md:inline">100%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </button>

          {showBatteryFlyout && (
            <div className="absolute top-7 right-0 w-60 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl p-3 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="font-semibold text-xs">Battery Status</span>
                <span className="text-emerald-400 text-[11px] font-mono">100% Charged</span>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Power Source:</span>
                  <span className="font-medium text-white">Power Adapter (96W USB-C)</span>
                </div>
                <div className="flex justify-between">
                  <span>Condition:</span>
                  <span className="text-emerald-400">Normal (100% Health)</span>
                </div>
                <div className="flex justify-between">
                  <span>Apps Using Energy:</span>
                  <span className="text-slate-400">VS Code, Terminal</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wi-Fi Icon */}
        <div className="relative">
          <button
            id="wifi-btn"
            onClick={() => {
              sound.playClick();
              setShowBatteryFlyout(false);
              setActiveMenu(null);
            }}
            className="p-1 rounded hover:bg-white/20 transition-colors"
            title="Wi-Fi: Connected"
          >
            <Wifi className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Control Center Toggle */}
        <button
          id="control-center-btn"
          onClick={() => {
            sound.playClick();
            onToggleControlCenter();
          }}
          className={`p-1 rounded hover:bg-white/20 transition-colors ${
            isControlCenterOpen ? 'bg-white/25 text-white' : ''
          }`}
          title="Control Center"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Live Date & Time Clock */}
        <div className="relative">
          <button
            id="clock-btn"
            onClick={() => {
              sound.playClick();
              setShowBatteryFlyout(false);
              setActiveMenu(null);
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/20 transition-colors font-medium"
          >
            <span className="hidden sm:inline text-white/80">{dateString}</span>
            <span className="font-semibold text-white">{timeString}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

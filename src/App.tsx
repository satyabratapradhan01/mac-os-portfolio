import React, { useState, useEffect, useCallback } from 'react';
import { AppId, WindowState } from './types';
import { WALLPAPERS, PLAYLIST, DEVELOPER_PROFILE } from './data/portfolioData';
import { sound } from './utils/sound';

// Components
import { Menubar } from './components/Menubar';
import { ControlCenter } from './components/ControlCenter';
import { Spotlight } from './components/Spotlight';
import { Dock } from './components/Dock';
import { Desktop } from './components/Desktop';
import { WindowFrame } from './components/WindowFrame';
import { AboutMacModal } from './components/AboutMacModal';
import { LockScreen } from './components/LockScreen';
import { WallpaperBackground } from './components/WallpaperBackground';

// Apps
import { FinderApp } from './components/apps/FinderApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { SafariApp } from './components/apps/SafariApp';
import { VSCodeApp } from './components/apps/VSCodeApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { NotesApp } from './components/apps/NotesApp';
import { ResumeApp } from './components/apps/ResumeApp';
import { MusicApp } from './components/apps/MusicApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { TrashApp } from './components/apps/TrashApp';
import { PortfolioProvider } from './context/PortfolioContext';

const DEFAULT_WINDOWS: Record<AppId, WindowState> = {
  finder: {
    id: 'finder',
    title: 'Finder — Portfolio & Projects',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 75, y: 50 },
    size: { width: 700, height: 480 },
    initialSize: { width: 700, height: 480 },
    minSize: { width: 500, height: 350 },
  },
  safari: {
    id: 'safari',
    title: 'Articles',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 120, y: 60 },
    size: { width: 760, height: 500 },
    initialSize: { width: 760, height: 500 },
    minSize: { width: 520, height: 360 },
  },
  photos: {
    id: 'photos',
    title: 'Photos — Gallery & Studio Setup',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 140, y: 70 },
    size: { width: 720, height: 480 },
    initialSize: { width: 720, height: 480 },
    minSize: { width: 500, height: 340 },
  },
  resume: {
    id: 'resume',
    title: 'Resume.pdf',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    position: { x: 140, y: 40 },
    size: { width: 680, height: 530 },
    initialSize: { width: 680, height: 530 },
    minSize: { width: 480, height: 380 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal — satyabrata@macbook ~ zsh — 80×24',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 20,
    position: { x: 110, y: 80 },
    size: { width: 680, height: 440 },
    initialSize: { width: 680, height: 440 },
    minSize: { width: 480, height: 320 },
  },
  vscode: {
    id: 'vscode',
    title: 'Code Studio — Satyabrata Portfolio',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 130, y: 75 },
    size: { width: 760, height: 500 },
    initialSize: { width: 760, height: 500 },
    minSize: { width: 540, height: 360 },
  },
  notes: {
    id: 'notes',
    title: 'Notes — Architecture & Ideas',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 150, y: 85 },
    size: { width: 700, height: 460 },
    initialSize: { width: 700, height: 460 },
    minSize: { width: 500, height: 340 },
  },
  music: {
    id: 'music',
    title: 'Music — Lo-Fi Focus Station',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    position: { x: 170, y: 90 },
    size: { width: 660, height: 440 },
    initialSize: { width: 660, height: 440 },
    minSize: { width: 480, height: 320 },
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    position: { x: 260, y: 100 },
    size: { width: 280, height: 400 },
    initialSize: { width: 280, height: 400 },
    minSize: { width: 250, height: 360 },
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    position: { x: 145, y: 75 },
    size: { width: 700, height: 460 },
    initialSize: { width: 700, height: 460 },
    minSize: { width: 500, height: 340 },
  },
  messages: {
    id: 'messages',
    title: 'Contact Me',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    position: { x: 165, y: 85 },
    size: { width: 620, height: 380 },
    initialSize: { width: 620, height: 380 },
    minSize: { width: 440, height: 320 },
  },
  trash: {
    id: 'trash',
    title: 'Trash',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 185, y: 95 },
    size: { width: 660, height: 430 },
    initialSize: { width: 660, height: 430 },
    minSize: { width: 480, height: 320 },
  },
  aboutMac: {
    id: 'aboutMac',
    title: 'About This Mac',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 99,
    position: { x: 380, y: 140 },
    size: { width: 400, height: 420 },
    initialSize: { width: 400, height: 420 },
    minSize: { width: 360, height: 380 },
  },
};

export default function App() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(DEFAULT_WINDOWS);
  const [activeAppId, setActiveAppId] = useState<AppId | null>('finder');
  const [topZIndex, setTopZIndex] = useState(20);

  // System States
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isAboutMacOpen, setIsAboutMacOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedWallpaperId, setSelectedWallpaperId] = useState('macos-fluid-wave');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(() => {
    return localStorage.getItem('macos_custom_wallpaper') || null;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [brightness, setBrightness] = useState(1);
  const [volume, setVolume] = useState(0.85);

  // Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Bring window to front
  const focusWindow = useCallback(
    (id: AppId) => {
      setActiveAppId(id);
      setWindows((prev) => {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        return {
          ...prev,
          [id]: {
            ...prev[id],
            zIndex: nextZ,
            isMinimized: false,
          },
        };
      });
    },
    [topZIndex]
  );

  // Open App
  const openApp = useCallback(
    (id: AppId) => {
      sound.playWindowOpen();
      setWindows((prev) => {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);

        const isMobile = window.innerWidth < 640;
        const maxAvailableWidth = isMobile ? window.innerWidth - 20 : window.innerWidth - 60;
        const maxAvailableHeight = isMobile ? window.innerHeight - 120 : window.innerHeight - 130;

        const width = Math.min(maxAvailableWidth, prev[id].initialSize.width);
        const height = Math.min(maxAvailableHeight, prev[id].initialSize.height);

        let posX = isMobile ? 10 : prev[id].position.x;
        let posY = isMobile ? 40 : prev[id].position.y;

        // Check for position collision with already open windows & cascade if overlapping
        if (!isMobile) {
          const openWindows = (Object.values(prev) as WindowState[]).filter((w) => w.isOpen && !w.isMinimized && w.id !== id);
          let offsetMultiplier = 0;

          while (
            openWindows.some(
              (w) =>
                Math.abs(w.position.x - (posX + offsetMultiplier * 35)) < 30 &&
                Math.abs(w.position.y - (posY + offsetMultiplier * 30)) < 30
            ) && offsetMultiplier < 5
          ) {
            offsetMultiplier++;
          }

          posX = Math.max(20, Math.min(window.innerWidth - width - 20, posX + offsetMultiplier * 35));
          posY = Math.max(35, Math.min(window.innerHeight - height - 80, posY + offsetMultiplier * 30));
        }

        return {
          ...prev,
          [id]: {
            ...prev[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            size: { width, height },
            position: { x: posX, y: posY },
          },
        };
      });
      setActiveAppId(id);
    },
    [topZIndex]
  );

  // Close Window
  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
    setActiveAppId((current) => (current === id ? null : current));
  }, []);

  // Minimize Window
  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
    setActiveAppId((current) => (current === id ? null : current));
  }, []);

  // Maximize / Restore Window
  const toggleMaximizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  }, []);

  // Update Position
  const updatePosition = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: { x, y },
      },
    }));
  }, []);

  // Update Size
  const updateSize = useCallback((id: AppId, width: number, height: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size: { width, height },
      },
    }));
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Cmd+Space -> Toggle Spotlight
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === ' ')) {
        e.preventDefault();
        sound.playClick();
        setIsSpotlightOpen((prev) => !prev);
      }
      // Esc -> close overlays
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsControlCenterOpen(false);
        setIsAboutMacOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Wallpaper style
  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === selectedWallpaperId) || WALLPAPERS[0];

  return (
    <PortfolioProvider>
      <div
        id="macos-root-container"
        style={{ filter: `brightness(${brightness})` }}
        className={`fixed inset-0 overflow-hidden font-sans select-none ${currentWallpaper.bgStyle} transition-all duration-500`}
      >
        {/* High Fidelity Custom Desktop Wallpaper Layer */}
        <WallpaperBackground
          wallpaperId={selectedWallpaperId}
          customWallpaperUrl={customWallpaperUrl}
        />

        {/* Dynamic macOS Wallpaper Ambient Glow Layers */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/40 pointer-events-none" />

        {/* 1. Top Menubar */}
        <Menubar
          activeAppId={activeAppId}
          onOpenApp={openApp}
          onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
          isControlCenterOpen={isControlCenterOpen}
          onToggleSpotlight={() => setIsSpotlightOpen(!isSpotlightOpen)}
          onLockScreen={() => setIsLocked(true)}
          onOpenAboutMac={() => setIsAboutMacOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            setSoundEnabled(!soundEnabled);
            sound.setEnabled(!soundEnabled);
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* 2. Control Center Dropdown */}
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          volume={volume}
          onVolumeChange={setVolume}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isPlayingMusic={isPlayingMusic}
          onTogglePlayMusic={() => setIsPlayingMusic(!isPlayingMusic)}
          currentSongIndex={currentSongIndex}
          onNextSong={() => setCurrentSongIndex((idx) => (idx + 1) % PLAYLIST.length)}
          onOpenApp={openApp}
        />

        {/* 3. Spotlight Search Modal */}
        <Spotlight
          isOpen={isSpotlightOpen}
          onClose={() => setIsSpotlightOpen(false)}
          onOpenApp={openApp}
        />

        {/* 4. Desktop Canvas & Icons */}
        <Desktop
          onOpenApp={openApp}
          onOpenAboutMac={() => setIsAboutMacOpen(true)}
          onOpenSettings={() => openApp('settings')}
          onOpenTerminal={() => openApp('terminal')}
        />

        {/* 5. Window Management Layer */}
        {/* Finder Window */}
        {windows.finder.isOpen && (
          <WindowFrame
            windowState={windows.finder}
            onClose={() => closeWindow('finder')}
            onMinimize={() => minimizeWindow('finder')}
            onMaximize={() => toggleMaximizeWindow('finder')}
            onFocus={() => focusWindow('finder')}
            onUpdatePosition={(x, y) => updatePosition('finder', x, y)}
            onUpdateSize={(w, h) => updateSize('finder', w, h)}
          >
            <FinderApp onOpenApp={openApp} />
          </WindowFrame>
        )}

        {/* Terminal Window */}
        {windows.terminal.isOpen && (
          <WindowFrame
            windowState={windows.terminal}
            onClose={() => closeWindow('terminal')}
            onMinimize={() => minimizeWindow('terminal')}
            onMaximize={() => toggleMaximizeWindow('terminal')}
            onFocus={() => focusWindow('terminal')}
            onUpdatePosition={(x, y) => updatePosition('terminal', x, y)}
            onUpdateSize={(w, h) => updateSize('terminal', w, h)}
            titleBarClassName="bg-slate-950/90 border-b border-white/10"
          >
            <TerminalApp onOpenApp={openApp} />
          </WindowFrame>
        )}

        {/* Safari Window */}
        {windows.safari.isOpen && (
          <WindowFrame
            windowState={windows.safari}
            onClose={() => closeWindow('safari')}
            onMinimize={() => minimizeWindow('safari')}
            onMaximize={() => toggleMaximizeWindow('safari')}
            onFocus={() => focusWindow('safari')}
            onUpdatePosition={(x, y) => updatePosition('safari', x, y)}
            onUpdateSize={(w, h) => updateSize('safari', w, h)}
            hideTitleBar={true}
          >
            <SafariApp />
          </WindowFrame>
        )}

        {/* VS Code Window */}
        {windows.vscode.isOpen && (
          <WindowFrame
            windowState={windows.vscode}
            onClose={() => closeWindow('vscode')}
            onMinimize={() => minimizeWindow('vscode')}
            onMaximize={() => toggleMaximizeWindow('vscode')}
            onFocus={() => focusWindow('vscode')}
            onUpdatePosition={(x, y) => updatePosition('vscode', x, y)}
            onUpdateSize={(w, h) => updateSize('vscode', w, h)}
            titleBarClassName="bg-[#323233] border-b border-[#252526]"
          >
            <VSCodeApp />
          </WindowFrame>
        )}

        {/* Photos Window */}
        {windows.photos.isOpen && (
          <WindowFrame
            windowState={windows.photos}
            onClose={() => closeWindow('photos')}
            onMinimize={() => minimizeWindow('photos')}
            onMaximize={() => toggleMaximizeWindow('photos')}
            onFocus={() => focusWindow('photos')}
            onUpdatePosition={(x, y) => updatePosition('photos', x, y)}
            onUpdateSize={(w, h) => updateSize('photos', w, h)}
          >
            <PhotosApp />
          </WindowFrame>
        )}

        {/* Notes Window */}
        {windows.notes.isOpen && (
          <WindowFrame
            windowState={windows.notes}
            onClose={() => closeWindow('notes')}
            onMinimize={() => minimizeWindow('notes')}
            onMaximize={() => toggleMaximizeWindow('notes')}
            onFocus={() => focusWindow('notes')}
            onUpdatePosition={(x, y) => updatePosition('notes', x, y)}
            onUpdateSize={(w, h) => updateSize('notes', w, h)}
            titleBarClassName="bg-[#2d2d2d] border-b border-[#333]"
          >
            <NotesApp />
          </WindowFrame>
        )}

        {/* Resume Window */}
        {windows.resume.isOpen && (
          <WindowFrame
            windowState={windows.resume}
            onClose={() => closeWindow('resume')}
            onMinimize={() => minimizeWindow('resume')}
            onMaximize={() => toggleMaximizeWindow('resume')}
            onFocus={() => focusWindow('resume')}
            onUpdatePosition={(x, y) => updatePosition('resume', x, y)}
            onUpdateSize={(w, h) => updateSize('resume', w, h)}
            titleBarClassName="bg-[#f3f4f6] border-b border-slate-200"
            headerContent={
              <span className="text-xs font-semibold text-slate-700">Resume.pdf</span>
            }
            rightHeaderContent={
              <a
                href="/files/resume.pdf"
                download="satyabrata_pradhan_resume.pdf"
                className="cursor-pointer text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded hover:bg-slate-200 flex items-center justify-center"
                title="Download resume"
                onClick={() => {
                  sound.playClick();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-download icon"
                  aria-hidden="true"
                >
                  <path d="M12 15V3"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <path d="m7 10 5 5 5-5"></path>
                </svg>
              </a>
            }
          >
            <ResumeApp />
          </WindowFrame>
        )}

        {/* Music Window */}
        {windows.music.isOpen && (
          <WindowFrame
            windowState={windows.music}
            onClose={() => closeWindow('music')}
            onMinimize={() => minimizeWindow('music')}
            onMaximize={() => toggleMaximizeWindow('music')}
            onFocus={() => focusWindow('music')}
            onUpdatePosition={(x, y) => updatePosition('music', x, y)}
            onUpdateSize={(w, h) => updateSize('music', w, h)}
          >
            <MusicApp
              isPlaying={isPlayingMusic}
              onTogglePlay={() => setIsPlayingMusic(!isPlayingMusic)}
              currentSongIndex={currentSongIndex}
              onSelectSong={(idx) => {
                setCurrentSongIndex(idx);
                setIsPlayingMusic(true);
              }}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </WindowFrame>
        )}

        {/* Calculator Window */}
        {windows.calculator.isOpen && (
          <WindowFrame
            windowState={windows.calculator}
            onClose={() => closeWindow('calculator')}
            onMinimize={() => minimizeWindow('calculator')}
            onMaximize={() => toggleMaximizeWindow('calculator')}
            onFocus={() => focusWindow('calculator')}
            onUpdatePosition={(x, y) => updatePosition('calculator', x, y)}
            onUpdateSize={(w, h) => updateSize('calculator', w, h)}
            titleBarClassName="bg-[#2c2c2e] border-b border-white/5"
          >
            <CalculatorApp />
          </WindowFrame>
        )}

        {/* Settings Window */}
        {windows.settings.isOpen && (
          <WindowFrame
            windowState={windows.settings}
            onClose={() => closeWindow('settings')}
            onMinimize={() => minimizeWindow('settings')}
            onMaximize={() => toggleMaximizeWindow('settings')}
            onFocus={() => focusWindow('settings')}
            onUpdatePosition={(x, y) => updatePosition('settings', x, y)}
            onUpdateSize={(w, h) => updateSize('settings', w, h)}
          >
            <SettingsApp
              selectedWallpaperId={selectedWallpaperId}
              onSelectWallpaper={(id) => {
                setSelectedWallpaperId(id);
                if (id !== 'custom') {
                  setCustomWallpaperUrl(null);
                  localStorage.removeItem('macos_custom_wallpaper');
                }
              }}
              customWallpaperUrl={customWallpaperUrl}
              onSetCustomWallpaper={(url) => {
                setCustomWallpaperUrl(url);
                if (url) {
                  localStorage.setItem('macos_custom_wallpaper', url);
                } else {
                  localStorage.removeItem('macos_custom_wallpaper');
                }
              }}
              soundEnabled={soundEnabled}
              onToggleSound={() => {
                setSoundEnabled(!soundEnabled);
                sound.setEnabled(!soundEnabled);
              }}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              brightness={brightness}
              onBrightnessChange={setBrightness}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </WindowFrame>
        )}

        {/* Messages / Contact Window */}
        {windows.messages.isOpen && (
          <WindowFrame
            windowState={windows.messages}
            onClose={() => closeWindow('messages')}
            onMinimize={() => minimizeWindow('messages')}
            onMaximize={() => toggleMaximizeWindow('messages')}
            onFocus={() => focusWindow('messages')}
            onUpdatePosition={(x, y) => updatePosition('messages', x, y)}
            onUpdateSize={(w, h) => updateSize('messages', w, h)}
            titleBarClassName="bg-[#f8f9fa] border-b border-slate-200"
            headerContent={
              <span className="text-xs font-semibold text-slate-700">Contact Me</span>
            }
          >
            <MessagesApp />
          </WindowFrame>
        )}

        {/* Trash Window */}
        {windows.trash.isOpen && (
          <WindowFrame
            windowState={windows.trash}
            onClose={() => closeWindow('trash')}
            onMinimize={() => minimizeWindow('trash')}
            onMaximize={() => toggleMaximizeWindow('trash')}
            onFocus={() => focusWindow('trash')}
            onUpdatePosition={(x, y) => updatePosition('trash', x, y)}
            onUpdateSize={(w, h) => updateSize('trash', w, h)}
          >
            <TrashApp />
          </WindowFrame>
        )}

        {/* 6. About This Mac Modal */}
        <AboutMacModal
          isOpen={isAboutMacOpen}
          onClose={() => setIsAboutMacOpen(false)}
        />

        {/* 7. macOS Lock Screen */}
        <LockScreen
          isLocked={isLocked}
          onUnlock={() => setIsLocked(false)}
        />

        {/* 8. macOS Magnifying Dock */}
        <Dock
          windows={windows}
          onOpenApp={openApp}
          onCloseApp={closeWindow}
          activeAppId={activeAppId}
        />
      </div>
    </PortfolioProvider>
  );
}

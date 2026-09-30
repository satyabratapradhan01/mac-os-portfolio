import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppId } from '../types';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { sound } from '../utils/sound';
import { getAppIcon } from '../utils/icons';
import {
  HardDrive,
  FolderCode,
  FileText,
  Terminal,
  Camera,
  BookOpen,
  Sparkles,
  ChevronRight,
  Sliders,
  LayoutGrid,
  Database
} from 'lucide-react';

interface DesktopProps {
  onOpenApp: (id: AppId) => void;
  onOpenAboutMac: () => void;
  onOpenTerminal: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface DynamicDesktopIcon {
  id: string;
  label: string;
  type: 'app' | 'folder' | 'file';
  targetApp?: AppId;
  iconType: string;
  projectId?: string;
}

// Standard macOS Grid Metrics
const GRID_SIZE_X = 96;
const GRID_SIZE_Y = 100;
const PADDING_X = 24;
const PADDING_Y = 24;

// ─── JSM Folio-style: Georama variable font + Framer Motion stagger ──────────
const SUBHEADER_CHARS = "Hey, I'm Satya! welcome to my".split('');
const PORTFOLIO_CHARS = ['p', 'o', 'r', 't', 'f', 'o', 'l', 'i', 'o', '.'];

// Stagger container
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

// Each char slides up from below + fades in
const charVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const subContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.022, delayChildren: 0.0 } },
};
const subCharVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const HeroHeading: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [subHoveredIdx, setSubHoveredIdx] = useState<number | null>(null);

  // Variable font weight & scale calculations for portfolio.
  const getWght = (i: number): number => {
    if (hoveredIdx === null) return 100;
    const d = Math.abs(i - hoveredIdx);
    if (d === 0) return 900;
    if (d === 1) return 600;
    if (d === 2) return 350;
    return 100;
  };

  const getScale = (i: number): number => {
    if (hoveredIdx === null) return 1;
    const d = Math.abs(i - hoveredIdx);
    if (d === 0) return 1.25;
    if (d === 1) return 1.12;
    if (d === 2) return 1.05;
    return 1;
  };

  const getY = (i: number): number => {
    if (hoveredIdx === null) return 0;
    const d = Math.abs(i - hoveredIdx);
    if (d === 0) return -12;
    if (d === 1) return -6;
    if (d === 2) return -2;
    return 0;
  };

  // Variable font weight & scale calculations for subheader
  const getSubWght = (i: number): number => {
    if (subHoveredIdx === null) return 100;
    const d = Math.abs(i - subHoveredIdx);
    if (d === 0) return 800;
    if (d === 1) return 500;
    if (d === 2) return 250;
    return 100;
  };

  const getSubScale = (i: number): number => {
    if (subHoveredIdx === null) return 1;
    const d = Math.abs(i - subHoveredIdx);
    if (d === 0) return 1.2;
    if (d === 1) return 1.08;
    return 1;
  };

  const getSubY = (i: number): number => {
    if (subHoveredIdx === null) return 0;
    const d = Math.abs(i - subHoveredIdx);
    if (d === 0) return -6;
    if (d === 1) return -3;
    return 0;
  };

  return (
    <div className="flex flex-col items-center select-none cursor-default pointer-events-auto">
      {/* Subheader — per-character stagger + interactive weight wave */}
      <motion.p
        className="font-georama text-xl sm:text-2xl md:text-3xl lg:text-4xl
          text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-wide mb-1
          flex flex-wrap justify-center overflow-visible py-1"
        initial="hidden"
        animate="visible"
        variants={subContainerVariants}
      >
        {SUBHEADER_CHARS.map((ch, i) => {
          const isHovered = subHoveredIdx === i;
          return (
            <motion.span
              key={i}
              variants={subCharVariants}
              animate={{
                scale: getSubScale(i),
                y: getSubY(i),
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onMouseEnter={() => {
                setSubHoveredIdx(i);
                sound.playClick();
              }}
              onMouseLeave={() => setSubHoveredIdx(null)}
              className={`transition-colors duration-200 ${
                isHovered ? 'text-sky-200 drop-shadow-[0_0_14px_rgba(56,189,248,0.9)]' : ''
              }`}
              style={{
                display: 'inline-block',
                fontVariationSettings: `'wght' ${getSubWght(i)}`,
                transition: 'font-variation-settings 0.25s cubic-bezier(0.22,1,0.36,1)',
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
                willChange: 'transform, font-variation-settings',
                cursor: 'pointer',
              }}
            >
              {ch === ' ' ? '\u00a0' : ch}
            </motion.span>
          );
        })}
      </motion.p>

      {/* portfolio. — variable weight wave + spring lift + gradient glow */}
      <div className="overflow-visible py-4">
        <motion.h1
          className="font-georama flex text-7xl sm:text-8xl md:text-9xl lg:text-[140px] gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-1.5
            italic text-white tracking-wide leading-none -mt-1 sm:-mt-3
            drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {PORTFOLIO_CHARS.map((ch, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <motion.span
                key={i}
                variants={charVariants}
                animate={{
                  scale: getScale(i),
                  y: getY(i),
                  rotate: isHovered ? (i % 2 === 0 ? -3 : 3) : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                onMouseEnter={() => {
                  setHoveredIdx(i);
                  sound.playClick();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`transition-all duration-200 ${
                  isHovered
                    ? 'text-transparent bg-clip-text bg-gradient-to-t from-sky-300 via-white to-blue-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]'
                    : ''
                }`}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: `'wght' ${getWght(i)}`,
                  transition: 'font-variation-settings 0.3s cubic-bezier(0.22,1,0.36,1)',
                  willChange: 'transform, font-variation-settings',
                  cursor: 'pointer',
                }}
              >
                {ch}
              </motion.span>
            );
          })}
        </motion.h1>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

export const Desktop: React.FC<DesktopProps> = ({
  onOpenApp,
  onOpenAboutMac,
  onOpenTerminal,
}) => {
  const { projects } = usePortfolio();

  // Dynamically compute desktop icons (single column on left side)
  const desktopIcons: DynamicDesktopIcon[] = useMemo(() => {
    const list: DynamicDesktopIcon[] = [];

    // Project Folders dynamically created from MongoDB/State
    projects.forEach((proj) => {
      if (proj.showOnDesktop !== false) {
        list.push({
          id: `folder-${proj.id}`,
          label: proj.title,
          type: 'folder',
          targetApp: 'finder',
          iconType: 'folder-code',
          projectId: proj.id,
        });
      }
    });

    // Resume Document
    list.push({
      id: 'resume-pdf',
      label: 'Resume.pdf',
      type: 'file',
      targetApp: 'resume',
      iconType: 'file-text',
    });

    return list;
  }, [projects]);

  // Helper: Find closest unoccupied grid slot to completely eliminate overlapping icons
  const resolveNonOverlappingGridPos = useCallback(
    (
      targetIconId: string,
      rawX: number,
      rawY: number,
      existingPositions: Record<string, Point>
    ): Point => {
      const maxRows = Math.max(1, Math.floor((window.innerHeight - 180 - PADDING_Y) / GRID_SIZE_Y));
      const maxCols = Math.max(1, Math.floor((window.innerWidth - 120 - PADDING_X) / GRID_SIZE_X));

      let targetCol = Math.max(0, Math.min(maxCols, Math.round((rawX - PADDING_X) / GRID_SIZE_X)));
      let targetRow = Math.max(0, Math.min(maxRows, Math.round((rawY - PADDING_Y) / GRID_SIZE_Y)));

      // Avoid placing directly on top of the system widget (top right on large screens)
      const isOverWidget = (col: number, row: number) => {
        if (window.innerWidth < 1024) return false;
        const posX = PADDING_X + col * GRID_SIZE_X;
        const posY = PADDING_Y + row * GRID_SIZE_Y;
        return posX > window.innerWidth - 380 && posY < 360;
      };

      // Check if grid cell is occupied by any other icon
      const isCellOccupied = (col: number, row: number) => {
        const slotX = PADDING_X + col * GRID_SIZE_X;
        const slotY = PADDING_Y + row * GRID_SIZE_Y;
        for (const [id, pos] of Object.entries(existingPositions)) {
          if (id === targetIconId) continue;
          if (Math.abs(pos.x - slotX) < 48 && Math.abs(pos.y - slotY) < 48) {
            return true;
          }
        }
        return false;
      };

      // If target cell is free and not over widget, return immediately
      if (!isCellOccupied(targetCol, targetRow) && !isOverWidget(targetCol, targetRow)) {
        return {
          x: PADDING_X + targetCol * GRID_SIZE_X,
          y: PADDING_Y + targetRow * GRID_SIZE_Y,
        };
      }

      // Search nearest available cell outward (spiral search)
      let bestCol = targetCol;
      let bestRow = targetRow;
      let minDistance = Infinity;

      for (let col = 0; col <= maxCols; col++) {
        for (let row = 0; row <= maxRows; row++) {
          if (!isCellOccupied(col, row) && !isOverWidget(col, row)) {
            const dist = Math.hypot(col - targetCol, row - targetRow);
            if (dist < minDistance) {
              minDistance = dist;
              bestCol = col;
              bestRow = row;
            }
          }
        }
      }

      return {
        x: PADDING_X + bestCol * GRID_SIZE_X,
        y: PADDING_Y + bestRow * GRID_SIZE_Y,
      };
    },
    []
  );

  // Initialize Desktop Icon Positions in Single Column on Left Side with Guaranteed Zero Overlap
  const [iconPositions, setIconPositions] = useState<Record<string, Point>>(() => {
    const initial: Record<string, Point> = {};
    desktopIcons.forEach((icon, idx) => {
      initial[icon.id] = {
        x: PADDING_X,
        y: PADDING_Y + idx * GRID_SIZE_Y,
      };
    });
    return initial;
  });

  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);
  const [dragCurrentPos, setDragCurrentPos] = useState<Point>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [hasMovedDuringDrag, setHasMovedDuringDrag] = useState(false);

  // Marquee Selection Box
  const [isSelectingMarquee, setIsSelectingMarquee] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<Point>({ x: 0, y: 0 });
  const [marqueeCurrent, setMarqueeCurrent] = useState<Point>({ x: 0, y: 0 });

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const desktopRef = useRef<HTMLDivElement>(null);

  // Re-align whenever icons list changes (e.g. adding new projects from MongoDB)
  useEffect(() => {
    setIconPositions((prev) => {
      const updated: Record<string, Point> = {};
      desktopIcons.forEach((icon, idx) => {
        const currentPos = prev[icon.id] || {
          x: PADDING_X,
          y: PADDING_Y + idx * GRID_SIZE_Y,
        };
        const resolved = resolveNonOverlappingGridPos(
          icon.id,
          currentPos.x,
          currentPos.y,
          updated
        );
        updated[icon.id] = resolved;
      });
      return updated;
    });
  }, [desktopIcons, resolveNonOverlappingGridPos]);

  // Handle Desktop Mouse Down (Start marquee selection)
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }

    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setIsSelectingMarquee(true);
    setMarqueeStart({ x: clickX, y: clickY });
    setMarqueeCurrent({ x: clickX, y: clickY });
    setSelectedIconIds([]);
  };

  // Handle Icon Mouse Down
  const handleIconMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;

    sound.playClick();
    const currentPos = iconPositions[iconId] || { x: PADDING_X, y: PADDING_Y };
    setDraggingIconId(iconId);
    setDragCurrentPos(currentPos);
    setDragOffset({
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y,
    });
    setHasMovedDuringDrag(false);
    setSelectedIconIds([iconId]);
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  // Global Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // 1. Icon Dragging
    if (draggingIconId) {
      setHasMovedDuringDrag(true);
      const newX = Math.max(10, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y));
      setDragCurrentPos({ x: newX, y: newY });
      return;
    }

    // 2. Marquee Drag Selection Box
    if (isSelectingMarquee) {
      setMarqueeCurrent({ x: currentX, y: currentY });

      const minX = Math.min(marqueeStart.x, currentX);
      const maxX = Math.max(marqueeStart.x, currentX);
      const minY = Math.min(marqueeStart.y, currentY);
      const maxY = Math.max(marqueeStart.y, currentY);

      const selected: string[] = [];
      desktopIcons.forEach((icon) => {
        const pos = iconPositions[icon.id] || { x: PADDING_X, y: PADDING_Y };
        const iconWidth = 90;
        const iconHeight = 90;
        const intersects =
          pos.x < maxX &&
          pos.x + iconWidth > minX &&
          pos.y < maxY &&
          pos.y + iconHeight > minY;

        if (intersects) {
          selected.push(icon.id);
        }
      });
      setSelectedIconIds(selected);
    }
  };

  // Mouse Up: Snap cleanly into nearest unoccupied grid cell
  const handleMouseUp = () => {
    if (draggingIconId) {
      if (hasMovedDuringDrag) {
        sound.playDrop();
        const finalResolvedPos = resolveNonOverlappingGridPos(
          draggingIconId,
          dragCurrentPos.x,
          dragCurrentPos.y,
          iconPositions
        );

        setIconPositions((prev) => ({
          ...prev,
          [draggingIconId]: finalResolvedPos,
        }));
      }
      setDraggingIconId(null);
      setHasMovedDuringDrag(false);
    }

    if (isSelectingMarquee) {
      setIsSelectingMarquee(false);
    }
  };

  const handleIconDoubleClick = (e: React.MouseEvent, targetApp?: AppId) => {
    e.stopPropagation();
    if (targetApp) {
      sound.playWindowOpen();
      onOpenApp(targetApp);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 240);
    setContextMenu({ x, y, visible: true });
  };

  // Auto-arrange all icons in a neat left single column
  const handleAutoAlignIcons = () => {
    sound.playClick();
    const resetPositions: Record<string, Point> = {};
    desktopIcons.forEach((icon, idx) => {
      resetPositions[icon.id] = {
        x: PADDING_X,
        y: PADDING_Y + idx * GRID_SIZE_Y,
      };
    });
    setIconPositions(resetPositions);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const renderIconGraphic = (type: string, targetApp?: AppId) => {
    if (type === 'folder-code' || type === 'folder') {
      return (
        <img
          src="/icons/folder.png"
          alt="Folder"
          className="w-14 h-14 object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)] transition-transform group-hover:scale-105"
        />
      );
    }
    if (type === 'file-text') {
      return (
        <div className="relative w-13 h-16 bg-white rounded-xl shadow-lg border border-slate-200/90 flex flex-col justify-between p-2 overflow-hidden group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
          {/* Dog ear fold */}
          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-100 border-l border-b border-slate-300 rounded-bl-sm" />

          {/* Lines */}
          <div className="space-y-1 mt-0.5">
            <div className="w-6 h-1.5 bg-rose-500 rounded-full" />
            <div className="w-8 h-1 bg-slate-200 rounded-full" />
            <div className="w-7 h-1 bg-slate-200 rounded-full" />
          </div>

          {/* Gradient Badge */}
          <div className="w-full h-5.5 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 flex items-center justify-center shadow-xs">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      );
    }
    const customIcon = targetApp ? getAppIcon(targetApp) : null;
    if (customIcon) {
      return (
        <img
          src={customIcon}
          alt={type}
          className="w-14 h-14 object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
        />
      );
    }
    switch (type) {
      case 'hard-drive':
        return (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 p-2 flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.35)] border border-white/60">
            <HardDrive className="w-8 h-8 text-slate-800" />
          </div>
        );
      case 'folder-code':
        return getAppIcon('folder') ? (
          <img
            src={getAppIcon('folder')}
            alt="Folder"
            className="w-14 h-14 object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="relative w-14 h-12 flex items-center justify-center drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-1 w-6 h-2.5 bg-sky-300/90 rounded-t-md" />
            <div className="absolute inset-0 top-1.5 w-full h-10.5 rounded-lg bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500 border border-sky-200/50 shadow-inner flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-t from-blue-600/30 to-transparent rounded-lg flex items-center justify-center">
                <FolderCode className="w-6 h-6 text-white/90 drop-shadow" />
              </div>
            </div>
          </div>
        );
      case 'file-text':
        return (
          <div className="w-12 h-14 bg-white rounded-md shadow-[0_8px_18px_rgba(0,0,0,0.35)] border border-slate-200/80 p-1.5 flex flex-col justify-between relative overflow-hidden group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-shadow">
            <div className="absolute top-0 right-0 w-3 h-3 bg-slate-100 border-l border-b border-slate-300 shadow-xs" />
            <div className="space-y-1">
              <div className="w-6 h-1 bg-rose-600 rounded-xs" />
              <div className="w-8 h-0.5 bg-slate-300 rounded-xs" />
              <div className="w-7 h-0.5 bg-slate-300 rounded-xs" />
              <div className="w-5 h-0.5 bg-slate-300 rounded-xs" />
            </div>
            <div className="w-full h-5 rounded bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        );
      case 'terminal':
        return getAppIcon('terminal') ? (
          <img
            src={getAppIcon('terminal')}
            alt="Terminal"
            className="w-14 h-14 object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-zinc-800 via-slate-900 to-black p-2 flex items-center justify-center shadow-lg border border-white/20">
            <Terminal className="w-7 h-7 text-emerald-400" />
          </div>
        );
      case 'camera':
        return getAppIcon('photos') ? (
          <img
            src={getAppIcon('photos')}
            alt="Photos"
            className="w-14 h-14 object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-2 flex items-center justify-center shadow-lg border border-amber-300/40">
            <Camera className="w-7 h-7 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-xl bg-blue-500 p-2 flex items-center justify-center shadow-lg">
            <FolderCode className="w-7 h-7 text-white" />
          </div>
        );
    }
  };

  // Compute Marquee Style Dimensions
  const marqueeBox = isSelectingMarquee
    ? {
      left: Math.min(marqueeStart.x, marqueeCurrent.x),
      top: Math.min(marqueeStart.y, marqueeCurrent.y),
      width: Math.abs(marqueeCurrent.x - marqueeStart.x),
      height: Math.abs(marqueeCurrent.y - marqueeStart.y),
    }
    : null;

  return (
    <div
      ref={desktopRef}
      id="macos-desktop-canvas"
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`fixed inset-0 top-7 bottom-16 overflow-hidden select-none z-0 ${draggingIconId ? 'cursor-grabbing' : 'cursor-default'
        }`}
    >
      {/* Marquee Selection Box Rectangle */}
      {isSelectingMarquee && marqueeBox && marqueeBox.width > 2 && marqueeBox.height > 2 && (
        <div
          id="desktop-marquee-box"
          style={{
            left: `${marqueeBox.left}px`,
            top: `${marqueeBox.top}px`,
            width: `${marqueeBox.width}px`,
            height: `${marqueeBox.height}px`,
          }}
          className="absolute z-20 border border-blue-400 bg-blue-500/20 backdrop-blur-[1px] rounded-sm pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        />
      )}

      {/* Center Screen Welcome Greeting — display only, no click */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 -translate-y-4">
        <HeroHeading />
      </div>

      {/* Top-Right Glassmorphic Desktop Status Widget with modern lock card style */}
      <div className="hidden lg:flex flex-col gap-3 absolute top-6 right-8 w-80 pointer-events-auto z-20">
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/30 via-white/10 to-white/5 shadow-[0_16px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_48px_rgba(0,0,0,0.45)] group">
          <div className="bg-slate-900/40 hover:bg-slate-900/55 rounded-[23px] p-4 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={DEVELOPER_PROFILE.avatar}
                  alt={DEVELOPER_PROFILE.name}
                  className="w-13 h-13 rounded-full object-cover shadow-md ring-2 ring-white/60 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5 truncate drop-shadow-sm tracking-tight">
                  {DEVELOPER_PROFILE.name}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                </h2>
                <p className="text-[11px] font-semibold text-blue-200 truncate drop-shadow-xs tracking-wide">
                  {DEVELOPER_PROFILE.title}
                </p>
                <p className="text-[10px] text-slate-300/85 truncate font-medium">
                  {DEVELOPER_PROFILE.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freeform Draggable Desktop Icons & Dynamic Folders in Single Left Column */}
      {desktopIcons.map((icon) => {
        const isSelected = selectedIconIds.includes(icon.id);
        const isDragging = draggingIconId === icon.id;
        const pos = isDragging ? dragCurrentPos : iconPositions[icon.id] || { x: PADDING_X, y: PADDING_Y };

        return (
          <div
            key={icon.id}
            id={`desktop-icon-${icon.id}`}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              zIndex: isDragging ? 50 : isSelected ? 30 : 25,
              transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            onDoubleClick={(e) => handleIconDoubleClick(e, icon.targetApp)}
            className={`absolute top-0 left-0 w-24 flex flex-col items-center justify-center p-2 rounded-xl text-center group select-none ${isDragging
              ? 'scale-105 shadow-2xl ring-2 ring-blue-400/80 bg-blue-600/30 backdrop-blur-md cursor-grabbing'
              : isSelected
                ? 'bg-blue-600/30 border border-blue-400/50 shadow-md backdrop-blur-sm cursor-grab'
                : 'hover:bg-white/10 cursor-grab'
              }`}
          >
            <div className="transition-transform group-hover:scale-105 duration-150 pointer-events-none">
              {renderIconGraphic(icon.iconType)}
            </div>
            <span
              className={`mt-1.5 text-[11px] font-medium leading-tight px-1.5 py-0.5 rounded text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-[88px] pointer-events-none ${isSelected ? 'bg-blue-600 text-white shadow-sm' : ''
                }`}
            >
              {icon.label}
            </span>
          </div>
        );
      })}

    </div>
  );
};

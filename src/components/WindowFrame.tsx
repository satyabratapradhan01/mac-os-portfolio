import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WindowState } from '../types';
import { sound } from '../utils/sound';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (w: number, h: number) => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  rightHeaderContent?: React.ReactNode;
  titleBarClassName?: string;
  isTransparent?: boolean;
  hideTitleBar?: boolean;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  children,
  headerContent,
  rightHeaderContent,
  titleBarClassName = 'bg-slate-900/80 border-b border-white/10',
  isTransparent = false,
  hideTitleBar = false,
}) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialDimensions = useRef({ w: 0, h: 0 });

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    // Only drag if left clicked and not on a button/input
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) return;

    onFocus();
    if (windowState.isMaximized) return;

    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: windowState.position.x, y: windowState.position.y };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - dragStart.current.x;
      const dy = ev.clientY - dragStart.current.y;

      const newX = Math.max(10, Math.min(window.innerWidth - 100, initialPos.current.x + dx));
      const newY = Math.max(30, Math.min(window.innerHeight - 100, initialPos.current.y + dy));

      onUpdatePosition(newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    if (windowState.isMaximized) return;

    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    initialDimensions.current = { w: windowState.size.width, h: windowState.size.height };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dw = ev.clientX - resizeStart.current.x;
      const dh = ev.clientY - resizeStart.current.y;

      const newW = Math.max(windowState.minSize.width, Math.min(window.innerWidth - 40, initialDimensions.current.w + dw));
      const newH = Math.max(windowState.minSize.height, Math.min(window.innerHeight - 80, initialDimensions.current.h + dh));

      onUpdateSize(newW, newH);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const windowStyle = windowState.isMaximized
    ? {
      top: 30,
      left: 0,
      width: '100vw',
      height: 'calc(100vh - 30px - 72px)',
      zIndex: windowState.zIndex,
    }
    : {
      top: windowState.position.y,
      left: windowState.position.x,
      width: windowState.size.width,
      height: windowState.size.height,
      zIndex: windowState.zIndex,
    };

  return (
    <motion.div
      id={`window-${windowState.id}`}
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      style={windowStyle}
      onClick={onFocus}
      className={`fixed flex flex-col rounded-xl overflow-hidden shadow-2xl transition-shadow duration-200 select-none ${isTransparent ? 'bg-slate-900/90 backdrop-blur-2xl' : 'bg-slate-900/95 backdrop-blur-2xl'
        } border border-white/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]`}
    >
      {/* Titlebar / Window Header */}
      {!hideTitleBar && (
        <div
          id={`titlebar-${windowState.id}`}
          onMouseDown={handleMouseDownHeader}
          onDoubleClick={onMaximize}
          className={`h-10 px-3 flex items-center justify-between cursor-default ${titleBarClassName} relative`}
        >
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-2 group/lights z-10">
            <button
              id={`btn-close-${windowState.id}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-sm"
              title="Close"
            >
              <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
            </button>
            <button
              id={`btn-minimize-${windowState.id}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-sm"
              title="Minimize"
            >
              <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
            </button>
            <button
              id={`btn-maximize-${windowState.id}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onMaximize();
              }}
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-sm"
              title="Zoom / Fullscreen"
            >
              {windowState.isMaximized ? (
                <Minimize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
              ) : (
                <Maximize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
              )}
            </button>
          </div>

          {/* Center Title or Custom Header */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            {headerContent || (
              <span className="text-xs font-medium text-slate-300 truncate tracking-wide">
                {windowState.title}
              </span>
            )}
          </div>

          {/* Right Header Content / Action Controls */}
          <div className="z-10 flex items-center justify-end min-w-[3.5rem]">
            {rightHeaderContent}
          </div>
        </div>
      )}

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col text-slate-100 font-sans">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              onClose,
              onMinimize,
              onMaximize,
              isMaximized: windowState.isMaximized,
              onMouseDownHeader: handleMouseDownHeader,
            })
          : children}
      </div>

      {/* Resize Handle (bottom-right corner) */}
      {!windowState.isMaximized && (
        <div
          id={`resize-handle-${windowState.id}`}
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-white/30 rounded-br-sm"></div>
        </div>
      )}
    </motion.div>
  );
};

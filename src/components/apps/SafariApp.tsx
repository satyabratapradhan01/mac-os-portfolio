import React from 'react';
import { sound } from '../../utils/sound';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Plus,
  Copy,
  Search,
  Sidebar,
  ArrowRight,
  Shield,
  X,
  Minus,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ArticleItem {
  id: string;
  date: string;
  title: string;
  url: string;
  iconType: 'typescript' | 'threejs' | 'gsap';
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'ts-guide',
    date: 'Sep 2, 2025',
    title: 'TypeScript Explained: What It Is, Why It Matters, and How to Master It',
    url: 'https://dev.to/t/typescript',
    iconType: 'typescript',
  },
  {
    id: 'threejs-guide',
    date: 'Aug 28, 2025',
    title: 'The Ultimate Guide to Mastering Three.js for 3D Development',
    url: 'https://threejs.org/docs',
    iconType: 'threejs',
  },
  {
    id: 'gsap-guide',
    date: 'Aug 15, 2025',
    title: 'The Ultimate Guide to Mastering GSAP Animations',
    url: 'https://gsap.com/docs/v3',
    iconType: 'gsap',
  },
];

interface SafariAppProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onMouseDownHeader?: (e: React.MouseEvent) => void;
}

export const SafariApp: React.FC<SafariAppProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  onMouseDownHeader,
}) => {
  const handleOpenPost = (article: ArticleItem) => {
    sound.playClick();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = (type: 'typescript' | 'threejs' | 'gsap') => {
    if (type === 'typescript') {
      return (
        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center filter drop-shadow-md">
          {/* TypeScript 3D Metallic Shield */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="tsGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="tsGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="tsGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Outer Bevel Rim */}
            <path
              d="M50 4 L92 18 L82 82 L50 96 L18 82 L8 18 Z"
              fill="url(#tsGoldRim)"
            />
            {/* Inner Shield Face */}
            <path
              d="M50 8 L87 21 L78 78 L50 91 L22 78 L13 21 Z"
              fill="url(#tsGradDark)"
            />
            {/* Specular Highlight Overlay */}
            <path
              d="M50 8 L87 21 L78 78 L50 91 L22 78 L13 21 Z"
              fill="url(#tsGloss)"
            />
            {/* TS Logo Bold Text */}
            <text
              x="50"
              y="63"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="34"
              fill="#ffffff"
              textAnchor="middle"
              letterSpacing="-1"
            >
              TS
            </text>
          </svg>
        </div>
      );
    }

    if (type === 'threejs') {
      return (
        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center filter drop-shadow-md">
          {/* Three.js 3D Geometric Cluster */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="threePyramidPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="threePyramidBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="threePyramidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <radialGradient id="threeSphereGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
            {/* 3D Pyramid Base & Facets */}
            <polygon points="50,10 88,72 12,72" fill="url(#threePyramidPink)" />
            <polygon points="50,10 88,72 50,88" fill="url(#threePyramidBlue)" opacity="0.9" />
            <polygon points="50,10 12,72 50,88" fill="url(#threePyramidGold)" opacity="0.8" />
            {/* Floating 3D Spherical Node */}
            <circle cx="28" cy="45" r="11" fill="url(#threeSphereGrad)" />
            {/* Triangular Center Hole */}
            <polygon points="50,34 68,64 32,64" fill="#0f172a" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-16 h-16 shrink-0 relative flex items-center justify-center filter drop-shadow-md">
        {/* GSAP 3D Superhero Character */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="gsapCapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="gsapHeroSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          {/* Green Flowing Cape */}
          <path d="M25 28 Q10 50 16 88 L84 88 Q90 50 75 28 Z" fill="url(#gsapCapeGrad)" />
          {/* Superhero Head */}
          <circle cx="50" cy="20" r="10" fill="url(#gsapHeroSuit)" />
          {/* Torso & Legs */}
          <path d="M42 32 L58 32 L64 62 L36 62 Z" fill="url(#gsapHeroSuit)" />
          <path d="M40 62 L47 90 L53 90 L60 62 Z" fill="#94a3b8" />
          {/* Hero Pose Arms */}
          <path d="M36 34 L25 45 L36 54" stroke="url(#gsapHeroSuit)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M64 34 L75 45 L64 54" stroke="url(#gsapHeroSuit)" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Bright Green GSAP Emblem */}
          <circle cx="50" cy="45" r="6" fill="#22c55e" />
        </svg>
      </div>
    );
  };

  return (
    <div id="safari-app" className="flex flex-col h-full bg-white text-slate-900 font-sans select-text overflow-hidden">
      {/* Unified Safari Window Toolbar (No separate titlebar) */}
      <div
        onMouseDown={onMouseDownHeader}
        onDoubleClick={onMaximize}
        className="bg-[#f6f6f8] px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 select-none cursor-default"
      >
        {/* Left Section: macOS Traffic Lights + Nav Buttons */}
        <div className="flex items-center gap-3">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-1.5 group/lights pr-1">
            <button
              id="btn-close-safari-custom"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onClose?.();
              }}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-xs cursor-pointer"
              title="Close"
            >
              <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
            </button>
            <button
              id="btn-minimize-safari-custom"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onMinimize?.();
              }}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-xs cursor-pointer"
              title="Minimize"
            >
              <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
            </button>
            <button
              id="btn-maximize-safari-custom"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onMaximize?.();
              }}
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-black/70 hover:text-black transition-all active:brightness-75 shadow-xs cursor-pointer"
              title="Zoom"
            >
              {isMaximized ? (
                <Minimize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
              ) : (
                <Maximize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity stroke-[3]" />
              )}
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1 text-slate-500">
            <button className="p-1 rounded hover:bg-slate-200/80 transition-colors" title="Toggle Sidebar">
              <Sidebar className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-slate-200/80 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-slate-200/80 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Shield + Smart Search / URL Bar */}
        <div className="flex-1 max-w-md mx-2 flex items-center justify-center gap-2">
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title="Privacy Report">
            <Shield className="w-4 h-4" />
          </button>
          <div className="flex-1 bg-white border border-slate-200/90 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-xs text-slate-400 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search or enter website name</span>
          </div>
        </div>

        {/* Right Section: Action Icons */}
        <div className="flex items-center gap-1 text-slate-500">
          <button className="p-1 rounded hover:bg-slate-200/80 transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-slate-200/80 transition-colors" title="New Tab">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-slate-200/80 transition-colors" title="Tab Overview">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Blog Canvas Content */}
      <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Page Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#db2777] mb-8 tracking-tight font-sans">
            My Developer Blog
          </h1>

          {/* Articles List */}
          <div className="space-y-8">
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                className="flex items-start gap-5 group cursor-pointer"
                onClick={() => handleOpenPost(article)}
              >
                {/* 3D Icon Graphic */}
                {renderIcon(article.iconType)}

                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 mb-1 font-medium">
                    {article.date}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                    {article.title}
                  </h2>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPost(article);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Check out the full post</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

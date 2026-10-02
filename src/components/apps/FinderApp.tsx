import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AppId, ProjectItem } from '../../types';
import { DEVELOPER_PROFILE } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';
import { sound } from '../../utils/sound';
import {
  Briefcase,
  Info,
  FileText,
  Trash2,
  Folder,
  Search,
  ExternalLink,
  Code,
  X,
  Github,
  Linkedin,
  Eye,
} from 'lucide-react';

interface FinderAppProps {
  onOpenApp: (id: AppId) => void;
}

type MainViewMode = 'project-folder' | 'work-all' | 'about' | 'resume' | 'trash';

interface FileItem {
  id: string;
  name: string;
  type: 'txt' | 'url' | 'png' | 'fig' | 'folder';
  label: string;
  project?: ProjectItem;
  url?: string;
  imageUrl?: string;
  description?: string;
}

// Custom Ultra-Modern macOS Finder File & Link Icon Renderers
const MacTxtIcon: React.FC = () => (
  <div className="relative w-14 h-16 group-hover:-translate-y-1 transition-all duration-300 ease-out select-none flex items-center justify-center">
    <div className="absolute inset-x-1 -bottom-1 h-3 bg-blue-500/15 rounded-full blur-md group-hover:bg-blue-500/35 group-hover:blur-lg transition-all duration-300" />
    <img
      src="/icons/txt-document.png"
      alt="TXT Document"
      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
    />
  </div>
);

const MacSafariIcon: React.FC = () => (
  <div className="relative w-14 h-14 group-hover:-translate-y-1 transition-all duration-300 ease-out select-none flex items-center justify-center">
    <div className="absolute inset-x-1 -bottom-1 h-3 bg-sky-500/20 rounded-full blur-md group-hover:bg-sky-500/40 group-hover:blur-lg transition-all duration-300" />
    <img
      src="/icons/safari.png"
      alt="Safari Link"
      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
    />
  </div>
);

const MacPngIcon: React.FC<{ imageUrl?: string }> = ({ imageUrl }) => (
  <div className="relative w-16 h-18 bg-white rounded-lg shadow border border-slate-300 flex flex-col p-1 overflow-hidden group-hover:shadow-md transition-shadow">
    {/* Dog ear fold */}
    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-100 rounded-bl-sm border-l border-b border-slate-300" />

    {/* Thumbnail area */}
    <div className="flex-1 bg-slate-50 rounded overflow-hidden relative flex items-center justify-center border border-slate-200">
      {imageUrl ? (
        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px]">
          IMG
        </div>
      )}
    </div>

    {/* Bottom PNG Label Badge */}
    <div className="h-4 bg-slate-100 mt-1 rounded-[2px] flex items-center justify-center border border-slate-200">
      <span className="text-[8px] font-black text-slate-500 tracking-wider">PNG</span>
    </div>
  </div>
);

const MacDesignIcon: React.FC = () => (
  <div className="relative w-16 h-18 bg-gradient-to-b from-white to-slate-100 rounded-lg shadow border border-slate-300 flex flex-col items-center justify-center p-1.5 overflow-hidden group-hover:shadow-md transition-shadow">
    {/* Dog ear fold */}
    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-200 rounded-bl-sm border-l border-b border-slate-300" />

    {/* Figma / Design Icon Emblem */}
    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold shadow-sm">
      fig
    </div>
  </div>
);

const MacFolderIcon: React.FC = () => (
  <div className="relative w-16 h-14 group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-300 ease-out select-none">
    {/* Folder Back Tab */}
    <div className="w-7 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-md absolute -top-1.5 left-1 shadow-xs border-t border-l border-r border-blue-400/60" />
    {/* Main Folder Front Body */}
    <div className="w-full h-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.35)] border border-sky-300/60 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_12px_26px_rgba(37,99,235,0.45)] transition-all duration-300">
      {/* Top Glass Lens sheen */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />
      {/* Folder Inner Card */}
      <div className="w-13 h-8 rounded-lg bg-white/20 backdrop-blur-xs border border-white/35 shadow-inner" />
    </div>
  </div>
);

// Helper to format clean TextEdit prose paragraphs matching Image 1
const formatProjectTxtProse = (project: ProjectItem): string[] => {
  if (project.id === 'devpilot-ai') {
    return [
      "Our DevPilot App is an in-browser AI-powered web application builder that converts natural language prompts into complete, production-ready React and Node.js projects.",
      "Instead of manually configuring backends, installing npm packages, or spinning up external cloud containers, DevPilot embeds an entire Node.js runtime inside your browser using WASM-based WebContainers to run dev servers and render live previews instantly.",
      "Think of it like having an expert full-stack AI engineer inside your browser—ready to generate, mount, and run complete web applications in real time with an interactive Monaco code editor.",
      "It's built with React.js, Node.js, and TypeScript, utilizing Google Gemini 2.5 Flash as the primary LLM with Groq LLaMA 3.3 70B automatic fallback routing."
    ];
  }
  if (project.id === 'job-tracker-ai') {
    return [
      "Our AI-Powered Job Application Tracker is a modern management platform that helps job seekers organize, monitor, and optimize their job search pipeline end-to-end.",
      "Instead of tracking applications in scattered spreadsheets or missing follow-up dates, users can manage interview stages, organize applications, and get AI-guided resume feedback in real time.",
      "Think of it like having a personal career co-pilot—keeping your search organized and matching your resume directly against target job descriptions.",
      "It's built with React.js, Node.js, Express.js, and MongoDB, integrating the Claude API for intelligent resume matching and application insights."
    ];
  }
  if (project.id === 'clothify-ecommerce') {
    return [
      "Our Clothify E-Commerce Platform is a fast and convenient way to shop online with role-based customer and admin management.",
      "Instead of slow checkout flows or fragmented order systems, Clothify features real-time cart synchronization, secure user dashboards, and instant payment processing.",
      "Think of it like having your favorite clothing store in your pocket—ready to deliver seamless product browsing and secure payments anytime, anywhere.",
      "It's built with React.js, Node.js, Express.js, and MongoDB, featuring Stripe payment gateway integration and Cloudinary cloud media storage."
    ];
  }
  if (project.id === 'wanderlust-hotel') {
    return [
      "Our Wanderlust Booking App is an intuitive hotel and vacation rental platform designed for effortless travel planning.",
      "Instead of tedious booking processes, users can explore curated accommodation listings, view interactive map locations, and reserve stays with instant confirmation.",
      "Think of it like having a global travel concierge—ready to find and book top-rated stays worldwide.",
      "It's built with Node.js, Express.js, MongoDB, and EJS, using Mapbox API for location mapping and Passport.js for secure user sessions."
    ];
  }

  return [
    project.description,
    project.tagline,
    project.longDescription.split('\n\n')[0] || project.description,
    `It's built with ${project.techStack.slice(0, 4).join(', ')} with a clean, modern design.`
  ];
};

// Floating Draggable macOS TextEdit Window Component (Matching Image 2)
interface ProjectTxtWindowProps {
  file: {
    title: string;
    type: 'txt' | 'png' | 'url';
    project?: ProjectItem;
    imageUrl?: string;
  };
  onClose: () => void;
}

const ProjectTxtWindow: React.FC<ProjectTxtWindowProps> = ({ file, onClose }) => {
  // Initial floating position on the right side of the screen outside of Finder (matching Image 2)
  const [position, setPosition] = useState(() => {
    const defaultX = Math.max(20, Math.min(window.innerWidth - 470, window.innerWidth / 2 + 80));
    const defaultY = Math.max(60, Math.min(window.innerHeight - 450, 110));
    return { x: defaultX, y: defaultY };
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) return;

    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - dragStart.current.x;
      const dy = ev.clientY - dragStart.current.y;

      const newX = Math.max(10, Math.min(window.innerWidth - 200, initialPos.current.x + dx));
      const newY = Math.max(30, Math.min(window.innerHeight - 100, initialPos.current.y + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return createPortal(
    <div
      className="fixed z-[99999] top-0 left-0 bg-white border border-slate-200/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-[450px] max-w-[90vw] overflow-hidden text-slate-800 flex flex-col select-none animate-in fade-in zoom-in-95 duration-150"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {/* macOS Window Title Bar - DRAGGABLE HEADER */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="h-9 px-4 bg-slate-50/95 border-b border-slate-200/80 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing"
      >
        {/* Traffic Light Dots */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 hover:opacity-80 transition-opacity flex items-center justify-center group"
            title="Close"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10" />
        </div>

        {/* Centered Document Title */}
        <span className="text-xs font-semibold text-slate-500 font-sans tracking-tight truncate px-2 max-w-[260px]">
          {file.title}
        </span>

        {/* Right Side Search Icon */}
        <div className="w-12 flex justify-end">
          <Search className="w-3.5 h-3.5 text-slate-300" />
        </div>
      </div>

      {/* Document Body (Matching Image 1 & 2) */}
      <div className="p-6 sm:p-7 space-y-4 font-sans text-xs sm:text-sm text-slate-700 leading-relaxed overflow-y-auto max-h-[60vh] select-text">
        {file.project ? (
          formatProjectTxtProse(file.project).map((paragraph, idx) => (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-slate-700">{file.title}</p>
        )}
      </div>
    </div>,
    document.body
  );
};

export const FinderApp: React.FC<FinderAppProps> = ({ onOpenApp }) => {
  const { projects } = usePortfolio();

  // State
  const [viewMode, setViewMode] = useState<MainViewMode>('project-folder');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'devpilot-ai');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Quick Look Preview Modal State
  const [quickLookFile, setQuickLookFile] = useState<{
    title: string;
    type: 'txt' | 'png' | 'url';
    project?: ProjectItem;
    imageUrl?: string;
  } | null>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Helper to handle double-clicking files
  const handleFileItemDoubleClick = (item: FileItem) => {
    sound.playClick();
    if (item.type === 'txt') {
      setQuickLookFile({
        title: item.name,
        type: 'txt',
        project: item.project || activeProject,
      });
    } else if (item.type === 'png') {
      setQuickLookFile({
        title: item.name,
        type: 'png',
        imageUrl: item.imageUrl || activeProject.screenshots?.[0]?.imageUrl,
        project: activeProject,
      });
    } else if (item.type === 'url') {
      if (item.url) {
        window.open(item.url, '_blank');
      } else {
        onOpenApp('safari');
      }
    } else if (item.type === 'fig') {
      if (activeProject.githubUrl) {
        window.open(activeProject.githubUrl, '_blank');
      } else {
        onOpenApp('vscode');
      }
    } else if (item.type === 'folder' && item.project) {
      setSelectedProjectId(item.project.id);
      setViewMode('project-folder');
    }
  };

  // Generate Files inside the selected Project Folder
  const getProjectFiles = (project: ProjectItem): FileItem[] => {
    // Derive domain name for web link
    const domainName = project.liveUrl
      ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
      : `${project.id.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    return [
      {
        id: `${project.id}-txt`,
        name: `${project.title.split(' ')[0]} Project.txt`,
        type: 'txt',
        label: `${project.title.split(' ')[0]} Project.txt`,
        project: project,
      },
      {
        id: `${project.id}-url`,
        name: domainName,
        type: 'url',
        label: domainName,
        url: project.liveUrl,
        project: project,
      },
    ];
  };

  const currentFiles =
    viewMode === 'project-folder' && activeProject ? getProjectFiles(activeProject) : [];

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="finder-app" className="flex h-full bg-[#f5f5f5] text-slate-800 font-sans select-none overflow-hidden text-xs relative">
      {/* -------------------- LEFT SIDEBAR -------------------- */}
      <div className="w-52 bg-[#ececec] border-r border-slate-300 p-3 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-4">
          {/* FAVORITES SECTION */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase px-2 mb-1.5 block tracking-wider">
              Favorites
            </span>
            <div className="space-y-0.5">
              {/* Work (All Projects Grid) */}
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('work-all');
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'work-all'
                  ? 'bg-[#d0d0d0] text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-black/5'
                  }`}
              >
                <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">Work</span>
              </button>

              {/* About me */}
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('about');
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'about'
                  ? 'bg-[#d0d0d0] text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-black/5'
                  }`}
              >
                <Info className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="truncate">About me</span>
              </button>

              {/* Resume */}
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('resume');
                  onOpenApp('resume');
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'resume'
                  ? 'bg-[#d0d0d0] text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-black/5'
                  }`}
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">Resume</span>
              </button>

              {/* Trash */}
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('trash');
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'trash'
                  ? 'bg-[#d0d0d0] text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-black/5'
                  }`}
              >
                <Trash2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">Trash</span>
              </button>
            </div>
          </div>

          {/* WORK / PROJECTS FOLDERS SECTION */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase px-2 mb-1.5 block tracking-wider">
              Work
            </span>
            <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {projects.map((proj) => {
                const isSelected = viewMode === 'project-folder' && selectedProjectId === proj.id;
                // Truncate folder label nicely
                const folderLabel = proj.title.length > 18 ? proj.title.slice(0, 16) + '...' : proj.title;

                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedProjectId(proj.id);
                      setViewMode('project-folder');
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${isSelected
                      ? 'bg-[#d0d0d0] text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-black/5'
                      }`}
                  >
                    <Folder className="w-4 h-4 fill-blue-400 text-blue-500 shrink-0" />
                    <span className="truncate">{folderLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="pt-2 border-t border-slate-300 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="font-mono">Macintosh HD</span>
          <span className="font-mono opacity-60">540 GB free</span>
        </div>
      </div>

      {/* -------------------- MAIN CONTENT PANE -------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f5f5f5]">
        {/* TOP BAR / WINDOW HEADER */}
        <div className="h-10 px-4 border-b border-slate-300 flex items-center justify-between shrink-0 bg-[#ececec]/70">
          <div className="flex items-center gap-2 text-slate-600">
            {viewMode === 'project-folder' && activeProject && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Folder className="w-4 h-4 fill-blue-400 text-blue-500" />
                <span>{activeProject.title}</span>
              </div>
            )}
            {viewMode === 'work-all' && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span>Work / All Projects</span>
              </div>
            )}
            {viewMode === 'about' && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Info className="w-4 h-4 text-sky-500" />
                <span>About Satyabrata</span>
              </div>
            )}
          </div>

          {/* Search Toggle / Input */}
          <div className="flex items-center gap-2">
            {isSearchActive ? (
              <div className="relative w-44">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white border border-slate-300 rounded-md pl-2 pr-6 py-0.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 shadow-sm"
                />
                <button
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchActive(true)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* FILE EXPLORER CANVAS AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 1. SINGLE PROJECT FOLDER FILE GRID (Matching Image 1) */}
          {viewMode === 'project-folder' && activeProject && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
                {currentFiles.map((file) => {
                  const isSelected = selectedFileId === file.id;

                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        setSelectedFileId(file.id);
                        handleFileItemDoubleClick(file);
                      }}
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer group transition-all ${isSelected ? 'bg-blue-500/20 ring-1 ring-blue-400' : 'hover:bg-black/5'
                        }`}
                    >
                      {/* Icon Graphic */}
                      {file.type === 'txt' && <MacTxtIcon />}
                      {file.type === 'url' && <MacSafariIcon />}
                      {file.type === 'png' && <MacPngIcon imageUrl={file.imageUrl} />}
                      {file.type === 'fig' && <MacDesignIcon />}

                      {/* File Label Text */}
                      <span className="text-xs text-slate-700 font-medium text-center max-w-[110px] truncate group-hover:text-slate-900">
                        {file.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Hint at bottom */}
              <div className="mt-12 text-center text-[11px] text-slate-400 font-mono">
                Click any file to open preview or web link
              </div>
            </div>
          )}

          {/* 2. WORK / ALL PROJECTS GRID */}
          {viewMode === 'work-all' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFileId(proj.id);
                    setSelectedProjectId(proj.id);
                    setViewMode('project-folder');
                  }}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer group transition-all ${selectedFileId === proj.id ? 'bg-blue-500/20 ring-1 ring-blue-400' : 'hover:bg-black/5'
                    }`}
                >
                  <MacFolderIcon />
                  <span className="text-xs text-slate-700 font-medium text-center max-w-[120px] truncate group-hover:text-slate-900">
                    {proj.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 3. ABOUT ME VIEW */}
          {viewMode === 'about' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-2 border-blue-400/40 shadow overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  <img
                    src={DEVELOPER_PROFILE.avatar}
                    alt={DEVELOPER_PROFILE.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{DEVELOPER_PROFILE.name}</h2>
                  <p className="text-xs font-medium text-blue-500 mt-0.5">{DEVELOPER_PROFILE.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{DEVELOPER_PROFILE.location}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-2 whitespace-pre-line">
                  {DEVELOPER_PROFILE.bio}
                </div>

                {DEVELOPER_PROFILE.whatILoveBuilding && (
                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs mb-2">What I Love Building</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {DEVELOPER_PROFILE.whatILoveBuilding.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {DEVELOPER_PROFILE.bioTagline && (
                  <p className="pt-2 text-slate-700 italic border-t border-slate-200/60">
                    {DEVELOPER_PROFILE.bioTagline}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {DEVELOPER_PROFILE.stats.map((st) => (
                  <div key={st.label} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-base font-bold text-slate-900 block">{st.value}</span>
                    <span className="text-[10px] text-slate-400">{st.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={DEVELOPER_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={DEVELOPER_PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          )}

          {/* 4. TRASH VIEW */}
          {viewMode === 'trash' && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <img src="/icons/trash.png" alt="Trash" className="w-16 h-16 mb-3 object-contain opacity-80" />
              <span className="text-xs font-medium">Trash is empty</span>
            </div>
          )}
        </div>
      </div>

      {/* -------------------- FLOATING DRAGGABLE TEXTEDIT WINDOW -------------------- */}
      {quickLookFile && (
        <ProjectTxtWindow file={quickLookFile} onClose={() => setQuickLookFile(null)} />
      )}
    </div>
  );
};

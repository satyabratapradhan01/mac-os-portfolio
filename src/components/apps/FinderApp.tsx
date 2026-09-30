import React, { useState } from 'react';
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

// Custom macOS Finder File Icon Renderers (light theme)
const MacTxtIcon: React.FC = () => (
  <div className="relative w-14 h-16 bg-gradient-to-b from-white to-slate-100 rounded-sm shadow border border-slate-300 flex flex-col p-1.5 overflow-hidden group-hover:shadow-md transition-shadow">
    {/* Dog ear fold */}
    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-200 rounded-bl-sm border-l border-b border-slate-300" />
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-slate-400 border-l-[14px] border-l-transparent pointer-events-none opacity-20" />

    {/* Text Lines */}
    <div className="space-y-1 mt-1 pr-1.5">
      <div className="h-1 bg-slate-400 rounded-full w-full" />
      <div className="h-1 bg-slate-300 rounded-full w-4/5" />
      <div className="h-1 bg-slate-300 rounded-full w-full" />
      <div className="h-1 bg-slate-400/70 rounded-full w-3/4" />
      <div className="h-1 bg-slate-300 rounded-full w-5/6" />
      <div className="h-1 bg-slate-300 rounded-full w-2/3" />
      <div className="h-1 bg-slate-400/60 rounded-full w-4/5" />
    </div>
  </div>
);

const MacSafariIcon: React.FC = () => (
  <div className="w-14 h-14 bg-white rounded-2xl shadow border border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center relative shadow-inner">
      {/* Compass Ring */}
      <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
        {/* Compass Needle */}
        <div className="w-1 h-8 bg-gradient-to-b from-red-500 via-red-400 to-slate-200 rotate-45 rounded-full shadow-sm" />
      </div>
    </div>
  </div>
);

const MacPngIcon: React.FC<{ imageUrl?: string }> = ({ imageUrl }) => (
  <div className="relative w-14 h-16 bg-white rounded-sm shadow border border-slate-300 flex flex-col p-1 overflow-hidden group-hover:shadow-md transition-shadow">
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
  <div className="relative w-14 h-16 bg-gradient-to-b from-white to-slate-100 rounded-sm shadow border border-slate-300 flex flex-col items-center justify-center p-1.5 overflow-hidden group-hover:shadow-md transition-shadow">
    {/* Dog ear fold */}
    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-200 rounded-bl-sm border-l border-b border-slate-300" />

    {/* Figma / Design Icon Emblem */}
    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold shadow-sm">
      fig
    </div>
  </div>
);

const MacFolderIcon: React.FC = () => (
  <div className="w-16 h-13 relative group-hover:scale-105 transition-transform">
    {/* Back tab */}
    <div className="w-7 h-3 bg-blue-500 rounded-t-md absolute -top-1.5 left-1 shadow-sm" />
    {/* Main folder body */}
    <div className="w-16 h-12 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 rounded-lg shadow border border-blue-300/50 flex items-center justify-center">
      <div className="w-14 h-9 bg-blue-200/40 rounded border border-white/30" />
    </div>
  </div>
);

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
      {
        id: `${project.id}-png`,
        name: `${project.id.toLowerCase()}.png`,
        type: 'png',
        label: `${project.id.toLowerCase()}.png`,
        imageUrl: project.screenshots?.[0]?.imageUrl,
        project: project,
      },
      {
        id: `${project.id}-fig`,
        name: 'Design.fig',
        type: 'fig',
        label: 'Design.fig',
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
                      onClick={() => setSelectedFileId(file.id)}
                      onDoubleClick={() => handleFileItemDoubleClick(file)}
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
                Double-click any file to preview or open link
              </div>
            </div>
          )}

          {/* 2. WORK / ALL PROJECTS GRID */}
          {viewMode === 'work-all' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedFileId(proj.id)}
                  onDoubleClick={() => {
                    sound.playClick();
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 border-2 border-blue-300 shadow flex items-center justify-center font-black text-xl text-white">
                  SP
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{DEVELOPER_PROFILE.name}</h2>
                  <p className="text-xs font-medium text-blue-500 mt-0.5">{DEVELOPER_PROFILE.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{DEVELOPER_PROFILE.location}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {DEVELOPER_PROFILE.bio}
              </p>

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
              <Trash2 className="w-12 h-12 mb-3 stroke-1" />
              <span className="text-xs font-medium">Trash is empty</span>
            </div>
          )}
        </div>
      </div>

      {/* -------------------- QUICK LOOK PREVIEW MODAL -------------------- */}
      {quickLookFile && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setQuickLookFile(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 flex flex-col max-h-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Look Header */}
            <div className="h-9 px-4 bg-[#ececec] border-b border-slate-300 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-slate-800 truncate">{quickLookFile.title}</span>
              </div>
              <button
                onClick={() => setQuickLookFile(null)}
                className="p-1 rounded hover:bg-black/10 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Look Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {quickLookFile.type === 'txt' && quickLookFile.project && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{quickLookFile.project.title}</h3>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">{quickLookFile.project.tagline}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {quickLookFile.project.longDescription}
                  </div>

                  {/* Highlights */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Performance Highlights
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLookFile.project.metrics.map((m, idx) => (
                        <div key={idx} className="bg-emerald-50 p-2 rounded border border-emerald-200 text-[11px] font-mono text-emerald-700">
                          ⚡ {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickLookFile.project.techStack.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {quickLookFile.type === 'png' && (
                <div className="space-y-3">
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    {quickLookFile.imageUrl ? (
                      <img
                        src={quickLookFile.imageUrl}
                        alt="Project Screenshot"
                        className="w-full h-auto object-contain max-h-[360px]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-400 font-mono">
                        No Screenshot Available
                      </div>
                    )}
                  </div>
                  {quickLookFile.project && (
                    <div className="text-center text-xs text-slate-500">
                      Screenshot preview for <span className="font-semibold text-slate-700">{quickLookFile.project.title}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Look Footer Action */}
            <div className="p-3 bg-[#f5f5f5] border-t border-slate-200 flex justify-end gap-2 shrink-0">
              {quickLookFile.project?.liveUrl && (
                <button
                  onClick={() => {
                    window.open(quickLookFile.project?.liveUrl, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Demo</span>
                </button>
              )}
              {quickLookFile.project?.githubUrl && (
                <button
                  onClick={() => {
                    window.open(quickLookFile.project?.githubUrl, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-300"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              )}
              <button
                onClick={() => setQuickLookFile(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

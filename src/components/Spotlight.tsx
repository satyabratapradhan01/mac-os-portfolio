import React, { useState, useEffect, useRef } from 'react';
import { AppId, ProjectItem, NoteItem, SkillCategory } from '../types';
import { sound } from '../utils/sound';
import { PROJECTS, SKILL_CATEGORIES, NOTES, EXPERIENCES } from '../data/portfolioData';
import {
  Search,
  Folder,
  Terminal,
  FileText,
  Code,
  Music,
  Camera,
  Layers,
  Sparkles,
  Calculator,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Safe Math calculation evaluator
  const calcResult = React.useMemo(() => {
    if (!query.trim()) return null;
    const cleanExpr = query.replace(/\s+/g, '');
    if (/^[0-9+\-*/().^%]+$/.test(cleanExpr) && /[+\-*/%]/.test(cleanExpr)) {
      try {
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${cleanExpr})`)();
        if (typeof res === 'number' && !isNaN(res)) {
          return res;
        }
      } catch {
        return null;
      }
    }
    return null;
  }, [query]);

  // Build searchable items list
  const searchResults = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default top suggestions
      return [
        { type: 'app', id: 'finder' as AppId, title: 'Finder — Portfolio Explorer', subtitle: 'Browse all files, projects & skills', icon: Folder },
        { type: 'app', id: 'terminal' as AppId, title: 'Terminal.app', subtitle: 'Interactive zsh developer shell', icon: Terminal },
        { type: 'app', id: 'vscode' as AppId, title: 'Code Studio (VS Code)', subtitle: 'View codebase, architecture & snippets', icon: Code },
        { type: 'app', id: 'resume' as AppId, title: 'Resume.pdf', subtitle: 'View experience, skills & achievements', icon: FileText },
        { type: 'app', id: 'photos' as AppId, title: 'Photos & Studio Setup', subtitle: 'Gallery of hardware, talks & life', icon: Camera },
        { type: 'app', id: 'music' as AppId, title: 'Apple Music Player', subtitle: 'Lo-Fi coding and focus tracks', icon: Music },
      ];
    }

    const items: Array<{
      type: 'app' | 'project' | 'skill' | 'note' | 'calc';
      id: string;
      appTarget?: AppId;
      title: string;
      subtitle: string;
      icon: any;
      payload?: any;
    }> = [];

    if (calcResult !== null) {
      items.push({
        type: 'calc',
        id: 'calc-result',
        appTarget: 'calculator',
        title: `= ${calcResult}`,
        subtitle: `Calculation for: ${query}`,
        icon: Calculator,
      });
    }

    // Search Apps
    const apps: { id: AppId; name: string; desc: string; icon: any }[] = [
      { id: 'finder', name: 'Finder', desc: 'Browse Projects, Skills & Files', icon: Folder },
      { id: 'terminal', name: 'Terminal', desc: 'Command Line Shell', icon: Terminal },
      { id: 'safari', name: 'Safari', desc: 'Interactive Browser & Web Previews', icon: Layers },
      { id: 'vscode', name: 'VS Code Studio', desc: 'Code Viewer & Architecture', icon: Code },
      { id: 'photos', name: 'Photos', desc: 'Image Gallery & Setup', icon: Camera },
      { id: 'notes', name: 'Notes', desc: 'Engineering & Architecture Notes', icon: FileText },
      { id: 'resume', name: 'Resume PDF', desc: 'Curriculum Vitae & Experience', icon: FileText },
      { id: 'music', name: 'Music', desc: 'Lo-Fi Coding Beats & Synthesizer', icon: Music },
      { id: 'calculator', name: 'Calculator', desc: 'Basic & Scientific Calculator', icon: Calculator },
      { id: 'messages', name: 'Messages', desc: 'Contact Developer Directly', icon: Sparkles },
    ];

    apps.forEach((app) => {
      if (app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)) {
        items.push({
          type: 'app',
          id: app.id,
          appTarget: app.id,
          title: app.name,
          subtitle: `Application — ${app.desc}`,
          icon: app.icon,
        });
      }
    });

    // Search Projects
    PROJECTS.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.techStack.some((t) => t.toLowerCase().includes(q)) ||
        proj.category.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'project',
          id: proj.id,
          appTarget: 'finder',
          title: proj.title,
          subtitle: `Project (${proj.category}) — ${proj.tagline}`,
          icon: Folder,
          payload: proj,
        });
      }
    });

    // Search Notes
    NOTES.forEach((note) => {
      if (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          type: 'note',
          id: note.id,
          appTarget: 'notes',
          title: note.title,
          subtitle: `Note (${note.folder}) — ${note.date}`,
          icon: FileText,
          payload: note,
        });
      }
    });

    // Search Skills
    SKILL_CATEGORIES.forEach((cat) => {
      cat.skills.forEach((sk) => {
        if (sk.name.toLowerCase().includes(q)) {
          items.push({
            type: 'skill',
            id: `skill-${sk.name}`,
            appTarget: 'finder',
            title: sk.name,
            subtitle: `Skill (${cat.category}) — ${sk.level}% proficiency (${sk.experience})`,
            icon: Code,
          });
        }
      });
    });

    return items;
  }, [query, calcResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = searchResults[selectedIndex];
      if (item && item.appTarget) {
        sound.playWindowOpen();
        onOpenApp(item.appTarget);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="spotlight-overlay"
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-start justify-center pt-28 px-4"
    >
      <div
        id="spotlight-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="spotlight-input"
            type="text"
            placeholder="Spotlight Search (Type projects, skills, notes, or math)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-base text-white placeholder-slate-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const IconComp = item.icon || Folder;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  id={`spotlight-item-${idx}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    if (item.appTarget) {
                      sound.playWindowOpen();
                      onOpenApp(item.appTarget);
                      onClose();
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-white/10 text-blue-400'
                      }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {item.title}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-75" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Hint */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono">↑</kbd> <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono">↓</kbd></span>
            <span>Select <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono">↵</kbd></span>
            <span>Close <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono">esc</kbd></span>
          </div>
          <span className="text-slate-400 font-mono">Satyabrata Pradhan OS v15.2</span>
        </div>
      </div>
    </div>
  );
};

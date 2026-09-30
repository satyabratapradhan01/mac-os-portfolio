import React, { useState } from 'react';
import { NOTES } from '../../data/portfolioData';
import { NoteItem } from '../../types';
import { sound } from '../../utils/sound';
import {
  Folder,
  FileText,
  Search,
  Plus,
  Trash2,
  Share2,
  Calendar,
  Tag,
  Lock,
  Sparkles
} from 'lucide-react';

export const NotesApp: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [notesList, setNotesList] = useState<NoteItem[]>(NOTES);

  const folders = ['All', 'Architecture', 'Engineering', 'Thoughts', 'Reading'];

  const filteredNotes = notesList.filter((n) => {
    const matchesFolder = selectedFolder === 'All' || n.folder === selectedFolder;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const activeNote = notesList.find((n) => n.id === selectedNoteId) || notesList[0];

  const handleCreateNewNote = () => {
    sound.playClick();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      folder: 'Thoughts',
      preview: 'New thoughts or architectural sketch...',
      content: '# Untitled Note\n\nStart writing your thoughts here...',
      tags: ['Idea'],
    };
    setNotesList([newNote, ...notesList]);
    setSelectedNoteId(newNote.id);
  };

  return (
    <div id="notes-app" className="flex h-full bg-[#1e1e1e] text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Column 1: Folders */}
      <div className="w-40 bg-[#252526] border-r border-[#333] p-3 flex flex-col shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
          Folders
        </span>
        <div className="space-y-0.5">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => {
                sound.playClick();
                setSelectedFolder(f);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFolder === f
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>{f}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {f === 'All' ? notesList.length : notesList.filter((n) => n.folder === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Notes List */}
      <div className="w-56 bg-[#1e1e1e] border-r border-[#333] flex flex-col shrink-0">
        {/* Top search & new button */}
        <div className="p-2 border-b border-[#333] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-2 pl-6 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={handleCreateNewNote}
            className="p-1 rounded bg-amber-500 hover:bg-amber-400 text-black shadow-sm"
            title="Create Note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Note Cards List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {filteredNotes.map((note) => {
            const isSelected = note.id === selectedNoteId;
            return (
              <div
                key={note.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedNoteId(note.id);
                }}
                className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-500/20 text-white border border-amber-500/40'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs truncate">{note.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{note.date}</span>
                  <span className="truncate">{note.preview}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 3: Note Content Editor / Viewer */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#191919] p-6 overflow-y-auto select-text font-sans">
        {activeNote ? (
          <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> {activeNote.date}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-mono">
                {activeNote.folder}
              </span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {activeNote.content}
            </div>

            <div className="pt-6 border-t border-white/10 flex gap-2">
              {activeNote.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select or create a note to view
          </div>
        )}
      </div>
    </div>
  );
};

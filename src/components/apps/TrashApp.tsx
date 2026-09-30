import React, { useState } from 'react';
import { sound } from '../../utils/sound';
import { Trash2, FileX, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface TrashFile {
  id: string;
  name: string;
  size: string;
  deletedDate: string;
  reason: string;
}

const INITIAL_TRASH: TrashFile[] = [
  {
    id: 't-1',
    name: 'legacy_jquery_spaghetti_2016.js',
    size: '1.4 MB',
    deletedDate: 'Yesterday',
    reason: 'Replaced by React 19 & WebGPU engine',
  },
  {
    id: 't-2',
    name: 'unoptimized_node_modules_heavy.tar.gz',
    size: '482 MB',
    deletedDate: '3 days ago',
    reason: 'Switched to lightweight Rust WASM & esbuild',
  },
  {
    id: 't-3',
    name: 'blocking_sync_database_queries.sql',
    size: '42 KB',
    deletedDate: 'Last week',
    reason: 'Migrated to ClickHouse & async eBPF stream',
  },
  {
    id: 't-4',
    name: 'flash_player_animation_v1.swf',
    size: '8.2 MB',
    deletedDate: '2020',
    reason: 'Retired in favor of 120fps CSS & GSAP springs',
  },
];

export const TrashApp: React.FC = () => {
  const [trashItems, setTrashItems] = useState<TrashFile[]>(INITIAL_TRASH);
  const [emptied, setEmptied] = useState(false);

  const handleEmptyTrash = () => {
    sound.playTrash();
    setTrashItems([]);
    setEmptied(true);
  };

  const handleRestore = () => {
    sound.playClick();
    setTrashItems(INITIAL_TRASH);
    setEmptied(false);
  };

  return (
    <div id="trash-app" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-white">Trash</span>
          <span className="text-[10px] text-slate-400 font-mono">({trashItems.length} items)</span>
        </div>

        <div className="flex items-center gap-2">
          {trashItems.length > 0 ? (
            <button
              onClick={handleEmptyTrash}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Empty Trash
            </button>
          ) : (
            <button
              onClick={handleRestore}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restore Samples</span>
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-900/80">
        {trashItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Trash is squeaky clean!</h3>
              <p className="text-slate-400 text-xs mt-1">Zero technical debt left in the dumpster.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trashItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
              >
                <FileX className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.reason}</div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-white/5">
                    <span>{item.size}</span>
                    <span>Deleted {item.deletedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

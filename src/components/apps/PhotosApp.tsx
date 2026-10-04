import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PhotoItem } from '../../types';
import { sound } from '../../utils/sound';
import {
  Image,
  Clock,
  MapPin,
  Users,
  Heart,
  Search,
  Mail,
  ChevronLeft,
  X,
  Calendar,
  Lock,
} from 'lucide-react';

type SidebarSection = 'Library' | 'Memories' | 'Places' | 'People' | 'Favorites';

// Only Library is enabled — others are coming soon
const SIDEBAR_ITEMS: {
  id: SidebarSection;
  icon: React.FC<any>;
  color: string;
  disabled?: boolean;
}[] = [
  { id: 'Library',   icon: Image,  color: '#3b82f6' },
  { id: 'Memories',  icon: Clock,  color: '#f59e0b', disabled: true },
  { id: 'Places',    icon: MapPin, color: '#10b981', disabled: true },
  { id: 'People',    icon: Users,  color: '#8b5cf6', disabled: true },
  { id: 'Favorites', icon: Heart,  color: '#ec4899', disabled: true },
];

export const PhotosApp: React.FC = () => {
  const { photos } = usePortfolio();
  const [activeSection] = useState<SidebarSection>('Library');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Only Library is active — filter by search only
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;
    const q = searchQuery.toLowerCase();
    return photos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [photos, searchQuery]);

  // Masonry-like layout: alternate between 1-col wide and 2-col pair rows
  const masonryRows = useMemo(() => {
    const rows: PhotoItem[][] = [];
    let i = 0;
    while (i < filteredPhotos.length) {
      if (i + 1 < filteredPhotos.length) {
        rows.push([filteredPhotos[i], filteredPhotos[i + 1]]);
        i += 2;
      } else {
        rows.push([filteredPhotos[i]]);
        i += 1;
      }
    }
    return rows;
  }, [filteredPhotos]);

  return (
    <div
      id="photos-app"
      className="flex h-full font-sans select-none overflow-hidden"
      style={{ background: '#f7f7f7' }}
    >
      {/* ── Sidebar ── */}
      <div
        className="shrink-0 flex flex-col pt-4 pb-4 px-3 border-r gap-0.5"
        style={{ width: 200, background: '#ffffff', borderColor: '#e5e5e5' }}
      >
        <span className="text-xs font-semibold px-3 mb-2" style={{ color: '#6b6b6b' }}>
          Photos
        </span>

        {SIDEBAR_ITEMS.map(({ id, icon: Icon, color, disabled }) => (
          <button
            key={id}
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              sound.playClick();
              setActivePhoto(null);
            }}
            title={disabled ? 'Coming soon' : id}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-left relative ${
              disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={{
              background: !disabled && activeSection === id ? '#e8f0fe' : 'transparent',
              color: !disabled && activeSection === id ? color : '#333',
            }}
          >
            <Icon
              className="w-4 h-4 shrink-0"
              style={{ color: !disabled && activeSection === id ? color : '#888' }}
            />
            <span>{id}</span>
            {disabled && (
              <Lock className="w-2.5 h-2.5 absolute right-2.5 top-2.5" style={{ color: '#bbb' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#ffffff' }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: '#e5e5e5' }}
        >
          {activePhoto ? (
            <button
              onClick={() => setActivePhoto(null)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: '#3b82f6' }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{activeSection}</span>
            </button>
          ) : (
            <h2 className="text-sm font-semibold" style={{ color: '#111' }}>
              {activeSection}
            </h2>
          )}

          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5" style={{ color: '#888' }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos..."
                  className="pl-8 pr-3 py-1 rounded-full text-xs focus:outline-none border"
                  style={{ width: 180, background: '#f5f5f5', borderColor: '#ddd', color: '#111' }}
                />
                <button
                  onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  className="absolute right-2.5"
                >
                  <X className="w-3 h-3" style={{ color: '#888' }} />
                </button>
              </div>
            )}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 rounded-full transition-colors hover:bg-gray-100"
            >
              <Search className="w-4 h-4" style={{ color: '#555' }} />
            </button>
            <button className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
              <Mail className="w-4 h-4" style={{ color: '#555' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activePhoto ? (
            /* ── Lightbox View ── */
            <div className="flex flex-col h-full">
              {/* Photo Display */}
              <div
                className="relative flex-1 flex items-center justify-center"
                style={{ background: '#111', minHeight: 0 }}
              >
                {activePhoto.imageUrl ? (
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    className="max-w-full max-h-full object-contain"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // If CORS fails, try without crossOrigin
                      const img = e.currentTarget;
                      img.removeAttribute('crossorigin');
                      img.src = activePhoto.imageUrl!;
                    }}
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-tr ${activePhoto.gradient} flex items-center justify-center`}
                  >
                    <Image className="w-16 h-16 opacity-30" style={{ color: '#fff' }} />
                  </div>
                )}
              </div>

              {/* Info Strip */}
              <div
                className="px-6 py-4 flex items-start justify-between border-t gap-4"
                style={{ background: '#fafafa', borderColor: '#e5e5e5' }}
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#111' }}>
                    {activePhoto.title}
                  </h3>
                  {activePhoto.description && (
                    <p className="text-xs" style={{ color: '#666' }}>
                      {activePhoto.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {activePhoto.date}
                    </span>
                    {activePhoto.location && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                        <MapPin className="w-3.5 h-3.5" />
                        {activePhoto.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                  {activePhoto.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: '#eff6ff', color: '#3b82f6' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredPhotos.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
              <Image className="w-12 h-12" style={{ color: '#bbb' }} />
              <span className="text-sm font-medium" style={{ color: '#999' }}>
                No photos yet
              </span>
              <span className="text-xs" style={{ color: '#bbb' }}>
                Add photos from System Settings → Photos Library
              </span>
            </div>
          ) : (
            /* ── Masonry Grid (Apple Photos style) ── */
            <div className="p-3 space-y-1.5">
              {masonryRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5">
                  {row.map((photo, colIdx) => {
                    const isBig = row.length === 2 && colIdx === 0;
                    return (
                      <div
                        key={photo.id}
                        onClick={() => {
                          sound.playClick();
                          setActivePhoto(photo);
                        }}
                        className="relative group overflow-hidden rounded-lg cursor-pointer transition-all hover:brightness-90"
                        style={{
                          flex: isBig ? '1.6 1 0%' : '1 1 0%',
                          height: row.length === 1 ? 220 : 200,
                        }}
                      >
                        {photo.imageUrl ? (
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-tr ${photo.gradient}`}
                          />
                        )}

                        {/* ── Hover overlay with name (hidden by default) ── */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <p className="text-white text-xs font-semibold truncate drop-shadow-sm">
                            {photo.title}
                          </p>
                          {photo.location && (
                            <p className="text-white/70 text-[10px] truncate flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              {photo.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

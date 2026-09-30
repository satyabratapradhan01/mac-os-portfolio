import React, { useState } from 'react';
import { WALLPAPERS, DEVELOPER_PROFILE } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../types';
import {
  Palette,
  Volume2,
  Monitor,
  Info,
  Check,
  Sparkles,
  Shield,
  Laptop,
  Upload,
  Image as ImageIcon,
  Trash2,
  Database,
  Plus,
  Edit2,
  Lock,
  Unlock,
  FolderCode,
  Globe,
  Github,
  RefreshCw,
  Server,
  Cloud,
  Layers,
  Key,
  CheckCircle2,
  AlertCircle,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Camera,
  X,
} from 'lucide-react';

interface SettingsAppProps {
  selectedWallpaperId: string;
  onSelectWallpaper: (id: string) => void;
  customWallpaperUrl?: string | null;
  onSetCustomWallpaper?: (url: string | null) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  brightness: number;
  onBrightnessChange: (val: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  selectedWallpaperId,
  onSelectWallpaper,
  customWallpaperUrl,
  onSetCustomWallpaper,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
  brightness,
  onBrightnessChange,
  volume,
  onVolumeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'database' | 'photos'>('wallpaper');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  // Portfolio Context
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    refreshProjects,
    uploadImage,
    isAdminAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    systemStatus,
    isLiveDb,
    photos,
    addPhoto,
    deletePhoto,
  } = usePortfolio();

  // Admin Auth Form state
  const [authUserId, setAuthUserId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authShake, setAuthShake] = useState(false);

  // New / Edit Project Form state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<'Full Stack' | 'Cloud & Systems' | 'AI & WebGL' | 'Open Source'>('Full Stack');
  const [formRole, setFormRole] = useState('Lead Architect');
  const [formYear, setFormYear] = useState('2026');
  const [formDescription, setFormDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formTechStack, setFormTechStack] = useState('');
  const [formMetrics, setFormMetrics] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formLiveUrl, setFormLiveUrl] = useState('');
  const [formColor, setFormColor] = useState('#3b82f6');
  const [formShowDesktop, setFormShowDesktop] = useState(true);
  const [formUploadedImageUrl, setFormUploadedImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const accentColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

  // Photo upload form state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload photo → auto-save immediately to Photos library (no separate form)
  const handlePhotoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be uploaded again
    e.target.value = '';
    setIsUploadingPhoto(true);
    setPhotoFeedback(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        if (!base64) { setIsUploadingPhoto(false); return; }
        const res = await uploadImage(base64);
        setIsUploadingPhoto(false);
        if (res.success && res.url) {
          addPhoto({
            title: file.name.replace(/\.[^.]+$/, '') || 'My Photo',
            category: 'Life',
            location: '',
            description: '',
            imageUrl: res.url,
            date: new Date().toISOString().split('T')[0],
            tags: ['Life'],
            gradient: 'from-slate-700 via-slate-800 to-slate-900',
            aspectRatio: '4/3',
          });
          sound.playChime();
          setPhotoFeedback({ type: 'success', message: 'Photo uploaded and saved to Photos library!' });
        } else {
          setPhotoFeedback({ type: 'error', message: res.message || 'Upload failed. Please try again.' });
        }
      } catch (err: any) {
        setIsUploadingPhoto(false);
        setPhotoFeedback({ type: 'error', message: 'Upload error: ' + (err?.message || 'Unknown error') });
      }
      setTimeout(() => setPhotoFeedback(null), 4000);
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
      setPhotoFeedback({ type: 'error', message: 'Failed to read file.' });
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError('');
    sound.playClick();

    const res = await loginAdmin(authUserId, authPassword);
    setIsSubmittingAuth(false);
    if (res.success) {
      sound.playChime();
      setAuthUserId('');
      setAuthPassword('');
    } else {
      setAuthError(res.message || 'Invalid User Name or Password.');
      setAuthShake(true);
      setTimeout(() => setAuthShake(false), 500);
    }
  };

  const handleQuickFillAuth = () => {
    setAuthUserId('Darkweb@gmail.com');
    setAuthPassword('Darkweb@138131');
    sound.playClick();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const uploadRes = await uploadImage(base64);
        setIsUploadingImage(false);
        if (uploadRes.success && uploadRes.url) {
          setFormUploadedImageUrl(uploadRes.url);
          sound.playChime();
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    sound.playClick();
    const payload: Partial<ProjectItem> = {
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      category: formCategory,
      role: formRole.trim(),
      year: formYear.trim(),
      description: formDescription.trim(),
      longDescription: formLongDescription.trim() || formDescription.trim(),
      techStack: formTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      metrics: formMetrics.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: formGithub.trim(),
      liveUrl: formLiveUrl.trim(),
      accentColor: formColor,
      showOnDesktop: formShowDesktop,
      featured: true,
      iconName: 'FolderCode',
      screenshots: formUploadedImageUrl
        ? [
            {
              title: `${formTitle} Overview`,
              caption: 'Live production screenshot via Cloudinary image pipeline.',
              gradient: 'from-blue-600 to-indigo-900',
              imageUrl: formUploadedImageUrl,
            },
          ]
        : [],
    };

    if (editingProjectId) {
      const res = await updateProject(editingProjectId, payload);
      if (res.success) {
        sound.playChime();
        setActionFeedback({ type: 'success', message: 'Project updated in MongoDB!' });
        resetForm();
      } else {
        setActionFeedback({ type: 'error', message: res.message || 'Update failed' });
      }
    } else {
      const res = await addProject(payload);
      if (res.success) {
        sound.playChime();
        setActionFeedback({ type: 'success', message: 'New project & desktop folder created in MongoDB!' });
        resetForm();
      } else {
        setActionFeedback({ type: 'error', message: res.message || 'Creation failed' });
      }
    }

    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleEditClick = (p: ProjectItem) => {
    sound.playClick();
    setEditingProjectId(p.id);
    setFormTitle(p.title);
    setFormTagline(p.tagline || '');
    setFormCategory((p.category as any) || 'Full Stack');
    setFormRole(p.role || 'Lead Architect');
    setFormYear(p.year || '2026');
    setFormDescription(p.description || '');
    setFormLongDescription(p.longDescription || '');
    setFormTechStack((p.techStack || []).join(', '));
    setFormMetrics((p.metrics || []).join(', '));
    setFormGithub(p.githubUrl || '');
    setFormLiveUrl(p.liveUrl || '');
    setFormColor(p.accentColor || '#3b82f6');
    setFormShowDesktop(p.showOnDesktop !== false);
    setFormUploadedImageUrl(p.screenshots?.[0]?.imageUrl || '');
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setFormTitle('');
    setFormTagline('');
    setFormDescription('');
    setFormLongDescription('');
    setFormTechStack('');
    setFormMetrics('');
    setFormGithub('');
    setFormLiveUrl('');
    setFormUploadedImageUrl('');
    setIsFormOpen(false);
  };

  if (!isAdminAuthenticated) {
    return (
      <div
        id="settings-app-locked"
        className="flex flex-col items-center justify-center h-full w-full font-sans select-none overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)',
        }}
      >
        {/* Subtle animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: 320, height: 320, top: '10%', left: '15%',
              background: 'radial-gradient(circle, #6366f1, transparent)',
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              width: 260, height: 260, bottom: '10%', right: '10%',
              background: 'radial-gradient(circle, #3b82f6, transparent)',
            }}
          />
        </div>

        {/* Card */}
        <div
          className={`relative w-full max-w-[340px] mx-4 rounded-3xl shadow-2xl overflow-hidden my-auto ${
            authShake ? 'animate-shake' : ''
          }`}
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* ── Profile Header ── */}
          <div
            className="flex flex-col items-center gap-3 px-8 pt-8 pb-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Avatar */}
            <div className="relative">
              {DEVELOPER_PROFILE.avatar ? (
                <img
                  src={DEVELOPER_PROFILE.avatar}
                  alt={DEVELOPER_PROFILE.name}
                  className="w-20 h-20 rounded-full object-cover border-2"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', boxShadow: '0 0 0 4px rgba(99,102,241,0.3)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : null}
              {/* Fallback initials avatar always rendered behind */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 0 0 4px rgba(99,102,241,0.3)',
                  zIndex: -1,
                }}
              >
                SP
              </div>

              {/* Online / admin badge */}
              <div
                className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  background: '#f59e0b',
                  borderColor: '#0f0c29',
                }}
              >
                <Lock className="w-2.5 h-2.5 text-slate-950" strokeWidth={3} />
              </div>
            </div>

            {/* Name & title */}
            <div className="text-center">
              <h2 className="text-base font-bold text-white tracking-tight">
                {DEVELOPER_PROFILE.name}
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#a5b4fc' }}>
                {DEVELOPER_PROFILE.title}
              </p>
            </div>

            {/* Locked notice */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <Lock className="w-2.5 h-2.5" />
              System Settings Locked
            </div>
          </div>

          {/* ── Login Form ── */}
          <form onSubmit={handleLoginSubmit} className="px-8 py-6 space-y-4">
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Enter your administrator credentials to unlock settings.
            </p>

            {/* Username */}
            <div>
              <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                User Name / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={authUserId}
                  onChange={(e) => setAuthUserId(e.target.value)}
                  placeholder="Administrator email or username"
                  autoFocus
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs transition-all focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    caretColor: '#818cf8',
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Administrator password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs transition-all focus:outline-none font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    caretColor: '#818cf8',
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
                <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 transition-colors cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {authError && (
              <div
                className="p-2.5 rounded-xl text-xs flex items-center gap-2"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                }}
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{
                background: isSubmittingAuth
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
            >
              {isSubmittingAuth ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock System Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="settings-app" className="flex h-full bg-gray-100 text-gray-900 font-sans select-none overflow-hidden text-xs">
      {/* Settings Left Navigation */}
      <div className="w-56 bg-gray-50 border-r border-gray-200 p-3 space-y-1 shrink-0 flex flex-col justify-between">
        <div className="space-y-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('wallpaper');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'wallpaper' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Wallpaper & Style</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('database');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors relative cursor-pointer ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-500" />
            <span>MongoDB & Projects</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute right-2.5 animate-pulse" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('photos');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors relative cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Camera className="w-4 h-4 text-pink-500" />
            <span>Photos Library</span>
          </button>
        </div>

        {/* Administrator Profile & Lock Button */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-gray-800 truncate block">Admin Mode</span>
                <span className="text-[9px] text-gray-500 font-mono truncate block">Darkweb@gmail.com</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                logoutAdmin();
              }}
              className="w-full py-1.5 px-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Lock Settings</span>
            </button>
          </div>

          {/* Database Status Mini Pill */}
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>Cluster DB:</span>
              <span className="flex items-center gap-1 text-emerald-600 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>Cloudinary:</span>
              <span className="text-blue-600 font-mono">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Main Content Pane */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {/* 1. Database & Project Dynamic Logic Tab */}
        {activeTab === 'database' && (
          <div className="max-w-2xl space-y-6">
            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
                }`}
              >
                {actionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
            )}

            {/* Authenticated Admin Dashboard */}
            <div className="space-y-6">
              {/* Admin Status Bar */}
              <div className="p-4 bg-slate-950/80 border border-white/15 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold shadow">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{adminUser?.name || 'Darkweb Administrator'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                        Authenticated
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">{adminUser?.email || 'Darkweb@gmail.com'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      refreshProjects();
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync DB</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      logoutAdmin();
                    }}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Lock Settings
                  </button>
                </div>
              </div>

                {/* Cloud & Cluster Credentials Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                      <Server className="w-3.5 h-3.5" />
                      <span>MongoDB Atlas Storage</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono truncate">
                      cluster: portfolio.iqukqf0.mongodb.net
                    </p>
                    <span className="text-[10px] text-slate-400">Database: /portfolio • Live Connection</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Cloudinary Media CDN</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">
                      API Key: 592359444296597 (Active)
                    </p>
                    <span className="text-[10px] text-slate-400">Direct Upload Pipeline & CDN Host</span>
                  </div>
                </div>

                {/* Add / Edit Project Button & Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Projects & Folders ({projects.length})</h4>
                      <p className="text-slate-400 text-xs">
                        Add new projects. Folders will automatically generate on your desktop and in Finder.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        if (isFormOpen) {
                          resetForm();
                        } else {
                          setIsFormOpen(true);
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isFormOpen ? 'Close Form' : 'Add Project Folder'}</span>
                    </button>
                  </div>

                  {/* Form Modal / Accordion */}
                  {isFormOpen && (
                    <form onSubmit={handleSaveProject} className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="font-bold text-sm text-white flex items-center gap-2">
                          <FolderCode className="w-4 h-4 text-blue-400" />
                          {editingProjectId ? 'Edit Project in MongoDB' : 'Create New Project & Desktop Folder'}
                        </span>
                        <span className="text-[10px] text-blue-300 font-mono">
                          {editingProjectId ? `ID: ${editingProjectId}` : 'Auto-assigned ID'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Title / Folder Name *</label>
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="e.g. Project 4 (AuraFlow)"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Category</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as any)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Full Stack">Full Stack</option>
                            <option value="Cloud & Systems">Cloud & Systems</option>
                            <option value="AI & WebGL">AI & WebGL</option>
                            <option value="Open Source">Open Source</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Tagline / Short Pitch</label>
                        <input
                          type="text"
                          value={formTagline}
                          onChange={(e) => setFormTagline(e.target.value)}
                          placeholder="e.g. Real-time distributed state synchronizer for React apps"
                          className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Description</label>
                        <textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          rows={3}
                          placeholder="Detailed overview of what the project does, key features, and architecture."
                          className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            value={formTechStack}
                            onChange={(e) => setFormTechStack(e.target.value)}
                            placeholder="React, TypeScript, Node.js, MongoDB, Docker"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Key Metrics (comma separated)</label>
                          <input
                            type="text"
                            value={formMetrics}
                            onChange={(e) => setFormMetrics(e.target.value)}
                            placeholder="99.9% Uptime, 50k+ Users, <10ms Latency"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">GitHub Repository URL</label>
                          <input
                            type="url"
                            value={formGithub}
                            onChange={(e) => setFormGithub(e.target.value)}
                            placeholder="https://github.com/satyabratapradhan01/project"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Live Demo URL</label>
                          <input
                            type="url"
                            value={formLiveUrl}
                            onChange={(e) => setFormLiveUrl(e.target.value)}
                            placeholder="https://myproject.satyabrata.dev"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Cloudinary Screenshot Upload */}
                      <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                            <Cloud className="w-3.5 h-3.5 text-blue-400" />
                            <span>Cloudinary Project Screenshot / Cover</span>
                          </label>
                          <label className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-colors shadow">
                            <span>{isUploadingImage ? 'Uploading to CDN...' : 'Upload Image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploadingImage}
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>

                        {formUploadedImageUrl ? (
                          <div className="flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/10">
                            <img
                              src={formUploadedImageUrl}
                              alt="Project Cover"
                              className="w-16 h-10 object-cover rounded border border-white/20"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] text-emerald-400 font-medium block">
                                Image Ready (Cloudinary CDN)
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block font-mono">
                                {formUploadedImageUrl}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormUploadedImageUrl('')}
                              className="p-1 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400">
                            Upload a screenshot to host it permanently in Cloudinary CDN and attach it to your project.
                          </p>
                        )}
                      </div>

                      {/* Options & Desktop Folder Toggle */}
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formShowDesktop}
                            onChange={(e) => setFormShowDesktop(e.target.checked)}
                            className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                          />
                          <span className="text-xs text-slate-200">
                            Display as dedicated folder on macOS Desktop (left column)
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                        >
                          {editingProjectId ? 'Save Changes' : 'Create in MongoDB'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Existing Projects */}
                  <div className="space-y-2.5">
                    {projects.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-3.5 bg-slate-950/60 hover:bg-slate-950/90 border border-white/10 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-700 flex items-center justify-center text-white shadow">
                            <FolderCode className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-xs">{p.title}</h5>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-medium border border-blue-500/30">
                                {p.category}
                              </span>
                              {p.showOnDesktop !== false && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                                  Desktop Folder
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.tagline || p.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(p.techStack || []).slice(0, 4).map((tech) => (
                                <span key={tech} className="px-1.5 py-0.2 bg-white/5 rounded text-[9px] text-slate-300">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete ${p.title} from MongoDB?`)) {
                                sound.playClick();
                                await deleteProject(p.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reset Defaults */}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Need to restore original showcase projects?</span>
                    <button
                      onClick={async () => {
                        if (confirm('Reset projects collection to default seed?')) {
                          sound.playClick();
                          await resetToDefaults();
                          setActionFeedback({ type: 'success', message: 'Restored default projects in MongoDB' });
                        }
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg border border-white/10 cursor-pointer"
                    >
                      Restore Seed Projects
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* 2. Wallpaper & Style */}
        {activeTab === 'wallpaper' && (
          <div className="max-w-xl space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white">Desktop Wallpaper</h3>
                <label className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-medium cursor-pointer transition-colors shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          if (result && onSetCustomWallpaper) {
                            sound.playChime();
                            onSetCustomWallpaper(result);
                            onSelectWallpaper('custom');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-slate-400 text-xs">Choose fluid vector backgrounds or upload any custom photo.</p>

              {customWallpaperUrl && (
                <div className="mt-3 p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={customWallpaperUrl}
                      alt="Custom Wallpaper"
                      className="w-12 h-8 rounded object-cover border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Custom Uploaded Wallpaper</span>
                      <span className="text-[10px] text-blue-300">Active Desktop Wallpaper</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onSetCustomWallpaper) onSetCustomWallpaper(null);
                      onSelectWallpaper('macos-fluid-wave');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                    title="Remove custom wallpaper"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {WALLPAPERS.map((wp) => {
                  const isSelected = selectedWallpaperId === wp.id && !customWallpaperUrl;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        sound.playClick();
                        if (onSetCustomWallpaper) onSetCustomWallpaper(null);
                        onSelectWallpaper(wp.id);
                      }}
                      className={`group rounded-xl overflow-hidden cursor-pointer border transition-all p-1 ${
                        isSelected ? 'border-blue-500 bg-blue-500/20 shadow-md' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`aspect-16/10 rounded-lg bg-gradient-to-tr ${wp.previewGradient} flex items-center justify-center shadow-md relative overflow-hidden`}>
                        {wp.id === 'macos-fluid-wave' && (
                          <div className="absolute inset-0 bg-radial from-transparent via-sky-500/30 to-blue-900/60" />
                        )}
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow z-10">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 block text-center mt-1.5 truncate">
                        {wp.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold text-white mb-2">Accent Color</h4>
              <div className="flex gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      accentColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {accentColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* 3. Photos Library Tab */}
        {activeTab === 'photos' && (
          <div className="max-w-2xl space-y-6">
            {/* Feedback Banner */}
            {photoFeedback && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                  photoFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {photoFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{photoFeedback.message}</span>
              </div>
            )}

            {/* Header + Upload Button */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-pink-500" />
                  Photos Library ({photos.length})
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Upload photos — they are instantly saved to the Photos app via Cloudinary.
                </p>
              </div>
              <label
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow cursor-pointer select-none ${
                  isUploadingPhoto
                    ? 'bg-pink-100 text-pink-400 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-500 text-white'
                }`}
              >
                {isUploadingPhoto ? (
                  <>
                    <div className="w-3 h-3 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading…</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploadingPhoto}
                  onChange={handlePhotoImageUpload}
                />
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Photos Grid */}
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Camera className="w-10 h-10 text-gray-300" />
                <span className="text-sm text-gray-400 font-medium">No photos yet</span>
                <span className="text-xs text-gray-400">Click "Upload Photo" to add your first photo.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-video shadow-sm"
                  >
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-tr ${photo.gradient}`} />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-[11px] font-semibold truncate drop-shadow">{photo.title}</p>
                      <span className="text-[9px] text-pink-200 font-medium">{photo.category}</span>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${photo.title}" from Photos?`)) {
                          sound.playClick();
                          deletePhoto(photo.id);
                        }
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

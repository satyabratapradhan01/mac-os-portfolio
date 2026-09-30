import React, { createContext, useContext, useState, useCallback } from 'react';
import { ProjectItem, PhotoItem } from '../types';
import { PROJECTS as STATIC_PROJECTS, PHOTOS as STATIC_PHOTOS } from '../data/portfolioData';

interface AdminUser {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

interface PortfolioContextType {
  projects: ProjectItem[];
  isLoading: boolean;
  isLiveDb: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  addProject: (data: Partial<ProjectItem>) => Promise<{ success: boolean; message?: string; project?: ProjectItem }>;
  updateProject: (id: string, data: Partial<ProjectItem>) => Promise<{ success: boolean; message?: string; project?: ProjectItem }>;
  deleteProject: (id: string) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => Promise<void>;
  uploadImage: (base64Data: string) => Promise<{ success: boolean; url?: string; storage?: string; message?: string }>;
  // Photos
  photos: PhotoItem[];
  addPhoto: (data: Partial<PhotoItem>) => void;
  deletePhoto: (id: string) => void;
  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (userId: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  systemStatus: {
    mongodbConnected: boolean;
    cloudinaryReady: boolean;
    cloudName?: string;
  };
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Safe window storage helpers to prevent SSR / module execution crashes
const getStorageItem = (storage: 'local' | 'session', key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const target = storage === 'local' ? window.localStorage : window.sessionStorage;
    return target.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (storage: 'local' | 'session', key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const target = storage === 'local' ? window.localStorage : window.sessionStorage;
    target.setItem(key, value);
  } catch (e) {
    console.warn(`[Storage] Failed to set ${key} in ${storage}Storage:`, e);
  }
};

const removeStorageItem = (storage: 'local' | 'session', key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const target = storage === 'local' ? window.localStorage : window.sessionStorage;
    target.removeItem(key);
  } catch {}
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── Projects local state with static fallback ────────────────────────────────
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = getStorageItem('local', 'portfolio_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const removedIds = new Set(['snapcast-streaming', 'converso-chat', 'prepwise-ai']);
          const filtered = parsed.filter((p: any) => p && !removedIds.has(p.id));
          if (filtered.length > 0) return filtered;
        }
      } catch {}
    }
    return STATIC_PROJECTS;
  });

  const [isLoading] = useState<boolean>(false);
  const [isLiveDb] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // ── Photos local state with static fallback ──────────────────────────────────
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = getStorageItem('local', 'portfolio_photos');
    if (saved) {
      try {
        const parsed: PhotoItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return STATIC_PHOTOS;
  });

  // ── Admin session state ───────────────────────────────────────────────────────
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return getStorageItem('session', 'darkweb_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = getStorageItem('session', 'darkweb_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const systemStatus = {
    mongodbConnected: false,
    cloudinaryReady: true,
    cloudName: 'Local Static Engine',
  };

  // ── Refresh helpers (compatible local-state sync) ─────────────────────────────
  const refreshProjects = useCallback(async () => {
    const saved = getStorageItem('local', 'portfolio_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setProjects(parsed);
      } catch {}
    }
  }, []);

  const refreshPhotos = useCallback(async () => {
    const saved = getStorageItem('local', 'portfolio_photos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPhotos(parsed);
      } catch {}
    }
  }, []);

  // ── Client-side project mutations ─────────────────────────────────────────────
  const saveProjects = (updatedProjects: ProjectItem[]) => {
    setProjects(updatedProjects);
    setStorageItem('local', 'portfolio_projects', JSON.stringify(updatedProjects));
  };

  const addProject = async (data: Partial<ProjectItem>) => {
    const newProj: ProjectItem = {
      id: data.id || `proj-${Date.now()}`,
      title: data.title || 'New Project',
      tagline: data.tagline || '',
      category: data.category || 'Full Stack',
      role: data.role || 'Lead Developer',
      year: data.year || String(new Date().getFullYear()),
      featured: data.featured ?? true,
      accentColor: data.accentColor || '#3b82f6',
      iconName: data.iconName || 'FolderCode',
      showOnDesktop: data.showOnDesktop ?? true,
      desktopFolderIndex: data.desktopFolderIndex ?? 0,
      description: data.description || '',
      longDescription: data.longDescription || '',
      metrics: Array.isArray(data.metrics) ? data.metrics : [],
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
      githubUrl: data.githubUrl || '',
      liveUrl: data.liveUrl || '',
      coverImageUrl: data.coverImageUrl || '',
      screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
    };

    const nextProjects = [newProj, ...projects];
    saveProjects(nextProjects);
    return { success: true, project: newProj, message: 'Project saved to local portfolio.' };
  };

  const updateProject = async (id: string, data: Partial<ProjectItem>) => {
    const nextProjects = projects.map((p) => (p.id === id ? ({ ...p, ...data } as ProjectItem) : p));
    saveProjects(nextProjects);
    return { success: true, message: 'Project updated in local portfolio.' };
  };

  const deleteProject = async (id: string) => {
    const nextProjects = projects.filter((p) => p.id !== id);
    saveProjects(nextProjects);
    return { success: true, message: 'Project removed from local portfolio.' };
  };

  const resetToDefaults = async () => {
    removeStorageItem('local', 'portfolio_projects');
    setProjects(STATIC_PROJECTS);
  };

  // ── Client-side photo mutations ───────────────────────────────────────────────
  const savePhotos = (updatedPhotos: PhotoItem[]) => {
    setPhotos(updatedPhotos);
    setStorageItem('local', 'portfolio_photos', JSON.stringify(updatedPhotos));
  };

  const addPhoto = (data: Partial<PhotoItem>) => {
    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: data.title || 'My Photo',
      category: data.category || 'Life',
      date: data.date || new Date().toISOString().split('T')[0],
      location: data.location || '',
      aspectRatio: data.aspectRatio || '4/3',
      gradient: data.gradient || 'from-slate-800 to-slate-900',
      description: data.description || '',
      tags: data.tags || [],
      imageUrl: data.imageUrl,
    };

    const nextPhotos = [newPhoto, ...photos];
    savePhotos(nextPhotos);
  };

  const deletePhoto = (id: string) => {
    const nextPhotos = photos.filter((p) => p.id !== id);
    savePhotos(nextPhotos);
  };

  // ── Local Image Upload ────────────────────────────────────────────────────────
  const uploadImage = async (base64Data: string) => {
    return { success: true, url: base64Data, storage: 'local-assets' };
  };

  // ── Admin Authentication ──────────────────────────────────────────────────────
  const loginAdmin = async (userId: string, pass: string) => {
    const cleanUser = String(userId || '').trim().toLowerCase().replace(/\r/g, '');
    const cleanPass = String(pass || '').trim().replace(/\r/g, '');

    const isValidUser =
      cleanUser === 'darkweb@gmail.com' ||
      cleanUser === 'darkweb' ||
      cleanUser === 'satyabratapradhann@gmail.com';

    const isValidPass = cleanPass === 'Darkweb@138131';

    if (isValidUser && isValidPass) {
      const user: AdminUser = {
        email: 'Darkweb@gmail.com',
        name: 'Satyabrata Pradhan (Admin)',
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      setStorageItem('session', 'darkweb_admin_auth', 'true');
      setStorageItem('session', 'darkweb_admin_user', JSON.stringify(user));
      return { success: true, message: 'Authentication successful (Local Session)' };
    }

    return { success: false, message: 'Invalid Admin User ID or Password.' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    removeStorageItem('session', 'darkweb_admin_auth');
    removeStorageItem('session', 'darkweb_admin_user');
    removeStorageItem('local', 'darkweb_admin_auth');
    removeStorageItem('local', 'darkweb_admin_user');
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        isLoading,
        isLiveDb,
        error,
        refreshProjects,
        addProject,
        updateProject,
        deleteProject,
        resetToDefaults,
        uploadImage,
        photos,
        addPhoto,
        deletePhoto,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        systemStatus,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

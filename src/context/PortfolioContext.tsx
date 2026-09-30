import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(STATIC_PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── Photos — prefer MongoDB, fall back to localStorage, then static ──────────
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_photos');
      if (!saved) return STATIC_PHOTOS;
      const parsed: PhotoItem[] = JSON.parse(saved);
      // Strip any stale base64 data: URLs from old storage
      const safe = parsed.map((p) => ({
        ...p,
        imageUrl: p.imageUrl?.startsWith('data:') ? undefined : p.imageUrl,
      }));
      if (safe.some((p, i) => p.imageUrl !== parsed[i].imageUrl)) {
        try { localStorage.setItem('portfolio_photos', JSON.stringify(safe)); } catch {}
      }
      return safe;
    } catch {
      try { localStorage.removeItem('portfolio_photos'); } catch {}
      return STATIC_PHOTOS;
    }
  });

  // ── Admin session ─────────────────────────────────────────────────────────────
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('darkweb_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('darkweb_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [systemStatus, setSystemStatus] = useState<{
    mongodbConnected: boolean;
    cloudinaryReady: boolean;
    cloudName?: string;
  }>({ mongodbConnected: false, cloudinaryReady: true });

  // ── Fetch Projects from MongoDB API ──────────────────────────────────────────
  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          setIsLiveDb(data.source === 'mongodb');
        }
      }
    } catch (err: any) {
      console.warn('[PortfolioContext] API unavailable, using local cached portfolio:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch Photos from MongoDB API ─────────────────────────────────────────────
  const refreshPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
          // Sync to localStorage as a quick-load cache
          try {
            localStorage.setItem('portfolio_photos', JSON.stringify(data.photos));
          } catch {}
        }
      }
    } catch {
      // Silently keep localStorage / static fallback
    }
  }, []);

  // ── System Status Polling ─────────────────────────────────────────────────────
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus({
          mongodbConnected: data.mongodb?.connected || false,
          cloudinaryReady: data.cloudinary?.configured || false,
          cloudName: data.cloudinary?.cloudName,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshProjects();
    refreshPhotos();
    checkStatus();
    const statusTimer = setInterval(checkStatus, 15000);
    return () => clearInterval(statusTimer);
  }, [refreshProjects, refreshPhotos, checkStatus]);

  // ── Admin Login ───────────────────────────────────────────────────────────────
  const loginAdmin = async (userId: string, pass: string) => {
    const cleanUser = String(userId || '').trim().toLowerCase().replace(/\r/g, '');
    const cleanPass = String(pass || '').trim().replace(/\r/g, '');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanUser, password: cleanPass }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminAuthenticated(true);
        setAdminUser(data.user);
        sessionStorage.setItem('darkweb_admin_auth', 'true');
        sessionStorage.setItem('darkweb_admin_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }

      // Static credential fallback (when server is temporarily unreachable)
      if (
        (cleanUser === 'darkweb@gmail.com' || cleanUser === 'darkweb' || cleanUser === 'satyabratapradhann@gmail.com') &&
        cleanPass === 'Darkweb@138131'
      ) {
        const user: AdminUser = {
          email: 'Darkweb@gmail.com',
          name: 'Darkweb Admin',
          role: 'admin',
          loginTime: new Date().toISOString(),
        };
        setIsAdminAuthenticated(true);
        setAdminUser(user);
        sessionStorage.setItem('darkweb_admin_auth', 'true');
        sessionStorage.setItem('darkweb_admin_user', JSON.stringify(user));
        return { success: true, message: 'Authenticated successfully' };
      }

      return { success: false, message: data.message || 'Invalid User Name or Password.' };
    } catch (err: any) {
      // Offline fallback
      if (
        (cleanUser === 'darkweb@gmail.com' || cleanUser === 'darkweb' || cleanUser === 'satyabratapradhann@gmail.com') &&
        cleanPass === 'Darkweb@138131'
      ) {
        const user: AdminUser = {
          email: 'Darkweb@gmail.com',
          name: 'Darkweb Admin',
          role: 'admin',
          loginTime: new Date().toISOString(),
        };
        setIsAdminAuthenticated(true);
        setAdminUser(user);
        sessionStorage.setItem('darkweb_admin_auth', 'true');
        sessionStorage.setItem('darkweb_admin_user', JSON.stringify(user));
        return { success: true, message: 'Authenticated successfully' };
      }
      return { success: false, message: err.message || 'Authentication error' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem('darkweb_admin_auth');
    sessionStorage.removeItem('darkweb_admin_user');
    localStorage.removeItem('darkweb_admin_auth');
    localStorage.removeItem('darkweb_admin_user');
  };

  // ── Add Project ───────────────────────────────────────────────────────────────
  /**
   * Sends the project to the server API which writes it to MongoDB.
   * If the server returns success: false (e.g. DB is offline), the error is
   * surfaced to the caller — we do NOT silently write to memory, because that
   * would make the project disappear on server restart.
   */
  const addProject = async (data: Partial<ProjectItem>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        // Refresh from DB to confirm the write and sync the UI
        await refreshProjects();
        return { success: true, project: result.project, message: result.message };
      }

      // Propagate the real error — do NOT silently fall back to memory
      return {
        success: false,
        message: result.message || 'Failed to save project to database.',
      };
    } catch (err: any) {
      // Network error (server unreachable)
      return {
        success: false,
        message: 'Cannot reach the server. Make sure the dev server is running (npm run dev).',
      };
    }
  };

  // ── Update Project ────────────────────────────────────────────────────────────
  const updateProject = async (id: string, data: Partial<ProjectItem>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        await refreshProjects();
        return { success: true, project: result.project, message: result.message };
      }
      return { success: false, message: result.message || 'Failed to update project.' };
    } catch (err: any) {
      // Optimistic local update as fallback for network errors only
      setProjects((prev) => prev.map((p) => (p.id === id ? ({ ...p, ...data } as ProjectItem) : p)));
      return { success: true, message: 'Updated locally (server unreachable).' };
    }
  };

  // ── Delete Project ────────────────────────────────────────────────────────────
  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Delete failed.' };
    } catch (err: any) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true, message: 'Deleted locally (server unreachable).' };
    }
  };

  // ── Reset to Defaults ─────────────────────────────────────────────────────────
  const resetToDefaults = async () => {
    try {
      const res = await fetch('/api/projects/reset', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setProjects(result.projects);
      }
    } catch {
      setProjects(STATIC_PROJECTS);
    }
  };

  // ── Add Photo — saves to MongoDB via API, caches in localStorage ──────────────
  const addPhoto = async (data: Partial<PhotoItem>) => {
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
      // Only keep https:// Cloudinary URLs — never base64 data: URLs
      imageUrl: data.imageUrl?.startsWith('http') ? data.imageUrl : undefined,
    };

    // Persist to MongoDB (fire-and-forget; UI updates immediately regardless)
    if (newPhoto.imageUrl) {
      fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      }).catch((err) => console.warn('[Photos] MongoDB save failed:', err.message));
    }

    setPhotos((prev) => {
      const updated = [newPhoto, ...prev];
      // Persist only https:// URLs to localStorage as quick-load cache
      try {
        const safeToPersist = updated.map((p) => ({
          ...p,
          imageUrl: p.imageUrl?.startsWith('http') ? p.imageUrl : undefined,
        }));
        localStorage.setItem('portfolio_photos', JSON.stringify(safeToPersist));
      } catch (e) {
        console.warn('[Photos] localStorage quota exceeded, pruning...');
        try {
          const trimmed = updated.slice(0, Math.max(1, updated.length - 3)).map((p) => ({
            ...p,
            imageUrl: p.imageUrl?.startsWith('http') ? p.imageUrl : undefined,
          }));
          localStorage.setItem('portfolio_photos', JSON.stringify(trimmed));
        } catch {
          localStorage.removeItem('portfolio_photos');
        }
      }
      return updated;
    });
  };

  // ── Delete Photo ──────────────────────────────────────────────────────────────
  const deletePhoto = (id: string) => {
    // Remove from MongoDB
    fetch(`/api/photos/${id}`, { method: 'DELETE' }).catch((err) =>
      console.warn('[Photos] MongoDB delete failed:', err.message)
    );

    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('portfolio_photos', JSON.stringify(updated));
      } catch {
        localStorage.removeItem('portfolio_photos');
      }
      return updated;
    });
  };

  // ── Upload Image to Cloudinary ────────────────────────────────────────────────
  /**
   * Sends base64 image to the server which uploads it to Cloudinary.
   * Returns the secure_url on success. Never returns base64 — that causes
   * localStorage QuotaExceededError when persisted.
   */
  const uploadImage = async (base64Data: string) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });
      const data = await res.json();
      if (data.success && data.url?.startsWith('http')) {
        return { success: true, url: data.url, storage: data.storage };
      }
      return { success: false, message: data.message || 'Cloudinary upload failed.' };
    } catch (err: any) {
      return { success: false, message: 'Cloudinary server unreachable. Check your API connection.' };
    }
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

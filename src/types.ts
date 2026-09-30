export type AppId =
  | 'finder'
  | 'safari'
  | 'terminal'
  | 'vscode'
  | 'photos'
  | 'notes'
  | 'resume'
  | 'music'
  | 'calculator'
  | 'messages'
  | 'trash'
  | 'aboutMac';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  initialSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Full Stack' | 'Cloud & Systems' | 'AI & WebGL' | 'Open Source' | string;
  description: string;
  longDescription: string;
  role: string;
  year: string;
  metrics: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  iconName: string;
  accentColor: string;
  showOnDesktop?: boolean;
  desktopFolderIndex?: number;
  coverImageUrl?: string;
  screenshots: {
    title: string;
    caption: string;
    gradient: string;
    imageUrl?: string;
    codeSnippet?: string;
  }[];
}

export interface SkillCategory {
  category: string;
  description: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    highlight?: boolean;
  }[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  coursework?: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  platform: string;
  detail: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Founding' | 'Project';
  description: string;
  achievements: string[];
  skills: string[];
  logoText: string;
}

export interface NoteItem {
  id: string;
  title: string;
  date: string;
  folder: 'Engineering' | 'Architecture' | 'Thoughts' | 'Reading';
  preview: string;
  content: string;
  tags: string[];
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Setup' | 'Conferences' | 'Projects' | 'Travel' | 'Life';
  date: string;
  location: string;
  aspectRatio: string;
  gradient: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverGradient: string;
  genre: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  theme: 'dark' | 'light' | 'dynamic';
  previewGradient: string;
  bgStyle: string;
  bgImage?: string;
}

export interface DesktopIconItem {
  id: string;
  label: string;
  type: 'app' | 'folder' | 'file';
  targetApp?: AppId;
  initialPos: { x: number; y: number };
  iconType: string;
  fileData?: any;
}

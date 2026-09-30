/**
 * models/Project.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose Schema & Model for Portfolio Projects.
 *
 * Design decisions:
 *  - `id` is a human-readable slug (e.g. "snapcast-streaming") used as the
 *    primary business key. MongoDB's _id is kept but not exposed in APIs.
 *  - `coverImageUrl` is a top-level field so the project thumbnail is always
 *    directly queryable without inspecting the screenshots sub-array.
 *  - `screenshots[].imageUrl` holds per-screenshot Cloudinary secure_urls.
 *  - All string fields default to '' so partial saves never produce nulls.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/* ── Screenshot sub-document ── */
export interface IScreenshot {
  title: string;
  caption: string;
  gradient: string;
  /** Cloudinary secure_url for this screenshot */
  imageUrl: string;
  codeSnippet: string;
}

/* ── Project document interface ── */
export interface IProject extends Document {
  /** Human-readable slug — business primary key */
  id: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  longDescription: string;
  role: string;
  year: string;
  metrics: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  iconName: string;
  accentColor: string;
  showOnDesktop: boolean;
  desktopFolderIndex: number;
  /**
   * Top-level cover / thumbnail image URL (Cloudinary secure_url).
   * Mirrors screenshots[0].imageUrl for quick access; always kept in sync.
   */
  coverImageUrl: string;
  screenshots: IScreenshot[];
  createdAt: Date;
  updatedAt: Date;
}

/* ── Screenshot sub-schema ── */
const ScreenshotSchema = new Schema<IScreenshot>(
  {
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
    gradient: { type: String, default: 'from-blue-600 to-indigo-900' },
    imageUrl: { type: String, default: '' },
    codeSnippet: { type: String, default: '' },
  },
  { _id: false }
);

/* ── Project schema ── */
const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    category: { type: String, default: 'Full Stack', trim: true },
    description: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    role: { type: String, default: 'Lead Developer', trim: true },
    year: { type: String, default: String(new Date().getFullYear()) },
    metrics: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: '', trim: true },
    liveUrl: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    iconName: { type: String, default: 'FolderCode' },
    accentColor: { type: String, default: '#3b82f6' },
    showOnDesktop: { type: Boolean, default: true },
    desktopFolderIndex: { type: Number, default: 0 },
    /** Cloudinary URL for the project cover/thumbnail image */
    coverImageUrl: { type: String, default: '' },
    screenshots: { type: [ScreenshotSchema], default: [] },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  }
);

/* ── Pre-save hook: keep coverImageUrl in sync with screenshots[0].imageUrl ── */
ProjectSchema.pre('save', function (this: IProject, next: (err?: Error) => void) {
  if (this.screenshots?.length > 0 && this.screenshots[0].imageUrl) {
    this.coverImageUrl = this.screenshots[0].imageUrl;
  }
  next();
});

/* ── Pre-findOneAndUpdate hook: sync coverImageUrl on updates too ── */
ProjectSchema.pre('findOneAndUpdate', function (this: mongoose.Query<any, any>, next: (err?: Error) => void) {
  const update = this.getUpdate() as any;
  const screenshots = update?.$set?.screenshots ?? update?.screenshots;
  if (Array.isArray(screenshots) && screenshots.length > 0 && screenshots[0].imageUrl) {
    if (update.$set) {
      update.$set.coverImageUrl = screenshots[0].imageUrl;
    } else {
      update.coverImageUrl = screenshots[0].imageUrl;
    }
  }
  next();
});

/* ── Model (singleton-safe for hot-reload environments like tsx watch) ── */
export const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>('Project', ProjectSchema);

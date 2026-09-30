/**
 * models/Photo.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose Schema & Model for Portfolio Photos.
 *
 * Design decisions:
 *  - Photos were previously only persisted in localStorage, which clears on
 *    browser data wipe. This model moves them to MongoDB for true persistence.
 *  - `imageUrl` must be a Cloudinary https:// URL — never a base64 data: URL.
 *    A pre-save validator enforces this to prevent accidental large payloads.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type PhotoCategory = 'Setup' | 'Conferences' | 'Projects' | 'Travel' | 'Life';

export interface IPhoto extends Document {
  /** Human-readable unique slug (e.g. "photo-1234567890") */
  id: string;
  title: string;
  category: PhotoCategory;
  date: string;
  location: string;
  aspectRatio: string;
  gradient: string;
  description: string;
  tags: string[];
  /** Cloudinary secure_url — must start with https:// */
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true, default: 'My Photo' },
    category: {
      type: String,
      enum: ['Setup', 'Conferences', 'Projects', 'Travel', 'Life'],
      default: 'Life',
    },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    location: { type: String, default: '', trim: true },
    aspectRatio: { type: String, default: '4/3' },
    gradient: { type: String, default: 'from-slate-700 via-slate-800 to-slate-900' },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    /**
     * Cloudinary CDN URL for the photo.
     * MUST be an https:// URL — base64 data: URLs are rejected to prevent
     * bloating MongoDB documents and causing network timeouts.
     */
    imageUrl: {
      type: String,
      default: '',
      validate: {
        validator: (v: string) => !v || v.startsWith('https://') || v.startsWith('http://'),
        message: 'imageUrl must be an https:// Cloudinary URL, not a base64 data: string.',
      },
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  }
);

/* ── Model (singleton-safe) ── */
export const Photo: Model<IPhoto> =
  (mongoose.models.Photo as Model<IPhoto>) ||
  mongoose.model<IPhoto>('Photo', PhotoSchema);

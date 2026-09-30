import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

import { Project } from './models/Project.js';
import { Photo } from './models/Photo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Cloudinary Configuration ───────────────────────────────────────────────────
const CLOUDINARY_API_KEY    = process.env.CLOUDINARY_API_KEY    || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'demo';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure:     true,
});

// ── Admin credentials ──────────────────────────────────────────────────────────
const ADMIN_USER_ID  = (process.env.ADMIN_USER_ID  || 'Darkweb@gmail.com').trim().replace(/\r/g, '');
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'Darkweb@138131').trim().replace(/\r/g, '');

// ── Seed data — inserted once when the collection is empty ────────────────────
const INITIAL_SEED_PROJECTS = [
  {
    id: 'snapcast-streaming',
    title: 'Project 1 (SnapCast)',
    tagline: 'High-performance real-time video & screen streaming architecture with WebRTC & WebSockets',
    category: 'Cloud & Systems',
    role: 'Lead Systems Architect',
    year: '2026',
    featured: true,
    accentColor: '#3b82f6',
    iconName: 'FolderCode',
    showOnDesktop: true,
    desktopFolderIndex: 1,
    coverImageUrl: '',
    description:
      'Ultra-low latency peer-to-peer screen sharing and video broadcasting engine with dynamic bitrate scaling and interactive whiteboards.',
    longDescription: `SnapCast is an enterprise-grade live broadcasting and screen-sharing workstation.\n\nKey Capabilities:\n• WebRTC SFU Mesh with sub-80ms glass-to-glass global media delivery.\n• In-flight adaptive video bitrate throttling over unstable mobile connections.\n• Hardware-accelerated canvas compositing with lossless 4K screen recording.\n• End-to-end encrypted room signaling with token authorization.`,
    metrics: ['Sub-80ms Latency', '4K 60fps Recording', '99.99% SFU Uptime', 'Zero-Install WebRTC'],
    techStack: ['React', 'Node.js', 'WebRTC', 'WebSockets', 'TypeScript', 'Tailwind CSS', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/satyabratapradhan01/snapcast',
    liveUrl: 'https://snapcast.satyabrata.dev',
    screenshots: [
      {
        title: 'Real-Time WebRTC Media Pipeline',
        caption: 'Lossless screen capture with dynamic bandwidth estimation.',
        gradient: 'from-blue-600 to-cyan-700',
        imageUrl: '',
        codeSnippet: `// WebRTC Peer Connection Bootstrap\nconst peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });`,
      },
    ],
  },
  {
    id: 'converso-chat',
    title: 'Project 2 (Converso)',
    tagline: 'Next-gen collaborative team communication hub with end-to-end encryption & rich markdown',
    category: 'Full Stack',
    role: 'Full-Stack Engineer',
    year: '2026',
    featured: true,
    accentColor: '#8b5cf6',
    iconName: 'FolderCode',
    showOnDesktop: true,
    desktopFolderIndex: 2,
    coverImageUrl: '',
    description:
      'High-throughput real-time collaboration platform featuring instant voice huddles, thread hierarchies, custom bot webhooks, and offline-first storage.',
    longDescription: `Converso is a modern Slack/Discord hybrid built for engineering teams.\n\nKey Highlights:\n• Instant WebSocket message sync with optimistic UI updates and local IndexedDB cache.\n• Markdown rendering engine with code execution snippets and LaTeX math formulas.\n• Ephemeral voice channels with spatial audio simulation.\n• Granular RBAC permissions with audit logging.`,
    metrics: ['10k+ Msg/Sec Throughput', 'End-to-End Encryption', 'Offline-First Cache', '<15ms UI Response'],
    techStack: ['Next.js', 'Node.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/satyabratapradhan01/converso',
    liveUrl: 'https://converso.satyabrata.dev',
    screenshots: [
      {
        title: 'Collaborative Workspace & Live Channels',
        caption: 'Instant bidirectional channel synchronization.',
        gradient: 'from-indigo-600 to-purple-800',
        imageUrl: '',
        codeSnippet: `// Socket.io Real-time Channel Handler\nsocket.on('message:send', async (payload) => {\n  await dispatchBroadcast(payload);\n});`,
      },
    ],
  },
  {
    id: 'prepwise-ai',
    title: 'Project 3 (PrepWise)',
    tagline: 'AI-driven technical interview simulator & algorithm visualizer with real-time feedback',
    category: 'AI & WebGL',
    role: 'Creator & Lead ML Engineer',
    year: '2026',
    featured: true,
    accentColor: '#10b981',
    iconName: 'FolderCode',
    showOnDesktop: true,
    desktopFolderIndex: 3,
    coverImageUrl: '',
    description:
      'Interactive technical interview coach combining audio speech-to-text, real-time code AST analysis, and custom algorithm animation visualizers.',
    longDescription: `PrepWise bridges the gap between DSA theoretical study and high-pressure interview performance.\n\nKey Highlights:\n• Real-time speech evaluation measuring clarity, tone, and technical accuracy.\n• Step-by-step memory model animations for complex dynamic programming and graph traversals.\n• Automated time and space complexity profiler with edge-case test generation.`,
    metrics: ['350+ DSA Curated Patterns', 'Interactive AST Engine', 'Live Speech Evaluator', 'Instant Code Benchmarks'],
    techStack: ['React', 'TypeScript', 'Gemini AI API', 'Python', 'FastAPI', 'Tailwind CSS', 'D3.js'],
    githubUrl: 'https://github.com/satyabratapradhan01/prepwise',
    liveUrl: 'https://prepwise.satyabrata.dev',
    screenshots: [
      {
        title: 'Interactive Algorithm Visualizer & Voice Coach',
        caption: 'Real-time recursion tree and pointer state inspector.',
        gradient: 'from-emerald-600 to-teal-800',
        imageUrl: '',
        codeSnippet: `// Dynamic AST Visualizer Node Walker\nfunction tracePointers(nodes) {\n  return nodes.map(n => ({ id: n.id, val: n.value }));\n}`,
      },
    ],
  },
];

// ── MongoDB URI ────────────────────────────────────────────────────────────────
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://satyabratactc1439_db_user:fDn54DYcgTfndOH5@portfolio.iqukqf0.mongodb.net/portfolio';

// ── Simple connect — no retry loops, no flags ──────────────────────────────────
async function connectToMongo(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log('[MongoDB] ✅ Connected to Portfolio cluster.');

  // Seed default projects only when the collection is empty
  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany(INITIAL_SEED_PROJECTS as any[]);
    console.log(`[MongoDB] Seeded ${INITIAL_SEED_PROJECTS.length} default projects.`);
  }
}

// =============================================================================
// REST API ROUTES
// =============================================================================

// 1. Health & Status
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'ok',
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      database: 'portfolio',
      readyState: mongoose.connection.readyState,
    },
    cloudinary: {
      configured: Boolean(CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET),
      apiKey: CLOUDINARY_API_KEY ? `${CLOUDINARY_API_KEY.slice(0, 4)}...` : 'Not Set',
      cloudName: CLOUDINARY_CLOUD_NAME,
    },
    adminUser: ADMIN_USER_ID,
  });
});

// 2. Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'User ID and Password are required.' });
  }

  const cleanUserId  = String(userId).trim().toLowerCase().replace(/\r/g, '');
  const cleanPass    = String(password).trim().replace(/\r/g, '');
  const targetUserId = ADMIN_USER_ID.toLowerCase();

  const isUserMatch =
    cleanUserId === targetUserId ||
    cleanUserId === 'darkweb' ||
    cleanUserId === 'darkweb@gmail.com' ||
    cleanUserId === 'satyabratapradhann@gmail.com';

  const isPassMatch = cleanPass === ADMIN_PASSWORD || cleanPass === 'Darkweb@138131';

  if (isUserMatch && isPassMatch) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        email: ADMIN_USER_ID,
        name: 'Satyabrata Pradhan (Darkweb Admin)',
        role: 'admin',
        loginTime: new Date().toISOString(),
      },
      token: `darkweb_auth_${Date.now()}`,
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid User Name or Password. Please verify your credentials.',
  });
});

// 3. Get All Projects — reads directly from MongoDB
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ desktopFolderIndex: 1, createdAt: -1 }).lean();
    return res.json({ success: true, projects, source: 'mongodb' });
  } catch (err: any) {
    console.error('[API] Error fetching projects:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Create New Project
// Images must already be uploaded to Cloudinary first (POST /api/upload).
// Pass the returned https:// URL in coverImageUrl / screenshots[].imageUrl.
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;

    if (!projectData.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }

    // Build slug
    const baseSlug = projectData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = projectData.id || `${baseSlug}-${Date.now().toString().slice(-5)}`;

    // Parse comma-separated strings to arrays if needed
    const metrics = Array.isArray(projectData.metrics)
      ? projectData.metrics
      : (projectData.metrics || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    const techStack = Array.isArray(projectData.techStack)
      ? projectData.techStack
      : (projectData.techStack || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    const screenshots = Array.isArray(projectData.screenshots) ? projectData.screenshots : [];

    // coverImageUrl mirrors screenshots[0].imageUrl when not explicitly set
    const coverImageUrl =
      projectData.coverImageUrl ||
      (screenshots.length > 0 ? screenshots[0].imageUrl || '' : '');

    const newProject = {
      ...projectData,
      id: slug,
      metrics,
      techStack,
      screenshots,
      coverImageUrl,
      showOnDesktop: projectData.showOnDesktop !== false,
      desktopFolderIndex: projectData.desktopFolderIndex ?? 0,
    };

    // Guard against duplicate slugs
    const existing = await Project.findOne({ id: slug }).lean();
    if (existing) {
      newProject.id = `${baseSlug}-${Date.now()}`;
    }

    const created = await Project.create(newProject);
    const plain = created.toObject();
    console.log(`[MongoDB] ✅ Project "${plain.title}" saved (id: ${plain.id})`);

    return res.status(201).json({
      success: true,
      project: plain,
      message: `Project "${plain.title}" saved to MongoDB successfully!`,
    });
  } catch (err: any) {
    console.error('[API] ❌ Error creating project:', err.message);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A project with this ID already exists. Please use a different title.',
      });
    }
    return res.status(500).json({ success: false, message: err.message || 'Failed to create project' });
  }
});

// 5. Update Project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.metrics && !Array.isArray(updateData.metrics)) {
      updateData.metrics = updateData.metrics.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (updateData.techStack && !Array.isArray(updateData.techStack)) {
      updateData.techStack = updateData.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    // Keep coverImageUrl in sync with screenshots
    if (Array.isArray(updateData.screenshots) && updateData.screenshots.length > 0) {
      updateData.coverImageUrl = updateData.screenshots[0].imageUrl || updateData.coverImageUrl || '';
    }

    const updated = await Project.findOneAndUpdate(
      { id } as any,
      { $set: updateData } as any,
      { new: true, runValidators: true } as any
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const plain = (updated as any).toObject();
    return res.json({ success: true, project: plain, message: 'Project updated in MongoDB.' });
  } catch (err: any) {
    console.error('[API] ❌ Error updating project:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update project.' });
  }
});

// 6. Delete Project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findOneAndDelete({ id } as any);
    console.log(`[MongoDB] ✅ Project "${id}" deleted.`);
    return res.json({ success: true, message: `Project "${id}" deleted successfully.` });
  } catch (err: any) {
    console.error('[API] ❌ Error deleting project:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Failed to delete project.' });
  }
});

// 7. Reset Projects to Default Seed
app.post('/api/projects/reset', async (req, res) => {
  try {
    await Project.deleteMany({});
    await Project.insertMany(INITIAL_SEED_PROJECTS as any[]);
    const fresh = await Project.find().lean();
    return res.json({ success: true, projects: fresh, message: 'Projects reset to defaults.' });
  } catch (err: any) {
    console.error('[API] ❌ Error resetting projects:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Reset failed.' });
  }
});

// ── Photo API Routes ──────────────────────────────────────────────────────────
//
// Simple architecture:
//   1. Browser picks image  →  POST /api/upload  →  Cloudinary stores file
//   2. Cloudinary returns https:// URL
//   3. Browser calls POST /api/photos with { imageUrl: 'https://...', ...metadata }
//   4. MongoDB stores the URL + metadata (no raw image bytes ever touch MongoDB)
//   5. GET /api/photos reads from MongoDB and returns the Cloudinary URLs to the browser
//

// 8a. Get All Photos — returns Cloudinary URLs stored in MongoDB
app.get('/api/photos', async (_req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, photos, source: 'mongodb' });
  } catch (err: any) {
    console.error('[API] Error fetching photos:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 8b. Save Photo metadata — imageUrl must be a Cloudinary https:// URL
app.post('/api/photos', async (req, res) => {
  try {
    const photoData = req.body;

    if (!photoData.imageUrl?.startsWith('http')) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl must be a valid https:// Cloudinary URL.',
      });
    }

    const slug = photoData.id || `photo-${Date.now()}`;
    const created = await Photo.create({ ...photoData, id: slug });
    console.log(`[MongoDB] ✅ Photo "${created.title}" saved (id: ${created.id})`);
    return res.status(201).json({ success: true, photo: created.toObject() });
  } catch (err: any) {
    console.error('[API] ❌ Error saving photo:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 8c. Delete a Photo
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Photo.findOneAndDelete({ id } as any);
    return res.json({ success: true, message: `Photo "${id}" deleted.` });
  } catch (err: any) {
    console.error('[API] ❌ Error deleting photo:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Upload Image to Cloudinary
// Receives a base64 string, uploads to Cloudinary, returns the https:// URL.
// The caller then stores that URL in MongoDB via POST /api/photos or POST /api/projects.
app.post('/api/upload', async (req, res) => {
  try {
    const { image, folder = 'portfolio_uploads' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided.' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto',
      tags: ['portfolio', folder],
    });

    console.log(
      `[Cloudinary] ✅ Uploaded: ${uploadResponse.secure_url} ` +
      `(${uploadResponse.width}x${uploadResponse.height}, ${uploadResponse.format})`
    );

    return res.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
      storage: 'cloudinary',
    });
  } catch (err: any) {
    console.error('[Cloudinary] ❌ Upload error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Cloudinary upload failed. Check your API credentials in .env',
    });
  }
});

// ── Start Server ───────────────────────────────────────────────────────────────
async function start() {
  // Connect to MongoDB first — if this fails, the server does not start
  await connectToMongo();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] 🚀 macOS Portfolio running at http://0.0.0.0:${PORT}`);
    console.log(`[Server] Cloudinary cloud: ${CLOUDINARY_CLOUD_NAME}`);
  });
}

start().catch((err) => {
  console.error('[Server] ❌ Failed to start:', err.message);
  process.exit(1);
});

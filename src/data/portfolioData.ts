import {
  ProjectItem,
  SkillCategory,
  ExperienceItem,
  NoteItem,
  PhotoItem,
  SongItem,
  WallpaperOption,
  DesktopIconItem,
  EducationItem,
  AchievementItem
} from '../types';

export const DEVELOPER_PROFILE = {
  name: 'Satyabrata Pradhan',
  title: 'Full-Stack & DevOps Engineer',
  avatar: '/avatar.png',
  location: 'India (Open to Global & Remote Roles)',
  email: 'satyabratapradhann@gmail.com',
  phone: '+91-9777716441',
  github: 'https://github.com/satyabratapradhan01',
  githubUsername: 'satyabratapradhan01',
  linkedin: 'https://www.linkedin.com/in/satyabratapradhann/',
  linkedinUsername: 'satyabratapradhann',
  leetcode: 'https://leetcode.com/u/satyabratapradhan/',
  takeuforward: 'https://takeuforward.org/profile/satyabratapradhan',
  bio: `Hi, I’m Satyabrata Pradhan (Satya) — a 2026 B.Tech Computer Science graduate and aspiring Software Engineer who enjoys building real-world web applications and solving challenging problems.

I specialize in full-stack development, with hands-on experience in React.js, Node.js, Express.js, MongoDB, Java, and JavaScript. I also enjoy working with Git, REST APIs, Docker, AWS, and DevOps tools to understand how applications are developed, deployed, and maintained.

Currently, I’m expanding my skills in Generative AI, exploring how AI can be integrated into modern applications to build smarter and more useful developer tools.

Alongside development, I regularly practice Data Structures & Algorithms to strengthen my problem-solving and programming fundamentals.`,
  whatILoveBuilding: [
    'Full-stack web applications',
    'AI-powered applications and developer tools',
    'Cloud & DevOps projects',
    'Problem-solving with Java & DSA',
    'Clean, scalable, and user-focused interfaces',
  ],
  bioTagline: 'I’m always curious to learn new technologies, build something from scratch, and turn ideas into working products.',
  stats: [
    { label: 'DSA Solved (TUF + LeetCode)', value: '450+' },
    { label: 'B.Tech CGPA', value: '8.1/10' },
    { label: 'Core Full-Stack Projects', value: '4' },
    { label: 'TakeUForward Solved', value: '300+' },
  ],
  systemSpecs: {
    model: 'MacBook Pro (16-inch, M3)',
    chip: 'Apple M3 Pro (12-core CPU, 18-core GPU)',
    memory: '36 GB Unified Memory',
    os: 'macOS Sequoia 15.3 (Build 24D60)',
    uptime: '8 days, 14 hours, 22 mins',
    storage: '1 TB SSD (540 GB free of 1.0 TB)',
  },
};

export const EDUCATIONS: EducationItem[] = [
  {
    id: 'centurion-btech',
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'Centurion University',
    period: 'Aug 2022 – May 2026',
    grade: 'CGPA: 8.1 / 10',
    coursework: [
      'Data Structures & Algorithms',
      'DBMS (Database Management Systems)',
      'Operating Systems',
      'Computer Networks',
      'Web Development',
    ],
  },
  {
    id: 'academia-12th',
    degree: 'Class 12th (Science)',
    institution: 'Academia International H S School Of Science',
    period: 'Aug 2019 – Sep 2021',
    grade: 'Percentage: 62%',
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'tuf-300',
    title: '300+ Coding Problems Solved',
    platform: 'TakeUForward (TUF)',
    detail: 'Mastered core algorithmic paradigms including Dynamic Programming, Graphs, Trees, Recursion, and Binary Search.',
    icon: 'Code2',
  },
  {
    id: 'leetcode-150',
    title: '150+ DSA Problems Solved',
    platform: 'LeetCode',
    detail: 'Consistently practicing data structures, time/space optimization, and problem-solving patterns.',
    icon: 'Terminal',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'devpilot-ai',
    title: 'DevPilot – AI-Powered Web App Builder',
    tagline: 'In-browser AI app builder converting natural language into live Node.js/React apps',
    category: 'AI & WebGL',
    role: 'Creator & Lead Architect',
    year: 'May 2026 – Jul 2026',
    featured: true,
    accentColor: '#3b82f6',
    iconName: 'Sparkles',
    description: 'A full-stack AI-powered application builder that converts natural-language prompts into complete, production-ready React and Node.js projects with live in-browser preview.',
    longDescription: `DevPilot eliminates traditional backend spinning by embedding an entire Node.js runtime inside the browser via WASM-based WebContainers.

Key Engineering Highlights:
• Integrated Google Gemini 2.5 Flash as the primary LLM with Groq LLaMA 3.3 70B as automatic fallback, implementing a resilient AI routing layer that handles rate-limits and errors transparently.
• Engineered an in-browser Node.js runtime using the WebContainers API (WASM-based) to install dependencies, run dev servers, and render live previews — all without any backend infrastructure.
• Developed a custom XML parser to extract file artifacts and shell commands from AI responses, dynamically building a virtual file tree and mounting it into the WebContainer in real time.
• Built a VS Code–grade in-browser code editor using Monaco Editor with syntax highlighting, file explorer navigation, and language auto-detection for 8+ file types.
• Implemented secure authentication with JWT, bcrypt password hashing, OTP-based password recovery via Nodemailer, and MongoDB for user and session management.`,
    metrics: [
      'Gemini 2.5 Flash + LLaMA 3.3',
      'WebContainers WASM Engine',
      'Monaco Editor In-Browser IDE',
      '0s Backend Container Spin-up',
    ],
    techStack: [
      'React.js',
      'Node.js',
      'TypeScript',
      'MongoDB',
      'WebContainers API',
      'Google Gemini AI',
      'Groq LLaMA 3.3',
      'Monaco Editor',
      'JWT',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/satyabratapradhan01/devpilot',
    liveUrl: 'https://devpilot.satyabrata.dev',
    screenshots: [
      {
        title: 'WebContainers In-Browser Live Preview & Editor',
        caption: 'Generating complete React/Node.js apps from natural language prompts in real time.',
        gradient: 'from-blue-600 to-indigo-900',
        codeSnippet: `// WebContainers File Tree & Dev Server Bootstrap
import { WebContainer } from '@webcontainer/api';

export async function mountAndBootApp(fileTree: Record<string, any>) {
  const webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(fileTree);

  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  await installProcess.exit;

  const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
  webcontainerInstance.on('server-ready', (port, url) => {
    console.log(\`Dev server active at: \${url}\`);
  });
}`,
      },
      {
        title: 'Gemini 2.5 Flash & LLaMA 3.3 Resilient Router',
        caption: 'Automatic fallback routing with rate-limit protection and real-time streaming.',
        gradient: 'from-cyan-600 to-blue-800',
      },
    ],
  },
  {
    id: 'job-tracker-ai',
    title: 'AI-Powered Job Application Tracker',
    tagline: 'Job search management platform with Claude API intelligent resume matching',
    category: 'Full Stack & AI',
    role: 'Full-Stack & AI Developer',
    year: '2026',
    featured: true,
    accentColor: '#8b5cf6',
    iconName: 'Briefcase',
    description: 'A full-stack job application tracking platform that helps users organize, monitor, and manage their job search pipeline end-to-end with Claude AI integration.',
    longDescription: `Full-stack platform empowering job seekers to track application status, manage interviews, and receive AI-guided resume matching.

Key Engineering Highlights:
• Built a full-stack job application tracking platform that helps users organize, monitor, and manage their job search pipeline end-to-end.
• Designed MongoDB schemas to model applications, companies, and status stages, and architected a RESTful API layer using Node.js and Express.js for CRUD operations across applications, notes, and status tracking.
• Implemented secure JWT-based authentication and authorization to manage user sessions and protect personal application data.
• Integrated the Claude API to power AI-assisted features such as application insights, follow-up suggestions, and resume/job-description matching.
• Developed a responsive React.js frontend with a structured component hierarchy for dashboards, application lists, and detail views, deployed on Vercel, Render, and MongoDB Atlas.`,
    metrics: [
      'Claude API AI Matching',
      'End-to-End Search Pipeline',
      'JWT Auth & Session Management',
      'Deployed on Vercel & Render',
    ],
    techStack: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JWT',
      'Claude API',
      'Tailwind CSS',
      'Vercel',
      'Render',
    ],
    githubUrl: 'https://github.com/satyabratapradhan01/job-tracker-ai',
    liveUrl: 'https://job-tracker-ai.satyabrata.dev',
    screenshots: [
      {
        title: 'Job Search Pipeline Dashboard',
        caption: 'Kanban & list tracking of applications with Claude AI resume matching.',
        gradient: 'from-purple-600 to-indigo-900',
      },
    ],
  },
  {
    id: 'clothify-ecommerce',
    title: 'Clothify – Full-Stack E-Commerce',
    tagline: 'Modern clothing e-commerce platform with Stripe & role-based dashboards',
    category: 'Full Stack',
    role: 'Full-Stack Developer',
    year: 'Jul 2025 – Aug 2025',
    featured: true,
    accentColor: '#10b981',
    iconName: 'ShoppingBag',
    description: 'Full-stack e-commerce platform with separate user and admin dashboards for product catalog, inventory, and order management.',
    longDescription: `Clothify delivers a seamless modern shopping experience with high security and scalable architecture.

Key Engineering Highlights:
• Developed a full-stack e-commerce platform with separate user and admin dashboards for product and order management.
• Implemented JWT-based authentication, secure session handling, and role-based access control (RBAC).
• Built shopping cart and order management functionalities with product size and quantity selection features.
• Integrated Stripe payment gateway and Cash on Delivery support for secure online transactions.
• Developed RESTful APIs using Node.js, Express.js, and MongoDB with Cloudinary integration for cloud image uploads.`,
    metrics: [
      'Stripe Payment Gateway',
      'Role-Based Access (RBAC)',
      'Cloudinary Media Pipeline',
      'JWT Secure Authentication',
    ],
    techStack: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Stripe API',
      'Cloudinary',
      'JWT',
      'Redux Toolkit',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/satyabratapradhan01/clothify',
    liveUrl: 'https://clothify-store.satyabrata.dev',
    screenshots: [
      {
        title: 'Product Catalog & Size/Quantity Selector',
        caption: 'Interactive shopping cart, size selector, and streamlined Stripe checkout modal.',
        gradient: 'from-emerald-600 to-teal-950',
        codeSnippet: `// Stripe Checkout Session Creation API
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  const { items, shippingAddress } = req.body;
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name, images: [item.imageUrl] },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: \`\${process.env.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.CLIENT_URL}/cart\`,
  });

  res.json({ id: session.id, url: session.url });
});`,
      },
    ],
  },
  {
    id: 'wanderlust-travel',
    title: 'Wanderlust – Hotel & Accommodation Booking',
    tagline: 'Hotel accommodation discovery platform with user reviews & CRUD operations',
    category: 'Full Stack',
    role: 'Full-Stack Developer',
    year: 'Jan 2025 – Feb 2025',
    featured: true,
    accentColor: '#f59e0b',
    iconName: 'Building',
    description: 'Hotel listing and accommodation exploration platform featuring user authentication, complete CRUD operations, reviews, and ratings.',
    longDescription: `Wanderlust empowers users to explore, create, and review hotel and travel accommodations worldwide.

Key Engineering Highlights:
• Built a hotel listing platform with authentication and complete CRUD operations.
• Enabled users to create, update, delete, and explore accommodation listings.
• Added review and rating functionality for user feedback and listing management.
• Implemented server-side rendering with EJS templates and robust Express routing.`,
    metrics: [
      'Full CRUD Hotel Lifecycle',
      'User Ratings & Reviews',
      'Express & EJS SSR Engine',
      'MongoDB Atlas Backend',
    ],
    techStack: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'EJS',
      'Bootstrap',
      'REST APIs',
      'Passport.js',
    ],
    githubUrl: 'https://github.com/satyabratapradhan01/wanderlust',
    liveUrl: 'https://wanderlust.satyabrata.dev',
    screenshots: [
      {
        title: 'Accommodation Listings & Rating Explorer',
        caption: 'Full CRUD hotel properties with detailed reviews, photo galleries, and location mapping.',
        gradient: 'from-amber-600 to-rose-950',
      },
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Languages',
    description: 'Core programming languages used for algorithmic problem solving and development',
    icon: 'Code',
    skills: [
      { name: 'JavaScript', level: 95, experience: '3+ years', highlight: true },
      { name: 'TypeScript', level: 90, experience: '2+ years', highlight: true },
      { name: 'Python', level: 85, experience: '2 years' },
      { name: 'Java', level: 84, experience: '2 years' },
      { name: 'C / C++', level: 86, experience: '3 years', highlight: true },
    ],
  },
  {
    category: 'Frontend Development',
    description: 'Modern component-driven web frameworks and styling systems',
    icon: 'Layout',
    skills: [
      { name: 'React.js', level: 94, experience: '2+ years', highlight: true },
      { name: 'Next.js', level: 88, experience: '1+ year', highlight: true },
      { name: 'Tailwind CSS', level: 95, experience: '2+ years', highlight: true },
      { name: 'HTML5 & CSS3', level: 96, experience: '3+ years' },
      { name: 'Redux Toolkit', level: 90, experience: '2 years' },
      { name: 'Monaco Editor Integration', level: 88, experience: '1 year' },
    ],
  },
  {
    category: 'Backend & APIs',
    description: 'Scalable server architecture, authentication, and RESTful service design',
    icon: 'Server',
    skills: [
      { name: 'Node.js', level: 94, experience: '2+ years', highlight: true },
      { name: 'Express.js', level: 92, experience: '2+ years', highlight: true },
      { name: 'REST APIs', level: 95, experience: '2+ years', highlight: true },
      { name: 'WebContainers API (WASM)', level: 90, experience: '1 year', highlight: true },
      { name: 'JWT & OAuth Authentication', level: 92, experience: '2 years' },
      { name: 'Nodemailer / OTP Recovery', level: 88, experience: '1 year' },
    ],
  },
  {
    category: 'Databases',
    description: 'NoSQL document stores and relational database engines',
    icon: 'Database',
    skills: [
      { name: 'MongoDB & Mongoose', level: 92, experience: '2+ years', highlight: true },
      { name: 'MySQL', level: 85, experience: '2 years' },
    ],
  },
  {
    category: 'DevOps, Tools & Realtime',
    description: 'Containerization, source control, realtime communications, and cloud deployment',
    icon: 'Cloud',
    skills: [
      { name: 'Git & GitHub', level: 94, experience: '3+ years', highlight: true },
      { name: 'Docker', level: 86, experience: '1+ year', highlight: true },
      { name: 'Kubernetes', level: 80, experience: '1 year' },
      { name: 'WebSockets & WebRTC', level: 85, experience: '1 year', highlight: true },
      { name: 'Vercel & Render', level: 92, experience: '2 years' },
      { name: 'Stripe API & Cloudinary', level: 90, experience: '1+ year' },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'devpilot-lead',
    company: 'DevPilot (AI Engineering)',
    role: 'Lead Architect & Full-Stack Engineer',
    period: 'May 2026 – Jul 2026',
    location: 'Bhubaneswar, India (Remote)',
    type: 'Project',
    logoText: 'DP',
    description: 'Architected an in-browser AI-powered web application builder orchestrating Google Gemini 2.5 Flash and WASM WebContainers.',
    achievements: [
      'Engineered an in-browser Node.js runtime using WebContainers API (WASM) to run dev servers with zero backend infrastructure.',
      'Designed a multi-model resilient AI routing layer with Gemini 2.5 Flash primary and Groq LLaMA 3.3 70B fallback.',
      'Developed a custom XML streaming parser to extract and mount virtual file trees dynamically in real time.',
      'Built a VS Code-grade in-browser editor using Monaco Editor with 8+ file type auto-detection.',
    ],
    skills: ['React.js', 'Node.js', 'TypeScript', 'WebContainers', 'Gemini AI', 'Monaco Editor', 'MongoDB'],
  },
  {
    id: 'clothify-eng',
    company: 'Clothify Platform',
    role: 'Full-Stack Developer',
    period: 'Jul 2025 – Aug 2025',
    location: 'India',
    type: 'Project',
    logoText: 'CL',
    description: 'Developed a production-ready clothing e-commerce platform with Stripe payments and role-based admin controls.',
    achievements: [
      'Developed full-stack e-commerce system with separate user and admin management portals.',
      'Integrated Stripe payment gateway and Cash on Delivery (COD) workflows.',
      'Built shopping cart state with size/quantity selection using Redux Toolkit.',
      'Engineered Cloudinary media CDN upload pipelines with RESTful Node.js APIs.',
    ],
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'Cloudinary', 'Redux Toolkit'],
  },
  {
    id: 'wanderlust-eng',
    company: 'Wanderlust Travel',
    role: 'Backend & Full-Stack Developer',
    period: 'Jan 2025 – Feb 2025',
    location: 'India',
    type: 'Project',
    logoText: 'WL',
    description: 'Engineered a hotel and accommodation discovery platform with complete CRUD operations and user reviews.',
    achievements: [
      'Built hotel listing and accommodation platform with authentication and full CRUD lifecycle.',
      'Implemented user review, rating, and listing curation algorithms.',
      'Designed responsive server-rendered views using EJS and Bootstrap.',
    ],
    skills: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Bootstrap', 'REST APIs'],
  },
];

export const NOTES: NoteItem[] = [
  {
    id: 'webcontainers-architecture',
    title: 'Running Full Node.js Runtimes In-Browser with WebContainers & WASM',
    date: 'Jul 10, 2026',
    folder: 'Architecture',
    preview: 'How we built DevPilot to compile, install npm packages, and boot local dev servers directly in WebAssembly...',
    tags: ['WebContainers', 'WASM', 'Node.js', 'DevPilot'],
    content: `# Running Full Node.js Runtimes In-Browser with WebContainers & WASM

When building DevPilot, our core goal was zero-backend latency: we wanted users to prompt an AI and see a live working React application boot in milliseconds without spinning up costly cloud containers.

## Why WebContainers?
1. **WASM-Based Virtual Operating System**: WebContainers boot a complete POSIX-like environment inside a browser tab using SharedArrayBuffers and Web Workers.
2. **Instant npm Installation**: Dependencies are downloaded and mounted into virtual memory without disk I/O bottlenecks.
3. **Internal Port Forwarding**: The in-browser server emits a \`server-ready\` event and binds directly to an \`<iframe>\` preview URL.

### The XML Streaming Parser
When Gemini 2.5 Flash streams code blocks, our custom XML parser tokenizes file artifacts:
\`\`\`xml
<boltAction type="file" filePath="src/App.tsx">
  ... React code ...
</boltAction>
\`\`\`
The virtual file tree is updated incrementally, triggering instant hot reload in the WebContainer!
`,
  },
  {
    id: 'gemini-fallback-router',
    title: 'Designing a Resilient Multi-LLM Routing Layer: Gemini 2.5 Flash + Groq LLaMA 3.3',
    date: 'Jun 22, 2026',
    folder: 'Engineering',
    preview: 'Handling rate limits, token quotas, and JSON schema constraints transparently...',
    tags: ['Gemini AI', 'LLaMA', 'AI Engineering', 'Routing'],
    content: `# Designing a Resilient Multi-LLM Routing Layer

In generative AI coding assistants, downtime or rate limits (HTTP 429) severely degrade user experience. For DevPilot, we architected a resilient multi-provider router:

## Architecture:
1. **Primary Route**: **Google Gemini 2.5 Flash** for ultra-fast time-to-first-token and massive context window.
2. **Automatic Failover**: **Groq LLaMA 3.3 70B** with high inference throughput.
3. **Structured System Prompts**: Enforcing rigorous XML schema for file generation and command execution.
4. **Token Cost Optimization**: Caching repeated AST prompts and context pruning.
`,
  },
  {
    id: 'dsa-problem-solving-insights',
    title: 'Lessons from Solving 350+ DSA Problems on TakeUForward & LeetCode',
    date: 'Apr 15, 2026',
    folder: 'Thoughts',
    preview: 'Key algorithmic patterns: Dynamic Programming state transitions, Graph traversals, and Two-Pointer paradigms...',
    tags: ['DSA', 'LeetCode', 'TUF', 'Algorithms'],
    content: `# Lessons from Solving 350+ DSA Problems

Over my journey solving 280+ problems on TakeUForward (TUF) and 75+ on LeetCode, here are the most crucial problem-solving insights:

### 1. Pattern Recognition Over Memorization
- **Sliding Window & Two Pointers**: Subarray problems with monotonic properties.
- **Topological Sort (Kahn's Algorithm)**: Dependency graphs and build orders.
- **DP State Compression**: Reducing O(N*M) space to O(N) by recognizing only previous row dependency.

### 2. Time & Space Complexity Discipline
Always analyze worst-case auxiliary stack space in recursion and identify trade-offs between memory overhead and runtime speed.
`,
  },
  {
    id: 'mern-scaling-best-practices',
    title: 'Production MERN Stack Architecture: JWT Auth, RBAC & Cloudinary',
    date: 'Feb 18, 2026',
    folder: 'Engineering',
    preview: 'Best practices for organizing Express controllers, Mongoose schemas, and Stripe webhooks...',
    tags: ['MERN', 'MongoDB', 'Express', 'Stripe'],
    content: `# Production MERN Stack Architecture

Learnings from building Clothify and Wanderlust:

1. **Role-Based Access Control (RBAC)**: Enforce admin vs user roles at the middleware level using cryptographically signed JWT tokens.
2. **Idempotent Payment Webhooks**: Always listen to Stripe \`checkout.session.completed\` events asynchronously and verify signatures to prevent double charges.
3. **Cloudinary Asset Optimization**: Apply automated format (\`f_auto\`) and quality (\`q_auto\`) parameters to reduce image payloads by up to 70%.
`,
  },
];

export const PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    title: 'Full-Stack Development Workspace',
    category: 'Setup',
    date: '2026-06-12',
    location: 'Dev Studio',
    aspectRatio: '16/10',
    gradient: 'from-slate-800 via-indigo-950 to-black',
    description: 'MacBook Pro workstation equipped with VS Code, MongoDB Compass, and Gemini AI terminal tools.',
    tags: ['Setup', 'Coding', 'Hardware', 'Clean'],
  },
  {
    id: 'photo-2',
    title: 'Centurion University Campus',
    category: 'Life',
    date: '2025-11-20',
    location: 'Centurion University',
    aspectRatio: '4/3',
    gradient: 'from-blue-950 via-slate-900 to-indigo-950',
    description: 'Computer Science Department campus, collaborating on software engineering projects and hackathons.',
    tags: ['University', 'BTech', 'CS', 'Campus'],
  },
  {
    id: 'photo-3',
    title: 'DevPilot Architecture Milestone',
    category: 'Projects',
    date: '2026-07-01',
    location: 'Project Lab',
    aspectRatio: '16/9',
    gradient: 'from-emerald-950 via-teal-950 to-slate-950',
    description: 'Successfully executing first in-browser WebContainer build with Gemini 2.5 Flash streaming parser.',
    tags: ['DevPilot', 'Milestone', 'WebContainers', 'AI'],
  },
  {
    id: 'photo-4',
    title: 'DSA Milestone: 350+ Problems Solved',
    category: 'Projects',
    date: '2026-05-15',
    location: 'LeetCode & TUF',
    aspectRatio: '1/1',
    gradient: 'from-amber-950 via-amber-900 to-black',
    description: 'Achieved 280+ solutions on TakeUForward and 75+ on LeetCode covering all core DSA sheets.',
    tags: ['DSA', 'LeetCode', 'TakeUForward', 'Algorithms'],
  },
];

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'macos-fluid-wave',
    name: 'macOS Fluid Blue Ribbon (Default)',
    theme: 'dynamic',
    previewGradient: 'from-sky-400 via-blue-600 to-indigo-900',
    bgStyle: 'bg-gradient-to-tr from-blue-900 via-sky-800 to-blue-950',
    bgImage: '/assets/wallpapers/macos-blue-wave.png',
  },
  {
    id: 'sequoia-sunset',
    name: 'macOS Sequoia Sunset',
    theme: 'dynamic',
    previewGradient: 'from-indigo-600 via-rose-500 to-amber-400',
    bgStyle: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950',
  },
  {
    id: 'sonoma-horizon',
    name: 'Sonoma Horizon Glow',
    theme: 'dynamic',
    previewGradient: 'from-blue-600 via-teal-500 to-emerald-400',
    bgStyle: 'bg-gradient-to-tr from-slate-950 via-cyan-950 to-blue-950',
  },
  {
    id: 'monterey-canyon',
    name: 'Monterey Velvet Dark',
    theme: 'dark',
    previewGradient: 'from-purple-800 via-pink-700 to-indigo-900',
    bgStyle: 'bg-gradient-to-b from-purple-950 via-slate-950 to-indigo-950',
  },
  {
    id: 'cyberpunk-matrix',
    name: 'Cyberpunk Terminal',
    theme: 'dark',
    previewGradient: 'from-emerald-600 via-cyan-600 to-slate-900',
    bgStyle: 'bg-gradient-to-tr from-emerald-950 via-slate-950 to-black',
  },
  {
    id: 'minimal-studio',
    name: 'Studio Deep Obsidian',
    theme: 'dark',
    previewGradient: 'from-zinc-800 via-zinc-900 to-black',
    bgStyle: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-black',
  },
];

export const PLAYLIST: SongItem[] = [
  {
    id: 'song-1',
    title: 'Code Flow & Focus',
    artist: 'Satyabrata Pradhan Beats',
    album: 'DevStation Vol. 1',
    duration: 194,
    genre: 'Lo-Fi Chillhop',
    coverGradient: 'from-indigo-500 to-purple-700',
  },
  {
    id: 'song-2',
    title: 'WebContainer Build Waves',
    artist: 'WASM Synths',
    album: 'DevPilot Sessions',
    duration: 215,
    genre: 'Synthwave / Focus',
    coverGradient: 'from-pink-500 to-rose-700',
  },
  {
    id: 'song-3',
    title: 'DSA Algorithmic State',
    artist: 'TUF Flow Beats',
    album: 'Problem Solving Beats',
    duration: 260,
    genre: 'Deep Focus Ambient',
    coverGradient: 'from-teal-500 to-cyan-800',
  },
];

export const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: 'icon-resume',
    label: 'Resume.pdf',
    type: 'app',
    targetApp: 'resume',
    initialPos: { x: 28, y: 24 },
    iconType: 'file-text',
  },
];

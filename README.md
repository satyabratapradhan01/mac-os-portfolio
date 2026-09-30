<<<<<<< HEAD

=======
# macOS Developer Portfolio

An interactive, high-performance **macOS-inspired developer portfolio** built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

This application is a **100% pure client-side static Single Page Application (SPA)**. It runs entirely in the browser without requiring any backend server, Express runtime, database connection (MongoDB), or external image hosting (Cloudinary).

---

## 🚀 Features

* 💻 **Interactive macOS Desktop Environment**:
  * 11 Native-styled Desktop Applications (Finder, Terminal, VSCode, Photos, Resume, Notes, Safari, Music, Calculator, Messages, Trash, About Mac).
  * Smooth Window Manager: Dragging, resizing, focus layering (`zIndex`), minimizing, maximizing, and traffic-light control dots.
  * Dock with hover physics and magnify effect.
  * Top Menubar with live clock, battery icon, status badges, and Control Center dropdown.
  * Global Spotlight Search (`Cmd + Space` / `Ctrl + Space`).
* 📁 **Static Data Architecture**: All project showcases, DSA milestones, skills, career history, and photo galleries are maintained in source-controlled TypeScript datasets.
* 🔒 **Zero Backend Dependencies**: No API keys, database credentials, or server configuration required for deployment.

---

## 🛠 Prerequisites & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher (or `pnpm` / `bun`)

### Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/satyabratapradhan01/macos-developer-portfolio.git
cd macos-developer-portfolio

# 2. Install dependencies
npm install
```

---

## 📜 Available Scripts

Run commands from the project root directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server at `http://localhost:5173/`. |
| `npm run build` | Compiles TypeScript and builds production SPA output in `dist/`. |
| `npm run preview` | Starts local production preview server serving static files from `dist/`. |
| `npm run lint` | Runs `tsc --noEmit` to verify type safety across all files. |
| `npm run clean` | Removes build artifacts (`dist/`). |

---

## ✍️ Content & Asset Management

### 1. Updating Portfolio Content
All portfolio text, showcase projects, and developer profile info are located in [`src/data/portfolioData.ts`](file:///c:/Users/Vivobook/OneDrive/Desktop/macos-developer-portfolio/src/data/portfolioData.ts):

* **Developer Profile**: Edit `DEVELOPER_PROFILE` (Name, title, bio, CGPA, DSA problem stats, social links).
* **Projects**: Edit `PROJECTS` (Title, tagline, category, tech stack, metrics, GitHub/Live URLs, long description).
* **Skills**: Edit `SKILL_CATEGORIES` (Languages, frameworks, databases, proficiency levels).
* **Education & Achievements**: Edit `EDUCATIONS` and `ACHIEVEMENTS`.

### 2. Replacing the Resume PDF
* Place your updated resume PDF at [`public/files/resume.pdf`](file:///c:/Users/Vivobook/OneDrive/Desktop/macos-developer-portfolio/public/files/resume.pdf).
* Both the Resume app viewer and download links automatically serve this file.

### 3. Adding Local Project Screenshots & Photos
* **Project Screenshots**: Place image files in `public/assets/projects/` (e.g. `public/assets/projects/devpilot.png`) and update the `imageUrl` property in `src/data/portfolioData.ts`:
  ```ts
  coverImageUrl: '/assets/projects/devpilot.png',
  screenshots: [
    { title: 'Overview', caption: 'Live preview', gradient: 'from-blue-600 to-indigo-900', imageUrl: '/assets/projects/devpilot.png' }
  ]
  ```
* **Gallery Photos**: Place photo files in `public/assets/photos/` and set `imageUrl: '/assets/photos/my-photo.jpg'` in `PHOTOS` inside `src/data/portfolioData.ts`.

---

## 🌐 Deploying to Static Hosting Platforms

Because the production output in `dist/` consists purely of static HTML, CSS, JavaScript, and assets, it can be deployed to any static host:

### Vercel
```bash
npm run build
npx vercel --prod
```
* **Framework Preset**: Vite
* **Build Command**: `npm run build`
* **Output Directory**: `dist`

### Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`

### GitHub Pages
1. Push project to GitHub.
2. Go to **Repository Settings** -> **Pages**.
3. Set source to **GitHub Actions** or deployment branch pointed to `dist/`.

---

## 🔒 Security Notice
This static frontend contains zero database connection strings, server environment variables, or secret keys. All content rendered by the app is public portfolio content.
>>>>>>> c7fa7f7 (changes)

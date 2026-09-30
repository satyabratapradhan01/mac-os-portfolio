import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ── One-time cleanup ───────────────────────────────────────────────────────────
// Remove any stale base64 data: URLs that were stored in portfolio_photos by an
// older version of the app. Storing base64 images in localStorage causes a
// QuotaExceededError that crashes the entire React tree.
try {
  const raw = localStorage.getItem('portfolio_photos');
  if (raw) {
    const parsed = JSON.parse(raw);
    const cleaned = parsed.map((p: any) => ({
      ...p,
      imageUrl: typeof p.imageUrl === 'string' && p.imageUrl.startsWith('http') ? p.imageUrl : undefined,
    }));
    localStorage.setItem('portfolio_photos', JSON.stringify(cleaned));
  }
} catch {
  // If parsing or writing fails just clear the key so the app can boot
  try { localStorage.removeItem('portfolio_photos'); } catch {}
}
// ──────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

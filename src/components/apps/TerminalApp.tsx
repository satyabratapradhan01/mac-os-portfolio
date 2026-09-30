import React, { useState, useEffect, useRef } from 'react';
import {
  DEVELOPER_PROFILE,
  SKILL_CATEGORIES,
  EXPERIENCES,
  EDUCATIONS,
  ACHIEVEMENTS
} from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { AppId } from '../../types';

interface TerminalAppProps {
  onOpenApp: (id: AppId) => void;
}

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ onOpenApp }) => {
  const { projects, isLiveDb } = usePortfolio();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [theme, setTheme] = useState<'default' | 'matrix' | 'dracula' | 'cyber'>('default');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    setHistory([
      {
        id: 'welcome',
        command: '',
        output: (
          <div className="space-y-1 text-slate-300">
            <div className="text-emerald-400 font-bold">
              Last login: {new Date().toUTCString()} on ttys001
            </div>
            <div className="text-slate-400 text-xs">
              Welcome to <span className="text-white font-semibold">Satyabrata Pradhan Developer OS (zsh v5.9)</span>.
            </div>
            <div className="text-xs text-blue-300">
              Type <span className="text-amber-400 font-bold">skills</span>, <span className="text-amber-400 font-bold">help</span> or <span className="text-amber-400 font-bold">neofetch</span> to explore my tech stack & resume.
            </div>
          </div>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrixMode]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    sound.playClick();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="text-blue-400 font-bold uppercase tracking-wider">Available Commands:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-mono">
              <div><span className="text-amber-400 font-semibold">neofetch</span> — Show developer & system specs</div>
              <div><span className="text-amber-400 font-semibold">bio</span> — Developer bio & contacts</div>
              <div><span className="text-amber-400 font-semibold">projects</span> — DevPilot, Clothify, Wanderlust</div>
              <div><span className="text-amber-400 font-semibold">skills</span> — Languages, Frontend, Backend, Tools</div>
              <div><span className="text-amber-400 font-semibold">education</span> — B.Tech Centurion Univ & 12th</div>
              <div><span className="text-amber-400 font-semibold">dsa</span> — LeetCode & TakeUForward stats</div>
              <div><span className="text-amber-400 font-semibold">sudo hire-me</span> — Direct contact & message</div>
              <div><span className="text-amber-400 font-semibold">cat &lt;file&gt;</span> — Read files (resume.txt, devpilot.md)</div>
              <div><span className="text-amber-400 font-semibold">matrix</span> — Digital rain visualizer</div>
              <div><span className="text-amber-400 font-semibold">theme &lt;name&gt;</span> — Switch terminal color theme</div>
              <div><span className="text-amber-400 font-semibold">clear</span> — Clear terminal output</div>
              <div><span className="text-amber-400 font-semibold">open &lt;app&gt;</span> — Launch GUI app (resume, vscode, finder)</div>
            </div>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-4 my-2 text-xs font-mono">
            {/* ASCII Apple Logo */}
            <div className="text-emerald-400 select-none font-bold text-[11px] leading-tight">
              <pre>{`
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.
              `}</pre>
            </div>
            {/* Specs */}
            <div className="space-y-1 text-slate-200">
              <div className="text-blue-400 font-bold">satyabrata@macbook-pro-m3</div>
              <div className="text-slate-500">------------------------------</div>
              <div><span className="text-amber-400 font-semibold">Developer:</span> {DEVELOPER_PROFILE.name}</div>
              <div><span className="text-amber-400 font-semibold">Role:</span> {DEVELOPER_PROFILE.title}</div>
              <div><span className="text-amber-400 font-semibold">College:</span> Centurion University (CGPA 8.1)</div>
              <div><span className="text-amber-400 font-semibold">DSA Solved:</span> 355+ (280+ TUF + 75+ LeetCode)</div>
              <div><span className="text-amber-400 font-semibold">Host:</span> {DEVELOPER_PROFILE.systemSpecs.model}</div>
              <div><span className="text-amber-400 font-semibold">OS:</span> {DEVELOPER_PROFILE.systemSpecs.os}</div>
              <div><span className="text-amber-400 font-semibold">Shell:</span> zsh 5.9 (arm64)</div>
              <div><span className="text-amber-400 font-semibold">Memory:</span> {DEVELOPER_PROFILE.systemSpecs.memory}</div>
              <div className="flex gap-1 pt-2">
                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        );
        break;

      case 'bio':
      case 'whoami':
        output = (
          <div className="space-y-2 text-xs text-slate-200 font-sans">
            <div className="font-bold text-sm text-white">{DEVELOPER_PROFILE.name} — {DEVELOPER_PROFILE.title}</div>
            <p className="leading-relaxed text-slate-300">{DEVELOPER_PROFILE.bio}</p>
            <div className="text-blue-400 font-mono">Email: {DEVELOPER_PROFILE.email} | Phone: {DEVELOPER_PROFILE.phone}</div>
            <div className="text-slate-400 font-mono">LinkedIn: {DEVELOPER_PROFILE.linkedin}</div>
            <div className="text-slate-400 font-mono">GitHub: {DEVELOPER_PROFILE.github}</div>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-2 text-xs">
            <div className="text-blue-400 font-bold uppercase">Education Background:</div>
            <div className="space-y-2 font-mono">
              {EDUCATIONS.map((e) => (
                <div key={e.id} className="p-2 bg-white/5 rounded border border-white/10">
                  <div className="text-amber-400 font-bold">{e.degree} — {e.institution}</div>
                  <div className="text-emerald-400 text-[11px]">{e.grade} | {e.period}</div>
                  {e.coursework && (
                    <div className="text-slate-300 text-[10px] mt-1">Coursework: {e.coursework.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'dsa':
      case 'achievements':
        output = (
          <div className="space-y-2 text-xs">
            <div className="text-blue-400 font-bold uppercase">Coding & DSA Milestones:</div>
            <div className="space-y-2 font-mono">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="p-2 bg-white/5 rounded border border-white/10">
                  <div className="text-amber-400 font-bold">🏆 {a.title} ({a.platform})</div>
                  <div className="text-slate-300 text-[11px]">{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-xs">
            <div className="text-blue-400 font-bold uppercase flex items-center justify-between">
              <span>Flagship Engineering Projects ({projects.length}):</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {isLiveDb ? '● MongoDB Atlas Connected' : '● In-Memory Cache'}
              </span>
            </div>
            <div className="space-y-2 font-mono">
              {projects.map((p, idx) => (
                <div key={p.id} className="p-2 bg-white/5 rounded border border-white/10">
                  <div className="text-amber-400 font-bold">{idx + 1}. {p.title}</div>
                  <div className="text-slate-300 text-[11px]">{p.description}</div>
                  <div className="text-emerald-400 text-[10px] mt-1">Stack: {p.techStack.join(', ')}</div>
                  <div className="text-blue-300 text-[10px]">Timeline: {p.year} | Category: {p.category}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'skills':
      case 'tech-stack':
      case 'techstack':
      case 'stack':
      case 'show':
      case 'technologies':
        output = (
          <div className="my-2 space-y-2.5 font-mono text-xs max-w-2xl">
            <div className="text-slate-400 font-bold text-[11px]">
              @satyabrata % show tech stack
            </div>

            <div className="bg-[#161618] border border-slate-800/80 rounded-xl p-4 shadow-lg space-y-2.5">
              {/* Table Header */}
              <div className="grid grid-cols-[140px_1fr] pl-6 text-slate-300 font-bold text-[11px] tracking-wider uppercase">
                <div>Category</div>
                <div>Technologies</div>
              </div>

              <div className="border-b border-dashed border-slate-700/60" />

              {/* Skill Rows */}
              <div className="space-y-2.5 pt-0.5">
                {[
                  { category: 'Frontend', tech: 'React.js, Next.js, HTML5, CSS3, Tailwind CSS' },
                  { category: 'Backend', tech: 'Node.js, Express.js, REST APIs' },
                  { category: 'Languages', tech: 'JavaScript, TypeScript, Python, Java, C/C++' },
                  { category: 'Database', tech: 'MongoDB, MySQL' },
                  { category: 'DevOps & Tools', tech: 'Docker, Kubernetes, Git, GitHub' },
                  { category: 'Realtime', tech: 'WebRTC, WebSockets' },
                  { category: 'Deployment', tech: 'Vercel, Render' },
                  { category: 'State & Extra', tech: 'Redux Toolkit, WebContainers (WASM)' },
                ].map((item) => (
                  <div key={item.category} className="grid grid-cols-[140px_1fr] items-center text-[11.5px]">
                    <div className="flex items-center gap-2 font-semibold text-emerald-400">
                      <span className="text-emerald-400 font-bold text-xs">✓</span>
                      <span>{item.category}</span>
                    </div>
                    <div className="text-slate-200 font-medium leading-relaxed">
                      {item.tech}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-slate-700/60 pt-1" />

              {/* Summary Footer */}
              <div className="pt-1 space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <span>✓</span>
                  <span>8 of 8 stacks loaded successfully (100%)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>⚑</span>
                  <span>Render time: 4ms</span>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-3 text-xs">
            <div className="text-blue-400 font-bold uppercase">Work & Project Experience:</div>
            <div className="space-y-2 font-mono">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="p-2 bg-white/5 rounded border border-white/10">
                  <div className="flex justify-between text-white font-bold">
                    <span>{exp.role} @ {exp.company}</span>
                    <span className="text-slate-400 text-[10px]">{exp.period}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'sudo':
        if (args.join(' ') === 'hire-me' || args.join(' ') === 'hire') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
          sound.playChime();
          output = (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs space-y-1">
              <div className="font-bold text-sm text-white">🎉 Access Granted! Let&apos;s collaborate.</div>
              <div>Satyabrata Pradhan is available for Full-Stack, AI Engineering, and Software Development roles.</div>
              <div className="text-white font-mono mt-1">Direct: satyabratapradhann@gmail.com | +91-9777716441</div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onOpenApp('messages')}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-xs transition-colors"
                >
                  Open Messages App ✉️
                </button>
                <button
                  onClick={() => onOpenApp('resume')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition-colors"
                >
                  View Resume 📄
                </button>
              </div>
            </div>
          );
        } else {
          output = <div className="text-rose-400 text-xs">sudo: Permission denied or unrecognized command. Try `sudo hire-me`</div>;
        }
        break;

      case 'cat':
        const file = (args[0] || '').toLowerCase();
        if (file === 'bio.txt' || file === 'bio') {
          output = <div className="text-xs text-slate-200 whitespace-pre-wrap">{DEVELOPER_PROFILE.bio}</div>;
        } else if (file === 'resume.txt' || file === 'resume.pdf') {
          output = (
            <div className="text-xs text-slate-200">
              Opening resume in Preview...
              <button
                onClick={() => onOpenApp('resume')}
                className="block mt-1 text-blue-400 underline"
              >
                Click here to view Resume in Preview App
              </button>
            </div>
          );
        } else {
          output = <div className="text-rose-400 text-xs">cat: {args[0] || 'file'}: No such file or directory. Try `cat bio.txt` or `cat resume.pdf`</div>;
        }
        break;

      case 'matrix':
        setIsMatrixMode(true);
        output = <div className="text-emerald-400 text-xs font-mono">Initializing Matrix visualizer stream... (Click anywhere to exit)</div>;
        break;

      case 'theme':
        const newTheme = args[0]?.toLowerCase();
        if (newTheme === 'matrix' || newTheme === 'dracula' || newTheme === 'cyber' || newTheme === 'default') {
          setTheme(newTheme as any);
          output = <div className="text-emerald-400 text-xs font-mono">Terminal theme updated to: {newTheme}</div>;
        } else {
          output = <div className="text-amber-400 text-xs">Usage: theme [default | matrix | dracula | cyber]</div>;
        }
        break;

      case 'open':
        const target = args[0]?.toLowerCase();
        if (['finder', 'safari', 'vscode', 'photos', 'notes', 'resume', 'music', 'calculator', 'messages', 'settings'].includes(target)) {
          onOpenApp(target as AppId);
          output = <div className="text-xs text-blue-300">Launching {target}.app...</div>;
        } else {
          output = <div className="text-rose-400 text-xs">open: App not found: {args[0]}</div>;
        }
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'date':
        output = <div className="text-xs text-slate-300 font-mono">{new Date().toString()}</div>;
        break;

      case 'pwd':
        output = <div className="text-xs text-slate-300 font-mono">/Users/satyabrata/portfolio</div>;
        break;

      case 'ls':
        output = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <span className="text-blue-400 font-semibold">📁 Projects/</span>
            <span className="text-blue-400 font-semibold">📁 TechStack/</span>
            <span className="text-blue-400 font-semibold">📁 Notes/</span>
            <span className="text-emerald-400">📄 bio.txt</span>
            <span className="text-rose-400">📄 Satyabrata_Resume.pdf</span>
            <span className="text-amber-400">⚙️ devpilot_cli.sh</span>
          </div>
        );
        break;

      default:
        output = (
          <div className="text-rose-400 text-xs font-mono">
            zsh: command not found: {mainCmd}. Type <span className="text-amber-400 font-bold">help</span> to view available commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isMatrixMode) {
      setIsMatrixMode(false);
      return;
    }

    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Determine terminal container styling by theme
  const getThemeClasses = () => {
    switch (theme) {
      case 'matrix':
        return 'bg-black text-emerald-400 font-mono';
      case 'dracula':
        return 'bg-[#282a36] text-[#f8f8f2] font-mono';
      case 'cyber':
        return 'bg-[#0f172a] text-[#38bdf8] font-mono';
      default:
        return 'bg-slate-950 text-slate-100 font-mono';
    }
  };

  return (
    <div
      id="terminal-app"
      onClick={handleFocus}
      className={`h-full flex flex-col p-4 overflow-y-auto ${getThemeClasses()} text-sm select-text cursor-text`}
    >
      {isMatrixMode ? (
        <div
          onClick={() => setIsMatrixMode(false)}
          className="flex-1 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer"
        >
          <div className="text-emerald-400 font-mono text-xs animate-pulse">
            [ MATRIX RAIN STREAM ACTIVE — CLICK ANYWHERE TO DISENGAGE ]
          </div>
          <div className="font-mono text-emerald-500 text-sm opacity-80 leading-relaxed max-w-lg">
            01010011 01100001 01110100 01111001 01100001 01100010 01110010 01100001 01110100 01100001<br />
            &gt;&gt; WebContainers WASM Node.js runtime boot: OK<br />
            &gt;&gt; Gemini 2.5 Flash stream parser: ACTIVE<br />
            &gt;&gt; LeetCode & TUF Solved: 355+ Verified
          </div>
        </div>
      ) : (
        <>
          {/* History stream */}
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.command && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-bold">satyabrata@macbook-pro</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-slate-400">%</span>
                    <span className="text-white font-medium">{item.command}</span>
                  </div>
                )}
                {item.output && <div className="pl-0">{item.output}</div>}
              </div>
            ))}
          </div>

          {/* Active Input Line */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-bold">satyabrata@macbook-pro</span>
            <span className="text-blue-400">~</span>
            <span className="text-slate-400">%</span>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs caret-emerald-400"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

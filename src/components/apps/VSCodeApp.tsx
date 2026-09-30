import React, { useState } from 'react';
import { sound } from '../../utils/sound';
import {
  FileCode,
  Search,
  GitBranch,
  Play,
  Settings,
  ChevronDown,
  Check
} from 'lucide-react';

interface CodeFile {
  name: string;
  language: string;
  code: string;
  icon: string;
}

const CODE_FILES: Record<string, CodeFile> = {
  'devpilot_webcontainer.ts': {
    name: 'devpilot_webcontainer.ts',
    language: 'TypeScript',
    icon: 'ts',
    code: `import { WebContainer } from '@webcontainer/api';
import { GoogleGenAI } from '@google/genai';

/**
 * DevPilot In-Browser WebContainer & Gemini 2.5 Flash Orchestration
 * Author: Satyabrata Pradhan
 */
export class DevPilotRuntimeEngine {
  private webcontainer!: WebContainer;
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  public async initialize(): Promise<void> {
    // Boot in-browser WASM POSIX Node.js runtime
    this.webcontainer = await WebContainer.boot();
    console.log('[DevPilot] WebContainer WASM runtime booted with 0 backend servers');
  }

  /**
   * Stream LLM response, parse custom XML file artifacts, and mount directly to virtual file tree
   */
  public async generateAndMountProject(userPrompt: string): Promise<string> {
    const responseStream = await this.ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: 'You are DevPilot AI. Output file trees in structured <boltAction type="file" filePath="..."> XML blocks.',
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      this.parseAndMountChunk(text);
    }

    // Spawn npm install and dev server inside browser tab
    const installProcess = await this.webcontainer.spawn('npm', ['install']);
    await installProcess.exit;

    await this.webcontainer.spawn('npm', ['run', 'dev']);

    return new Promise((resolve) => {
      this.webcontainer.on('server-ready', (port, url) => {
        console.log(\`[DevPilot] Live Preview ready on port \${port}: \${url}\`);
        resolve(url);
      });
    });
  }

  private parseAndMountChunk(chunk: string): void {
    // Incremental XML artifact tokenizer & file tree updater
  }
}`
  },
  'clothify_stripe_order.ts': {
    name: 'clothify_stripe_order.ts',
    language: 'TypeScript',
    icon: 'ts',
    code: `import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticateUser, authorizeRole } from '../middlewares/auth';
import { OrderModel } from '../models/Order';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });

/**
 * Clothify - Full-Stack Clothing E-Commerce Checkout Pipeline
 * Author: Satyabrata Pradhan
 */
router.post('/create-checkout', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = (req as any).user.id;

    // Create persistent Order in MongoDB with pending status
    const order = await OrderModel.create({
      userId,
      items,
      shippingAddress,
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name, images: [item.imageUrl] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: order._id.toString(),
      success_url: \`\${process.env.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${process.env.CLIENT_URL}/cart\`,
    });

    res.status(200).json({ success: true, url: session.url, orderId: order._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;`
  },
  'dsa_tuf_patterns.cpp': {
    name: 'dsa_tuf_patterns.cpp',
    language: 'C++',
    icon: 'cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

/**
 * TakeUForward & LeetCode Algorithmic Mastery Patterns
 * Author: Satyabrata Pradhan (355+ Problems Solved)
 */

class AlgorithmicEngine {
public:
    // Dynamic Programming: Longest Increasing Subsequence in O(N log N)
    int lengthOfLIS(std::vector<int>& nums) {
        std::vector<int> tails;
        for (int x : nums) {
            auto it = std::lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) {
                tails.push_back(x);
            } else {
                *it = x;
            }
        }
        return tails.size();
    }

    // Graph: Topological Sort using Kahn's Algorithm (BFS)
    std::vector<int> topoSort(int V, std::vector<int> adj[]) {
        std::vector<int> inDegree(V, 0);
        for (int i = 0; i < V; i++) {
            for (auto node : adj[i]) {
                inDegree[node]++;
            }
        }

        std::queue<int> q;
        for (int i = 0; i < V; i++) {
            if (inDegree[i] == 0) q.push(i);
        }

        std::vector<int> topo;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            topo.push_back(node);

            for (auto neighbor : adj[node]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return topo;
    }
};`
  },
  'README.md': {
    name: 'README.md',
    language: 'Markdown',
    icon: 'md',
    code: `# Satyabrata Pradhan — Full-Stack & AI Systems Developer

- **Email**: satyabratapradhann@gmail.com
- **Phone**: +91-9777716441
- **LinkedIn**: [linkedin.com/in/satyabratapradhann](https://linkedin.com/in/satyabratapradhann)
- **GitHub**: [github.com/satyabratapradhan01](https://github.com/satyabratapradhan01)

## Education:
- **Centurion University**: B.Tech in Computer Science (2022 – 2026), CGPA: 8.1/10
- **Academia International H S School of Science**: Class 12th (2019 – 2021), 62%

## Core Projects:
1. **DevPilot**: AI-powered web builder with Gemini 2.5 Flash, LLaMA 3.3, and in-browser WASM WebContainers.
2. **Clothify**: Full-stack e-commerce with Stripe, JWT auth, and Redux Toolkit.
3. **Wanderlust**: Hotel discovery & booking platform with MongoDB and Express CRUD.

## Algorithmic Milestones:
- **280+ Problems Solved** on TakeUForward (TUF)
- **75+ Problems Solved** on LeetCode
`
  }
};

export const VSCodeApp: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('devpilot_webcontainer.ts');
  const [isExplorerOpen] = useState(true);

  const file = CODE_FILES[selectedFile] || CODE_FILES['devpilot_webcontainer.ts'];
  const lines = file.code.split('\n');

  return (
    <div id="vscode-app" className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono select-none overflow-hidden text-xs">
      {/* Main Workbench Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-3 gap-5 shrink-0 border-r border-[#252526]">
          <button className="text-white hover:text-white transition-colors" title="Explorer">
            <FileCode className="w-5 h-5 text-blue-400" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors" title="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors" title="Source Control">
            <GitBranch className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors" title="Run and Debug">
            <Play className="w-5 h-5" />
          </button>
          <div className="mt-auto">
            <button className="text-slate-400 hover:text-white" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar File Explorer */}
        {isExplorerOpen && (
          <div className="w-60 bg-[#252526] border-r border-[#191919] flex flex-col shrink-0">
            <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#191919] flex items-center justify-between">
              <span>EXPLORER</span>
              <span className="text-[10px] text-blue-400">SATYABRATA-WORKSPACE</span>
            </div>

            <div className="p-2 space-y-1 overflow-y-auto">
              <div className="flex items-center gap-1.5 px-2 py-1 text-slate-300 font-semibold text-xs">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>src / core-projects</span>
              </div>

              <div className="pl-4 space-y-0.5">
                {Object.keys(CODE_FILES).map((fileName) => {
                  const isSelected = selectedFile === fileName;
                  return (
                    <button
                      key={fileName}
                      onClick={() => {
                        sound.playClick();
                        setSelectedFile(fileName);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors ${
                        isSelected ? 'bg-[#37373d] text-white font-medium' : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 ${
                        fileName.endsWith('.ts') ? 'text-blue-400' : fileName.endsWith('.cpp') ? 'text-amber-500' : 'text-rose-400'
                      }`} />
                      <span className="truncate">{fileName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Open Tabs */}
          <div className="bg-[#252526] flex items-center overflow-x-auto border-b border-[#191919] shrink-0">
            {Object.keys(CODE_FILES).map((fileName) => {
              const isSelected = selectedFile === fileName;
              return (
                <div
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`flex items-center gap-2 px-3 py-1.5 border-r border-[#191919] cursor-pointer text-xs ${
                    isSelected ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'text-slate-400 hover:bg-[#2a2d2e]'
                  }`}
                >
                  <span>{fileName}</span>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="px-4 py-1 bg-[#1e1e1e] text-[11px] text-slate-500 border-b border-[#2d2d2d] flex items-center gap-1.5">
            <span>satyabrata-portfolio</span>
            <span>&gt;</span>
            <span>src</span>
            <span>&gt;</span>
            <span className="text-slate-300 font-medium">{selectedFile}</span>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs select-text flex">
            {/* Line numbers */}
            <div className="pr-4 select-none text-slate-600 text-right font-mono space-y-0.5">
              {lines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Code Lines */}
            <div className="flex-1 overflow-x-auto text-[#9cdcfe] space-y-0.5">
              {lines.map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  {line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') ? (
                    <span className="text-[#6a9955] italic">{line}</span>
                  ) : line.startsWith('import') || line.startsWith('export') || line.startsWith('#include') || line.startsWith('using') ? (
                    <span className="text-[#c586c0] font-semibold">{line}</span>
                  ) : line.includes('class') || line.includes('interface') ? (
                    <span className="text-[#4ec9b0] font-semibold">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[11px] font-sans shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> main*
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" /> 0 errors, 0 warnings
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>{file.language}</span>
          <span>Prettier ✓</span>
        </div>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { DEVELOPER_PROFILE } from '../../data/portfolioData';
import {
  Mail,
  Phone,
  Linkedin,
  Github
} from 'lucide-react';

export const ResumeApp: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="resume-app"
      className="relative flex flex-col h-full w-full bg-white text-slate-900 font-sans select-text overflow-hidden text-xs"
    >
      {/* Main Document Viewer Canvas Area */}
      <div
        ref={scrollContainerRef}
        className="react-pdf__Document resume-pdf flex-1 overflow-y-auto bg-white flex justify-center select-text min-h-0 relative text-slate-900 scroll-smooth"
      >
        {/* SATYABRATA PRADHAN PDF CANVAS */}
        <div
          className="react-pdf__Page bg-white text-slate-900 w-full max-w-4xl p-6 sm:p-8 md:p-10 pb-16 font-sans relative text-[11.5px] leading-relaxed space-y-5"
          data-page-number="1"
        >
          {/* Header: Candidate Name & Links */}
          <div className="text-center space-y-1.5 pb-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a2e5a] uppercase font-serif">
              SATYABRATA PRADHAN
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-slate-700">
              <a
                href={`mailto:${DEVELOPER_PROFILE.email}`}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-3 h-3 text-[#1a2e5a]" />
                <span>{DEVELOPER_PROFILE.email}</span>
              </a>
              <span className="text-slate-400">•</span>
              <a
                href={`tel:${DEVELOPER_PROFILE.phone}`}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3 h-3 text-[#1a2e5a]" />
                <span>{DEVELOPER_PROFILE.phone}</span>
              </a>
              <span className="text-slate-400">•</span>
              <a
                href={DEVELOPER_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-3 h-3 text-[#1a2e5a]" />
                <span>satyabratapradhan</span>
              </a>
              <span className="text-slate-400">•</span>
              <a
                href={DEVELOPER_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Github className="w-3 h-3 text-[#1a2e5a]" />
                <span>satyabratapradhan01</span>
              </a>
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          <div>
            <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-[#1a2e5a] border-b border-[#1a2e5a] pb-0.5 mb-1.5 font-serif">
              EDUCATION
            </h2>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Bachelor of Technology in Computer Science</span>
                  <span className="text-[10px] text-slate-600 font-medium">Aug 2022 – May 2026</span>
                </div>
                <div className="italic text-slate-700 text-[10.5px]">Centurion University</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 ml-1 mt-0.5">
                  <li>CGPA: 8.1/10</li>
                  <li>
                    <span className="font-medium">Relevant Coursework:</span> Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Web Development
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Class 12th</span>
                  <span className="text-[10px] text-slate-600 font-medium">Aug 2019 – Sep 2021</span>
                </div>
                <div className="italic text-slate-700 text-[10.5px]">Academia International H S School Of Science</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 ml-1 mt-0.5">
                  <li>Percentage: 62%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION: ACHIEVEMENTS */}
          <div>
            <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-[#1a2e5a] border-b border-[#1a2e5a] pb-0.5 mb-1.5 font-serif">
              ACHIEVEMENTS
            </h2>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800 ml-1">
              <li>Solved 150+ DSA problems on LeetCode.</li>
              <li>Solved 300+ coding problems on TakeUForward (TUF).</li>
            </ul>
          </div>

          {/* SECTION: PROJECTS */}
          <div>
            <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-[#1a2e5a] border-b border-[#1a2e5a] pb-0.5 mb-1.5 font-serif">
              PROJECTS
            </h2>
            <div className="space-y-3">
              {/* DevPilot */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[11.5px]">DevPilot – AI-Powered Web App Builder</span>
                  <span className="text-[10px] text-slate-600 font-medium">May 2026 – Jul 2026</span>
                </div>
                <div className="italic text-slate-600 text-[10px] mb-1">
                  React.js, Node.js, TypeScript, MongoDB, WebContainers, Google Gemini AI
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[10.5px] leading-snug">
                  <li>Built a full-stack AI-powered application builder that converts natural-language prompts into complete, production-ready React and Node.js projects with live in-browser preview.</li>
                  <li>Integrated Google Gemini 2.5 Flash as the primary LLM with Groq LLaMA 3.3 70B as automatic fallback, implementing a resilient AI routing layer that handles rate-limits and errors transparently.</li>
                  <li>Engineered an in-browser Node.js runtime using the WebContainers API (WASM-based) to install dependencies, run dev servers, and render live previews — all without any backend infrastructure.</li>
                  <li>Developed a custom XML parser to extract file artifacts and shell commands from AI responses, dynamically building a virtual file tree and mounting it into the WebContainer in real time.</li>
                  <li>Built a VS Code–grade in-browser code editor using Monaco Editor with syntax highlighting, file explorer navigation, and language auto-detection for 8+ file types.</li>
                  <li>Implemented secure authentication with JWT, bcrypt password hashing, and OTP-based password recovery via Nodemailer, with MongoDB for user and session management.</li>
                </ul>
              </div>

              {/* Job Application Tracker */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[11.5px]">Job Application Tracker</span>
                  <span className="text-[10px] text-slate-600 font-medium">Nov 2025 – Feb 2026</span>
                </div>
                <div className="italic text-slate-600 text-[10px] mb-1">
                  React.js, Node.js, Express.js, MongoDB, JWT
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[10.5px] leading-snug">
                  <li>Built a full-stack job application tracking platform that helps users organize, monitor, and manage their job search pipeline end-to-end.</li>
                  <li>Designed MongoDB schemas to model applications, companies, and status stages, and architected a RESTful API layer using Node.js and Express.js for CRUD operations across applications, notes, and status tracking.</li>
                  <li>Implemented secure JWT-based authentication and authorization to manage user sessions and protect personal application data.</li>
                  <li>Developed a responsive React.js frontend with a structured component hierarchy for dashboards, application lists, and detail views, deployed on a free-tier stack — Vercel, Render, and MongoDB Atlas.</li>
                </ul>
              </div>

              {/* Clothify */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[11.5px]">Clothify</span>
                  <span className="text-[10px] text-slate-600 font-medium">Jul 2025 – Aug 2025</span>
                </div>
                <div className="italic text-slate-600 text-[10px] mb-1">
                  React.js, Node.js, Express.js, MongoDB, Stripe, Cloudinary
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[10.5px] leading-snug">
                  <li>Developed a full-stack e-commerce platform with separate user and admin dashboards for product and order management.</li>
                  <li>Implemented JWT-based authentication, secure session handling, and role-based access control.</li>
                  <li>Built shopping cart and order management functionalities with product size and quantity selection features.</li>
                  <li>Integrated Stripe payment gateway and Cash on Delivery support for secure online transactions.</li>
                  <li>Developed RESTful APIs using Node.js, Express.js, and MongoDB with Cloudinary integration for image uploads.</li>
                </ul>
              </div>

              {/* Wanderlust */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[11.5px]">Wanderlust</span>
                  <span className="text-[10px] text-slate-600 font-medium">Jan 2025 – Feb 2025</span>
                </div>
                <div className="italic text-slate-600 text-[10px] mb-1">
                  Node.js, Express.js, MongoDB, EJS
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[10.5px] leading-snug">
                  <li>Built a hotel listing platform with authentication and CRUD operations.</li>
                  <li>Enabled users to create, update, delete, and explore accommodation listings.</li>
                  <li>Added review and rating functionality for user feedback and listing management.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION: TECHNICAL SKILLS */}
          <div>
            <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-[#1a2e5a] border-b border-[#1a2e5a] pb-0.5 mb-1.5 font-serif">
              TECHNICAL SKILLS
            </h2>
            <div className="space-y-0.5 text-[10.5px] text-slate-900 leading-relaxed">
              <div><span className="font-bold">Languages:</span> JavaScript, TypeScript, Python, Java, C/C++</div>
              <div><span className="font-bold">Frontend:</span> React.js, Next.js, HTML, CSS, Tailwind CSS</div>
              <div><span className="font-bold">Backend:</span> Node.js, Express.js, REST APIs</div>
              <div><span className="font-bold">Databases:</span> MongoDB, MySQL</div>
              <div><span className="font-bold">DevOps & Tools:</span> Docker, Kubernetes, Git, GitHub, CI/CD, AWS</div>
              <div><span className="font-bold">Other:</span> WebRTC, WebSockets, Redux Toolkit</div>
              <div><span className="font-bold">Deployment:</span> Vercel, Render</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

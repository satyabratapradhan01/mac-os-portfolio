import React from 'react';
import { DEVELOPER_PROFILE } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import {
  Github,
  Linkedin,
  Globe,
  Twitter
} from 'lucide-react';

export const MessagesApp: React.FC = () => {
  const handleOpenLink = (url: string) => {
    sound.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="contact-app"
      className="flex flex-col h-full w-full bg-white text-slate-900 font-sans select-text overflow-y-auto p-6 sm:p-8 md:p-10 justify-center"
    >
      <div className="max-w-3xl w-full mx-auto">
        {/* Avatar */}
        <div className="mb-5">
          <img
            src={DEVELOPER_PROFILE.avatar}
            alt={DEVELOPER_PROFILE.name}
            className="w-20 h-20 rounded-full object-cover shadow-md border border-slate-200"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Let's Connect
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed max-w-xl">
          Got an idea? A bug to squash? Or just wanna talk tech? I'm in.
        </p>

        {/* Grid of 4 Color Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Github */}
          <button
            onClick={() => handleOpenLink(DEVELOPER_PROFILE.github)}
            className="bg-[#e56b6f] hover:bg-[#de5b5f] text-white p-5 rounded-2xl flex flex-col justify-between h-32 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent focus:outline-none"
          >
            <Github className="w-6 h-6 text-white stroke-[2]" />
            <span className="font-bold text-sm tracking-wide text-white">Github</span>
          </button>

          {/* Card 2: Platform */}
          <button
            onClick={() => handleOpenLink(DEVELOPER_PROFILE.takeuforward)}
            className="bg-[#60c269] hover:bg-[#53b85c] text-white p-5 rounded-2xl flex flex-col justify-between h-32 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent focus:outline-none"
          >
            <Globe className="w-6 h-6 text-white stroke-[2]" />
            <span className="font-bold text-sm tracking-wide text-white">Platform</span>
          </button>

          {/* Card 3: Twitter/X */}
          <button
            onClick={() => handleOpenLink('https://x.com')}
            className="bg-[#f08a6e] hover:bg-[#e77c5f] text-white p-5 rounded-2xl flex flex-col justify-between h-32 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent focus:outline-none"
          >
            <Twitter className="w-6 h-6 text-white stroke-[2]" />
            <span className="font-bold text-sm tracking-wide text-white">Twitter/X</span>
          </button>

          {/* Card 4: LinkedIn */}
          <button
            onClick={() => handleOpenLink(DEVELOPER_PROFILE.linkedin)}
            className="bg-[#4db5f0] hover:bg-[#3ba7e5] text-white p-5 rounded-2xl flex flex-col justify-between h-32 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer border border-transparent focus:outline-none"
          >
            <Linkedin className="w-6 h-6 text-white stroke-[2]" />
            <span className="font-bold text-sm tracking-wide text-white">LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

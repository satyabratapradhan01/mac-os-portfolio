import React from 'react';

interface WallpaperBackgroundProps {
  wallpaperId: string;
  customWallpaperUrl?: string | null;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  wallpaperId,
  customWallpaperUrl,
}) => {
  const activeImage = customWallpaperUrl || (wallpaperId === 'macos-fluid-wave' ? '/assets/wallpapers/macos-blue-wave.png' : null);

  // If wallpaper image is available (uploaded or stored blue wave image)
  if (activeImage) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <img
          src={activeImage}
          alt="Desktop Wallpaper"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Exact reproduction of the uploaded macOS Fluid Azure Silk Wave Wallpaper
  if (wallpaperId === 'macos-fluid-wave' || wallpaperId === 'sequoia-sunset') {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Sky Gradient: Warm golden horizon transitioning to soft morning blue */}
            <linearGradient id="bgSky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="25%" stopColor="#e2e8f0" />
              <stop offset="45%" stopColor="#fef08a" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            {/* Left Out-of-Focus Azure Hill Gradient */}
            <linearGradient id="leftHillGrad" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Main Fluid Wave Front Face - Rich cobalt to sapphire silk */}
            <linearGradient id="mainSilkGrad" x1="0.1" y1="0.1" x2="0.85" y2="0.95">
              <stop offset="0%" stopColor="#0062e6" />
              <stop offset="25%" stopColor="#0052cc" />
              <stop offset="50%" stopColor="#0043a8" />
              <stop offset="75%" stopColor="#002d80" />
              <stop offset="100%" stopColor="#001a4d" />
            </linearGradient>

            {/* Translucent Upper Silk Curvature & Iridescent Edge (Above the sharp crest) */}
            <linearGradient id="translucentFoldGrad" x1="0.2" y1="0.8" x2="0.8" y2="0.1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#a7f3d0" stopOpacity="0.65" />
              <stop offset="90%" stopColor="#67e8f9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>

            {/* Center Fluid Swell / Crease Shadow Gradient */}
            <linearGradient id="creaseShadowGrad" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stopColor="#002d80" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00184d" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0043a8" stopOpacity="0.1" />
            </linearGradient>

            {/* Razor-sharp White Specular Line */}
            <linearGradient id="sharpEdgeGleam" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="85%" stopColor="#bae6fd" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Bottom Right Frost Overlay Slope */}
            <linearGradient id="frostSlopeGrad" x1="0.3" y1="0.3" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.95" />
            </linearGradient>

            {/* Depth & Soft Gaussian Blur Filters */}
            <filter id="softHillBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="35" />
            </filter>

            <filter id="frostBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="25" />
            </filter>

            <filter id="glowBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop Shadow for the Main Upper Wave Ribbon */}
            <filter id="waveDepthShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="-8" dy="12" stdDeviation="22" floodColor="#001538" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. Sky Background */}
          <rect width="1920" height="1080" fill="url(#bgSky)" />

          {/* 2. Soft Ambient Sunlight Flare (Top Left) */}
          <circle cx="350" cy="320" r="480" fill="#fef08a" opacity="0.35" filter="url(#softHillBlur)" />

          {/* 3. Left Midground Blurred Azure Hill */}
          <path
            d="M-100,680 C50,450 250,420 450,560 C650,700 800,880 900,1100 L-100,1100 Z"
            fill="url(#leftHillGrad)"
            filter="url(#softHillBlur)"
            opacity="0.85"
          />

          {/* 4. Translucent Upper Silk Ribbon Back-fold */}
          <path
            d="M-50,880 C320,620 700,380 1100,190 C1400,60 1700,20 1980,-20 L1980,380 C1550,420 1100,620 700,820 C350,970 100,1050 -50,1100 Z"
            fill="url(#translucentFoldGrad)"
            opacity="0.95"
          />

          {/* Subtle vertical silk caustics / ripples on the upper translucent fold */}
          <g opacity="0.25">
            <path d="M1200,150 C1250,220 1300,300 1350,380" stroke="#ffffff" strokeWidth="6" filter="url(#glowBloom)" />
            <path d="M1380,100 C1430,170 1480,240 1520,310" stroke="#ffffff" strokeWidth="8" filter="url(#glowBloom)" />
            <path d="M1520,60 C1570,120 1620,180 1650,250" stroke="#ffffff" strokeWidth="10" filter="url(#glowBloom)" />
            <path d="M1680,25 C1720,80 1770,130 1800,200" stroke="#ffffff" strokeWidth="6" filter="url(#glowBloom)" />
          </g>

          {/* 5. Main Foreground Electric Cobalt Silk Body */}
          <path
            d="M-10,885 C280,680 620,490 980,340 C1320,200 1620,100 1950,-30 L1950,1120 L-10,1120 Z"
            fill="url(#mainSilkGrad)"
            filter="url(#waveDepthShadow)"
          />

          {/* 6. Diagonal Crease / Deep Shadow Valley Inside The Wave */}
          <path
            d="M-10,890 C320,780 700,680 1050,550 C1450,400 1750,300 1950,220 L1950,750 C1650,850 1200,980 700,1050 L-10,1050 Z"
            fill="url(#creaseShadowGrad)"
            opacity="0.8"
          />

          {/* 7. The Signature Razor-Sharp White Glowing Crest Edge */}
          <path
            d="M-10,885 C280,680 620,490 980,340 C1320,200 1620,100 1950,-30"
            stroke="url(#sharpEdgeGleam)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#glowBloom)"
          />

          {/* Secondary Subtler Refraction Edge Line Above Main Crest */}
          <path
            d="M-10,882 C280,676 620,486 980,336 C1320,196 1620,96 1950,-34"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.2"
          />

          {/* 8. Bottom Left Soft Bokeh Glow */}
          <circle cx="200" cy="980" r="260" fill="#e0f2fe" opacity="0.45" filter="url(#softHillBlur)" />

          {/* 9. Bottom Right Frost Slope / Foreground Out-of-Focus Elevation */}
          <path
            d="M1380,1150 C1480,950 1650,750 1980,500 L2050,1150 Z"
            fill="url(#frostSlopeGrad)"
            filter="url(#frostBlur)"
            opacity="0.9"
          />
        </svg>

        {/* Ambient Screen Light Blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 via-transparent to-black/5 pointer-events-none" />
      </div>
    );
  }

  return null;
};

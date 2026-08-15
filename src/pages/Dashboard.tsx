export default function Dashboard() {
  return (
    <main className="flex-1 p-4 md:p-8 lg:p-container-padding-desktop pb-24 md:pb-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-on-surface tracking-tight">
          Good Morning, Admin <span className="inline-block animate-bounce origin-bottom">👋</span>
        </h2>
        <p className="font-body-md text-body-md md:font-body-lg md:text-body-lg text-on-surface-variant max-w-2xl">
          Here is today's environmental intelligence for your city.
        </p>
      </div>

      {/* KPI BENTO GRID */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap">
        {/* KPI 1: Current AQI */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">air</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Current AQI</span>
            </div>
            <div className="px-2 py-1 bg-tertiary/20 text-tertiary rounded font-label-sm text-label-sm border border-tertiary/30">
              Unhealthy
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface font-bold">142</span>
            <span className="font-body-md text-body-md text-tertiary flex items-center">
              <span className="material-symbols-outlined text-sm">warning</span>
            </span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-auto relative z-10">
            <div className="h-full bg-tertiary w-[60%] rounded-full"></div>
          </div>
        </div>

        {/* KPI 2: Predicted AQI */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group border border-error/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">online_prediction</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Predicted AQI</span>
            </div>
            <div className="px-2 py-1 bg-error/20 text-error rounded font-label-sm text-label-sm border border-error/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span> 12h
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-error font-bold">176</span>
            <span className="font-body-md text-body-md text-error flex items-center font-medium">
              +24%
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant relative z-10 mt-auto">Warning threshold approaching</p>
        </div>

        {/* KPI 3: High-Risk Zones */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">location_city</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">High-Risk Zones</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface font-bold">7</span>
            <span className="font-body-md text-body-md text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">add</span>3 New
            </span>
          </div>
          <div className="mt-auto relative z-10 flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-[10px] text-on-surface z-30">N1</div>
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-[10px] text-on-surface z-20">S4</div>
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-[10px] text-on-surface z-10">+5</div>
          </div>
        </div>

        {/* KPI 4: AI Confidence */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">AI Confidence</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-secondary font-bold">91<span className="text-2xl">%</span></span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-auto relative z-10 flex">
            <div className="h-full bg-secondary w-[91%] rounded-full shadow-[0_0_10px_rgba(109,221,129,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* MAIN DATA & INSIGHTS GRID */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
        {/* Large Chart Card */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface">24-Hour AI Pollution Forecast</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary border border-tertiary border-dashed bg-opacity-20"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Predicted</span>
              </div>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="relative w-full h-[300px] mt-4 rounded-lg border border-outline-variant/10 bg-surface-container-low/50 overflow-hidden">
            {/* Simulated Chart Grid */}
            <div className="absolute inset-0 flex flex-col justify-between py-8 px-12 pointer-events-none">
              <div className="border-b border-outline-variant/20 w-full h-0 relative">
                <span className="absolute -left-8 -top-2 font-label-sm text-label-sm text-on-surface-variant text-[10px]">200</span>
              </div>
              <div className="border-b border-tertiary/30 w-full h-0 relative border-dashed">
                <span className="absolute -left-8 -top-2 font-label-sm text-label-sm text-tertiary text-[10px]">150</span>
                <span className="absolute right-4 -top-6 text-[10px] text-tertiary bg-tertiary/10 px-2 py-1 rounded font-medium">Warning Threshold</span>
              </div>
              <div className="border-b border-outline-variant/20 w-full h-0 relative">
                <span className="absolute -left-8 -top-2 font-label-sm text-label-sm text-on-surface-variant text-[10px]">100</span>
              </div>
              <div className="border-b border-outline-variant/20 w-full h-0 relative">
                <span className="absolute -left-8 -top-2 font-label-sm text-label-sm text-on-surface-variant text-[10px]">50</span>
              </div>
            </div>
            
            {/* X-Axis Labels */}
            <div className="absolute bottom-2 left-12 right-12 flex justify-between font-label-sm text-label-sm text-on-surface-variant text-[10px]">
              <span>12 AM</span>
              <span>4 AM</span>
              <span>8 AM</span>
              <span>12 PM</span>
              <span>4 PM</span>
              <span>8 PM</span>
            </div>
            
            {/* SVG Lines Simulation */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="primaryGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#adc6ff" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient id="warningGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.4"></stop>
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M50,250 L50,180 C 150,170 200,220 300,190 C 350,175 380,160 400,160 L400,250 Z" fill="url(#primaryGrad)"></path>
              <path d="M50,180 C 150,170 200,220 300,190 C 350,175 380,160 400,160" fill="none" stroke="#adc6ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              <path d="M400,250 L400,160 C 450,160 480,50 550,60 C 600,70 620,150 650,180 L650,250 Z" fill="url(#warningGrad)"></path>
              <path d="M400,160 C 450,160 480,50 550,60 C 600,70 620,150 650,180 C 750,220 850,200 950,210" fill="none" stroke="#fbbc05" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              
              <g transform="translate(470, 30)">
                <rect fill="#191f2f" height="28" opacity="0.9" rx="4" stroke="#ffb4ab" strokeWidth="1" width="160" x="0" y="0"></rect>
                <text fill="#ffb4ab" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.5" x="10" y="18">⚠️ Predicted Pollution Spike</text>
                <path d="M80,28 L85,35 L90,28 Z" fill="#191f2f" stroke="#ffb4ab" strokeWidth="1"></path>
              </g>
              
              <line stroke="#c2c6d5" strokeDasharray="2 4" strokeWidth="1" x1="400" x2="400" y1="20" y2="280"></line>
              <circle cx="400" cy="160" fill="#0d1322" r="5" stroke="#adc6ff" strokeWidth="2"></circle>
            </svg>
          </div>
        </div>

        {/* Prominent AI Insight Card */}
        <div className="lg:col-span-1 bg-surface-container/80 backdrop-blur-3xl border border-primary/30 rounded-xl p-6 flex flex-col gap-6 ai-glow relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 relative">
              <span className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20"></span>
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-primary font-semibold">Gemini AI Insight</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px] text-secondary">verified</span>
                91% Confidence Match
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="bg-surface-container-lowest/50 rounded-lg p-4 border border-outline-variant/10 h-full">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <strong className="text-error font-medium">AQI is predicted to increase tomorrow morning.</strong> The model identifies increased heavy traffic activity scheduled along the Northern Corridor (Zone N1) combined with a thermal inversion weather pattern starting at 06:00 AM.
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-surface-variant rounded text-xs text-on-surface-variant font-medium">Weather Anomaly</span>
                <span className="px-2 py-1 bg-surface-variant rounded text-xs text-on-surface-variant font-medium">Traffic Density</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 relative z-10 mt-auto">
            <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-label-sm py-3 px-4 rounded-lg shadow-[0_4px_14px_rgba(77,142,254,0.4)] transition-all flex items-center justify-center gap-2 group">
              <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">forum</span>
              Ask Gemini
            </button>
            <button className="w-full bg-transparent hover:bg-surface-variant/50 text-on-surface border border-outline-variant/50 font-label-sm text-label-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">visibility</span>
              View Explanation
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

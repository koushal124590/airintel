export default function PollutionMap() {
  const zones = [
    { id: 'N1', name: 'Northern Industrial', aqi: 186, status: 'Severe', trend: 'up', risk: 'High' },
    { id: 'S4', name: 'South Residential', aqi: 142, status: 'Unhealthy', trend: 'up', risk: 'Medium' },
    { id: 'C2', name: 'Central Business District', aqi: 85, status: 'Moderate', trend: 'flat', risk: 'Low' },
    { id: 'E1', name: 'Eastern Tech Park', aqi: 62, status: 'Moderate', trend: 'down', risk: 'Low' },
    { id: 'W3', name: 'West Suburbs', aqi: 45, status: 'Good', trend: 'flat', risk: 'Minimal' },
  ];

  return (
    <div className="p-container-padding-mobile md:p-container-padding-desktop flex-1 space-y-gutter max-w-7xl mx-auto w-full pb-20 md:pb-0 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Pollution Map</h2>
          <p className="font-title-md text-title-md text-on-surface-variant mt-2">Real-time neighborhood risk assessment.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-primary">filter_list</span>
            <span className="font-label-sm text-label-sm">Filters</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer bg-primary/10 border-primary/30">
            <span className="material-symbols-outlined text-[18px] text-primary">layers</span>
            <span className="font-label-sm text-label-sm text-primary">AQI Overlay</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-card-gap flex-1 min-h-[500px]">
        {/* Map Area */}
        <div className="glass-panel rounded-xl flex-1 relative overflow-hidden group">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-surface-container-low/50" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(140, 144, 159, 0.1) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>
          
          {/* Faux Map Elements */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-3xl max-h-3xl border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest/30 backdrop-blur-sm">
               {/* Decorative map lines */}
               <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                 <path d="M 10 200 Q 150 50 300 250 T 600 150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round"/>
                 <path d="M 200 10 Q 250 150 400 300 T 700 450" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round"/>
               </svg>

               {/* Simulated Map Markers */}
               {/* N1 */}
               <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center animate-pulse absolute -z-10 blur-md"></div>
                 <div className="w-8 h-8 rounded-full bg-error border-4 border-surface shadow-[0_0_15px_rgba(255,180,171,0.5)] flex items-center justify-center text-on-error font-bold text-[10px]">N1</div>
                 <div className="mt-2 px-2 py-1 bg-surface/90 backdrop-blur border border-error/30 rounded text-xs font-semibold text-error">AQI 186</div>
               </div>
               
               {/* S4 */}
               <div className="absolute top-[60%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-full bg-tertiary/20 flex items-center justify-center animate-pulse absolute -z-10 blur-xl"></div>
                 <div className="w-8 h-8 rounded-full bg-tertiary border-4 border-surface shadow-[0_0_15px_rgba(251,188,5,0.5)] flex items-center justify-center text-on-tertiary font-bold text-[10px]">S4</div>
                 <div className="mt-2 px-2 py-1 bg-surface/90 backdrop-blur border border-tertiary/30 rounded text-xs font-semibold text-tertiary">AQI 142</div>
               </div>

               {/* C2 */}
               <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-secondary border-4 border-surface shadow-md flex items-center justify-center text-on-secondary font-bold text-[10px]">C2</div>
               </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:bg-surface-bright flex items-center justify-center shadow-lg border border-outline-variant/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:bg-surface-bright flex items-center justify-center shadow-lg border border-outline-variant/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center shadow-lg border border-primary/20 transition-colors mt-2">
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col overflow-hidden">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20">
               <h3 className="font-title-md text-title-md text-on-surface">Zone Risk Levels</h3>
               <span className="px-2 py-0.5 bg-error/20 text-error rounded-full text-[10px] font-bold uppercase tracking-wider">2 Critical</span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
                {zones.map(zone => {
                  const isSevere = zone.status === 'Severe';
                  const isUnhealthy = zone.status === 'Unhealthy';
                  const isModerate = zone.status === 'Moderate';
                  
                  let colorClass = 'text-secondary bg-secondary/10 border-secondary/20';
                  let barColorClass = 'bg-secondary';
                  if (isSevere) {
                    colorClass = 'text-error bg-error/10 border-error/20';
                    barColorClass = 'bg-error';
                  } else if (isUnhealthy) {
                    colorClass = 'text-tertiary bg-tertiary/10 border-tertiary/20';
                    barColorClass = 'bg-tertiary';
                  } else if (isModerate) {
                    colorClass = 'text-primary bg-primary/10 border-primary/20';
                    barColorClass = 'bg-primary';
                  }

                  return (
                    <div key={zone.id} className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-variant/50 transition-colors cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface">{zone.id}</div>
                            <span className="font-label-sm text-label-sm text-on-surface truncate max-w-[120px]">{zone.name}</span>
                         </div>
                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colorClass}`}>{zone.risk}</span>
                       </div>
                       
                       <div className="flex items-end justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <span className="font-title-md text-title-md font-bold text-on-surface">{zone.aqi}</span>
                            <span className="font-label-sm text-[10px] text-on-surface-variant">AQI</span>
                          </div>
                          <span className={`material-symbols-outlined text-[16px] ${isSevere || isUnhealthy ? (zone.trend === 'up' ? 'text-error' : 'text-tertiary') : 'text-secondary'}`}>
                            {zone.trend === 'up' ? 'trending_up' : zone.trend === 'down' ? 'trending_down' : 'trending_flat'}
                          </span>
                       </div>
                       
                       <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${barColorClass}`} style={{ width: `${Math.min((zone.aqi / 300) * 100, 100)}%` }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
          
          <div className="glass-panel rounded-xl p-4 bg-primary-container/10 border-primary/20 ai-glow flex items-start gap-3">
             <span className="material-symbols-outlined text-primary mt-1">psychology</span>
             <div>
               <h4 className="font-label-sm text-label-sm text-primary font-bold">AI Recommendation</h4>
               <p className="font-body-md text-[12px] leading-tight text-on-surface-variant mt-1">
                 Deploy dust-suppression units to Zone N1 immediately. Traffic rerouting for S4 recommended by 17:00.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

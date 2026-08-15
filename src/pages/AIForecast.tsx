export default function AIForecast() {
  return (
    <div className="p-container-padding-mobile md:p-container-padding-desktop flex-1 space-y-gutter max-w-7xl mx-auto w-full pb-20 md:pb-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">AI Forecast</h2>
          <p className="font-title-md text-title-md text-on-surface-variant mt-2">Predict pollution before it becomes a problem.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            <span className="font-label-sm text-label-sm">Location: All Zones</span>
            <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
            <span className="font-label-sm text-label-sm">Time: Next 48h</span>
            <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-primary">science</span>
            <span className="font-label-sm text-label-sm">Pollutant: All</span>
            <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="w-full ai-glow bg-primary/5 rounded-xl p-4 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-3xl shrink-0">psychology</span>
        <div>
          <h4 className="font-title-md text-title-md text-primary mb-1">AI Sentinel Alert</h4>
          <p className="font-body-md text-body-md text-on-surface-variant">Predictive models indicate a 91% probability of a severe PM2.5 spike in the Industrial Zone between 18:00 and 22:00 due to expected atmospheric inversion.</p>
        </div>
      </div>

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-card-gap">
        {/* PM2.5 */}
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error"></span> PM2.5
            </span>
            <span className="material-symbols-outlined text-error">trending_up</span>
          </div>
          <div className="mt-auto">
            <div className="font-headline-lg text-headline-lg text-on-surface">118</div>
            <div className="font-label-sm text-label-sm text-error">µg/m³ • Severe</div>
          </div>
        </div>

        {/* PM10 */}
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> PM10
            </span>
            <span className="material-symbols-outlined text-tertiary">trending_flat</span>
          </div>
          <div className="mt-auto">
            <div className="font-headline-lg text-headline-lg text-on-surface">186</div>
            <div className="font-label-sm text-label-sm text-tertiary">µg/m³ • Poor</div>
          </div>
        </div>

        {/* NO2 */}
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> NO2
            </span>
            <span className="material-symbols-outlined text-secondary">trending_down</span>
          </div>
          <div className="mt-auto">
            <div className="font-headline-lg text-headline-lg text-on-surface">72</div>
            <div className="font-label-sm text-label-sm text-secondary">µg/m³ • Moderate</div>
          </div>
        </div>

        {/* AQI */}
        <div className="glass-panel p-4 rounded-xl flex flex-col ai-glow">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error"></span> Projected AQI
            </span>
            <span className="material-symbols-outlined text-error animate-pulse">warning</span>
          </div>
          <div className="mt-auto">
            <div className="font-display-lg text-display-lg text-error">176</div>
            <div className="font-label-sm text-label-sm text-error">Peak at 20:00</div>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10 relative">
          <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">timeline</span>
            48-Hour Predictive Modeling
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-surface-variant text-on-surface font-label-sm text-label-sm rounded-md">AQI</button>
            <button className="px-3 py-1 bg-transparent border border-outline-variant text-on-surface-variant font-label-sm text-label-sm rounded-md hover:bg-surface-variant/50">PM2.5</button>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 w-full bg-surface-container-high rounded-lg relative flex items-end px-4 pb-4">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
            <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
            <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75"></line>
            
            <path d="M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,60" fill="none" stroke="#ffb4ab" strokeLinecap="round" strokeWidth="2"></path>
            <path d="M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,60 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.2"></path>
            
            <defs>
              <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffb4ab"></stop>
                <stop offset="100%" stopColor="transparent"></stop>
              </linearGradient>
            </defs>
          </svg>
          
          {/* Interactive Tooltip Marker */}
          <div className="absolute left-[60%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-surface p-3 rounded-lg shadow-lg border border-outline-variant/30 mb-2 whitespace-nowrap z-20">
              <div className="font-label-sm text-label-sm text-error font-bold">AQI 176 (Severe)</div>
              <div className="font-body-md text-body-md text-on-surface-variant">Tomorrow, 20:00</div>
            </div>
            <div className="w-3 h-3 bg-error rounded-full border-2 border-surface"></div>
            <div className="w-px h-full bg-error/50 absolute top-3"></div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary">verified</span>
          <span className="font-body-md text-body-md">Forecast Accuracy:</span>
          <span className="font-title-md text-title-md text-secondary font-bold">92.4%</span>
        </div>
        <div className="hidden sm:block w-px h-6 bg-outline-variant/30"></div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">model_training</span>
          <span className="font-body-md text-body-md">Model Confidence:</span>
          <span className="font-title-md text-title-md text-primary font-bold">91%</span>
        </div>
      </div>
    </div>
  );
}

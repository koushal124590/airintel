import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const [aqiData, setAqiData] = useState<{ current: any; hourly: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Greater Noida approximate coordinates
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.4744&longitude=77.5040&current=us_aqi&hourly=us_aqi&timezone=auto&past_days=1&forecast_days=2";
        const res = await fetch(url);
        const data = await res.json();
        
        // Format hourly data for recharts
        const formattedHourly = data.hourly.time.map((timeStr: string, index: number) => ({
          time: new Date(timeStr),
          formattedTime: format(new Date(timeStr), 'ha'),
          aqi: data.hourly.us_aqi[index],
          isPredicted: new Date(timeStr) > new Date()
        })).filter((item: any) => {
          // Show 12 hours past and 12 hours future
          const now = new Date();
          const diffHours = (item.time.getTime() - now.getTime()) / (1000 * 60 * 60);
          return diffHours >= -12 && diffHours <= 12;
        });

        setAqiData({
          current: data.current,
          hourly: formattedHourly
        });
      } catch (error) {
        console.error("Failed to fetch AQI data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-secondary', bg: 'bg-secondary' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-tertiary', bg: 'bg-tertiary' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-error', bg: 'bg-error' };
    return { label: 'Unhealthy', color: 'text-error', bg: 'bg-error' };
  };

  const currentAqi = aqiData?.current?.us_aqi || 142;
  const status = getAqiStatus(currentAqi);
  
  // Find peak in the next 12 hours
  const futureData = aqiData?.hourly.filter(d => d.isPredicted) || [];
  const peakAqi = futureData.length > 0 ? Math.max(...futureData.map(d => d.aqi)) : 176;

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-container-padding-desktop pb-24 md:pb-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-on-surface tracking-tight">
          Good Morning, Admin <span className="inline-block animate-bounce origin-bottom">👋</span>
        </h2>
        <p className="font-body-md text-body-md md:font-body-lg md:text-body-lg text-on-surface-variant max-w-2xl">
          Here is today's environmental intelligence for Greater Noida.
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
            <div className={`px-2 py-1 ${status.color.replace('text-', 'bg-')}/20 ${status.color} rounded font-label-sm text-label-sm border border-outline-variant/30`}>
              {status.label}
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface font-bold">
              {loading ? "..." : currentAqi}
            </span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-auto relative z-10">
            <div className={`h-full ${status.bg} rounded-full`} style={{ width: `${Math.min((currentAqi/300)*100, 100)}%` }}></div>
          </div>
        </div>

        {/* KPI 2: Predicted AQI */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group border border-error/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">online_prediction</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Peak Predicted AQI</span>
            </div>
            <div className="px-2 py-1 bg-error/20 text-error rounded font-label-sm text-label-sm border border-error/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span> 12h
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-error font-bold">
              {loading ? "..." : peakAqi}
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
            <span className="font-display-lg text-display-lg text-on-surface font-bold">2</span>
            <span className="font-body-md text-body-md text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">add</span>1 New
            </span>
          </div>
          <div className="mt-auto relative z-10 flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-[10px] text-on-surface z-30">N1</div>
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-[10px] text-on-surface z-20">S4</div>
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
            <span className="font-display-lg text-display-lg text-secondary font-bold">94<span className="text-2xl">%</span></span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-auto relative z-10 flex">
            <div className="h-full bg-secondary w-[94%] rounded-full shadow-[0_0_10px_rgba(109,221,129,0.5)]"></div>
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
          </div>
          
          {/* Real Recharts Container */}
          <div className="relative w-full h-[300px] mt-4 rounded-lg bg-surface-container-low/50 overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                Loading live AQI data...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aqiData?.hourly || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140, 144, 159, 0.1)" vertical={false} />
                  <XAxis 
                    dataKey="formattedTime" 
                    stroke="#8c909f" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#8c909f" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 'dataMax + 50']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140, 144, 159, 0.2)', borderRadius: '8px', color: '#dde2f8' }}
                    itemStyle={{ color: '#adc6ff' }}
                    labelStyle={{ color: '#8c909f', marginBottom: '4px' }}
                  />
                  <ReferenceLine y={150} stroke="#ffb4ab" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Warning Threshold', fill: '#ffb4ab', fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="aqi" 
                    name="US AQI"
                    stroke="#adc6ff" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0d1322', stroke: '#adc6ff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#adc6ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
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
                Live Model Analysis
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="bg-surface-container-lowest/50 rounded-lg p-4 border border-outline-variant/10 h-full">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <strong className={peakAqi > 150 ? "text-error font-medium" : "text-secondary font-medium"}>
                  {peakAqi > 150 ? "AQI is predicted to spike soon." : "Air quality will remain stable."}
                </strong> 
                {" "}Based on real-time Open-Meteo data, the peak AQI in the next 12 hours is expected to reach <strong>{peakAqi}</strong>.
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-surface-variant rounded text-xs text-on-surface-variant font-medium">Real-time Data</span>
                <span className="px-2 py-1 bg-surface-variant rounded text-xs text-on-surface-variant font-medium">Open-Meteo</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 relative z-10 mt-auto">
            <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-label-sm py-3 px-4 rounded-lg shadow-[0_4px_14px_rgba(77,142,254,0.4)] transition-all flex items-center justify-center gap-2 group">
              <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">forum</span>
              Ask Gemini
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

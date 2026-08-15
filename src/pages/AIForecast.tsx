import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

export default function AIForecast() {
  const [data, setData] = useState<{ current: any; hourly: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.4744&longitude=77.5040&current=us_aqi,pm10,pm2_5,nitrogen_dioxide&hourly=us_aqi,pm10,pm2_5,nitrogen_dioxide&timezone=auto&past_days=1&forecast_days=2";
        const res = await fetch(url);
        const raw = await res.json();
        
        const formattedHourly = raw.hourly.time.map((timeStr: string, index: number) => ({
          time: new Date(timeStr),
          formattedTime: format(new Date(timeStr), 'ha'),
          aqi: raw.hourly.us_aqi[index],
          pm10: raw.hourly.pm10[index],
          pm25: raw.hourly.pm2_5[index],
          no2: raw.hourly.nitrogen_dioxide[index],
        })).filter((item: any) => {
          // Show 12 hours past and 36 hours future
          const now = new Date();
          const diffHours = (item.time.getTime() - now.getTime()) / (1000 * 60 * 60);
          return diffHours >= -12 && diffHours <= 36;
        });

        setData({
          current: raw.current,
          hourly: formattedHourly
        });
      } catch (error) {
        console.error("Failed to fetch forecast data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const futureData = data?.hourly.filter(d => d.time > new Date()) || [];
  const peakAqi = futureData.length > 0 ? Math.max(...futureData.map(d => d.aqi)) : 0;
  
  const currentPm25 = data?.current?.pm2_5 || 0;
  const currentPm10 = data?.current?.pm10 || 0;
  const currentNo2 = data?.current?.nitrogen_dioxide || 0;

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
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="w-full ai-glow bg-primary/5 rounded-xl p-4 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-3xl shrink-0">psychology</span>
        <div>
          <h4 className="font-title-md text-title-md text-primary mb-1">AI Sentinel Alert</h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Predictive models based on live Open-Meteo data indicate the AQI will peak at <strong>{loading ? '...' : peakAqi}</strong> in the coming 48 hours.
          </p>
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
            <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : currentPm25}</div>
            <div className="font-label-sm text-label-sm text-error">µg/m³</div>
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
            <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : currentPm10}</div>
            <div className="font-label-sm text-label-sm text-tertiary">µg/m³</div>
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
            <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : currentNo2}</div>
            <div className="font-label-sm text-label-sm text-secondary">µg/m³</div>
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
            <div className="font-display-lg text-display-lg text-error">{loading ? '...' : peakAqi}</div>
            <div className="font-label-sm text-label-sm text-error">Next 48h Peak</div>
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
        </div>
        
        {/* Real AreaChart */}
        <div className="h-64 w-full rounded-lg relative">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
               Loading predictive model...
             </div>
          ) : (
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data?.hourly || []} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
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
                 />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140, 144, 159, 0.2)', borderRadius: '8px', color: '#dde2f8' }}
                   itemStyle={{ color: '#ffb4ab' }}
                   labelStyle={{ color: '#8c909f', marginBottom: '4px' }}
                 />
                 <ReferenceLine y={150} stroke="#ffb4ab" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Unhealthy Threshold', fill: '#ffb4ab', fontSize: 10 }} />
                 <Area 
                   type="monotone" 
                   dataKey="aqi" 
                   stroke="#ffb4ab" 
                   fillOpacity={1} 
                   fill="url(#colorAqi)" 
                   strokeWidth={2}
                 />
               </AreaChart>
             </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

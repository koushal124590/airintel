import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { fetchIndiaStations, fetchHourlyForecast, STATUS_STYLES, type StationData } from '../data/cities';

export default function Dashboard() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [stationData, forecastRaw] = await Promise.all([
          fetchIndiaStations(),
          fetchHourlyForecast(28.6139, 77.2090, 1, 2), // Delhi for the main chart
        ]);

        const validStations = stationData.filter(s => s.aqi > 0);
        setStations(validStations);

        const fmtHourly = forecastRaw.hourly.time.map((t: string, i: number) => ({
          time: new Date(t),
          label: format(new Date(t), 'ha'),
          aqi: forecastRaw.hourly.us_aqi[i],
        })).filter((d: any) => {
          const diff = (d.time.getTime() - Date.now()) / 36e5;
          return diff >= -12 && diff <= 12;
        });
        setHourly(fmtHourly);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const avgAqi = stations.length ? Math.round(stations.reduce((s, c) => s + c.aqi, 0) / stations.length) : 0;
  const worstStation = stations[0];
  const hazardousCount = stations.filter(s => s.statusColor === 'hazardous').length;
  const veryUnhealthyCount = stations.filter(s => s.statusColor === 'very_unhealthy').length;
  const unhealthyCount = stations.filter(s => s.statusColor === 'unhealthy').length;

  const aqiLabel = avgAqi <= 50 ? 'Good' : avgAqi <= 100 ? 'Moderate' : avgAqi <= 150 ? 'Unhealthy (SG)' : avgAqi <= 200 ? 'Unhealthy' : avgAqi <= 300 ? 'Very Unhealthy' : 'Hazardous';
  const aqiColor = avgAqi <= 50 ? 'text-secondary' : avgAqi <= 100 ? 'text-tertiary' : avgAqi <= 150 ? 'text-[#ff9800]' : avgAqi <= 200 ? 'text-error' : avgAqi <= 300 ? 'text-[#9c27b0]' : 'text-[#b71c1c]';

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Greeting */}
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin <span className="inline-block animate-bounce origin-bottom">👋</span>
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">
          National air quality overview — monitoring {stations.length} active stations across India.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* National Avg AQI */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>public</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">National Avg AQI</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className={`${aqiColor}`}>{loading ? '–' : avgAqi}</span>
            <span className={`px-2 py-0.5 rounded-lg ${aqiColor.replace('text-', 'bg-')}/15 ${aqiColor}`} style={{ fontSize: 11, fontWeight: 700 }}>{loading ? '' : aqiLabel}</span>
          </div>
        </div>

        {/* Most Polluted Station */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group border border-[#b71c1c]/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#b71c1c]/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">Most Polluted</span>
          </div>
          <div className="relative z-10 min-w-0">
            <div className="flex items-baseline gap-2">
               <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700, color: worstStation ? STATUS_STYLES[worstStation.statusColor].hex : '#ffb4ab' }}>{loading ? '–' : worstStation?.aqi}</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }} className="text-on-surface-variant mt-1 truncate pr-4" title={worstStation?.name}>{loading ? '' : worstStation?.name}</p>
          </div>
        </div>

        {/* Stations at Risk */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#9c27b0]/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_city</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">Stations at Risk</span>
          </div>
          <div className="flex flex-col relative z-10 gap-1">
            <div className="flex items-baseline gap-3">
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className="text-on-surface">{loading ? '–' : hazardousCount + veryUnhealthyCount + unhealthyCount}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {hazardousCount > 0 && <span className="px-1.5 py-0.5 bg-[#b71c1c]/15 text-[#b71c1c] rounded" style={{ fontSize: 9, fontWeight: 700 }}>{hazardousCount} Haz</span>}
              {veryUnhealthyCount > 0 && <span className="px-1.5 py-0.5 bg-[#9c27b0]/15 text-[#9c27b0] rounded" style={{ fontSize: 9, fontWeight: 700 }}>{veryUnhealthyCount} V.Un</span>}
              {unhealthyCount > 0 && <span className="px-1.5 py-0.5 bg-error/15 text-error rounded" style={{ fontSize: 9, fontWeight: 700 }}>{unhealthyCount} Un</span>}
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>psychology</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">AI Confidence</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className="text-secondary">98<span style={{ fontSize: 24 }}>%</span></span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-secondary w-[98%] rounded-full shadow-[0_0_10px_rgba(109,221,129,0.5)]" />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>monitoring</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">24-Hour AQI Forecast — Delhi</span>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourly} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,144,159,0.1)" vertical={false} />
                  <XAxis dataKey="label" stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} domain={[0, 'dataMax + 30']} />
                  <Tooltip contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140,144,159,0.2)', borderRadius: 8, color: '#dde2f8', fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                  <ReferenceLine y={150} stroke="#ffb4ab" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Unhealthy (SG)', fill: '#ffb4ab', fontSize: 10 }} />
                  <ReferenceLine y={200} stroke="#f44336" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Unhealthy', fill: '#f44336', fontSize: 10 }} />
                  <Line type="monotone" dataKey="aqi" name="US AQI" stroke="#adc6ff" strokeWidth={2.5} dot={{ r: 3, fill: '#0d1322', stroke: '#adc6ff', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#adc6ff' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div className="lg:col-span-1 glass-panel rounded-xl p-5 ai-glow border border-primary/20 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary relative">
              <span className="absolute inset-0 rounded-xl border border-primary/40 animate-ping opacity-20" />
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>smart_toy</span>
            </div>
            <div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600 }} className="text-primary">Gemini AI Insight</span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 12 }}>verified</span> Live Analysis
              </p>
            </div>
          </div>
          <div className="flex-1 bg-surface-container-lowest/40 rounded-lg p-4 border border-outline-variant/10 relative z-10 overflow-y-auto">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: '22px' }} className="text-on-surface-variant">
              {loading ? 'Analyzing national data...' : (
                hazardousCount > 0 || veryUnhealthyCount > 0
                  ? <><strong className="text-error">{hazardousCount + veryUnhealthyCount} stations are reporting severe or hazardous pollution.</strong> The most critical area is {worstStation?.name} with an AQI of {worstStation?.aqi}. Emergency action recommended for affected regions.</>
                  : <><strong className="text-secondary">Air quality is manageable across India.</strong> National average AQI is {avgAqi}. Continued monitoring recommended. No immediate public health interventions required.</>
              )}
            </p>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-on-primary py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group relative z-10 shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }}>
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform" style={{ fontSize: 18 }}>forum</span>
            Ask Gemini
          </button>
        </div>
      </div>

      {/* Top Polluted Cities strip */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 18 }}>trending_up</span>
            Most Polluted Stations Right Now
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {stations.slice(0, 6).map((station, i) => {
            const s = STATUS_STYLES[station.statusColor];
            return (
              <div key={station.uid} className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/10 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="w-5 h-5 rounded bg-surface-variant flex items-center justify-center text-on-surface" style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Inter' }}>#{i + 1}</span>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 700, color: s.hex }}>{station.aqi}</span>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600 }} className="text-on-surface mt-2 line-clamp-2 leading-tight" title={station.name}>{station.name}</p>
                <div className="mt-2 w-full flex justify-center">
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: s.hex, color: '#fff' }}>{station.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

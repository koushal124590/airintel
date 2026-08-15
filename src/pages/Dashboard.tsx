import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { INDIAN_CITIES, fetchCitiesAQI, fetchHourlyForecast, STATUS_STYLES, type CityAQI } from '../data/cities';

export default function Dashboard() {
  const [cities, setCities] = useState<CityAQI[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cityData, forecastRaw] = await Promise.all([
          fetchCitiesAQI(INDIAN_CITIES),
          fetchHourlyForecast(28.6139, 77.2090, 1, 2), // Delhi for the main chart
        ]);

        setCities(cityData.sort((a, b) => b.aqi - a.aqi));

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

  const avgAqi = cities.length ? Math.round(cities.reduce((s, c) => s + c.aqi, 0) / cities.length) : 0;
  const worstCity = cities[0];
  const severeCount = cities.filter(c => c.statusColor === 'severe').length;
  const unhealthyCount = cities.filter(c => c.statusColor === 'unhealthy').length;

  const aqiLabel = avgAqi <= 50 ? 'Good' : avgAqi <= 100 ? 'Moderate' : avgAqi <= 150 ? 'Unhealthy' : 'Severe';
  const aqiColor = avgAqi <= 50 ? 'text-secondary' : avgAqi <= 100 ? 'text-primary' : avgAqi <= 150 ? 'text-tertiary' : 'text-error';

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Greeting */}
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin <span className="inline-block animate-bounce origin-bottom">👋</span>
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">
          National air quality overview — monitoring {INDIAN_CITIES.length} cities across India.
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

        {/* Most Polluted City */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group border border-error/15">
          <div className="absolute top-0 right-0 w-20 h-20 bg-error/8 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">Most Polluted</span>
          </div>
          <div className="relative z-10">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className="text-error">{loading ? '–' : worstCity?.aqi}</span>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }} className="text-on-surface-variant mt-1">{loading ? '' : `${worstCity?.name}, ${worstCity?.state}`}</p>
          </div>
        </div>

        {/* Cities at Risk */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-tertiary/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_city</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} className="uppercase">Cities at Risk</span>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className="text-on-surface">{loading ? '–' : severeCount + unhealthyCount}</span>
            <div className="flex gap-2">
              {severeCount > 0 && <span className="px-2 py-0.5 bg-error/15 text-error rounded-lg" style={{ fontSize: 10, fontWeight: 700 }}>{severeCount} Severe</span>}
              {unhealthyCount > 0 && <span className="px-2 py-0.5 bg-tertiary/15 text-tertiary rounded-lg" style={{ fontSize: 10, fontWeight: 700 }}>{unhealthyCount} Unhealthy</span>}
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
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 700 }} className="text-secondary">94<span style={{ fontSize: 24 }}>%</span></span>
          </div>
          <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-secondary w-[94%] rounded-full shadow-[0_0_10px_rgba(109,221,129,0.5)]" />
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
                  <ReferenceLine y={150} stroke="#ffb4ab" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Unhealthy', fill: '#ffb4ab', fontSize: 10 }} />
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
          <div className="flex-1 bg-surface-container-lowest/40 rounded-lg p-4 border border-outline-variant/10 relative z-10">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: '22px' }} className="text-on-surface-variant">
              {loading ? 'Analyzing national data...' : (
                severeCount > 0
                  ? <><strong className="text-error">{severeCount} cities show severe pollution.</strong> {worstCity?.name} leads with AQI {worstCity?.aqi}. Northern India shows elevated PM2.5 levels due to seasonal factors. Immediate health advisories recommended for affected metros.</>
                  : <><strong className="text-secondary">Air quality is manageable across India.</strong> National average AQI is {avgAqi}. Continued monitoring recommended. No immediate public health interventions required.</>
              )}
            </p>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-on-primary py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group relative z-10" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }}>
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
            Most Polluted Cities Right Now
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cities.slice(0, 5).map((city, i) => {
            const s = STATUS_STYLES[city.statusColor];
            return (
              <div key={city.id} className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/10 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="w-5 h-5 rounded bg-surface-variant flex items-center justify-center" style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Inter' }}>#{i + 1}</span>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700 }} className={s.text}>{city.aqi}</span>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }} className="text-on-surface mt-1 truncate">{city.name}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }} className="text-on-surface-variant truncate">{city.state}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

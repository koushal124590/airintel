import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { MAJOR_CITIES, fetchHourlyForecast } from '../data/cities';

export default function AIForecast() {
  const [hourly, setHourly] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState(MAJOR_CITIES[0]); // Delhi by default
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);



  useEffect(() => {
    async function loadForecast() {
      setChartLoading(true);
      try {
        const raw = await fetchHourlyForecast(selectedCity.lat, selectedCity.lng, 1, 2);
        setCurrentData(raw.current);

        const fmtHourly = raw.hourly.time.map((t: string, i: number) => ({
          time: new Date(t),
          label: format(new Date(t), 'ha'),
          aqi: raw.hourly.us_aqi[i],
          pm25: raw.hourly.pm2_5[i],
          pm10: raw.hourly.pm10[i],
        })).filter((d: any) => {
          const diff = (d.time.getTime() - Date.now()) / 36e5;
          return diff >= -12 && diff <= 36;
        });
        setHourly(fmtHourly);
      } catch (e) { console.error(e); }
      finally { setChartLoading(false); setLoading(false); }
    }
    loadForecast();
  }, [selectedCity]);

  const futureData = hourly.filter(d => d.time > new Date());
  const peakAqi = futureData.length > 0 ? Math.max(...futureData.map(d => d.aqi)) : 0;
  const pm25 = currentData?.pm2_5 ?? 0;
  const pm10 = currentData?.pm10 ?? 0;
  const no2 = currentData?.nitrogen_dioxide ?? 0;

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">AI Forecast</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Predictive pollution modeling — select a city below.</p>
        </div>
        {/* City selector */}
        <select
          value={selectedCity.name}
          onChange={e => {
            const c = MAJOR_CITIES.find(city => city.name === e.target.value);
            if (c) setSelectedCity(c);
          }}
          className="bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all w-full md:w-64"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
        >
          {MAJOR_CITIES.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* AI Banner */}
      <div className="glass-panel rounded-xl p-4 ai-glow flex items-start gap-4 border border-primary/20">
        <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: 24 }}>psychology</span>
        <div>
          <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-primary mb-1">AI Sentinel Alert — {selectedCity.name}</h4>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} className="text-on-surface-variant">
            Predictive models indicate AQI will peak at <strong>{loading ? '...' : peakAqi}</strong> within the next 48 hours.
            {peakAqi > 150 ? ' Public health advisory recommended.' : ' No immediate concerns.'}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'PM2.5', value: pm25, unit: 'µg/m³', color: 'text-error', icon: 'trending_up', dot: 'bg-error' },
          { label: 'PM10', value: pm10, unit: 'µg/m³', color: 'text-tertiary', icon: 'trending_flat', dot: 'bg-tertiary' },
          { label: 'NO₂', value: no2, unit: 'µg/m³', color: 'text-secondary', icon: 'trending_down', dot: 'bg-secondary' },
          { label: 'Peak AQI', value: peakAqi, unit: '48h forecast', color: 'text-error', icon: 'warning', dot: 'bg-error' },
        ].map(m => (
          <div key={m.label} className="glass-panel p-4 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500 }}>
                <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                <span className="text-on-surface-variant">{m.label}</span>
              </span>
              <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: 18 }}>{m.icon}</span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700 }} className="text-on-surface">{loading ? '–' : m.value}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className={m.color}>{m.unit}</div>
          </div>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>timeline</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">48-Hour Predictive Model — {selectedCity.name}</span>
        </div>
        <div className="h-64">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,144,159,0.1)" vertical={false} />
                <XAxis dataKey="label" stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140,144,159,0.2)', borderRadius: 8, color: '#dde2f8', fontSize: 12, fontFamily: 'Inter' }} />
                <ReferenceLine y={150} stroke="#ffb4ab" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Unhealthy', fill: '#ffb4ab', fontSize: 10 }} />
                <Area type="monotone" dataKey="aqi" name="AQI" stroke="#ffb4ab" fill="url(#forecastGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </main>
  );
}

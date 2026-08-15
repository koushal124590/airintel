import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

export default function Analytics() {
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.4744&longitude=77.5040&hourly=us_aqi,pm2_5,pm10,nitrogen_dioxide&timezone=auto&past_days=3&forecast_days=1";
        const res = await fetch(url);
        const raw = await res.json();

        const formatted = raw.hourly.time.map((t: string, i: number) => ({
          time: new Date(t),
          hour: format(new Date(t), 'ha'),
          day: format(new Date(t), 'EEE'),
          dateStr: format(new Date(t), 'MMM d'),
          aqi: raw.hourly.us_aqi[i],
          pm25: raw.hourly.pm2_5[i],
          pm10: raw.hourly.pm10[i],
          no2: raw.hourly.nitrogen_dioxide[i],
        }));

        setHourlyData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute daily averages for bar chart
  const dailyMap = new Map<string, { day: string; aqiSum: number; count: number }>();
  hourlyData.forEach(d => {
    const key = d.dateStr;
    if (!dailyMap.has(key)) dailyMap.set(key, { day: `${d.day} ${d.dateStr}`, aqiSum: 0, count: 0 });
    const e = dailyMap.get(key)!;
    if (d.aqi != null) { e.aqiSum += d.aqi; e.count++; }
  });
  const dailyAvg = Array.from(dailyMap.values()).map(d => ({ day: d.day, avgAqi: Math.round(d.aqiSum / d.count) }));

  // Pollutant distribution for pie chart
  const latestValid = [...hourlyData].reverse().find(d => d.pm25 != null && d.pm10 != null && d.no2 != null);
  const pieData = latestValid ? [
    { name: 'PM2.5', value: latestValid.pm25 },
    { name: 'PM10', value: latestValid.pm10 },
    { name: 'NO₂', value: latestValid.no2 },
  ] : [];
  const PIE_COLORS = ['#ffb4ab', '#fbbc05', '#adc6ff'];

  // Last 24h for trend chart
  const last24h = hourlyData.filter(d => {
    const diff = (new Date().getTime() - d.time.getTime()) / (1000 * 60 * 60);
    return diff >= 0 && diff <= 24;
  });

  // Stats
  const allAqi = hourlyData.filter(d => d.aqi != null).map(d => d.aqi);
  const avgAqi = allAqi.length ? Math.round(allAqi.reduce((a: number, b: number) => a + b, 0) / allAqi.length) : 0;
  const maxAqi = allAqi.length ? Math.max(...allAqi) : 0;
  const minAqi = allAqi.length ? Math.min(...allAqi) : 0;
  const hoursAbove100 = allAqi.filter(a => a > 100).length;

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">Analytics</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Historical trends and data analysis for Greater Noida (past 3 days).</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '3-Day Avg AQI', value: avgAqi, icon: 'calculate', color: 'text-primary' },
          { label: 'Peak AQI', value: maxAqi, icon: 'arrow_upward', color: 'text-error' },
          { label: 'Lowest AQI', value: minAqi, icon: 'arrow_downward', color: 'text-secondary' },
          { label: 'Hours > 100', value: hoursAbove100, icon: 'timer', color: 'text-tertiary' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500 }} className="text-on-surface-variant">{s.label}</span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700 }} className="text-on-surface">
              {loading ? '–' : s.value}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="glass-panel rounded-xl p-16 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
          <span className="ml-3 text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Average Bar Chart */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>bar_chart</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Daily Average AQI</span>
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyAvg} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,144,159,0.1)" vertical={false} />
                    <XAxis dataKey="day" stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140,144,159,0.2)', borderRadius: 8, color: '#dde2f8', fontSize: 12 }} />
                    <Bar dataKey="avgAqi" name="Avg AQI" fill="#adc6ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pollutant Breakdown Pie */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>pie_chart</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Pollutant Breakdown (Latest)</span>
              </h3>
              <div className="h-56 flex items-center">
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140,144,159,0.2)', borderRadius: 8, color: '#dde2f8', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 pl-4">
                  {pieData.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <div>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }} className="text-on-surface">{p.name}</span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} className="text-on-surface-variant ml-2">{p.value} µg/m³</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 24h Trend */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>timeline</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Last 24-Hour Trend</span>
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last24h} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#adc6ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#adc6ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,144,159,0.1)" vertical={false} />
                  <XAxis dataKey="hour" stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke="#8c909f" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#191f2f', border: '1px solid rgba(140,144,159,0.2)', borderRadius: 8, color: '#dde2f8', fontSize: 12 }} />
                  <Area type="monotone" dataKey="aqi" name="AQI" stroke="#adc6ff" fill="url(#aqiGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

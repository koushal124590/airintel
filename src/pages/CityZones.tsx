import { useEffect, useState } from 'react';
import { INDIAN_CITIES, fetchCitiesAQI, STATUS_STYLES, type CityAQI } from '../data/cities';

export default function CityZones() {
  const [cities, setCities] = useState<CityAQI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCitiesAQI(INDIAN_CITIES)
      .then(data => setCities(data.sort((a, b) => b.aqi - a.aqi)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase()))
    : cities;

  const severeCount = cities.filter(c => c.statusColor === 'severe').length;
  const unhealthyCount = cities.filter(c => c.statusColor === 'unhealthy').length;
  const moderateCount = cities.filter(c => c.statusColor === 'moderate').length;
  const goodCount = cities.filter(c => c.statusColor === 'good').length;

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">City Zones</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Real-time monitoring across {INDIAN_CITIES.length} major Indian cities.</p>
        </div>
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
          <input
            type="text"
            placeholder="Search city or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all w-full md:w-64"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Cities', value: cities.length, icon: 'grid_view', color: 'text-primary' },
          { label: 'Severe', value: severeCount, icon: 'error', color: 'text-error' },
          { label: 'Unhealthy', value: unhealthyCount, icon: 'warning', color: 'text-tertiary' },
          { label: 'Good', value: goodCount + moderateCount, icon: 'check_circle', color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
            <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-on-surface leading-none">{loading ? '–' : s.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500 }} className="text-on-surface-variant mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* City Grid */}
      {loading ? (
        <div className="glass-panel rounded-xl p-16 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
          <span className="ml-3 text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading city data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((city, idx) => {
            const s = STATUS_STYLES[city.statusColor];
            const isSelected = selectedCity === city.id;
            return (
              <div
                key={city.id}
                onClick={() => setSelectedCity(isSelected ? null : city.id)}
                className={`glass-panel rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isSelected ? `ring-2 ring-offset-0 ${s.border.replace('border-', 'ring-')} shadow-xl` : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center shrink-0">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700 }} className="text-on-surface">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">{city.name}</h3>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant">{city.state} • Pop. {city.population}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg ${s.text} ${s.bgOp} border ${s.border}`} style={{ fontSize: 10, fontWeight: 700 }}>{city.status}</span>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700 }} className={s.text}>{city.aqi}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} className="text-on-surface-variant ml-1">AQI</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${s.bg} rounded-full transition-all duration-700`} style={{ width: `${Math.min((city.aqi / 300) * 100, 100)}%` }} />
                </div>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/15 grid grid-cols-3 gap-2">
                    {[
                      { label: 'PM2.5', value: city.pm25 },
                      { label: 'PM10', value: city.pm10 },
                      { label: 'NO₂', value: city.no2 },
                    ].map(p => (
                      <div key={p.label} className="bg-surface-container/60 rounded-lg p-2 text-center">
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }} className="text-on-surface-variant">{p.label}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} className="text-on-surface">{p.value}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9 }} className="text-on-surface-variant">µg/m³</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

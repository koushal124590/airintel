import { useEffect, useState } from 'react';
import { fetchIndiaStations, STATUS_STYLES, type StationData } from '../data/cities';

export default function CityZones() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIndiaStations()
      .then(data => {
        setStations(data.filter(s => s.aqi > 0));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? stations.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : stations;

  const hazardousCount = stations.filter(s => s.statusColor === 'hazardous').length;
  const veryUnhealthyCount = stations.filter(s => s.statusColor === 'very_unhealthy').length;
  const unhealthyCount = stations.filter(s => s.statusColor === 'unhealthy').length;
  const moderateCount = stations.filter(s => s.statusColor === 'moderate').length;
  const goodCount = stations.filter(s => s.statusColor === 'good').length;

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">Station Rankings</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Real-time monitoring across {stations.length} Indian stations.</p>
        </div>
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
          <input
            type="text"
            placeholder="Search station..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all w-full md:w-64"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Stations', value: stations.length, icon: 'grid_view', color: 'text-primary' },
          { label: 'Hazardous', value: hazardousCount, icon: 'skull', color: 'text-[#b71c1c]' },
          { label: 'V.Unhealthy', value: veryUnhealthyCount, icon: 'error', color: 'text-[#9c27b0]' },
          { label: 'Unhealthy', value: unhealthyCount, icon: 'warning', color: 'text-error' },
          { label: 'Moderate', value: moderateCount, icon: 'info', color: 'text-tertiary' },
          { label: 'Good', value: goodCount, icon: 'check_circle', color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-3 flex flex-col items-center text-center">
            <span className={`material-symbols-outlined ${s.color} mb-1`} style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{s.icon === 'skull' ? 'warning' : s.icon}</span>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700 }} className="text-on-surface leading-none">{loading ? '–' : s.value}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500 }} className="text-on-surface-variant mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Station Grid */}
      {loading ? (
        <div className="glass-panel rounded-xl p-16 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
          <span className="ml-3 text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading network data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.slice(0, 100).map((station, idx) => {
            const s = STATUS_STYLES[station.statusColor];
            return (
              <div
                key={station.uid}
                className={`glass-panel rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-surface-variant flex items-center justify-center shrink-0">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700 }} className="text-on-surface">{idx + 1}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }} className="text-on-surface line-clamp-3" title={station.name}>{station.name}</h3>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-3 mt-auto pt-2">
                  <div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 700, color: s.hex }}>{station.aqi}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }} className="text-on-surface-variant ml-1">AQI</span>
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 4, backgroundColor: s.hex, color: '#fff', textAlign: 'center' }}>{station.status}</span>
                </div>

                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min((station.aqi / 500) * 100, 100)}%`, backgroundColor: s.hex }} />
                </div>
                
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#888', marginTop: 8 }}>
                  Updated: {new Date(station.time).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
          
          {filtered.length > 100 && (
             <div className="lg:col-span-4 p-4 text-center text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                Showing top 100 stations. Use search to find specific locations.
             </div>
          )}
        </div>
      )}
    </main>
  );
}

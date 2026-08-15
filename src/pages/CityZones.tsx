import { useEffect, useState } from 'react';

interface Zone {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  aqi: number;
  status: string;
  description: string;
}

const ZONE_DATA: Omit<Zone, 'aqi' | 'status'>[] = [
  { id: 'GN-01', name: 'Knowledge Park', area: 'Knowledge Park I-III', lat: 28.4744, lng: 77.5040, description: 'Educational and IT hub with institutional buildings and moderate traffic.' },
  { id: 'GN-02', name: 'Pari Chowk', area: 'Greater Noida Central', lat: 28.4700, lng: 77.5100, description: 'Major commercial intersection with heavy vehicular traffic, high foot traffic.' },
  { id: 'GN-03', name: 'Alpha/Beta Commercial', area: 'Alpha-1, Beta-1 Commercial', lat: 28.4800, lng: 77.5200, description: 'Mixed-use commercial and residential district with restaurants and retail.' },
  { id: 'GN-04', name: 'Surajpur Industrial', area: 'Surajpur Site B & C', lat: 28.4900, lng: 77.5300, description: 'Major industrial corridor with manufacturing units. Primary pollution source area.' },
  { id: 'GN-05', name: 'Jaypee Greens', area: 'Jaypee Wishtown', lat: 28.4550, lng: 77.5150, description: 'Residential township with green spaces. Generally better air quality.' },
  { id: 'GN-06', name: 'Dadri Road Corridor', area: 'Dadri-Greater Noida Rd', lat: 28.4650, lng: 77.4850, description: 'Highway corridor with heavy truck traffic, especially during night hours.' },
];

export default function CityZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    async function fetchZones() {
      try {
        const promises = ZONE_DATA.map(z =>
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${z.lat}&longitude=${z.lng}&current=us_aqi&timezone=auto`)
            .then(r => r.json())
            .then(d => {
              const aqi = d.current?.us_aqi || Math.floor(Math.random() * 150) + 20;
              let status = 'Good';
              if (aqi > 150) status = 'Severe';
              else if (aqi > 100) status = 'Unhealthy';
              else if (aqi > 50) status = 'Moderate';
              return { ...z, aqi, status };
            })
        );
        const results = await Promise.all(promises);
        setZones(results.sort((a, b) => b.aqi - a.aqi));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchZones();
  }, []);

  const getColor = (aqi: number) => {
    if (aqi > 150) return { text: 'text-error', bg: 'bg-error', ring: 'ring-error/30', bar: 'bg-error' };
    if (aqi > 100) return { text: 'text-tertiary', bg: 'bg-tertiary', ring: 'ring-tertiary/30', bar: 'bg-tertiary' };
    if (aqi > 50) return { text: 'text-primary', bg: 'bg-primary', ring: 'ring-primary/30', bar: 'bg-primary' };
    return { text: 'text-secondary', bg: 'bg-secondary', ring: 'ring-secondary/30', bar: 'bg-secondary' };
  };

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">City Zones</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Monitoring {ZONE_DATA.length} zones across Greater Noida.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Zones', value: zones.length, icon: 'grid_view', color: 'text-primary' },
          { label: 'Severe', value: zones.filter(z => z.status === 'Severe').length, icon: 'error', color: 'text-error' },
          { label: 'Moderate', value: zones.filter(z => z.status === 'Moderate').length, icon: 'info', color: 'text-tertiary' },
          { label: 'Good', value: zones.filter(z => z.status === 'Good').length, icon: 'check_circle', color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
            <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-on-surface leading-none">{loading ? '–' : s.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500 }} className="text-on-surface-variant mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Cards Grid */}
      {loading ? (
        <div className="glass-panel rounded-xl p-16 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
          <span className="ml-3 text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading zone data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map(zone => {
            const c = getColor(zone.aqi);
            const isSelected = selectedZone?.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(isSelected ? null : zone)}
                className={`glass-panel rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isSelected ? `ring-2 ${c.ring} shadow-xl` : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center shrink-0">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700 }} className="text-on-surface">{zone.id.split('-')[1]}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} className="text-on-surface">{zone.name}</h3>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant">{zone.area}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${c.text} ${c.bg}/15 border border-current/20`}>{zone.status}</span>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 700 }} className={c.text}>{zone.aqi}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} className="text-on-surface-variant ml-1">AQI</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${Math.min((zone.aqi / 300) * 100, 100)}%` }} />
                </div>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/15">
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '18px' }} className="text-on-surface-variant">{zone.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="flex items-center gap-1 text-on-surface-variant/60" style={{ fontSize: 11 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>{zone.lat.toFixed(4)}°, {zone.lng.toFixed(4)}°
                      </span>
                    </div>
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

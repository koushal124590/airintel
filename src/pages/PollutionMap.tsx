import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { INDIAN_CITIES, fetchCitiesAQI, STATUS_STYLES, type CityAQI } from '../data/cities';

export default function PollutionMap() {
  const [cities, setCities] = useState<CityAQI[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchCitiesAQI(INDIAN_CITIES)
      .then(data => setCities(data.sort((a, b) => b.aqi - a.aqi)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedStatus === 'all' ? cities : cities.filter(c => c.statusColor === selectedStatus);
  const severeCount = cities.filter(c => c.statusColor === 'severe').length;
  const unhealthyCount = cities.filter(c => c.statusColor === 'unhealthy').length;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 pb-24 md:pb-6 gap-4 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">India Pollution Map</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }} className="text-on-surface-variant mt-1">
            Real-time air quality across {INDIAN_CITIES.length} major cities • Powered by Open-Meteo
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: cities.length },
            { key: 'severe', label: 'Severe', count: severeCount },
            { key: 'unhealthy', label: 'Unhealthy', count: unhealthyCount },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedStatus(f.key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${selectedStatus === f.key ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'}`}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-[550px]">
        {/* ── MAP ── */}
        <div className="glass-panel rounded-2xl flex-1 relative overflow-hidden z-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 32 }}>progress_activity</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }} className="text-on-surface-variant">Loading real-time AQI data...</span>
            </div>
          ) : (
            <MapContainer
              center={[22.5, 79.0]}
              zoom={5}
              scrollWheelZoom={true}
              zoomControl={false}
              style={{ height: '100%', width: '100%', minHeight: '450px', background: '#0d1322' }}
              className="z-0"
            >
              {/* Premium dark map tiles — CartoDB Dark Matter (no API key) */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={18}
              />
              <ZoomControl position="bottomright" />

              {/* Heat glow layer — large translucent circles behind markers */}
              {filtered.map(city => {
                const style = STATUS_STYLES[city.statusColor];
                return (
                  <CircleMarker
                    key={`glow-${city.id}`}
                    center={[city.lat, city.lng]}
                    radius={city.aqi > 150 ? 40 : city.aqi > 100 ? 30 : 20}
                    fillColor={style.hex}
                    color="transparent"
                    fillOpacity={0.12}
                  />
                );
              })}

              {/* City markers */}
              {filtered.map(city => {
                const style = STATUS_STYLES[city.statusColor];
                return (
                  <CircleMarker
                    key={city.id}
                    center={[city.lat, city.lng]}
                    radius={10}
                    fillColor={style.hex}
                    color={style.hex}
                    weight={2}
                    opacity={0.9}
                    fillOpacity={0.6}
                    eventHandlers={{
                      mouseover: () => setHoveredCity(city.id),
                      mouseout: () => setHoveredCity(null),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[180px] p-1">
                        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{city.name}</h3>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#666', margin: '2px 0 8px' }}>{city.state}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700, color: style.hex }}>{city.aqi}</span>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#888', marginLeft: 4 }}>US AQI</span>
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, backgroundColor: style.hex + '22', color: style.hex }}>{city.status}</span>
                        </div>
                        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                          <div style={{ textAlign: 'center', padding: '4px', background: '#f5f5f5', borderRadius: 4 }}>
                            <div style={{ fontSize: 10, color: '#888' }}>PM2.5</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{city.pm25}</div>
                          </div>
                          <div style={{ textAlign: 'center', padding: '4px', background: '#f5f5f5', borderRadius: 4 }}>
                            <div style={{ fontSize: 10, color: '#888' }}>PM10</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{city.pm10}</div>
                          </div>
                          <div style={{ textAlign: 'center', padding: '4px', background: '#f5f5f5', borderRadius: 4 }}>
                            <div style={{ fontSize: 10, color: '#888' }}>NO₂</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{city.no2}</div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Legend overlay */}
          <div className="absolute top-4 left-4 z-[1000] glass-panel rounded-xl p-3 space-y-2">
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }} className="text-on-surface-variant uppercase block">AQI Legend</span>
            {[
              { label: '0–50 Good', color: STATUS_STYLES.good.hex },
              { label: '51–100 Moderate', color: STATUS_STYLES.moderate.hex },
              { label: '101–150 Unhealthy', color: STATUS_STYLES.unhealthy.hex },
              { label: '150+ Severe', color: STATUS_STYLES.severe.hex },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="w-full lg:w-80 flex flex-col gap-3 max-h-[650px]">
          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-panel rounded-xl p-3 text-center">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-on-surface">{cities.length}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500 }} className="text-on-surface-variant">Cities Monitored</div>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center border border-error/20">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-error">{severeCount + unhealthyCount}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500 }} className="text-on-surface-variant">At Risk</div>
            </div>
          </div>

          {/* City list */}
          <div className="glass-panel rounded-xl p-3 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/15 shrink-0">
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} className="text-on-surface">City Rankings</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600 }} className="text-on-surface-variant">Sorted by AQI ↓</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
              {filtered.map((city, idx) => {
                const style = STATUS_STYLES[city.statusColor];
                return (
                  <div key={city.id} className={`p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-variant/40 transition-all cursor-pointer ${hoveredCity === city.id ? 'ring-1 ring-primary/30' : ''}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded bg-surface-variant flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: 'var(--color-on-surface)' }}>{idx + 1}</span>
                        <div className="min-w-0">
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }} className="text-on-surface truncate">{city.name}</div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }} className="text-on-surface-variant truncate">{city.state}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700 }} className={style.text}>{city.aqi}</span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${style.bg} rounded-full`} style={{ width: `${Math.min((city.aqi / 300) * 100, 100)}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI recommendation */}
          <div className="glass-panel rounded-xl p-3 ai-glow border border-primary/20 shrink-0">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: 18 }}>psychology</span>
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700 }} className="text-primary">AI Recommendation</span>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: '16px' }} className="text-on-surface-variant mt-1">
                  {severeCount > 0
                    ? `${severeCount} cities show severe AQI levels. Recommend issuing public health advisory and activating emergency air quality protocols in affected regions.`
                    : 'Air quality across India is within manageable limits. Continue routine monitoring.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchIndiaStations, STATUS_STYLES, type StationData } from '../data/cities';

export default function PollutionMap() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchIndiaStations()
      .then(data => {
        // Filter out stations with invalid or missing AQI
        const validStations = data.filter(s => s.aqi > 0);
        setStations(validStations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedStatus === 'all' ? stations : stations.filter(s => s.statusColor === selectedStatus);
  const hazardousCount = stations.filter(s => s.statusColor === 'hazardous').length;
  const veryUnhealthyCount = stations.filter(s => s.statusColor === 'very_unhealthy').length;
  const unhealthyCount = stations.filter(s => s.statusColor === 'unhealthy').length;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 pb-24 md:pb-6 gap-4 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">Live AQI Stations</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }} className="text-on-surface-variant mt-1">
            Real-time air quality from {stations.length} monitoring stations across India • Powered by WAQI
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedStatus === 'all' ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'}`}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            All ({stations.length})
          </button>
          {[
            { key: 'hazardous', label: 'Hazardous', count: hazardousCount, colorClass: 'text-[#b71c1c]' },
            { key: 'very_unhealthy', label: 'Very Unhealthy', count: veryUnhealthyCount, colorClass: 'text-[#9c27b0]' },
            { key: 'unhealthy', label: 'Unhealthy', count: unhealthyCount, colorClass: 'text-error' },
          ].map(f => f.count > 0 && (
            <button
              key={f.key}
              onClick={() => setSelectedStatus(f.key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${selectedStatus === f.key ? 'bg-surface-variant text-on-surface border border-outline-variant/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'}`}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}
            >
              <span className={f.colorClass}>{f.label}</span> ({f.count})
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
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }} className="text-on-surface-variant">Connecting to WAQI sensor network...</span>
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
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={18}
              />
              <ZoomControl position="bottomright" />

              {/* Station markers */}
              {filtered.map(station => {
                const style = STATUS_STYLES[station.statusColor];
                return (
                  <CircleMarker
                    key={station.uid}
                    center={[station.lat, station.lng]}
                    radius={8}
                    fillColor={style.hex}
                    color={style.hex}
                    weight={1}
                    opacity={0.9}
                    fillOpacity={0.7}
                    eventHandlers={{
                      mouseover: () => setHoveredStation(station.uid),
                      mouseout: () => setHoveredStation(null),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px] p-2">
                        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, paddingBottom: 4, borderBottom: '1px solid #eee', marginBottom: 8 }}>{station.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 700, color: style.hex, lineHeight: 1 }}>{station.aqi}</span>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#888', marginLeft: 4 }}>US AQI</span>
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4, backgroundColor: style.hex, color: '#fff', textAlign: 'center', minWidth: 60 }}>{station.status}</span>
                        </div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#888', marginTop: 8, textAlign: 'right' }}>
                          Updated: {new Date(station.time).toLocaleTimeString()}
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
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }} className="text-on-surface-variant uppercase block">AQI Scale (US EPA)</span>
            {[
              { label: '0-50 Good', color: STATUS_STYLES.good.hex },
              { label: '51-100 Moderate', color: STATUS_STYLES.moderate.hex },
              { label: '101-150 Unhealthy for Sensitive Groups', color: STATUS_STYLES.unhealthy_sensitive.hex },
              { label: '151-200 Unhealthy', color: STATUS_STYLES.unhealthy.hex },
              { label: '201-300 Very Unhealthy', color: STATUS_STYLES.very_unhealthy.hex },
              { label: '300+ Hazardous', color: STATUS_STYLES.hazardous.hex },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="w-full lg:w-96 flex flex-col gap-3 max-h-[650px]">
          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-panel rounded-xl p-3 text-center">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-on-surface">{stations.length}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500 }} className="text-on-surface-variant">Live Stations</div>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center border border-[#9c27b0]/30 bg-[#9c27b0]/5">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700 }} className="text-[#9c27b0]">{hazardousCount + veryUnhealthyCount}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500 }} className="text-on-surface-variant">Hazardous / Very Unhealthy</div>
            </div>
          </div>

          {/* Station list (Top 100) */}
          <div className="glass-panel rounded-xl p-3 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/15 shrink-0">
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} className="text-on-surface">Top Polluted Stations</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600 }} className="text-on-surface-variant">Top 100</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
              {filtered.slice(0, 100).map((station, idx) => {
                const style = STATUS_STYLES[station.statusColor];
                return (
                  <div key={station.uid} className={`p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-variant/40 transition-all cursor-pointer ${hoveredStation === station.uid ? 'ring-1 ring-primary/30 bg-surface-variant/80' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-3">
                        <span className="w-6 h-6 rounded bg-surface-variant flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: 'var(--color-on-surface)' }}>{idx + 1}</span>
                        <div className="min-w-0">
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }} className="text-on-surface truncate" title={station.name}>{station.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700 }} className={style.text}>{station.aqi}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${style.bg} rounded-full`} style={{ width: `${Math.min((station.aqi / 500) * 100, 100)}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

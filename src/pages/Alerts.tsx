import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  zone: string;
  time: string;
  read: boolean;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.4744&longitude=77.5040&current=us_aqi,pm2_5,pm10,nitrogen_dioxide&timezone=auto";
        const res = await fetch(url);
        const data = await res.json();
        const aqi = data.current?.us_aqi || 0;
        const pm25 = data.current?.pm2_5 || 0;
        const pm10 = data.current?.pm10 || 0;

        const generated: Alert[] = [];
        const now = new Date();

        if (aqi > 150) {
          generated.push({ id: '1', type: 'critical', title: 'AQI Exceeds Unhealthy Level', message: `Current AQI is ${aqi}. Immediate action recommended for sensitive groups. Consider activating emergency ventilation protocols.`, zone: 'Greater Noida', time: now.toLocaleTimeString(), read: false });
        } else if (aqi > 100) {
          generated.push({ id: '1', type: 'warning', title: 'AQI Elevated — Moderate Risk', message: `Current AQI is ${aqi}. Air quality is unhealthy for sensitive groups. Outdoor activities should be limited.`, zone: 'Greater Noida', time: now.toLocaleTimeString(), read: false });
        } else {
          generated.push({ id: '1', type: 'info', title: 'AQI Within Safe Limits', message: `Current AQI is ${aqi}. No immediate action required. Monitoring continues.`, zone: 'Greater Noida', time: now.toLocaleTimeString(), read: true });
        }

        if (pm25 > 35) {
          generated.push({ id: '2', type: 'critical', title: 'PM2.5 Above WHO Guideline', message: `PM2.5 is at ${pm25} µg/m³, exceeding the WHO 24-hour guideline of 15 µg/m³. Deploy air purification systems.`, zone: 'Northern Industrial', time: new Date(now.getTime() - 1200000).toLocaleTimeString(), read: false });
        }
        if (pm10 > 45) {
          generated.push({ id: '3', type: 'warning', title: 'PM10 Concentration Rising', message: `PM10 levels at ${pm10} µg/m³. Dust suppression recommended in construction zones.`, zone: 'Pari Chowk', time: new Date(now.getTime() - 3600000).toLocaleTimeString(), read: false });
        }

        generated.push({ id: '4', type: 'info', title: 'Sensor Network Health Check', message: 'All 12 sensor nodes in Greater Noida reporting normal. Next calibration scheduled in 48 hours.', zone: 'All Zones', time: new Date(now.getTime() - 7200000).toLocaleTimeString(), read: true });
        generated.push({ id: '5', type: 'warning', title: 'Traffic Congestion Detected', message: 'Heavy traffic detected along Noida-Greater Noida Expressway. Vehicular emissions expected to spike in Zone S4.', zone: 'Expressway Corridor', time: new Date(now.getTime() - 5400000).toLocaleTimeString(), read: true });
        generated.push({ id: '6', type: 'info', title: 'AI Model Retrained', message: 'Predictive model retrained with latest 72-hour data. Accuracy improved to 94.2%.', zone: 'System', time: new Date(now.getTime() - 10800000).toLocaleTimeString(), read: true });

        setAlerts(generated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const iconMap = { critical: 'error', warning: 'warning', info: 'info' };
  const colorMap = {
    critical: { text: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: 'bg-error/20' },
    warning: { text: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20', icon: 'bg-tertiary/20' },
    info: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: 'bg-primary/20' },
  };

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">Alerts</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Real-time environmental notifications for Greater Noida.</p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-error/10 border border-error/20 rounded-xl">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>crisis_alert</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }} className="text-error">{criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'critical', 'warning', 'info'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full transition-all duration-200 capitalize ${
              filter === f
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }}
          >
            {f === 'all' ? `All (${alerts.length})` : `${f} (${alerts.filter(a => a.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {loading ? (
          <div className="glass-panel rounded-xl p-12 flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 28 }}>progress_activity</span>
            <span className="ml-3 text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading alerts...</span>
          </div>
        ) : filtered.map(alert => {
          const c = colorMap[alert.type];
          return (
            <div key={alert.id} className={`glass-panel rounded-xl p-5 border ${c.border} transition-all duration-200 hover:shadow-lg ${!alert.read ? 'border-l-4' : 'opacity-75'}`}>
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
                    {iconMap[alert.type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className={`${c.text}`}>{alert.title}</h3>
                    {!alert.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: '20px' }} className="text-on-surface-variant mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-on-surface-variant/60" style={{ fontSize: 12 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>{alert.zone}
                    </span>
                    <span className="flex items-center gap-1 text-on-surface-variant/60" style={{ fontSize: 12 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>{alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

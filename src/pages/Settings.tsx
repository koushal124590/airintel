import { useState } from 'react';

export default function Settings() {
  const [location, setLocation] = useState('Greater Noida');
  const [refreshRate, setRefreshRate] = useState('5');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({ critical: true, warning: true, info: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full space-y-6">
      <div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-on-surface">Settings</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }} className="text-on-surface-variant mt-1">Configure your AirIntel dashboard preferences.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }} className="text-secondary">Settings saved successfully!</span>
        </div>
      )}

      {/* Location */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>location_on</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Monitoring Location</span>
        </h3>
        <div>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500 }} className="text-on-surface-variant block mb-2">Primary City</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}
          >
            <option value="Greater Noida">Greater Noida, Uttar Pradesh</option>
            <option value="Noida">Noida, Uttar Pradesh</option>
            <option value="Delhi">New Delhi</option>
            <option value="Gurgaon">Gurgaon, Haryana</option>
          </select>
        </div>
      </div>

      {/* Data */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>sync</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Data & Refresh</span>
        </h3>
        <div>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500 }} className="text-on-surface-variant block mb-2">Auto-refresh interval</label>
          <div className="flex gap-2">
            {['1', '5', '15', '30'].map(v => (
              <button
                key={v}
                onClick={() => setRefreshRate(v)}
                className={`px-4 py-2 rounded-xl transition-all ${refreshRate === v ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'}`}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }}
              >
                {v} min
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500 }} className="text-on-surface-variant block mb-2">Data source</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-outline-variant/10 rounded-xl">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>cloud_done</span>
            <div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }} className="text-on-surface">Open-Meteo Air Quality API</span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant mt-0.5">Free, open-source weather API. No API key required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>notifications</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Notifications</span>
        </h3>
        {[
          { key: 'critical' as const, label: 'Critical alerts', desc: 'AQI > 150 or sensor failures', color: 'bg-error' },
          { key: 'warning' as const, label: 'Warning alerts', desc: 'AQI > 100 or rising trends', color: 'bg-tertiary' },
          { key: 'info' as const, label: 'Info updates', desc: 'Model retraining, sensor health', color: 'bg-primary' },
        ].map(n => (
          <div key={n.key} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${n.color}`} />
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500 }} className="text-on-surface">{n.label}</span>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }} className="text-on-surface-variant">{n.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications[n.key] ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${notifications[n.key] ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>palette</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600 }} className="text-on-surface">Appearance</span>
        </h3>
        <div className="flex gap-3">
          {[
            { val: 'dark', icon: 'dark_mode', label: 'Dark' },
            { val: 'light', icon: 'light_mode', label: 'Light' },
            { val: 'auto', icon: 'brightness_auto', label: 'Auto' },
          ].map(t => (
            <button
              key={t.val}
              onClick={() => setTheme(t.val)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${theme === t.val ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:bg-surface-variant/50'}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: theme === t.val ? "'FILL' 1" : "'FILL' 0" }}>{t.icon}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
        Save Settings
      </button>
    </main>
  );
}

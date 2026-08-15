import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const mainNavItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/map', icon: 'map', label: 'Pollution Map' },
    { to: '/forecast', icon: 'query_stats', label: 'AI Forecast' },
    { to: '/alerts', icon: 'notifications_active', label: 'Alerts' },
    { to: '/insights', icon: 'psychology', label: 'AI Insights' },
  ];

  const secondaryNavItems = [
    { to: '/zones', icon: 'location_city', label: 'City Zones' },
    { to: '/analytics', icon: 'bar_chart', label: 'Analytics' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
  ];

  const mobileNavItems = [
    { to: '/', icon: 'home', label: 'Home' },
    { to: '/map', icon: 'explore', label: 'Map' },
    { to: '/forecast', icon: 'online_prediction', label: 'Forecast', isPrimary: true },
    { to: '/alerts', icon: 'warning', label: 'Alerts', hasAlert: true },
    { to: '/analytics', icon: 'bar_chart', label: 'More' },
  ];

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[280px] bg-surface-container border-r border-outline-variant/10 z-40">
        <div className="flex flex-col h-full py-6 px-5">
          
          {/* Brand */}
          <div className="mb-8 px-3">
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>air</span>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }} className="text-primary">AirIntel</h1>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em' }} className="text-on-surface-variant uppercase">Municipal AI Platform</p>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }} className="text-on-surface-variant/60 uppercase px-3 mb-2">Main</p>
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary/12 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
                    <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <div className="my-3 mx-3 border-t border-outline-variant/15" />

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }} className="text-on-surface-variant/60 uppercase px-3 mb-2">Tools</p>
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary/12 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
                    <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-outline-variant/10 space-y-3 px-1">
            <div className="flex items-center gap-3 px-3 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }} className="text-secondary">AI Model Online</span>
            </div>
            <button className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
              Export Report
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-2 pt-2 pb-safe bg-surface-container-highest/95 backdrop-blur-2xl border-t border-outline-variant/20 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)]">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              item.isPrimary
                ? `flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full w-14 h-14 -mt-5 shadow-xl transition-all duration-300 border-4 border-background ${isActive ? 'ring-2 ring-primary/50 scale-110' : 'hover:scale-105'}`
                : `flex flex-col items-center justify-center py-2 px-3 rounded-xl relative transition-all duration-200 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.hasAlert && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-surface-container-highest"></span>
                )}
                {!item.isPrimary && (
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: isActive ? 700 : 500, marginTop: 2 }}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

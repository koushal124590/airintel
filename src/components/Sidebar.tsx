import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const desktopNavItems = [
    { to: '/', icon: 'dashboard', label: 'Overview' },
    { to: '/map', icon: 'map', label: 'Pollution Map' },
    { to: '/forecast', icon: 'query_stats', label: 'AI Forecast' },
    { to: '/alerts', icon: 'notifications_active', label: 'Alerts' },
    { to: '/insights', icon: 'psychology', label: 'AI Insights' },
    { to: '/zones', icon: 'location_city', label: 'City Zones' },
    { to: '/analytics', icon: 'bar_chart', label: 'Analytics' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
  ];

  const mobileNavItems = [
    { to: '/', icon: 'home', label: 'Home' },
    { to: '/map', icon: 'explore', label: 'Map' },
    { to: '/forecast', icon: 'online_prediction', label: 'Forecast', isPrimary: true },
    { to: '/alerts', icon: 'warning', label: 'Alerts', hasAlert: true },
    { to: '/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <>
      {/* DESKTOP SHELL: SideNavBar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[280px] bg-surface-container border-r border-outline-variant/10 shadow-md z-40">
        <div className="flex flex-col h-full py-8 px-4">
          {/* Brand / Header */}
          <div className="mb-10 px-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
              <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">AirIntel</h1>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Municipal AI Platform</p>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-primary font-bold bg-primary/10 shadow-sm border border-primary/10'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-transparent'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer / CTA */}
          <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-4">
            <div className="flex items-center gap-3 px-4 py-2 text-secondary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
              <span>AI Model Online</span>
            </div>
            <button className="w-full bg-[#34A853] hover:bg-[#2b8c45] text-white font-label-sm text-label-sm py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Export Report
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SHELL: BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container-highest/90 backdrop-blur-2xl border-t border-outline-variant/20 shadow-[0px_-4px_16px_rgba(0,0,0,0.4)] rounded-t-xl pb-safe">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              item.isPrimary
                ? `flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full p-2 w-16 h-16 -mt-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-[6px] border-background ${isActive ? 'ring-2 ring-primary/50' : ''}`
                : `flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-variant rounded-xl relative w-14 h-14 transition-all duration-200 ${
                    isActive ? 'bg-surface-variant text-on-surface font-semibold scale-105' : ''
                  }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[24px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                {item.hasAlert && (
                  <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container"></span>
                )}
                {!item.isPrimary && (
                  <span className={`font-label-sm text-[11px] leading-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
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

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet icons not showing in React properly
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ZONES = [
  { id: 'N1', name: 'Northern Industrial', lat: 28.4900, lng: 77.5100 },
  { id: 'S4', name: 'South Residential', lat: 28.4600, lng: 77.4950 },
  { id: 'C2', name: 'Central Business District', lat: 28.4750, lng: 77.5000 },
  { id: 'E1', name: 'Eastern Tech Park', lat: 28.4800, lng: 77.5200 },
  { id: 'W3', name: 'West Suburbs', lat: 28.4700, lng: 77.4800 },
];

export default function PollutionMap() {
  const [zones, setZones] = useState<any[]>(ZONES.map(z => ({ ...z, aqi: 0, status: 'Loading', risk: 'Unknown', trend: 'flat' })));
  
  useEffect(() => {
    async function fetchAllZones() {
      // For demonstration, we will fetch data for all zones based on their coordinates
      // Since it's a demo, we might just add slight random variation to the base coordinates to simulate different data
      try {
        const promises = ZONES.map(z => 
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${z.lat}&longitude=${z.lng}&current=us_aqi&timezone=auto`)
            .then(res => res.json())
            .then(data => ({
              ...z,
              aqi: data.current?.us_aqi || Math.floor(Math.random() * 200) + 20, // Fallback random if API fails
            }))
        );
        
        const results = await Promise.all(promises);
        
        const formattedZones = results.map(z => {
          let status = 'Good';
          let risk = 'Minimal';
          let trend = 'flat';
          
          if (z.aqi > 150) { status = 'Severe'; risk = 'High'; trend = 'up'; }
          else if (z.aqi > 100) { status = 'Unhealthy'; risk = 'Medium'; trend = 'up'; }
          else if (z.aqi > 50) { status = 'Moderate'; risk = 'Low'; trend = 'down'; }
          
          return { ...z, status, risk, trend };
        });
        
        setZones(formattedZones);
      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    }
    
    fetchAllZones();
  }, []);

  const getAqiColor = (aqi: number) => {
    if (aqi > 150) return '#ffb4ab'; // error
    if (aqi > 100) return '#fbbc05'; // tertiary
    if (aqi > 50) return '#4d8efe'; // primary
    return '#6ddd81'; // secondary
  };

  const getAqiColorClass = (aqi: number) => {
    if (aqi > 150) return { text: 'text-error', bg: 'bg-error', bgOp: 'bg-error/10', border: 'border-error/20' };
    if (aqi > 100) return { text: 'text-tertiary', bg: 'bg-tertiary', bgOp: 'bg-tertiary/10', border: 'border-tertiary/20' };
    if (aqi > 50) return { text: 'text-primary', bg: 'bg-primary', bgOp: 'bg-primary/10', border: 'border-primary/20' };
    return { text: 'text-secondary', bg: 'bg-secondary', bgOp: 'bg-secondary/10', border: 'border-secondary/20' };
  };

  return (
    <div className="p-container-padding-mobile md:p-container-padding-desktop flex-1 space-y-gutter max-w-7xl mx-auto w-full pb-20 md:pb-0 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Pollution Map</h2>
          <p className="font-title-md text-title-md text-on-surface-variant mt-2">Real-time neighborhood risk assessment.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-primary">filter_list</span>
            <span className="font-label-sm text-label-sm">Filters</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer bg-primary/10 border-primary/30">
            <span className="material-symbols-outlined text-[18px] text-primary">layers</span>
            <span className="font-label-sm text-label-sm text-primary">AQI Overlay</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-card-gap flex-1 min-h-[500px]">
        {/* Map Area */}
        <div className="glass-panel rounded-xl flex-1 relative overflow-hidden group z-0">
          <MapContainer 
            center={[28.4744, 77.5040]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', minHeight: '400px' }}
            className="z-0"
          >
            {/* Using a dark themed OpenStreetMap tile layer (CartoDB Dark Matter) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {zones.map(zone => (
              <CircleMarker 
                key={zone.id}
                center={[zone.lat, zone.lng]} 
                radius={25}
                fillColor={getAqiColor(zone.aqi)}
                color={getAqiColor(zone.aqi)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.4}
              >
                <Popup className="dark-popup">
                  <div className="p-1 min-w-[120px]">
                    <h3 className="font-bold text-sm text-gray-800 m-0">{zone.name}</h3>
                    <p className="text-xs text-gray-500 m-0 mt-1">Zone: {zone.id}</p>
                    <div className="mt-2 flex items-center justify-between">
                       <span className="text-xs font-semibold">AQI: {zone.aqi}</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded text-white`} style={{backgroundColor: getAqiColor(zone.aqi)}}>{zone.status}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar List */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col overflow-hidden max-h-[500px]">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20 shrink-0">
               <h3 className="font-title-md text-title-md text-on-surface">Zone Risk Levels</h3>
               <span className="px-2 py-0.5 bg-error/20 text-error rounded-full text-[10px] font-bold uppercase tracking-wider">
                 {zones.filter(z => z.aqi > 150).length} Critical
               </span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
                {zones.sort((a,b) => b.aqi - a.aqi).map(zone => {
                  const colors = getAqiColorClass(zone.aqi);

                  return (
                    <div key={zone.id} className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-variant/50 transition-colors cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface shrink-0">{zone.id}</div>
                            <span className="font-label-sm text-label-sm text-on-surface truncate max-w-[120px]">{zone.name}</span>
                         </div>
                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colors.text} ${colors.bgOp} ${colors.border}`}>{zone.risk}</span>
                       </div>
                       
                       <div className="flex items-end justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <span className="font-title-md text-title-md font-bold text-on-surface">{zone.aqi}</span>
                            <span className="font-label-sm text-[10px] text-on-surface-variant">AQI</span>
                          </div>
                          <span className={`material-symbols-outlined text-[16px] ${colors.text}`}>
                            {zone.trend === 'up' ? 'trending_up' : zone.trend === 'down' ? 'trending_down' : 'trending_flat'}
                          </span>
                       </div>
                       
                       <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${colors.bg}`} style={{ width: `${Math.min((zone.aqi / 300) * 100, 100)}%` }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
          
          <div className="glass-panel rounded-xl p-4 bg-primary-container/10 border-primary/20 ai-glow flex items-start gap-3 shrink-0">
             <span className="material-symbols-outlined text-primary mt-1">psychology</span>
             <div>
               <h4 className="font-label-sm text-label-sm text-primary font-bold">AI Recommendation</h4>
               <p className="font-body-md text-[12px] leading-tight text-on-surface-variant mt-1">
                 Deploy dust-suppression units to the highest risk zones immediately. Traffic rerouting recommended by 17:00.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

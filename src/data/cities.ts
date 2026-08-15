// ── Real-time AQI Data Layer ──
// Uses WAQI (World Air Quality Index) API — same source as aqi.in
// Free demo token, real-time station data across India

export interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lng: number;
  name: string;
  time: string;
  status: string;
  statusColor: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
}

export function getAqiStatus(aqi: number): { label: string; color: StationData['statusColor'] } {
  if (aqi <= 50) return { label: 'Good', color: 'good' };
  if (aqi <= 100) return { label: 'Moderate', color: 'moderate' };
  if (aqi <= 150) return { label: 'Unhealthy (SG)', color: 'unhealthy_sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'unhealthy' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'very_unhealthy' };
  return { label: 'Hazardous', color: 'hazardous' };
}

export const STATUS_STYLES: Record<StationData['statusColor'], { text: string; bg: string; bgOp: string; border: string; hex: string }> = {
  good:                 { text: 'text-secondary',  bg: 'bg-secondary',  bgOp: 'bg-secondary/10',  border: 'border-secondary/20',  hex: '#6ddd81' },
  moderate:             { text: 'text-tertiary',   bg: 'bg-tertiary',   bgOp: 'bg-tertiary/10',   border: 'border-tertiary/20',   hex: '#fbbc05' },
  unhealthy_sensitive:  { text: 'text-[#ff9800]',  bg: 'bg-[#ff9800]',  bgOp: 'bg-[#ff9800]/10',  border: 'border-[#ff9800]/20',  hex: '#ff9800' },
  unhealthy:            { text: 'text-error',      bg: 'bg-error',      bgOp: 'bg-error/10',      border: 'border-error/20',      hex: '#ffb4ab' },
  very_unhealthy:       { text: 'text-[#9c27b0]',  bg: 'bg-[#9c27b0]',  bgOp: 'bg-[#9c27b0]/10',  border: 'border-[#9c27b0]/20',  hex: '#ce93d8' },
  hazardous:            { text: 'text-[#b71c1c]',  bg: 'bg-[#b71c1c]',  bgOp: 'bg-[#b71c1c]/10',  border: 'border-[#b71c1c]/20',  hex: '#ef5350' },
};

// ── WAQI API ──
// Using the free demo token (same data source as aqi.in)
const WAQI_TOKEN = 'demo';

// Fetch ALL monitoring stations within India's bounding box
export async function fetchIndiaStations(): Promise<StationData[]> {
  // India bounding box: lat 6.5-35.5, lng 68.1-97.4
  const url = `https://api.waqi.info/v2/map/bounds?latlng=6.5,68.1,35.5,97.4&networks=all&token=${WAQI_TOKEN}`;
  
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'ok' || !Array.isArray(json.data)) {
    console.error('WAQI API error:', json);
    return [];
  }

  return json.data
    .filter((s: any) => s.aqi && s.aqi !== '-' && !isNaN(Number(s.aqi)))
    .map((s: any) => {
      const aqi = Number(s.aqi);
      const st = getAqiStatus(aqi);
      return {
        uid: s.uid,
        aqi,
        lat: s.lat,
        lng: s.lon,
        name: s.station?.name || 'Unknown Station',
        time: s.station?.time || '',
        status: st.label,
        statusColor: st.color,
      };
    })
    .sort((a: StationData, b: StationData) => b.aqi - a.aqi);
}

// Fetch detailed data for a specific station by city name
export async function fetchStationDetail(city: string) {
  const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${WAQI_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== 'ok') return null;
  return json.data;
}

// ── Open-Meteo (for hourly forecast data — WAQI doesn't provide this) ──
export async function fetchHourlyForecast(lat: number, lng: number, pastDays = 1, forecastDays = 2) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide&hourly=us_aqi,pm2_5,pm10,nitrogen_dioxide&timezone=auto&past_days=${pastDays}&forecast_days=${forecastDays}`;
  const res = await fetch(url);
  return res.json();
}

// Major Indian cities for the forecast dropdown
export const MAJOR_CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Greater Noida', lat: 28.4744, lng: 77.5040 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Patna', lat: 25.6093, lng: 85.1376 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
];

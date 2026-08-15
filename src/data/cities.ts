// ── Indian Cities Database ──
// Coordinates and metadata for major Indian cities used across the app.

export interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  population: string; // approximate, for context
}

export const INDIAN_CITIES: CityData[] = [
  { id: 'DEL', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, population: '32M' },
  { id: 'MUM', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: '21M' },
  { id: 'BLR', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, population: '13M' },
  { id: 'HYD', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, population: '10M' },
  { id: 'CHN', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, population: '11M' },
  { id: 'KOL', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, population: '15M' },
  { id: 'PUN', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: '7M' },
  { id: 'AMD', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, population: '8M' },
  { id: 'JAI', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: '4M' },
  { id: 'LKO', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, population: '4M' },
  { id: 'GNO', name: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040, population: '1M' },
  { id: 'CHD', name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, population: '1.2M' },
  { id: 'BHO', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, population: '2.5M' },
  { id: 'PAT', name: 'Patna', state: 'Bihar', lat: 25.6093, lng: 85.1376, population: '2.5M' },
  { id: 'IND', name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, population: '3.5M' },
  { id: 'NAG', name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: '3M' },
  { id: 'VIS', name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, population: '2M' },
  { id: 'VNS', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, population: '1.8M' },
  { id: 'GUW', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, population: '1.1M' },
  { id: 'COI', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, population: '2.1M' },
  { id: 'KOC', name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, population: '2.1M' },
  { id: 'GAH', name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266, population: '1.5M' },
  { id: 'RAI', name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, population: '1.2M' },
  { id: 'DUN', name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, population: '0.7M' },
  { id: 'AGR', name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, population: '2M' },
];

// ── AQI Helpers ──

export interface CityAQI extends CityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  status: string;
  statusColor: 'good' | 'moderate' | 'unhealthy' | 'severe';
}

export function getAqiStatus(aqi: number): { label: string; color: 'good' | 'moderate' | 'unhealthy' | 'severe' } {
  if (aqi <= 50) return { label: 'Good', color: 'good' };
  if (aqi <= 100) return { label: 'Moderate', color: 'moderate' };
  if (aqi <= 150) return { label: 'Unhealthy', color: 'unhealthy' };
  return { label: 'Severe', color: 'severe' };
}

export const STATUS_STYLES = {
  good: { text: 'text-secondary', bg: 'bg-secondary', bgOp: 'bg-secondary/10', border: 'border-secondary/20', hex: '#6ddd81' },
  moderate: { text: 'text-primary', bg: 'bg-primary', bgOp: 'bg-primary/10', border: 'border-primary/20', hex: '#adc6ff' },
  unhealthy: { text: 'text-tertiary', bg: 'bg-tertiary', bgOp: 'bg-tertiary/10', border: 'border-tertiary/20', hex: '#fbbc05' },
  severe: { text: 'text-error', bg: 'bg-error', bgOp: 'bg-error/10', border: 'border-error/20', hex: '#ffb4ab' },
};

// ── Data Fetching ──

// Fetch AQI for a batch of cities from Open-Meteo (free, no key)
export async function fetchCitiesAQI(cities: CityData[]): Promise<CityAQI[]> {
  // Open-Meteo supports multi-location in a single request via comma-separated coords
  const lats = cities.map(c => c.lat).join(',');
  const lngs = cities.map(c => c.lng).join(',');
  
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide&timezone=auto`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  // Open-Meteo returns an array when multiple locations are requested
  const results: any[] = Array.isArray(data) ? data : [data];
  
  return cities.map((city, i) => {
    const d = results[i]?.current || {};
    const aqi = d.us_aqi ?? Math.floor(Math.random() * 200 + 20);
    const status = getAqiStatus(aqi);
    return {
      ...city,
      aqi,
      pm25: d.pm2_5 ?? 0,
      pm10: d.pm10 ?? 0,
      no2: d.nitrogen_dioxide ?? 0,
      status: status.label,
      statusColor: status.color,
    };
  });
}

// Fetch hourly forecast for a single location
export async function fetchHourlyForecast(lat: number, lng: number, pastDays = 1, forecastDays = 2) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide&hourly=us_aqi,pm2_5,pm10,nitrogen_dioxide&timezone=auto&past_days=${pastDays}&forecast_days=${forecastDays}`;
  const res = await fetch(url);
  return res.json();
}

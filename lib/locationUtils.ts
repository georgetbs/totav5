import { getCityCoordinates, mapSmallCityToBigCity } from './weatherUtils'
import { findNearestCity, preloadedCities } from './preloadedCities'

let useOptimizedMode = true;

export function setOptimizedMode(value: boolean) {
  useOptimizedMode = value;
}

export async function getCurrentLocation(): Promise<{ lat: number; lon: number; cityName: string }> {
  // Try browser geolocation first
  const browserLocation = await getBrowserGeolocation();
  if (browserLocation) {
    saveCity(browserLocation.cityName);
    return browserLocation;
  }

  // If browser geolocation fails, try IP-based methods
  const ipLocation = await getLocationByIP();
  if (ipLocation) {
    saveCity(ipLocation.cityName);
    return ipLocation;
  }

  // If API methods fail, try to get the last saved city
  const savedCity = localStorage.getItem('lastCity');
  if (savedCity) {
    const cityCoords = getCityCoordinates(savedCity);
    if (cityCoords) {
      console.log('Using last saved city:', savedCity);
      return { ...cityCoords, cityName: savedCity };
    }
  }

  // If all methods fail, return a default location (e.g., Tbilisi)
  console.warn('All location methods failed. Using Tbilisi as default.');
  return { lat: 41.7151, lon: 44.8271, cityName: 'თბილისი' };
}

async function getBrowserGeolocation(): Promise<{ lat: number; lon: number; cityName: string } | null> {
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      const { latitude, longitude } = position.coords;
      
      if (useOptimizedMode) {
        const nearestCity = findNearestCity(latitude, longitude);
        return { lat: nearestCity.lat, lon: nearestCity.lon, cityName: nearestCity.name };
      } else {
        const cityName = await getCityNameFromCoords(latitude, longitude);
        return { lat: latitude, lon: longitude, cityName };
      }
    } catch (error) {
      console.error('Browser geolocation failed:', error);
      return null;
    }
  }
  return null;
}

async function getLocationByIP(): Promise<{ lat: number; lon: number; cityName: string } | null> {
  const ipApis = [
    { url: 'https://ipapi.co/json/', parse: (data: any) => ({ lat: data.latitude, lon: data.longitude, city: data.city }) },
    { url: 'https://ip-api.com/json/', parse: (data: any) => ({ lat: data.lat, lon: data.lon, city: data.city }) },
    { url: 'https://ipwhois.app/json/', parse: (data: any) => ({ lat: data.latitude, lon: data.longitude, city: data.city }) },
    { url: 'https://ipinfo.io/json', parse: (data: any) => {
      const [lat, lon] = data.loc.split(',').map(Number);
      return { lat, lon, city: data.city };
    }}
  ];

  for (const api of ipApis) {
    try {
      const response = await fetch(api.url);
      const data = await response.json();
      const { lat, lon, city } = api.parse(data);

      if (lat && lon && city) {
        const cityName = mapSmallCityToBigCity(city);
        
        if (useOptimizedMode) {
          const nearestCity = findNearestCity(lat, lon);
          return { lat: nearestCity.lat, lon: nearestCity.lon, cityName: nearestCity.name };
        } else {
          const cityCoords = getCityCoordinates(cityName);
          return cityCoords ? { ...cityCoords, cityName } : { lat, lon, cityName };
        }
      }
    } catch (error) {
      console.error(`Error fetching location from ${api.url}:`, error);
    }
  }

  return null;
}

async function getCityNameFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown';
  }
}

function saveCity(cityName: string) {
  localStorage.setItem('lastCity', cityName);
}

export { getCityCoordinates };


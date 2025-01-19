interface City {
  name: string;
  lat: number;
  lon: number;
  aliases: string[];
}

export const preloadedCities: City[] = [
  { name: "თბილისი", lat: 41.7151, lon: 44.8271, aliases: ["Tbilisi", "Тбилиси"] },
  { name: "თბილისი - საბურთალო", lat: 41.7270, lon: 44.7530, aliases: ["Tbilisi - Saburtalo", "Тбилиси - Сабуртало"] },
  { name: "თბილისი - მერია", lat: 41.6941, lon: 44.8337, aliases: ["Tbilisi - Meria", "Тбилиси - Мэрия"] },
  { name: "თბილისი - ნაძალადევი", lat: 41.7371, lon: 44.8093, aliases: ["Tbilisi - Nadzaladevi", "Тбилиси - Надзаладеви"] },
  { name: "თბილისი - ზაჰესი", lat: 41.7852, lon: 44.7917, aliases: ["Tbilisi - Zahesi", "Тбилиси - Захеси"] },
  { name: "ბათუმი", lat: 41.6417, lon: 41.6395, aliases: ["Batumi", "Батуми"] },
  { name: "რუსთავი", lat: 41.5495, lon: 44.9932, aliases: ["Rustavi", "Рустави"] },
  { name: "ქუთაისი", lat: 42.2679, lon: 42.7180, aliases: ["Kutaisi", "Кутаиси"] },
  { name: "ზუგდიდი", lat: 42.5088, lon: 41.8709, aliases: ["Zugdidi", "Зугдиди"] },
  { name: "სოხუმი", lat: 43.0015, lon: 41.0234, aliases: ["Sokhumi", "Сухуми"] },
  { name: "თელავი", lat: 41.9198, lon: 45.4731, aliases: ["Telavi", "Телави"] },
  { name: "ახალციხე", lat: 41.6392, lon: 42.9826, aliases: ["Akhaltsikhe", "Ахалцихе"] },
  { name: "სტეფანწმინდა", lat: 42.6562, lon: 44.6419, aliases: ["Stepantsminda", "Степанцминда"] },
  { name: "მესტია", lat: 43.0423, lon: 42.7178, aliases: ["Mestia", "Местиа"] },
  { name: "ონი", lat: 42.5833, lon: 43.4500, aliases: ["Oni", "Они"] }
];

export const tbilisiDistricts: string[] = [
  "თბილისი - საბურთალო",
  "თბილისი - მერია",
  "თბილისი - ნაძალადევი",
  "თბილისი - ზაჰესი"
];

export function findNearestCity(lat: number, lon: number): City {
  return preloadedCities.reduce((nearest, city) => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lon - lon, 2)
    );
    return distance < nearest.distance ? { ...city, distance } : nearest;
  }, { ...preloadedCities[0], distance: Infinity });
}

export function normalizeCity(cityName: string): string {
  if (tbilisiDistricts.includes(cityName)) {
    return "თბილისი";
  }
  return cityName;
}

export function getCityByNameOrAlias(searchTerm: string): string | null {
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Check preloaded cities first
  for (const city of preloadedCities) {
    if (city.name.toLowerCase() === lowerSearchTerm || city.aliases.some(alias => alias.toLowerCase() === lowerSearchTerm)) {
      return city.name;
    }
  }

  return null;
}


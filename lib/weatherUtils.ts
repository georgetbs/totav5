import { preloadedCities } from '@/lib/preloadedCities'
import cityTranslations from '@/app/data/cityTranslations.json'
import cityTranslationsEn from '@/app/data/cityTranslationsEn.json'
import cityTranslationsRu from '@/app/data/cityTranslationsRu.json'
import descriptionTranslations from '@/app/data/descriptionTranslations.json'
import descriptionTranslationsRu from '@/app/data/descriptionTranslationsRu.json'
import translations from '@/app/data/translations.json'
import smallToBigCityMapping from '@/app/data/smallToBigCityMapping.json'

const API_KEY = process.env.OPENWEATHERAPIKEY

export function getCityCoordinates(cityName: string): { lat: number; lon: number } | null {
  const city = preloadedCities.find(city => city.name === cityName);
  return city ? { lat: city.lat, lon: city.lon } : null;
}

export function mapSmallCityToBigCity(cityName: string): string {
  return smallToBigCityMapping[cityName as keyof typeof smallToBigCityMapping] || cityName
}

export function translateCityName(cityName: string, locale: string): string {
  if (locale === 'ka') {
    return cityName; // Georgian names are already in the correct format
  }
  if (locale === 'en') {
    return cityTranslationsEn[cityName as keyof typeof cityTranslationsEn] || cityName;
  }
  if (locale === 'ru') {
    return cityTranslationsRu[cityName as keyof typeof cityTranslationsRu] || cityName;
  }
  return cityName;
}

export function translateWeatherDescription(description: string, locale: string): string {
  if (locale === 'ka') return descriptionTranslations[description as keyof typeof descriptionTranslations] || description
  if (locale === 'ru') return descriptionTranslationsRu[description as keyof typeof descriptionTranslationsRu] || description
  return description
}

export function translate(key: string, locale: string): string {
  const localeTranslations = translations[locale as keyof typeof translations] || {}
  return localeTranslations[key as keyof typeof localeTranslations] || key
}


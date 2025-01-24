'use client'

import { useState, useEffect } from 'react'
import { Cloud, MapPin, AlertTriangle, Sun, CloudRain, CloudFog, Thermometer, Wind, Snowflake, Zap, CloudDrizzle, Tornado } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { translateCityName, translateWeatherDescription, translate } from '@/lib/weatherUtils'
import { getCityCoordinates } from '@/lib/locationUtils'
import { useI18n } from '@/lib/i18n'
import cityTranslations from '@/app/data/cityTranslations.json'
import cityTranslationsEn from '@/app/data/cityTranslationsEn.json'
import cityTranslationsRu from '@/app/data/cityTranslationsRu.json'

interface WeatherData {
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
  name: string
}

const getWeatherIcon = (description:string) => {
  const desc = description.toLowerCase();

  if (desc.includes('thunderstorm')) return <Zap className="w-6 h-6 text-purple-500" />;
  if (desc.includes('drizzle')) return <CloudDrizzle className="w-6 h-6 text-blue-400" />;
  if (desc.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500" />;
  if (desc.includes('snow')) return <Snowflake className="w-6 h-6 text-gray-300" />;
  if (desc.includes('tornado')) return <Tornado className="w-6 h-6 text-gray-700" />;
  if (
    desc.includes('mist') ||
    desc.includes('fog') ||
    desc.includes('smoke') ||
    desc.includes('haze') ||
    desc.includes('dust') ||
    desc.includes('ash') ||
    desc.includes('squall')
  )
    return <CloudFog className="w-6 h-6 text-gray-400" />;
  if (
    desc.includes('clear') &&
    !desc.includes('cloud')
  )
    return <Sun className="w-6 h-6 text-yellow-500" />;
  if (desc.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;

  // Default icon for unclassified weather
  return <Wind className="w-6 h-6 text-gray-500" />;
};

const formatTemperature = (temp: number): string => {
  const roundedTemp = Math.round(temp)
  return roundedTemp > 0 ? `+${roundedTemp}` : `${roundedTemp}`
}

const translateCity = (cityName: string, locale: string): string => {
  const englishKey = Object.entries(cityTranslations).find(([_, value]) => value === cityName)?.[0]
  
  if (!englishKey) return cityName

  if (locale === 'ka') return cityTranslations[englishKey] || cityName
  if (locale === 'en') return cityTranslationsEn[englishKey] || cityName
  if (locale === 'ru') return cityTranslationsRu[englishKey] || cityName
  
  return cityName
}

export function WeatherWidget() {
  const { locale } = useI18n()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const savedCity = sessionStorage.getItem('selectedCity') || 'თბილისი';
        console.log('Fetching weather for city:', savedCity);

        const cityCoords = getCityCoordinates(savedCity);
        if (!cityCoords) {
          console.error('Invalid city coordinates for:', savedCity);
          throw new Error('Invalid city coordinates');
        }

        console.log('Using coordinates:', cityCoords);
        const response = await fetch(`/api/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&locale=${locale}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch weather data');
        }
        const data = await response.json();
        
        if (!data || !data.main || !data.weather) {
          console.error('Invalid weather data received:', data);
          throw new Error('Invalid weather data received');
        }

        data.name = savedCity; // Use the saved city name instead of API response
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error instanceof Error ? error.message : translate('weather.error', locale));
      }
    }

    fetchWeather()
  }, [locale])

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <span className="text-center">{error}</span>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Sun className="h-5 w-5 animate-spin mr-2" />
            <span>{translate('weather.loading', locale)}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer" onClick={() => router.push(`/${locale}/weather-details`)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          {translate('weather.title', locale)}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${locale}/change-city`);
          }}
        >
          <MapPin className="h-4 w-4" />
          {translateCity(weatherData.name, locale)}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weatherData.weather[0].main)}
              <div className="text-3xl font-bold">
                {formatTemperature(weatherData.main.temp)}°C
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>
                {translate('weather.feelsLike', locale)}: {formatTemperature(weatherData.main.feels_like)}°C
              </div>
              <div className="flex items-center gap-1">
                <Cloud className="h-4 w-4" />
                <div>{translate('weather.humidity', locale)}: {weatherData.main.humidity}%</div>
              </div>
              <div>{translateWeatherDescription(weatherData.weather[0].description, locale)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-8 w-8 text-primary" />
              <div className="text-sm text-muted-foreground">
                {translate('weather.windSpeed', locale)}: {weatherData.wind.speed} {translate('weather.metersPerSecond', locale)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


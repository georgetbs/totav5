'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { translateCityName, translateWeatherDescription, translate } from '@/lib/weatherUtils'
import { getCityCoordinates } from '@/lib/locationUtils'
import { preloadedCities } from '@/lib/preloadedCities'
import { Cloud, Sun, CloudRain, CloudFog, Thermometer, Droplets, Wind, Snowflake, Zap, CloudDrizzle, Tornado } from 'lucide-react'
import cityTranslations from '@/app/data/cityTranslations.json'
import cityTranslationsEn from '@/app/data/cityTranslationsEn.json'
import cityTranslationsRu from '@/app/data/cityTranslationsRu.json'

const translateCity = (cityName: string, locale: string): string => {
  const englishKey = Object.entries(cityTranslations).find(([_, value]) => value === cityName)?.[0]
  
  if (!englishKey) return cityName

  if (locale === 'ka') return cityTranslations[englishKey as keyof typeof cityTranslations] || cityName
  if (locale === 'en') return cityTranslationsEn[englishKey as keyof typeof cityTranslationsEn] || cityName
  if (locale === 'ru') return cityTranslationsRu[englishKey as keyof typeof cityTranslationsRu] || cityName
  
  return cityName
}

interface WeatherData {
  current: {
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      humidity: number
    }
    weather: Array<{
      description: string
      icon: string
    }>
    wind: {
      speed: number
    }
    name: string
  }
  forecast: {
    list: Array<{
      dt: number
      dt_txt: string
      main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        humidity: number
      }
      weather: Array<{
        description: string
        icon: string
      }>
      wind: {
        speed: number
      }
    }>
    city: {
      name: string
    }
  }
}



const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  
  // Thunderstorm conditions
  if (['thunderstorm', 'гроза', 'ჭექა-ქუხილი'].some(term => desc.includes(term))) {
    return <Zap className="w-6 h-6 text-purple-500" />;
  }
  
  // Drizzle conditions
  if (['drizzle', 'моросящий дождь', 'წვიმა'].some(term => desc.includes(term))) {
    return <CloudDrizzle className="w-6 h-6 text-blue-400" />;
  }
  
  // Rain conditions
  if (['rain', 'дождь', 'წვიმა'].some(term => desc.includes(term))) {
    return <CloudRain className="w-6 h-6 text-blue-500" />;
  }
  
  // Snow conditions
  if (['snow', 'снег', 'თოვლი'].some(term => desc.includes(term))) {
    return <Snowflake className="w-6 h-6 text-gray-300" />;
  }
  
  // Tornado conditions
  if (['tornado', 'торнадо', 'ტორნადო'].some(term => desc.includes(term))) {
    return <Tornado className="w-6 h-6 text-gray-700" />;
  }
  
  // Mist/Fog/Haze/Smoke conditions
  if (['mist', 'fog', 'smoke', 'haze', 'dust', 'ash', 'squall', 
       'туман', 'дым', 'дымка', 'песок', 'пыль', 'вулканический пепел', 'шквалы',
       'ნისლი', 'მოწევა', 'ქვიშა', 'მტვერი', 'ვულკანური ფერფლი', 'ყვირილს'].some(term => desc.includes(term))) {
    return <CloudFog className="w-6 h-6 text-gray-400" />;
  }
  
  // Clear sky conditions
  if (['clear', 'ясное небо', 'მოწმენდილი ცა'].some(term => desc.includes(term)) && !desc.includes('cloud')) {
    return <Sun className="w-6 h-6 text-yellow-500" />;
  }
  
  // Cloud conditions
  if (['cloud', 'облак', 'ღრუბელი'].some(term => desc.includes(term))) {
    return <Cloud className="w-6 h-6 text-gray-500" />;
  }
  
  // Default icon for unclassified weather
  return <Wind className="w-6 h-6 text-gray-500" />;
};


const formatTemperature = (temp: number): string => {
  const roundedTemp = Math.round(temp)
  return roundedTemp > 0 ? `+${roundedTemp}` : `${roundedTemp}`
}

interface DailyForecast {
  date: Date
  dayTemp: number | null
  nightTemp: number | null
  weather: {
    description: string
    icon: string
  }
}

export default function WeatherDetailsPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [city, setCity] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        const savedCity = sessionStorage.getItem('selectedCity') || 'თბილისი'
        setCity(savedCity)

        const cityCoords = getCityCoordinates(savedCity)
        if (!cityCoords) {
          throw new Error('Invalid city')
        }

        const [forecastResponse, currentResponse] = await Promise.all([
          fetch(`/api/weather/forecast?lat=${cityCoords.lat}&lon=${cityCoords.lon}&locale=${locale}`),
          fetch(`/api/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&locale=${locale}`)
        ])

        if (!forecastResponse.ok || !currentResponse.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const [forecastData, currentData] = await Promise.all([
          forecastResponse.json(),
          currentResponse.json()
        ])

        setWeatherData({ forecast: forecastData, current: currentData })
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error fetching weather data:', error)
        setError(translate('weather.error', locale))
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [locale])

  const processDailyForecast = (list: WeatherData['forecast']['list']): DailyForecast[] => {
    const dailyData: { [key: string]: DailyForecast } = {}

    list.forEach(item => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toISOString().split('T')[0]
      const hour = date.getHours()

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date,
          dayTemp: null,
          nightTemp: null,
          weather: item.weather[0]
        }
      }

      if (hour === 15) {
        dailyData[dateKey].dayTemp = item.main.temp
        dailyData[dateKey].weather = item.weather[0]
      } else if (hour === 3) {
        dailyData[dateKey].nightTemp = item.main.temp
      }

      if (dailyData[dateKey].dayTemp === null && hour >= 12 && hour <= 18) {
        dailyData[dateKey].dayTemp = item.main.temp
      }
      if (dailyData[dateKey].nightTemp === null && (hour <= 6 || hour >= 21)) {
        dailyData[dateKey].nightTemp = item.main.temp
      }
    })

    Object.values(dailyData).forEach(day => {
      if (day.dayTemp === null && day.nightTemp !== null) {
        day.dayTemp = day.nightTemp
      } else if (day.nightTemp === null && day.dayTemp !== null) {
        day.nightTemp = day.dayTemp
      }
    })

    return Object.values(dailyData).slice(0, 5)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
  }

  if (!weatherData) {
    return <div className="container mx-auto p-4 text-center">{translate('weather.noData', locale)}</div>
  }

  const currentWeather = weatherData.current
  const hourlyForecast = weatherData.forecast.list.slice(0, 8)
  const dailyForecast = processDailyForecast(weatherData.forecast.list)

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {translateCity(city, locale)}
          </CardTitle>
          <Button onClick={() => router.push(`/${locale}/change-city`)}>
            {translate('weather.changeCity', locale)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Current Weather */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="mb-4">
                <CardTitle className="text-2xl">{translate('weather.currentWeather', locale)}</CardTitle>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-bold">
                    {formatTemperature(currentWeather.main.temp)}°C
                  </div>
                  <div className="flex flex-col items-center">
                    {getWeatherIcon(currentWeather.weather[0].description)}
                    <p className="text-sm text-muted-foreground mt-2">
                      {translateWeatherDescription(currentWeather.weather[0].description, locale)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-muted-foreground" />
                    <span>{translate('weather.feelsLike', locale)}: {formatTemperature(currentWeather.main.feels_like)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-muted-foreground" />
                    <span>{translate('weather.humidity', locale)}: {currentWeather.main.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-muted-foreground" />
                    <span>{translate('weather.windSpeed', locale)}: {currentWeather.wind.speed} {translate('weather.metersPerSecond', locale)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div>
              <CardTitle className="text-2xl mb-4">{translate('weather.hourlyForecast', locale)}</CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {hourlyForecast.map((hour, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4 flex flex-col items-center">
                      <p className="font-medium mb-2">
                        {new Date(hour.dt * 1000).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xl font-bold mb-2">
                        {formatTemperature(hour.main.temp)}°C
                      </p>
                      {getWeatherIcon(hour.weather[0].description)}
                      <p className="text-sm text-muted-foreground mt-2">
                        {translateWeatherDescription(hour.weather[0].description, locale)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Daily Forecast */}
            <div>
              <CardTitle className="text-2xl mb-4">{translate('weather.dailyForecast', locale)}</CardTitle>
              <div className="space-y-2">
                {dailyForecast.map((day, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-5 items-center">
                        <p className="font-medium">
                          {translate(`weather.days.${day.date.getDay()}`, locale)}
                        </p>
                        <div className="flex justify-center">
                          {getWeatherIcon(day.weather.description)}
                        </div>
                        <p className="text-center">
                          <span className="font-bold">
                            {day.dayTemp !== null ? formatTemperature(day.dayTemp) : '—'}°C
                          </span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {translate('weather.day', locale)}
                          </span>
                        </p>
                        <p className="text-center">
                          <span className="font-bold">
                            {day.nightTemp !== null ? formatTemperature(day.nightTemp) : '—'}°C
                          </span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {translate('weather.night', locale)}
                          </span>
                        </p>
                        <p className="text-muted-foreground text-right">
                          {translateWeatherDescription(day.weather.description, locale)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {lastUpdated && (
              <div className="text-sm text-muted-foreground text-center">
                <p>{translate('weather.lastUpdated', locale)}: {lastUpdated.toLocaleString(locale)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


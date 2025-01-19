'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { translate } from '@/lib/weatherUtils'
import { preloadedCities, getCityByNameOrAlias } from '@/lib/preloadedCities'
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

export default function ChangeCityPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const [city, setCity] = useState('')

  const handleCitySelect = (selectedCity: string) => {
    const normalizedCity = getCityByNameOrAlias(selectedCity) || selectedCity;
    sessionStorage.setItem('selectedCity', normalizedCity)
    router.push(`/${locale}/weather-details`)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{translate('weather.changeCity', locale)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={translate('weather.enterCity', locale)}
            />
            <div className="flex flex-wrap gap-2">
              {preloadedCities.map((city, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCitySelect(city.name)}
                >
                  {translateCity(city.name, locale)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


'use client'

import { useI18n } from '@/lib/i18n'
import { WeatherWidget } from '@/components/widgets/weather'
import { ExchangeWidget } from '@/components/widgets/exchange'
import { NewsFeed } from '@/components/widgets/news-feed'

export default function HomePage() {
  const { locale } = useI18n()

  return (
    <div className="container py-8 px-4 grid gap-6 grid-cols-1 md:grid-cols-2">
      <WeatherWidget />
      <ExchangeWidget />
      <NewsFeed className="md:col-span-2" />
    </div>
  )
}


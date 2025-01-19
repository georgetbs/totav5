import { MetadataRoute } from 'next'
import { i18nConfig } from '@/config/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tota.ge'
  const routes = [
    '',
    '/weather-details',
    '/exchange-rates',
    '/services',
    '/change-city',
  ]

  return routes.flatMap(route => 
    i18nConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.8,
    }))
  )
}


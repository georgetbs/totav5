'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Thermometer, DollarSign, ExternalLink } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { translate, TranslationKey } from '@/lib/i18nUtils'
import categoriesData from '@/app/data/categories.json'

const getServices = (locale: string) => [
  {
    title: translate('services.weather.title' as TranslationKey, locale),
    description: translate('services.weather.description' as TranslationKey, locale),
    icon: Thermometer,
    href: '/weather-details'
  },
  {
    title: translate('services.exchange.title' as TranslationKey, locale),
    description: translate('services.exchange.description' as TranslationKey, locale),
    icon: DollarSign,
    href: '/exchange-rates'
  }
]

const getFaviconUrl = (url: string) => {
  const domain = new URL(url).hostname
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

export default function ServicesPage() {
  const { locale } = useI18n()
  const services = getServices(locale)

  return (
    <div className="container py-8 space-y-8">
      {/* Services Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {translate('sections.services' as TranslationKey, locale)}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link key={service.href} href={`/${locale}${service.href}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Useful Links Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {translate('sections.useful' as TranslationKey, locale)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categoriesData).map(([key, category]) => (
            <Card key={key} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {translate(category.title as TranslationKey, locale)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Image
                          src={getFaviconUrl(item.href)}
                          alt=""
                          width={16}
                          height={16}
                          className="inline-block"
                        />
                        <ExternalLink className="h-4 w-4" />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
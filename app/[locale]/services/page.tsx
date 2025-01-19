'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Thermometer, DollarSign } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const services = [
  {
    title: 'Weather',
    description: 'Check weather forecasts using OpenWeather API',
    icon: Thermometer,
    href: '/weather-details'
  },
  {
    title: 'Exchange Rates',
    description: 'View current exchange rates from NBG',
    icon: DollarSign,
    href: '/exchange-rates'
  }
]

export default function ServicesPage() {
  const { locale } = useI18n()

  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Link 
              key={service.href} 
              href={`/${locale}${service.href}`}
            >
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
    </div>
  )
}


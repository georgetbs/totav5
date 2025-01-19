'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Thermometer, DollarSign, ExternalLink } from 'lucide-react'
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

const categories = {
  
  tv_channels: {
    title: "TV Channels",
    items: [
      { href: "https://myvideo.ge/c/livetv", label: "MyVideo TV" },
      { href: "https://www.silktv.ge/?page=silktv", label: "Silk TV" }
    ]
  },
  tickets: {
    title: "Tickets & Travel",
    items: [
      { href: "https://tkt.ge", label: "TKT.GE" },
      { href: "https://biletebi.ge", label: "BILETEBI.GE" },
      { href: "https://tickets.ge", label: "TICKETS.GE" },
      { href: "https://turebi.ge", label: "TUREBI.GE" },
      { href: "https://avia.ge", label: "AVIA.GE" }
    ]
  },
  real_estate: {
    title: "Real Estate",
    items: [
      { href: "https://realtor.ge", label: "REALTOR.GE" },
      { href: "https://house.ge/", label: "HOUSE.GE" },
      { href: "https://propertygeorgia.ge", label: "PROPERTY GEORGIA" },
      { href: "https://myhome.ge", label: "MYHOME.GE" },
      { href: "https://ss.ge", label: "SS.GE" },
      { href: "https://korter.ge/", label: "KORTER.GE" },
      { href: "https://place.ge/", label: "PLACE.GE" },
      { href: "https://mbg.ge/ka", label: "MBG.GE" }
    ]
  },
  stores: {
    title: "Online Stores",
    items: [
      { href: "https://veli.store", label: "VELI.STORE" },
      { href: "https://mymarket.ge", label: "MYMARKET.GE" },
      { href: "https://www.ee.ge", label: "ELIT ELECTRONICS" },
      { href: "https://gorgia.ge/ka/", label: "GORGIA" },
      { href: "https://vendoo.ge", label: "VENDOO" },
      { href: "https://zoommer.ge", label: "ZOOMMER.GE" },
      { href: "https://www.liloshop.ge", label: "LILOSHOP.GE" },
      { href: "https://extra.ge", label: "EXTRA.GE" },
      { href: "https://biblusi.ge", label: "BIBLUSI.GE" }
    ]
  },
  pharmacies: {
    title: "Pharmacies",
    items: [
      { href: "https://www.aversi.ge", label: "AVERSI" },
      { href: "https://psp.ge", label: "PSP" },
      { href: "https://gpc.ge", label: "GPC" }
    ]
  },
  jobs: {
    title: "Jobs",
    items: [
      { href: "https://www.jobs.ge", label: "JOBS.GE" },
      { href: "https://www.hr.ge", label: "HR.GE" },
      { href: "https://nes.ge", label: "NES.GE" }
    ]
  },
  auto: {
    title: "Auto",
    items: [
      { href: "https://autopapa.ge", label: "AUTOPAPA.GE" },
      { href: "https://myauto.ge", label: "MYAUTO.GE" },
      { href: "https://auto.ge", label: "AUTO.GE" },
      { href: "https://myparts.ge", label: "MYPARTS.GE" },
      { href: "https://manqanebi.ge", label: "MANQANEBI.GE" }
    ]
  },
  handymen: {
    title: "Handymen",
    items: [
      { href: "https://servisebi.ge", label: "SERVISEBI.GE" },
      { href: "https://mrmaster.ge", label: "MRMASTER.GE" },
      { href: "https://masteron.ge", label: "MASTERON.GE" }
    ]
  },
  school: {
    title: "School",
    items: [
      { href: "https://www.schoolbook.ge", label: "SCHOOLBOOK" }
    ]
  },
  government: {
    title: "Government Services",
    items: [
      { href: "https://my.gov.ge", label: "MY.GOV.GE" },
      { href: "https://sda.gov.ge", label: "SDA.GOV.GE" },
      { href: "https://napr.gov.ge", label: "NAPR.GOV.GE" },
      { href: "https://rs.ge", label: "RS.GE" }
    ]
  },
  payment_services: {
    title: "Payment Services",
    items: [
      { href: "https://tbcpay.ge", label: "TBC Pay" },
      { href: "https://bogpay.ge", label: "BoG Pay" },
      { href: "https://pay.ge", label: "PAY.GE" }
    ]
  },
  banks: {
    title: "Banks",
    items: [
      { href: "https://tbc.ge", label: "TBC" },
      { href: "https://bog.ge", label: "BANK OF GEORGIA" },
      { href: "https://libertybank.ge", label: "LIBERTY BANK" },
      { href: "https://bb.ge", label: "BASISBANK" },
      { href: "https://credobank.ge", label: "CREDO" }
    ]
  },
  sport: {
    title: "Sport",
    items: [
      { href: "https://sprenty.com/", label: "SPLENTY" }
    ]
  },
  clinics: {
    title: "Clinics",
    items: [
      { href: "https://www.aversiclinic.ge", label: "AVERSI CLINIC" },
      { href: "https://toduaclinic.ge", label: "TODUA CLINIC" },
      { href: "https://medi.ge", label: "MEDI CLINIC" },

    ]
  },
  telecommunication: {
    title: "Telecommunication",
    items: [
      { href: "https://www.magticom.ge/", label: "MAGTI" },
      { href: "https://silknet.com", label: "SILKNET" },
      { href: "https://cellfie.ge/ka", label: "CELLFIE" }
    ]
  },
  discounts: {
    title: "Discounts",
    items: [
      { href: "https://www.swoop.ge", label: "SWOOP.GE" },
      { href: "https://hotsale.ge", label: "HOTSALE.GE" }
    ]
  },
  language_learning: {
    title: "Language Learning",
    items: [
      { href: "https://lingwing.com/ka", label: "LINGWING" }
    ]
  },
  cryptocurrency: {
    title: "Cryptocurrency",
    items: [
      { href: "https://alltrust.me/ka/?ref=ZU1hqcjdfnq", label: "ALLTRUST.ME" },
      { href: "https://cryptal.com/en/referral/3Pd9zd4Bxw", label: "CRYPTAL" }
    ]
  },
  parent: {
    title: "Parenting",
    items: [
      { href: "https://mshoblebi.ge/", label: "MSHOBLEBI.GE" },
      { href: "https://vidal.ge", label: "VIDAL.GE" }
    ]
  },
  vet_clinics: {
    title: "Veterinary Clinics",
    items: [
      { href: "https://www.facebook.com/Abvet.clinic", label: "ABVETT CLINIC" }
    ]
  },
  forum: {
    title: "Forum",
    items: [
      { href: "https://forum.ge", label: "FORUM.GE" }
    ]
  }
}


const getFaviconUrl = (url: string) => {
  const domain = new URL(url).hostname
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

export default function ServicesPage() {
  const { locale } = useI18n()

  return (
    <div className="container py-8 space-y-8">
      {/* Services Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Services</h2>
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
        <h2 className="text-2xl font-bold mb-4">Useful Links</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories).map(([key, category]) => (
            <Card key={key} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
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

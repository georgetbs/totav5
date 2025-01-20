import { notFound } from 'next/navigation'
import { i18nConfig } from '@/config/i18n'
import { I18nProvider } from '@/lib/i18n'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Metadata } from 'next'
import { generateMetadata as genMeta, generateCanonicalUrl } from '@/lib/seo'

// Define keywords for each locale
const localizedKeywords: Record<string, string[]> = {
  ka: [
    'საქართველო',
    'თბილისი',
    'ამინდი',
    'ვალუტის კურსი',
    'სიახლეები',
    'ქართული პორტალი',
    'ემიგრანტები',
    'ტურისტები'
  ],
  en: [
    'Georgia',
    'Tbilisi',
    'weather',
    'exchange rates',
    'news',
    'Georgian portal',
    'expats',
    'tourists'
  ],
  ru: [
    'Грузия',
    'Тбилиси',
    'погода',
    'курсы валют',
    'новости',
    'портал',
    'жизнь в Грузии',
    'туристы'
  ]
};

// Define titles for each locale
const localizedTitles: Record<string, string> = {
  ka: 'თოთა - ქართული პორტალი',
  en: 'Tota - Georgian Portal',
  ru: 'Тота - Портал для жителей Грузии'
};

// Define descriptions for each locale
const localizedDescriptions: Record<string, string> = {
  ka: 'საქართველოს პორტალი ყველასთვის: ადგილობრივი მოსახლეობისთვის, ემიგრანტებისთვის, ტურისტებისთვის და საქართველოს მოყვარულთათვის. აქ თქვენ იპოვით ყველაფერს, რაც გჭირდებათ საქართველოში ცხოვრებისთვის, მოგზაურობისთვის და ქვეყნის უკეთ გასაცნობად',
  
  en: 'Your comprehensive Georgian portal: serving locals, expats, tourists, and everyone who loves Georgia. Find everything you need to live, travel, and explore this beautiful country - from daily essentials to in-depth cultural insights',
  
  ru: 'Ваш путеводитель по Грузии: для местных жителей, экспатов, туристов и всех, кто любит эту прекрасную страну. Здесь вы найдёте всё необходимое для жизни, путешествий и знакомства с культурой Грузии - от повседневных потребностей до глубокого погружения в местные традиции'
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  // Use the locale-specific content, fallback to English if locale not found
  const safeLocale = locale in localizedKeywords ? locale : 'en';
  
  const metadata = genMeta({
    title: localizedTitles[safeLocale],
    description: localizedDescriptions[safeLocale],
    keywords: [...localizedKeywords[safeLocale]], // Convert readonly array to mutable
    url: 'https://tota.ge',
    locale,
  });

  return {
    ...metadata,
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png' }
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#5bbad5'
        }
      ]
    },
    manifest: '/site.webmanifest',
    themeColor: '#ffffff'
  }
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!i18nConfig.locales.includes(locale)) notFound()

  return (
    <html lang={locale}>
      <body>
        <I18nProvider initialLocale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
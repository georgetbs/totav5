import { notFound } from 'next/navigation'
import { i18nConfig } from '@/config/i18n'
import { I18nProvider } from '@/lib/i18n'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Metadata } from 'next'
import { generateMetadata as genMeta, generateCanonicalUrl } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return genMeta({
    title: 'Tota - Georgian Portal',
    description: 'Portal for Georgians: locals, expats, and tourists',
    keywords: ['Georgia', 'Tbilisi', 'weather', 'exchange rates', 'news'],
    url: 'https://tota.ge',
    locale,
  })
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


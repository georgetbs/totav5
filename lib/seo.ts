import { Metadata } from 'next'

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  locale,
}: {
  title: string
  description: string
  keywords: string[]
  image?: string
  url: string
  locale: string
}): Metadata {
  const defaultImage = 'https://tota.ge/og-image.png' // Replace with your actual default OG image URL

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Tota',
      locale,
      type: 'website',
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || defaultImage],
    },
  }
}

export function generateStructuredData(data: any): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

export function generateCanonicalUrl(path: string): string {
  return `https://tota.ge${path}`
}


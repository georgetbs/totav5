'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ka, ru } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n'
import { newsSources } from '@/config/newsSources'

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  author: string;
  pubDate: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface NewsState {
  items: NewsItem[];
  isLoading: boolean;
  error: string | null;
}

interface NewsFeedProps {
  className?: string;
}

export function NewsFeed({ className }: NewsFeedProps) {
  const { locale } = useI18n()
  const [newsState, setNewsState] = useState<NewsState>({
    items: [],
    isLoading: true,
    error: null,
  })

  const fetchNews = async (sourceUrl: string) => {
    try {
      setNewsState(prev => ({ ...prev, isLoading: true, error: null }))
      const response = await fetch(`/api/news?url=${encodeURIComponent(sourceUrl)}`)
      if (!response.ok) throw new Error('Failed to fetch news')

      const data = await response.json()
      setNewsState({ items: data, isLoading: false, error: null })
    } catch {
      setNewsState({ items: [], isLoading: false, error: 'Failed to load news. Please try again later.' })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'PPp', { locale: locale === 'ka' ? ka : locale === 'ru' ? ru : undefined })
  }

  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = text
    return textArea.value
  }

  const stripHtmlTags = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, '')

  const currentSource = newsSources.find(source => source.language === locale) || newsSources[0]

  useEffect(() => {
    fetchNews(currentSource.url)
  }, [locale])

  if (newsState.error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-destructive gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{newsState.error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h1><CardTitle className="flex items-center gap-2">
          <img
            src="https://civil.ge/wp-content/uploads/2021/05/cropped-adapted-no-square-32x32.png"
            alt="Civil.ge"
            className="h-5 w-5"
          />
          Civil.ge
        </CardTitle></h1>
      </CardHeader>
      <CardContent>
        {newsState.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {newsState.items.slice(0, 5).map(item => (
              <article 
                key={item.id} 
                className={`group hover:bg-muted/50 rounded-lg transition-colors p-3 -mx-3 ${
                  item.imageUrl || item.videoUrl ? 'md:grid md:grid-cols-3 md:gap-4' : ''
                }`}
              >
                {/* Обёртка для кликабельного контента */}
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`contents cursor-pointer ${
                    item.imageUrl || item.videoUrl ? 'md:col-span-3' : ''
                  }`}
                >
                  {/* Media section */}
                  {(item.videoUrl || item.imageUrl) && (
                    <div className="md:col-span-1 mb-4 md:mb-0">
                      {item.videoUrl ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <video
                            className="absolute inset-0 w-full h-full object-cover"
                          >
                            <source src={item.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : item.imageUrl && (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={decodeHtmlEntities(item.title)}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content section */}
                  <div className={`${item.imageUrl || item.videoUrl ? 'md:col-span-2' : ''} space-y-2`}>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {decodeHtmlEntities(item.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {decodeHtmlEntities(stripHtmlTags(item.description))}
                    </p>
                  </div>
                </a>

                {/* Metadata section (не кликабельная) */}
                <div className={`${
                  item.imageUrl || item.videoUrl ? 'md:col-span-3' : ''
                } flex items-center justify-between text-xs text-muted-foreground mt-2`}>
                  <span>{item.author}</span>
                  <time dateTime={item.pubDate}>{formatDate(item.pubDate)}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
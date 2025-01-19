'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Newspaper, AlertCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ka, ru } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n'
import { NewsItem, NewsState } from '@/types/news'
import { newsSources } from '@/config/newsSources'

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
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()
      setNewsState({
        items: data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setNewsState({
        items: [],
        isLoading: false,
        error: 'Failed to load news. Please try again later.',
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'PPp', {
      locale: locale === 'ka' ? ka : locale === 'ru' ? ru : undefined
    })
  }

  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = text
    return textArea.value
  }

  const stripHtmlTags = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "")
  }

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
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Civil.ge
        </CardTitle>
      </CardHeader>
      <CardContent>
        {newsState.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {newsState.items.slice(0, 5).map((item) => (
              <article key={item.id} className="space-y-2">
                <h3 className="font-semibold hover:text-primary">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {decodeHtmlEntities(item.title)}
                  </a>
                </h3>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={decodeHtmlEntities(item.title)}
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {decodeHtmlEntities(stripHtmlTags(item.description))}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
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


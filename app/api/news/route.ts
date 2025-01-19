import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { NewsItem } from '@/types/news'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TotaV4/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xml = await response.text()
    const result = parser.parse(xml)
    const channel = result.rss.channel
    
    const items: NewsItem[] = channel.item.map((item: any) => ({
      id: item.guid?.['#text'] || item.link,
      title: item.title,
      link: item.link,
      description: item.description,
      content: item['content:encoded'] || item.description,
      pubDate: item.pubDate,
      author: item['dc:creator'],
      categories: Array.isArray(item.category) ? item.category : item.category ? [item.category] : [],
      imageUrl: extractImageUrl(item['content:encoded'] || item.description || '')
    }))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news feed' },
      { status: 500 }
    )
  }
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined

  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch && imgMatch[1]) {
    // Ensure the URL is absolute
    try {
      return new URL(imgMatch[1], 'https://civil.ge').toString()
    } catch (error) {
      console.error('Error parsing image URL:', error)
      return undefined
    }
  }
  return undefined
}


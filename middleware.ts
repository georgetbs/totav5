import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nConfig } from '@/config/i18n'

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Origin"
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Log for debugging
  console.log('Middleware processing path:', pathname)
  console.log('OPENWEATHERAPIKEY in middleware:', process.env.OPENWEATHERAPIKEY ? 'Defined' : 'Undefined')

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, {
      headers: CORS_HEADERS
    })
  }

  // Allow requests to the API route and apply CORS headers
  if (pathname.startsWith('/api/')) {
    console.log('API route detected, applying CORS headers')
    const response = NextResponse.next()
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || i18nConfig.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}




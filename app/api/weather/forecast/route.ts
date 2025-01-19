import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const locale = searchParams.get('locale')

  console.log('Weather forecast API route called with params:', { lat, lon, locale })
  console.log('NEXT_PUBLIC_OPENWEATHERAPIKEY:', process.env.NEXT_PUBLIC_OPENWEATHERAPIKEY ? 'Defined' : 'Undefined')

  if (!lat || !lon || !locale) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  if (!process.env.NEXT_PUBLIC_OPENWEATHERAPIKEY) {
    console.error('API key is not defined in API route')
    return NextResponse.json({ error: 'Weather API key is not configured', env: process.env }, { status: 500 })
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERAPIKEY}&lang=${locale}`
    console.log('Fetching forecast data from:', apiUrl.replace(process.env.NEXT_PUBLIC_OPENWEATHERAPIKEY, 'REDACTED'))

    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenWeather API error:', errorText)
      throw new Error(`OpenWeather API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Forecast data received successfully')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching forecast data:', error)
    return NextResponse.json({ error: 'Failed to fetch forecast data', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}


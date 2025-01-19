import { NextResponse } from 'next/server'

const API_URL = 'https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

interface ExchangeRate {
  code: string;
  quantity: number;
  rateFormated: string;
  diffFormated: string;
  rate: number;
  name: string;
  diff: number;
  date: string;
  validFromDate: string;
}

let cachedData: ExchangeRate[] | null = null
let lastFetchTime: number = 0

export async function GET() {
  const now = Date.now()

  if (!cachedData || now - lastFetchTime > CACHE_DURATION) {
    try {
      console.log('Fetching fresh data from NBG API...')
      const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      const response = await fetch(`${API_URL}?date=${date}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TotaV4/1.0',
        },
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Raw data received:', JSON.stringify(data))

      if (!Array.isArray(data) || !data[0] || !Array.isArray(data[0].currencies)) {
        throw new Error('Invalid data structure received from API')
      }

      cachedData = data[0].currencies
      lastFetchTime = now

      console.log('Data processed and cached')
    } catch (error) {
      console.error('Error fetching from NBG API:', error)
      
      if (!cachedData) {
        return NextResponse.json({ error: 'Failed to fetch exchange rates' }, { status: 500 })
      }
    }
  }

  if (!cachedData) {
    return NextResponse.json({ error: 'No exchange rate data available' }, { status: 404 })
  }

  console.log('Returning exchange rate data')
  return NextResponse.json(cachedData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
      'Access-Control-Allow-Origin': '*'
    }
  })
}


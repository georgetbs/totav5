'use client'

import { useState, useEffect } from 'react'
import { DollarSign, RefreshCw, ArrowRight, ArrowUp, ArrowDown, Equal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useI18n } from '@/lib/i18n'
import { translate } from '@/lib/i18nUtils'
import { useRouter } from 'next/navigation'

interface Currency {
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

const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.slice(0, 2).toLowerCase()}.png`

const DISPLAY_CURRENCIES = ['USD', 'EUR', 'RUB', 'UAH', 'TRY']

export function ExchangeWidget() {
  const { locale } = useI18n()
  const [rates, setRates] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/exchange-rates')
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates')
        }
        const data = await response.json()
        // Sort the rates according to the display order
        const sortedRates = data.sort((a, b) => {
          const indexA = DISPLAY_CURRENCIES.indexOf(a.code)
          const indexB = DISPLAY_CURRENCIES.indexOf(b.code)
          return indexA - indexB
        })
        setRates(sortedRates)
        setError(null)
      } catch (err) {
        console.error('Error fetching exchange rates:', err)
        setError('Failed to load exchange rates. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    getRates()

    // Refresh rates every hour
    const intervalId = setInterval(getRates, 60 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const handleViewAllRates = () => {
    router.push(`/${locale}/exchange-rates`)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-destructive">
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayRates = rates.filter(rate => DISPLAY_CURRENCIES.includes(rate.code))

  const getRateIcon = (diff: number) => {
    if (diff > 0) {
      return <ArrowUp className="h-4 w-4" />
    }
    if (diff < 0) {
      return <ArrowDown className="h-4 w-4" />
    }
    return <Equal className="h-4 w-4" />
  }

  const getRateColor = (diff: number) => {
    if (diff > 0) return 'text-green-600'
    if (diff < 0) return 'text-red-600'
    return 'text-gray-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          {translate('exchange.title', locale)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="ml-2">{translate('exchange.loading', locale)}</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {displayRates.map((rate) => (
              <li key={rate.code} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={getFlagUrl(rate.code)} alt={rate.code} />
                    <AvatarFallback>{rate.code.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{rate.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {rate.quantity !== 1 
                      ? `${rate.quantity} ${rate.code} = ${rate.rateFormated} GEL` 
                      : `${rate.rateFormated} GEL`
                    }
                  </span>
                  <span className={`text-sm ${getRateColor(rate.diff)}`}>
                    {getRateIcon(rate.diff)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewAllRates}>
          {translate('exchange.viewAllRates', locale)}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ExchangeWidget;
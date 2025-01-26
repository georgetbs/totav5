"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n"
import { translate, formatDate } from "@/lib/i18nUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"

const translateMonthToGeorgian = (month: string): string => {
  const monthTranslations: { [key: string]: string } = {
    January: "იანვარი",
    February: "თებერვალი",
    March: "მარტი",
    April: "აპრილი",
    May: "მაისი",
    June: "ივნისი",
    July: "ივლისი",
    August: "აგვისტო",
    September: "სექტემბერი",
    October: "ოქტომბერი",
    November: "ნოემბერი",
    December: "დეკემბერი",
  }

  return monthTranslations[month] || month
}

interface Currency {
  code: string
  quantity: number
  rateFormated: string
  diffFormated: string
  rate: number
  name: string
  diff: number
  date: string
  validFromDate: string
}

const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.slice(0, 2).toLowerCase()}.png`

export default function ExchangeRatesPage() {
  const { locale } = useI18n()
  const [rates, setRates] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/exchange-rates")
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates")
        }
        const data = await response.json()
        setRates(data)
        if (data.length > 0) {
          setLastUpdated(data[0].date)
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching exchange rates:", err)
        setError("Failed to load exchange rates. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getRates()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-destructive">
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            {translate("exchange.allRatesTitle", locale)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">{translate("exchange.loading", locale)}</span>
            </div>
          ) : (
            <>
              {lastUpdated && (
                <div className="mb-4 text-sm text-muted-foreground">
                  {translate("exchange.lastUpdated" as any, locale)}: {formatDate(lastUpdated, locale)}
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead>{translate("exchange.currency", locale)}</TableHead>
                    <TableHead>{translate("exchange.rate", locale)}</TableHead>
                    <TableHead>{translate("exchange.change", locale)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate, index) => (
                    <TableRow key={rate.code} className={index !== rates.length - 1 ? "border-b" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getFlagUrl(rate.code)} alt={rate.code} />
                            <AvatarFallback>{rate.code.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{rate.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rate.quantity !== 1
                          ? `${rate.quantity} ${rate.code} = ${rate.rateFormated} GEL`
                          : `${rate.rateFormated} GEL`}
                      </TableCell>
                      <TableCell className={rate.diff > 0 ? "text-green-600" : rate.diff < 0 ? "text-red-600" : ""}>
                        {rate.diff !== 0 ? (
                          <>
                            {rate.diff > 0 ? (
                              <ArrowUp className="inline h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDown className="inline h-4 w-4 mr-1" />
                            )}
                            {rate.diffFormated}
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


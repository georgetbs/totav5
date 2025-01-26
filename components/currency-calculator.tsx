"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n"
import { translate } from "@/lib/i18nUtils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface Currency {
  code: string
  quantity: number
  rate: number
  name: string
}

interface CurrencyCalculatorProps {
  rates: Currency[]
}

export function CurrencyCalculator({ rates }: CurrencyCalculatorProps) {
  const { locale } = useI18n()
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("GEL")
  const [result, setResult] = useState("")
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")

  useEffect(() => {
    calculateExchange()
  }, [amount, fromCurrency, toCurrency]) // Removed unnecessary 'rates' dependency

  const calculateExchange = () => {
    const fromRate = rates.find((rate) => rate.code === fromCurrency)
    const toRate = rates.find((rate) => rate.code === toCurrency)

    if (fromRate && toRate) {
      const fromAmount = Number.parseFloat(amount) / fromRate.quantity
      const toAmount = (fromAmount * fromRate.rate) / toRate.rate
      setResult(toAmount.toFixed(4))
    }
  }

  const filteredRatesFrom = rates.filter(
    (rate) =>
      rate.code.toLowerCase().includes(searchFrom.toLowerCase()) ||
      rate.name.toLowerCase().includes(searchFrom.toLowerCase()),
  )

  const filteredRatesTo = rates.filter(
    (rate) =>
      rate.code.toLowerCase().includes(searchTo.toLowerCase()) ||
      rate.name.toLowerCase().includes(searchTo.toLowerCase()),
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="amount">{translate("exchange.amount", locale)}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fromCurrency">{translate("exchange.from", locale)}</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="fromCurrency" className="mt-1">
                <SelectValue placeholder={translate("exchange.selectCurrency", locale)} />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder={translate("exchange.search", locale)}
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="mb-2"
                />
                {filteredRatesFrom.map((rate) => (
                  <SelectItem key={rate.code} value={rate.code}>
                    {rate.code} - {rate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="toCurrency">{translate("exchange.to", locale)}</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="toCurrency" className="mt-1">
                <SelectValue placeholder={translate("exchange.selectCurrency", locale)} />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder={translate("exchange.search", locale)}
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="mb-2"
                />
                {filteredRatesTo.map((rate) => (
                  <SelectItem key={rate.code} value={rate.code}>
                    {rate.code} - {rate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <p className="text-lg">
            {amount} {fromCurrency} <ArrowRight className="inline mx-2" /> {result} {toCurrency}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


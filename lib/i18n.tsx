'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { i18nConfig } from '@/config/i18n'

type Translations = {
  [key: string]: string | Translations
}

type I18nContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
  isLoading: boolean
  error: string | null
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode, initialLocale: string }) {
  const [locale, setLocale] = useState(initialLocale)
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const t = useCallback((key: string) => {
    const keys = key.split('.')
    let current: any = translations
    for (let k of keys) {
      if (current[k] === undefined) {
        return key
      }
      current = current[k]
    }
    return current
  }, [translations])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading, error }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}


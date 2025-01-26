import ka from '@/locales/ka.json'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<typeof ka>

const translations = {
  ka,
  en,
  ru,
}

export function translate(key: TranslationKey, locale: string): string {
  const keys = key.split('.')
  let current: any = translations[locale as keyof typeof translations]

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key "${key}" not found for locale "${locale}"`)
      return key // Fallback to the key itself if translation is not found
    }
    current = current[k]
  }

  if (typeof current !== 'string') {
    console.warn(`Translation for key "${key}" in locale "${locale}" is not a string`)
    return key // Fallback to the key itself if the result is not a string
  }

  return current
}

export function getLocaleFromPathname(pathname: string): string {
  const locale = pathname.split('/')[1]
  if (['ka', 'en', 'ru'].includes(locale)) {
    return locale
  }
  return 'ka' // Default to Georgian if no valid locale is found
}

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number, locale: string, currency: string = 'GEL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}


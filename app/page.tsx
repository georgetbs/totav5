import { redirect } from 'next/navigation'
import { i18nConfig } from '@/config/i18n'

export default function Home() {
  redirect(`/${i18nConfig.defaultLocale}`)
}


'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/lib/i18n'
import { translate } from '@/lib/i18nUtils'

export function Footer() {
  const { locale } = useI18n()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. {translate('common.footer.rights', locale)}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {translate('common.footer.links.github', locale)}
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {translate('common.footer.links.twitter', locale)}
          </Link>
        </div>
      </div>
    </footer>
  )
}


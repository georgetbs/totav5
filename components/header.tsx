'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sun, Moon, Globe, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'
import { i18nConfig } from '@/config/i18n'
import { useI18n } from '@/lib/i18n'
import { translate } from '@/lib/i18nUtils'
import { useTheme } from 'next-themes'

export function Header() {
  const { locale, setLocale } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const NavItems = () => (
    <>
      {siteConfig.mainNav.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          onClick={() => setIsOpen(false)}
        >
          {translate(`common.nav.${item.title.toLowerCase()}`, locale)}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-primary">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <NavItems />
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {i18nConfig.locales.map((l) => (
                <DropdownMenuItem key={l} onClick={() => changeLanguage(l)}>
                  {i18nConfig.localesToName[l]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-4">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}


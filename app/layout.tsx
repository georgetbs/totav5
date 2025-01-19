import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'Tota - Georgian Portal',
  description: 'Portal for Georgians: locals, expats, and tourists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';

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
       <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="public/icon-16x16.png" sizes="any" type="image/png"/>
          <link
                rel="icon"
                href="public/icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
              />
          <link
            rel="apple-touch-icon"
            href="/public/apple-icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'
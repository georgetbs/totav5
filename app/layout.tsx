import { Inter } from "next/font/google"
import type { Metadata } from "next"
import './globals.css'

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Tota - Georgian Portal",
  description: "Portal for Georgians: locals, expats, and tourists",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }],
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
  other: {
    "msapplication-TileColor": "#da532c",
  },
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


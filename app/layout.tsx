import type { Metadata, Viewport } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/i18n/context'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0A192F',
}

export const metadata: Metadata = {
  title: {
    template: '%s | PetroProf Portal',
    default: 'PetroProf Portal — Rope Access & Manpower Dispatch',
  },
  description:
    'PetroProf is Saudi Arabia\'s premier B2B SaaS platform for IRATA-certified rope access training, technician dispatch, and safety compliance management.',
  keywords: [
    'rope access',
    'IRATA',
    'Saudi Arabia',
    'manpower dispatch',
    'industrial safety',
    'oil and gas',
  ],
  authors: [{ name: 'PetroProf' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_SA',
    siteName: 'PetroProf Portal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: 'var(--font-inter), var(--font-cairo), sans-serif',
              },
            }}
          />
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}

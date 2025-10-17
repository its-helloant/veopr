import type { Metadata, Viewport } from 'next'
import { HeroUIProvider } from '@heroui/react'
import { CartProvider } from '@/contexts/CartContext'
import { getExistingCart } from '@/actions/cart'
import './globals.css'

export const metadata: Metadata = {
  title: 'VEOPR - Tu plataforma de entretenimiento',
  description: 'Descubre los mejores programas y productos en VEOPR',
  keywords: 'entretenimiento, programas, productos, VEOPR',
  authors: [{ name: 'VEOPR Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'VEOPR - Tu plataforma de entretenimiento',
    description: 'Descubre los mejores programas y productos en VEOPR',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEOPR - Tu plataforma de entretenimiento',
    description: 'Descubre los mejores programas y productos en VEOPR',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch existing cart server-side for SSR (without creating a new one)
  // Cart will be created lazily when user adds first item
  const cart = await getExistingCart();

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Prevent iOS auto-detection of phone numbers, dates, etc. that can cause hydration mismatches */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body>
        <HeroUIProvider>
          <CartProvider initialCart={cart}>
            {children}
          </CartProvider>
        </HeroUIProvider>
      </body>
    </html>
  )
} 
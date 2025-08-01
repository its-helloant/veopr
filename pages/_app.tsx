import type { AppProps } from 'next/app'
import { HeroUIProvider } from '@heroui/react'
import '../src/index.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeroUIProvider>
      <Component {...pageProps} />
    </HeroUIProvider>
  )
} 
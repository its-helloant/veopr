import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Prevent iOS auto-detection of phone numbers, dates, etc. that can cause hydration mismatches */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 
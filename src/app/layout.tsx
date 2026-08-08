import type { Metadata } from 'next'
import './globals.css'
import FloatingDonateButton from './components/FloatingDonateButton'

export const siteUrl = 'https://astro.khagatara.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Khagatara Astro — Vedic Numerology & Astrology Reports',
  description: 'Discover your cosmic path through Vedic numerology and astrology',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Khagatara Astro — Vedic Numerology & Astrology Reports',
    description: 'Discover your cosmic path through Vedic numerology and astrology',
    url: '/',
    siteName: 'Khagatara Astro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khagatara Astro — Vedic Numerology & Astrology Reports',
    description: 'Discover your cosmic path through Vedic numerology and astrology',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        {children}
        <FloatingDonateButton
          hostedButtonId={process.env.NEXT_PUBLIC_PAYPAL_DONATE_BUTTON_ID || ''}
        />
      </body>
    </html>
  )
}

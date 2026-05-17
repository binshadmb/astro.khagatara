import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful | Khagatara',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Success() {
  return (
    <main className="page">
      <div className="card" style={{textAlign: 'center'}}>
        <div className="success-icon">✨</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-text">
          Your Khagatara report is being generated.
          You will receive it shortly.
        </p>
        <div className="success-note">
          Check your email for your full Vedic numerology report PDF.
        </div>
        <Link href="/" className="btn-link">
          Calculate Another Report
        </Link>
      </div>
    </main>
  )
}

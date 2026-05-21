import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful | Khagatara',
  robots: {
    index: false,
    follow: false,
  },
}

interface SuccessProps {
  searchParams: {
    email?: string
  }
}

export default function Success({ searchParams }: SuccessProps) {
  const email = searchParams.email

  return (
    <main className="page">
      <div className="card success-card">
        <div className="success-glow"></div>

        <div className="success-icon">
          ✨
        </div>

        <h1 className="success-title">
          Your Cosmic Blueprint is Being Forged
        </h1>

        <p className="success-text">
          Payment received successfully.
          Your personalized Khagatara report is now being generated.
        </p>

        <div className="delivery-box">
          <div className="delivery-label">
            REPORT DELIVERY EMAIL
          </div>

          <div className="delivery-email">
            {email || "your email address"}
          </div>

          <div className="delivery-time">
            Usually delivered within 1-3 minutes.
          </div>
        </div>

        <div className="progress-wrapper">
          <div className="progress-bar"></div>
        </div>

        <div className="success-warning">
          Please do not close this page while your report is processing.
        </div>

        <div className="support-note">
          If your PDF does not arrive within 5 minutes,
          contact:
          <span> info@khagatara.com </span>
        </div>

        <Link href="/" className="secondary-btn">
          Generate Another Reading
        </Link>
      </div>

      <style>{`
        .success-card {
          position: relative;
          overflow: hidden;
        }

        .success-glow {
          position: absolute;
          inset: -100px;
          background: radial-gradient(
            circle,
            rgba(245,197,66,0.15) 0%,
            transparent 70%
          );
          animation: pulseGlow 4s infinite;
        }

        .delivery-box {
          margin-top: 24px;
          padding: 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(245,197,66,0.15);
        }

        .delivery-label {
          font-size: 12px;
          letter-spacing: 2px;
          opacity: 0.7;
          margin-bottom: 10px;
        }

        .delivery-email {
          color: #f5c542;
          font-size: 18px;
          font-weight: 600;
          word-break: break-word;
        }

        .delivery-time {
          margin-top: 10px;
          opacity: 0.8;
          font-size: 14px;
        }

        .progress-wrapper {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 28px;
        }

        .progress-bar {
          width: 45%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #f5c542,
            #ffd86b
          );
          animation: loading 2s infinite;
        }

        .success-warning {
          margin-top: 18px;
          font-size: 14px;
          opacity: 0.8;
        }

        .support-note {
          margin-top: 24px;
          font-size: 13px;
          opacity: 0.7;
          line-height: 1.6;
        }

        .support-note span {
          color: #f5c542;
        }

        .secondary-btn {
          display: inline-block;
          margin-top: 30px;
          padding: 14px 26px;
          border-radius: 12px;
          border: 1px solid rgba(245,197,66,0.3);
          color: #f5c542;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .secondary-btn:hover {
          background: rgba(245,197,66,0.08);
        }

        @keyframes loading {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        @keyframes pulseGlow {
          0%,100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  )
}

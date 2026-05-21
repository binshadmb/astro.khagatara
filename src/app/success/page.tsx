'use client'

import Link from 'next/link'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'   // ← THE FIX

// ─── Account creation form ────────────────────────────────────────────────────
function AccountForm({ email, sessionId }: { email?: string; sessionId?: string }) {
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handleCreate() {
    if (!form.name || !form.password) { setErr('Name and password are required.'); return }
    setLoading(true); setErr('')
    try {
      const res = await fetch('https://khagatara-api.onrender.com/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, password: form.password, email, session_id: sessionId })
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setErr('Account creation failed. You can try later from your email link.')
    }
    setLoading(false)
  }

  if (submitted) return (
    <div className="account-box" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>🌟</div>
      <div style={{ color: '#c8901a', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>Account Created</div>
      <div style={{ color: '#7a6a5a', fontSize: '0.72rem', marginTop: 6, letterSpacing: '0.06em' }}>Your readings will be saved to your account.</div>
    </div>
  )

  return (
    <div className="account-box">
      <div className="account-label">Save Your Reading — Create an Account</div>
      <p className="account-sub">Access your reports anytime, track your cosmic journey.</p>

      <div className="form-row" style={{ marginBottom: '0.75rem' }}>
        <label htmlFor="acc-name">Full Name</label>
        <input id="acc-name" type="text" placeholder="Your name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="form-row" style={{ marginBottom: '0.75rem' }}>
        <label htmlFor="acc-phone">Phone (optional)</label>
        <input id="acc-phone" type="tel" placeholder="+1 234 567 8900" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="form-row" style={{ marginBottom: '0.75rem' }}>
        <label htmlFor="acc-email">Email</label>
        <input id="acc-email" type="email" value={email || ''} readOnly
          style={{ opacity: 0.6, cursor: 'not-allowed' }} />
      </div>
      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <label htmlFor="acc-pw">Choose a Password</label>
        <input id="acc-pw" type="password" placeholder="Min. 8 characters" value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
      </div>

      {err && <p className="error" style={{ marginBottom: '0.75rem' }}>{err}</p>}

      <button className="cta-btn" onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create My Account'}
      </button>
    </div>
  )
}

// ─── Poll hook ────────────────────────────────────────────────────────────────
type Status = 'pending' | 'processing' | 'done' | 'error'

function useReportPolling(sessionId: string | null) {
  const [status, setStatus]       = useState<Status>('pending')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [progress, setProgress]   = useState(10)
  const [debugMsg, setDebugMsg]   = useState('')   // visible during dev
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const attemptsRef = useRef(0)
  const MAX_ATTEMPTS = 40  // ~2 min at 3 s

  useEffect(() => {
    if (!sessionId) {
      setDebugMsg('⚠ No session_id in URL — polling skipped')
      return
    }

    const activeSessionId = sessionId

    async function poll() {
      attemptsRef.current += 1
      setProgress(p => Math.min(p + Math.random() * 6, 85))

      try {
        const params = new URLSearchParams({
          session_id: activeSessionId,
          sessionid: activeSessionId,
        })

        const res = await fetch(
          `https://khagatara-api.onrender.com/report-status?${params.toString()}`
        )

        if (!res.ok) {
          setDebugMsg(`Poll ${attemptsRef.current}: HTTP ${res.status}`)
          return
        }

        const data = await res.json()
        setDebugMsg(`Poll ${attemptsRef.current}: status=${data.status}`)

        const reportUrl = data.download_url ?? data.downloadurl ?? null

        if (data.status === 'done' && reportUrl) {
          setStatus('done')
          setDownloadUrl(reportUrl)
          setProgress(100)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }

        if (data.status === 'processing') setStatus('processing')

        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setStatus('error')
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch (e: any) {
        setDebugMsg(`Poll ${attemptsRef.current}: fetch error — ${e?.message}`)
      }
    }

    const timeout = setTimeout(() => {
      poll()
      intervalRef.current = setInterval(poll, 3000)
    }, 2000)

    return () => {
      clearTimeout(timeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sessionId])

  return { status, downloadUrl, progress, debugMsg }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function SuccessContent() {
  const searchParams = useSearchParams()           // ← reads URL params correctly in client components
  const email     = searchParams.get('email')    ?? undefined
  const sessionId = searchParams.get('session_id') ?? searchParams.get('sessionid')

  const { status, downloadUrl, progress, debugMsg } = useReportPolling(sessionId)

  const statusLabel: Record<Status, string> = {
    pending:    'Consulting the stars…',
    processing: 'Weaving your cosmic blueprint…',
    done:       'Your report is ready!',
    error:      'Taking longer than usual — check your email shortly.',
  }

  return (
    <main className="page">
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>

        <div style={{
          position: 'absolute', inset: -100, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(200,144,26,0.13) 0%, transparent 70%)',
          animation: 'pulseGlow 4s infinite',
        }} />

        <div className="success-icon">✨</div>

        <h1 className="success-title">
          {status === 'done' ? 'Your Cosmic Blueprint is Ready' : 'Your Cosmic Blueprint is Being Forged'}
        </h1>

        <p className="success-text">
          {status === 'error'
            ? 'Payment received. Generation is taking a bit longer — your PDF will arrive by email within 5 minutes.'
            : 'Payment received successfully. Your personalized Khagatara report is now being generated.'}
        </p>

        {/* Delivery box */}
        <div className="success-note" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', opacity: 0.6, marginBottom: 8, textTransform: 'uppercase' }}>
            Report Delivery Email
          </div>
          <div style={{ color: '#c8901a', fontSize: '1.1rem', fontWeight: 600, wordBreak: 'break-word' }}>
            {email || 'Email used at checkout'}
          </div>
          <div style={{ marginTop: 8, opacity: 0.75, fontSize: '0.8rem' }}>
            Usually delivered within 1–3 minutes.
          </div>
          {sessionId && (
            <div style={{ marginTop: 8, fontSize: '0.68rem', opacity: 0.45, wordBreak: 'break-all' }}>
              Order ref: {sessionId}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#7a6a5a', letterSpacing: '0.08em' }}>
              {statusLabel[status]}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#c8901a' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #c8901a, #e8c547)',
              borderRadius: 999,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Debug strip — remove before going live */}
        {debugMsg && (
          <p style={{ fontSize: '0.6rem', color: '#5a4a3a', marginTop: 4, fontFamily: 'monospace' }}>
            {debugMsg}
          </p>
        )}

        {/* Download button when done */}
        {status === 'done' && downloadUrl && (
          <a href={downloadUrl} download className="cta-btn"
            style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
            ⬇ Download Your PDF Report
          </a>
        )}

        {status !== 'done' && (
          <p style={{ fontSize: '0.72rem', color: '#5a4a3a', letterSpacing: '0.06em', marginTop: '0.75rem', textAlign: 'center' }}>
            Please do not close this page while your report is processing.
          </p>
        )}

        <p style={{ fontSize: '0.7rem', color: '#5a4a3a', letterSpacing: '0.04em', marginTop: '1rem', textAlign: 'center', lineHeight: 1.6 }}>
          If your PDF does not arrive within 5 minutes, contact:{' '}
          <span style={{ color: '#c8901a' }}>info@khagatara.com</span>
        </p>

        {/* Account creation */}
        <div style={{ marginTop: '2rem', borderTop: '0.5px solid #2a2330', paddingTop: '1.5rem' }}>
          <AccountForm email={email} sessionId={sessionId ?? undefined} />
        </div>

        <Link href="/" className="btn-link" style={{ marginTop: '1.5rem', display: 'block' }}>
          Generate Another Reading
        </Link>
      </div>

      <style>{`
        .account-box {
          background: #0d0b0f;
          border: 0.5px solid #2e2535;
          border-radius: 10px;
          padding: 1.25rem;
        }
        .account-label {
          color: #c8901a;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .account-sub {
          color: #5a4a3a;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </main>
  )
}

export default function Success() {
  return (
    <Suspense fallback={<main className="page" />}>
      <SuccessContent />
    </Suspense>
  )
}

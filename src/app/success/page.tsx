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
      <div style={{ color: '#e8c547', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>Account Created</div>
      <div style={{ color: '#c8b89a', fontSize: '0.72rem', marginTop: 6, letterSpacing: '0.06em' }}>Your readings will be saved to your account.</div>
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
  const [debugMsg, setDebugMsg]   = useState(sessionId ? '' : '⚠ No session_id in URL — polling skipped')   // visible during dev
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const attemptsRef = useRef(0)
  const MAX_ATTEMPTS = 40  // ~2 min at 3 s

  useEffect(() => {
    if (!sessionId) {
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
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        setDebugMsg(`Poll ${attemptsRef.current}: fetch error — ${message}`)
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

// ─── Native download labels ───────────────────────────────────────────────────
const DOWNLOAD_LABELS: Record<string, { screen: string; pdf: string }> = {
  ml: { screen: 'മലയാളത്തിൽ കാണുക', pdf: 'മലയാളത്തിൽ ഡൗൺലോഡ് ചെയ്യുക' },
  hi: { screen: 'हिंदी में देखें', pdf: 'हिंदी में डाउनलोड करें' },
  ta: { screen: 'தமிழில் காண்க', pdf: 'தமிழில் பதிவிறக்கவும்' },
  te: { screen: 'తెలుగులో చూడండి', pdf: 'తెలుగులో డౌన్‌లోడ్ చేయండి' },
  kn: { screen: 'ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ', pdf: 'ಕನ್ನಡದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
  ar: { screen: 'عرض بالعربية', pdf: 'تحميل بالعربية' },
  fa: { screen: 'مشاهده به فارسی', pdf: 'دانلود به فارسی' },
  ur: { screen: 'اردو میں دیکھیں', pdf: 'اردو میں ڈاؤن لوڈ کریں' },
  he: { screen: 'צפה בעברית', pdf: 'הורד בעברית' },
  'zh-cn': { screen: '以简体中文查看', pdf: '下载简体中文版' },
  'zh-tw': { screen: '以繁體中文查看', pdf: '下載繁體中文版' },
  zh_cn: { screen: '以简体中文查看', pdf: '下载简体中文版' },
  zh_tw: { screen: '以繁體中文查看', pdf: '下載繁體中文版' },
  yue: { screen: '以廣東話查看', pdf: '下載廣東話' },
  ja: { screen: '日本語で見る', pdf: '日本語でダウンロード' },
  ko: { screen: '한국어로 보기', pdf: '한국어로 다운로드' },
  ru: { screen: 'Смотреть на русском', pdf: 'Скачать на русском' },
  uk: { screen: 'Переглянути українською', pdf: 'Завантажити українською' },
  el: { screen: 'Προβολή στα ελληνικά', pdf: 'Λήψη στα ελληνικά' },
  am: { screen: 'በአማርኛ ይመልከቱ', pdf: 'በአማርኛ ያውርዱ' },
  ti: { screen: 'ብትግርኛ ርአዩ', pdf: 'ብትግርኛ ኣውርዱ' },
  my: { screen: 'မြန်မာဘာသာဖြင့် ကြည့်ရှုပါ', pdf: 'မြန်မာဘာသာဖြင့် ဒေါင်းလုဒ်လုပ်ပါ' },
  th: { screen: 'ดูเป็นภาษาไทย', pdf: 'ดาวน์โหลดเป็นภาษาไทย' },
  km: { screen: 'មើលជាភាសាខ្មែរ', pdf: 'ទាញយកជាភាសាខ្មែរ' },
  bn: { screen: 'বাংলায় দেখুন', pdf: 'বাংলায় ডাউনলোড করুন' },
  pa: { screen: 'ਪੰਜਾਬੀ ਵਿੱਚ ਵੇਖੋ', pdf: 'ਪੰਜਾਬੀ ਵਿੱਚ ਡਾਊਨਲੋਡ ਕਰੋ' },
  gu: { screen: 'ગુજરાતીમાં જુઓ', pdf: 'ગુજરાતીમાં ડાઉનલોડ કરો' },
  es: { screen: 'Ver en español', pdf: 'Descargar en español' },
  pt: { screen: 'Ver em português', pdf: 'Baixar em português' },
  fr: { screen: 'Voir en français', pdf: 'Télécharger en français' },
  de: { screen: 'Auf Deutsch ansehen', pdf: 'Auf Deutsch herunterladen' },
  it: { screen: 'Vedi in italiano', pdf: 'Scarica in italiano' },
  tr: { screen: 'Türkçe görüntüle', pdf: 'Türkçe indir' },
  sw: { screen: 'Tazama kwa Kiswahili', pdf: 'Pakua kwa Kiswahili' },
  id: { screen: 'Lihat dalam Bahasa Indonesia', pdf: 'Unduh dalam Bahasa Indonesia' },
  vi: { screen: 'Xem bằng tiếng Việt', pdf: 'Tải xuống bằng tiếng Việt' },
}

const DEFAULT_LABELS = { screen: 'View in English', pdf: 'Download Your PDF Report' }

const MOTHER_TONGUE_OPTIONS = [
  { code: 'en', native: 'English', english: 'English', flag: '🇬🇧' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', flag: '🇮🇳' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', flag: '🇮🇳' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', flag: '🇮🇳' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', flag: '🇮🇳' },
  { code: 'ar', native: 'العربية', english: 'Arabic', flag: '🇸🇦' },
  { code: 'fa', native: 'فارسی', english: 'Persian (Farsi)', flag: '🇮🇷' },
  { code: 'ur', native: 'اردو', english: 'Urdu', flag: '🇵🇰' },
  { code: 'he', native: 'עברית', english: 'Hebrew', flag: '🇮🇱' },
  { code: 'zh-cn', native: '中文（简体）', english: 'Chinese Simplified', flag: '🇨🇳' },
  { code: 'zh-tw', native: '中文（繁體）', english: 'Chinese Traditional', flag: '🇹🇼' },
  { code: 'yue', native: '廣東話', english: 'Cantonese', flag: '🇭🇰' },
  { code: 'ja', native: '日本語', english: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', native: '한국어', english: 'Korean', flag: '🇰🇷' },
  { code: 'ru', native: 'Русский', english: 'Russian', flag: '🇷🇺' },
  { code: 'uk', native: 'Українська', english: 'Ukrainian', flag: '🇺🇦' },
  { code: 'el', native: 'Ελληνικά', english: 'Greek', flag: '🇬🇷' },
  { code: 'am', native: 'አማርኛ', english: 'Amharic', flag: '🇪🇹' },
  { code: 'ti', native: 'ትግርኛ', english: 'Tigrinya', flag: '🇪🇷' },
  { code: 'my', native: 'မြန်မာဘာသာ', english: 'Burmese', flag: '🇲🇲' },
  { code: 'th', native: 'ภาษาไทย', english: 'Thai', flag: '🇹🇭' },
  { code: 'km', native: 'ភាសាខ្មែរ', english: 'Khmer', flag: '🇰🇭' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', flag: '🇧🇩' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🇮🇳' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳' },
  { code: 'es', native: 'Español', english: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', native: 'Português', english: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', native: 'Français', english: 'French', flag: '🇫🇷' },
  { code: 'de', native: 'Deutsch', english: 'German', flag: '🇩🇪' },
  { code: 'it', native: 'Italiano', english: 'Italian', flag: '🇮🇹' },
  { code: 'tr', native: 'Türkçe', english: 'Turkish', flag: '🇹🇷' },
  { code: 'sw', native: 'Kiswahili', english: 'Swahili', flag: '🇹🇿' },
  { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', flag: '🇮🇩' },
  { code: 'vi', native: 'Tiếng Việt', english: 'Vietnamese', flag: '🇻🇳' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
function SuccessContent() {
  const searchParams = useSearchParams()           // ← reads URL params correctly in client components
  const email     = searchParams.get('email')    ?? undefined
  const sessionId = searchParams.get('session_id') ?? searchParams.get('sessionid')
  const urlLang   = searchParams.get('mother_tongue') ?? 'en'

  const { status, downloadUrl, progress, debugMsg } = useReportPolling(sessionId)

  const [screenLang, setScreenLang] = useState(urlLang)
  const [pdfLang, setPdfLang] = useState(urlLang)

  const languageOptions = MOTHER_TONGUE_OPTIONS.some(o => o.code === urlLang)
    ? MOTHER_TONGUE_OPTIONS
    : [{ code: urlLang, native: urlLang, english: urlLang.toUpperCase(), flag: '🌐' }, ...MOTHER_TONGUE_OPTIONS]

  const screenLabel = (DOWNLOAD_LABELS[screenLang] ?? DEFAULT_LABELS).screen
  const pdfLabel = (DOWNLOAD_LABELS[pdfLang] ?? DEFAULT_LABELS).pdf

  const statusLabel: Record<Status, string> = {
    pending:    'Consulting the stars…',
    processing: 'Weaving your cosmic blueprint…',
    done:       'Your report is ready!',
    error:      'Taking longer than usual — check your email shortly.',
  }

  const pdfUrl = downloadUrl
    ? `${downloadUrl}${downloadUrl.includes('?') ? '&' : '?'}lang=${encodeURIComponent(pdfLang)}`
    : null

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
          <div style={{ color: '#c8b89a', fontSize: '0.62rem', letterSpacing: '0.18em', opacity: 0.85, marginBottom: 8, textTransform: 'uppercase' }}>
            Report Delivery Email
          </div>
          <div style={{ color: '#e8c547', fontSize: '1.1rem', fontWeight: 700, wordBreak: 'break-word' }}>
            {email || 'Email used at checkout'}
          </div>
          <div style={{ color: '#c8b89a', marginTop: 8, opacity: 0.9, fontSize: '0.8rem' }}>
            Usually delivered within 1–3 minutes.
          </div>
          {sessionId && (
            <div style={{ color: '#9a8878', marginTop: 8, fontSize: '0.68rem', opacity: 0.75, wordBreak: 'break-all' }}>
              Order ref: {sessionId}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#c8b89a', letterSpacing: '0.08em' }}>
              {statusLabel[status]}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#e8c547', fontWeight: 700 }}>{Math.round(progress)}%</span>
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

        {/* Screen language dropdown */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#9a8878', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            View reading in
          </div>
          <select
            value={screenLang}
            onChange={e => setScreenLang(e.target.value)}
            style={{
              width: '100%', background: '#1a1b26', border: '1px solid #2e2535',
              borderRadius: 8, color: '#cdd6f4', fontSize: '0.82rem',
              padding: '0.6rem 0.9rem', outline: 'none', cursor: 'pointer',
            }}>
            {languageOptions.map(o => (
              <option key={o.code} value={o.code}>{o.flag} {o.native} — {o.english}</option>
            ))}
          </select>
          <div style={{ fontSize: '0.7rem', color: '#c8b89a', marginTop: '0.4rem', textAlign: 'center', fontStyle: 'italic' }}>
            {screenLabel}
          </div>
        </div>

        {/* PDF language dropdown + download button */}
        {status === 'done' && pdfUrl && (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.6rem', color: '#9a8878', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Download PDF in
            </div>
            <select
              value={pdfLang}
              onChange={e => setPdfLang(e.target.value)}
              style={{
                width: '100%', background: '#1a1b26', border: '1px solid #2e2535',
                borderRadius: 8, color: '#cdd6f4', fontSize: '0.82rem',
                padding: '0.6rem 0.9rem', outline: 'none', cursor: 'pointer',
                marginBottom: '0.75rem',
              }}>
              {languageOptions.map(o => (
                <option key={o.code} value={o.code}>{o.flag} {o.native} — {o.english}</option>
              ))}
            </select>
            <a href={pdfUrl} download className="cta-btn"
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              ⬇ {pdfLabel}
            </a>
          </div>
        )}

        {status !== 'done' && (
          <p style={{ fontSize: '0.72rem', color: '#9a8878', letterSpacing: '0.06em', marginTop: '0.75rem', textAlign: 'center' }}>
            Please do not close this page while your report is processing.
          </p>
        )}

        <p style={{ fontSize: '0.7rem', color: '#9a8878', letterSpacing: '0.04em', marginTop: '1rem', textAlign: 'center', lineHeight: 1.6 }}>
          If your PDF does not arrive within 5 minutes, contact:{' '}
          <span style={{ color: '#e8c547', fontWeight: 700 }}>info@khagatara.com</span>
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
          color: #e8c547;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .account-sub {
          color: #c8b89a;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        select option { background: #1a1b26; }
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

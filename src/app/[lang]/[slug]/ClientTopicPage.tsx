'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LANGUAGE_CONFIG, TOPIC_SLUGS } from '../../seo-config'
import { CALC_LOCALIZATION } from '../../calculator-localization'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Result {
  life_path: number
  name_number: number
  soul_urge: number
  personality: number
  meaning: string
  rashi: string
  nakshatra: string
  nakshatra_pada: number
  dasha_lord: string
  dasha_years: number
}

interface HomeProps {
  // When rendered under /[lang]/[slug], Next.js passes params here.
  // For the root page (/) this will be undefined → falls back to 'en'.
  params?: { lang?: string }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home({ params }: HomeProps) {
  const lang = params?.lang ?? 'en'

  // Resolve strings: use the lang's translations if available, else fall back to English
  const t = CALC_LOCALIZATION[lang] ?? CALC_LOCALIZATION['en']

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [ampm, setAmpm] = useState('AM')
  const [birthPlace, setBirthPlace] = useState('')
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [gender, setGender] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isIndia, setIsIndia] = useState(false)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setIsIndia(tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta'))
  }, [])

  const showDisclaimer = timeUnknown || gender === 'prefer_not'

  function buildPayload() {
    return {
      name,
      dob,
      birth_time: timeUnknown ? '' : birthTime,
      ampm,
      birth_place: birthPlace,
      time_unknown: timeUnknown,
    }
  }

  async function calculate() {
    if (!name || !dob) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://khagatara-api.onrender.com/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setError(t.errorText)
    }
    setLoading(false)
  }

  async function getFullReport() {
    setLoading(true)
    try {
      if (isIndia) {
        const res = await fetch('https://khagatara-api.onrender.com/create-checkout-inr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload())
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Payment failed')

        const rzp = new (window as any).Razorpay({
          key:         data.key_id,
          amount:      data.amount,
          currency:    data.currency,
          order_id:    data.order_id,
          name:        'Khagatara',
          description: 'Your Complete Vedic Blueprint',
          prefill:     { name: data.name },
          theme:       { color: '#c8901a' },
          handler: function() {
            window.location.href = 'https://khagatara.com/success'
          }
        })
        rzp.open()
      } else {
        const res = await fetch('https://khagatara-api.onrender.com/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload())
        })
        const data = await res.json()
        if (!res.ok || !data.checkout_url) throw new Error(data.detail || 'Payment failed')
        window.location.href = data.checkout_url
      }
    } catch (err: unknown) {
      console.error(err)
      setError(t.errorPayment)
    }
    setLoading(false)
  }

  // Resolve nav slugs for the current lang
  const numerologySlug   = TOPIC_SLUGS?.numerology?.[lang]       ?? 'free-numerology-reading'
  const astrologySlug    = TOPIC_SLUGS?.astrology?.[lang]        ?? 'free-vedic-astrology'
  const birthChartSlug   = TOPIC_SLUGS?.birthChart?.[lang]       ?? 'free-birth-chart'
  const compatSlug       = TOPIC_SLUGS?.compatibility?.[lang]    ?? 'numerology-compatibility'

  return (
    <main className="page">
      <nav className="nav">
        <div className="nav-logo">
          <div className="tri-wrap" aria-hidden="true">
            <div className="tr"><div className="t tu ta"></div><div className="t tu tb"></div><div className="t tu tc"></div></div>
            <div className="tr"><div className="t tu tb"></div><div className="t tu tc"></div></div>
            <div className="tr"><div className="t td te"></div></div>
          </div>
          <span className="logo-txt">khagatara</span>
        </div>
        <div className="nav-links">
          <Link href={`/${lang}/${numerologySlug}`}>Readings</Link>
          <Link href={`/${lang}/${astrologySlug}`}>Astrology</Link>
          <Link href={`/${lang}/${birthChartSlug}`}>Birth Chart</Link>
          <Link href={`/${lang}/${compatSlug}`}>Compatibility</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Vedic numerology</div>
        <h1 className="hero-title">Discover your<br /><em>cosmic path</em></h1>
        <p className="hero-sub">Ancient wisdom. Personal insight. Timeless guidance.</p>

        <div className="form-card">
          <div className="form-row">
            <label htmlFor="name" className="font-mono-crisp text-[var(--text-low)] text-[10px] font-bold uppercase tracking-widest">
              {t.placeholderName}
            </label>
            <input
              className="font-sans tracking-wide"
              id="name"
              type="text"
              placeholder={t.placeholderName}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="dob">{t.placeholderDob}</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="birthPlace">{t.placeholderPlace}</label>
            <input
              id="birthPlace"
              type="text"
              placeholder={t.placeholderPlace}
              value={birthPlace}
              onChange={e => setBirthPlace(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="birthTime">
              {/* Birth time label — use the disclaimer text as a hint or add a dedicated key if needed */}
              Birth time
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="birthTime"
                type="time"
                value={birthTime}
                disabled={timeUnknown}
                onChange={e => setBirthTime(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--surface2)', border: '0.5px solid var(--border2)',
                  borderRadius: '6px', color: 'var(--text)', padding: '0.65rem 0.5rem',
                  fontSize: '0.82rem', opacity: timeUnknown ? 0.4 : 1
                }}
              />
              <select
                value={ampm}
                disabled={timeUnknown}
                onChange={e => setAmpm(e.target.value)}
                style={{
                  background: 'var(--surface2)', border: '0.5px solid var(--border2)',
                  borderRadius: '6px', color: 'var(--text)', padding: '0.65rem 0.5rem',
                  fontSize: '0.82rem', opacity: timeUnknown ? 0.4 : 1
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--text-low)' }}>
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={e => setTimeUnknown(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              {t.labelTimeUnknown}
            </label>
          </div>
          <div className="form-row">
            <label>Gender</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
              {([
                ['male',       t.genderMale],
                ['female',     t.genderFemale],
                ['prefer_not', t.genderOther],
              ] as [string, string][]).map(([val, label]) => (
                <label
                  key={val}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', fontSize: '0.82rem',
                    color: gender === val ? 'var(--accent)' : 'var(--text-low)'
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={val}
                    checked={gender === val}
                    onChange={() => setGender(val)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {showDisclaimer && (
            <div className="bg-[var(--surface2)] border border-[var(--accent)] rounded-lg p-3 mb-3 text-[0.72rem] text-[var(--text)] opacity-90 leading-relaxed font-mono">
              ⚠️ {t.disclaimerText}
            </div>
          )}

          <button
            className="w-full bg-[var(--primary)] text-[var(--background)] font-bold py-3 px-4 rounded-md transition-transform active:scale-[0.98] disabled:opacity-50 hover:brightness-110 tracking-wide uppercase text-xs"
            onClick={calculate}
            disabled={loading}
          >
            {loading ? t.btnCalculating : t.btnCalculate}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </section>

      {result && (
        <section className="result-card mt-8 border border-[var(--border-clean)] p-6 bg-[var(--surface)] rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {([
              [t.gridLifePath,    result.life_path],
              [t.gridNameNumber,  result.name_number],
              [t.gridSoulUrge,    result.soul_urge],
              [t.gridPersonality, result.personality],
            ] as [string, number][]).map(([label, value]) => (
              <div key={label} className="border border-[var(--border-clean)] bg-[var(--surface2)] p-4 rounded text-center">
                <div className="text-4xl font-bold font-mono-crisp text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent-glow)] antialiased">
                  {value}
                </div>
                <div className="text-[10px] text-[var(--text-low)] uppercase tracking-widest mt-2 font-bold font-mono-crisp">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p className="meaning text-[var(--text-high)] font-medium leading-relaxed mb-6 text-sm bg-[var(--surface2)] p-4 rounded border border-[var(--border-clean)]">
            {result.meaning}
          </p>

          <div className="border-t border-[var(--border-clean)] pt-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)] mb-3 font-mono-crisp">
              {t.titleVedic}
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-[var(--border-clean)] font-mono-crisp">
              <span className="text-[var(--text)]">{t.labelMoonSign}</span>
              <span className="font-bold text-[var(--text-high)]">{result.rashi}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-[var(--border-clean)] font-mono-crisp">
              <span className="text-[var(--text)]">{t.labelBirthStar}</span>
              <span className="font-bold text-[var(--text-high)]">
                {result.nakshatra}{' '}
                <span className="text-[var(--secondary)] font-medium">({t.labelPada}-{result.nakshatra_pada})</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 font-mono-crisp">
              <span className="text-[var(--text)]">{t.labelCurrentDasha}</span>
              <span className="font-bold text-[var(--text-high)]">
                {result.dasha_lord}{' '}
                <span className="text-[var(--accent)] font-medium">({result.dasha_years} {t.labelYears})</span>
              </span>
            </div>
          </div>

          <div className="premium-blur my-6 p-4 rounded-md bg-[var(--surface2)] bg-opacity-40 border border-[var(--secondary)] border-opacity-20 backdrop-blur-md text-xs text-[var(--text)] leading-relaxed">
            {t.premiumText}
          </div>

          <button
            className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--background)] font-extrabold py-3 rounded-md uppercase tracking-wider text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
            onClick={getFullReport}
            disabled={loading}
          >
            {loading ? t.btnLoading : isIndia ? 'Get Full Report - ₹99' : t.btnReport}
          </button>
          <p className="payment-note text-center text-[var(--text-low)] text-[0.7rem] mt-2 font-mono">
            {t.paymentNote}
          </p>
        </section>
      )}

      <section className="section">
        <div className="section-label">Popular free readings</div>
        <div className="readings-grid">
          <Link className="reading-pill" href={`/${lang}/${numerologySlug}`}>Free numerology reading</Link>
          <Link className="reading-pill" href={`/${lang}/${TOPIC_SLUGS?.nameNumerology?.[lang] ?? 'numerology-by-name'}`}>Numerology by name</Link>
          <Link className="reading-pill" href={`/${lang}/${TOPIC_SLUGS?.number11?.[lang] ?? 'meaning-of-number-11'}`}>Meaning of number 11</Link>
          <Link className="reading-pill" href={`/${lang}/${astrologySlug}`}>Free Vedic astrology</Link>
          <Link className="reading-pill" href={`/${lang}/${birthChartSlug}`}>Free birth chart</Link>
          <Link className="reading-pill" href={`/${lang}/${compatSlug}`}>Compatibility</Link>
          <Link className="reading-pill" href={`/${lang}/${TOPIC_SLUGS?.astrologyChart?.[lang] ?? 'free-astrology-chart'}`}>Free astrology chart</Link>
        </div>
      </section>

      <section className="features">
        <div className="feat-card">
          <div className="feat-icon">01</div>
          <div className="feat-title">{t.gridLifePath}</div>
          <div className="feat-desc">Uncover your soul&apos;s purpose and destiny number</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">02</div>
          <div className="feat-title">Birth chart</div>
          <div className="feat-desc">Vedic planetary positions at your moment of birth</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">03</div>
          <div className="feat-title">Compatibility</div>
          <div className="feat-desc">Discover your cosmic match and relationship path</div>
        </div>
        <Link href={`/${lang}/${compatSlug}`} className="feat-card feat-card--marriage">
          <div className="feat-icon">04</div>
          <div className="feat-title">Relationship &amp; Marriage</div>
          <div className="feat-desc">Partnership energy, karmic cycles, and relationship timing</div>
        </Link>
      </section>

      <div className="divider"></div>

      <section className="lang-section">
        <div className="section-label">Read in your language</div>
        <div className="lang-grid">
          {LANGUAGE_CONFIG.map(([code, name]) => {
            const slug = TOPIC_SLUGS?.numerology?.[code] ?? 'free-numerology-reading'
            return (
              <Link key={code} className="lang-pill" href={`/${code}/${slug}`}>
                {name}
              </Link>
            )
          })}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-txt">© 2026 khagatara.com</div>
        <div className="footer-links">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact</Link>
        </div>
      </footer>
    </main>
  )
}

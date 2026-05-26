// src/app/read/[slug]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { READING_DEFS, CATEGORY_ORDER, type ReadingDef } from '../../reading-slugs'

const HOOKS: Record<string, string[]> = {
  'why-men-are-drawn-to-certain-body-types': [
    'There is a reason certain body shapes stop a man mid-thought.',
    'It is not random. It is not shallow.',
    'It is ancient, wired deep into the nervous system over thousands of years.',
    'Most men cannot explain it even to themselves — because it bypasses language entirely.',
    'What triggers this pull is not what magazines tell you. It is something far more specific.',
  ],
  'why-some-women-attract-obsession': [
    'Some women walk into a room and something shifts in the air.',
    'Men remember them for years — sometimes decades — without understanding why.',
    'They are not always the most beautiful person present.',
    'They carry something else. Something that operates below conscious awareness.',
    'This quality has a name, a pattern, and an origin — and it is not accidental.',
  ],
  'when-will-i-get-married': [
    'The question returns. No matter how much you tell yourself it does not matter.',
    'You have waited, wondered, watched others move forward while you stayed still.',
    'It is not bad luck. It is not your fault. It is timing — cosmic, precise, and readable.',
    'Vedic astrology identifies specific marriage windows in every person\'s chart.',
    'For you, that window is visible — and it may be closer than you currently believe.',
  ],
  'your-hidden-karmic-relationship-pattern': [
    'Every relationship you have ever had follows a hidden thread.',
    'The same dynamic, different faces. You have noticed this.',
    'This is not coincidence and it is not your personality.',
    'It is a karmic contract — chosen before this lifetime — playing out in each connection.',
    'Once you see the pattern clearly, you gain the power to change it.',
  ],
  'the-dark-side-of-your-personality': [
    'Every number has a shadow. Every Nakshatra carries a wound.',
    'The traits you work hardest to hide are the ones shaping your life most powerfully right now.',
    'Not because you are flawed — but because unseen energy is still energy.',
    'Your dark side is not something to be ashamed of. It is something to be understood.',
    'Because what you cannot see in yourself, others will exploit.',
  ],
  'the-hidden-reason-your-life-feels-blocked': [
    'You are working hard. You are doing the right things.',
    'And yet something keeps not moving. Doors that should open stay closed.',
    'This is not failure and it is not your fault.',
    'There is a specific karmic obstruction visible in your birth chart.',
    'It has a name, a duration, and — most importantly — a way through.',
  ],
  'the-emotional-wound-controlling-your-decisions': [
    'Every major decision you have made in the last five years has been quietly shaped by one wound.',
    'A wound you have circled but never fully faced.',
    'It shows up in who you choose, what you avoid, how you respond to love.',
    'This is the most important thing to understand about yourself right now.',
    'Not to blame yourself — but to finally be free of it.',
  ],
  // Default hook for all other slugs — pulled from reading title
  '__default': [
    'Most people live their entire lives without understanding this about themselves.',
    'The pattern is visible. The evidence is consistent. The truth is uncomfortable.',
    'What you are about to read is not theory — it is ancient observation confirmed by thousands.',
    'The five lines above are just the beginning.',
    'The full reading will show you something about yourself you cannot unknow.',
  ],
}

function getHook(slug: string): string[] {
  return HOOKS[slug] ?? HOOKS['__default']
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void }
  }
}

export default function ReadingPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const reading = READING_DEFS.find(r => r.slug === slug)
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage for existing unlock
    const key = `unlocked:${slug}`
    if (localStorage.getItem(key) === 'true') {
      setUnlocked(true)
    }
  }, [slug])

  useEffect(() => {
    if (unlocked) {
      // Fetch full content markdown
      fetch(`/api/read-content?slug=${slug}`)
        .then(r => r.json())
        .then(d => setContent(d.content))
        .catch(() => setContent(null))
    }
  }, [unlocked, slug])

  if (!reading) {
    return (
      <main style={{minHeight:'100vh', background:'var(--bg)', padding:'4rem 2rem', textAlign:'center'}}>
        <p style={{color:'var(--text-low)'}}>Reading not found.</p>
        <Link href="/read" style={{color:'var(--accent)', fontSize:'0.78rem'}}>← Back to Readings</Link>
      </main>
    )
  }

  const hook = getHook(slug)
  const readMin = reading.price === 9 ? '3 min' : reading.price === 19 ? '6 min' : '10 min'

  // Related readings — same category, exclude current
  const related = READING_DEFS
    .filter(r => r.category === reading.category && r.slug !== slug)
    .slice(0, 3)

  function handleUnlock() {
    if (!window.Razorpay) {
      alert('Payment system loading. Please try again in a moment.')
      return
    }
    setLoading(true)
    const rz = new window.Razorpay({
      key: RAZORPAY_KEY,
      amount: reading!.price * 100, // paise
      currency: 'INR',
      name: 'Khagatara',
      description: reading!.title,
      prefill: {},
      theme: { color: '#B07A10' },
      handler: function () {
        localStorage.setItem(`unlocked:${slug}`, 'true')
        setUnlocked(true)
        setLoading(false)
      },
      modal: {
        ondismiss: () => setLoading(false)
      }
    })
    rz.open()
  }

  return (
    <main style={{minHeight:'100vh', background:'var(--bg)'}}>

      {/* Nav */}
      <div style={{
        padding:'1rem 2rem',
        borderBottom:'0.5px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <Link href="/read" style={{
          fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase',
          color:'var(--text-low)', border:'0.5px solid var(--border2)',
          borderRadius:'20px', padding:'0.35rem 0.9rem', textDecoration:'none'
        }}>← Readings</Link>
        <Link href="/" style={{
          fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase',
          color:'var(--text-low)', border:'0.5px solid var(--border2)',
          borderRadius:'20px', padding:'0.35rem 0.9rem', textDecoration:'none'
        }}>Home</Link>
      </div>

      {/* Reading container */}
      <div style={{maxWidth:'680px', margin:'0 auto', padding:'2.5rem 1.5rem'}}>

        {/* Category + read time */}
        <div style={{display:'flex', gap:'0.5rem', marginBottom:'1rem', alignItems:'center'}}>
          <span style={{
            fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase',
            color:'var(--accent)', border:'0.5px solid var(--accent)',
            borderRadius:'10px', padding:'0.2rem 0.6rem'
          }}>{reading.category}</span>
          <span style={{fontSize:'0.6rem', color:'var(--muted)', letterSpacing:'0.06em'}}>{readMin} read</span>
          {!unlocked && (
            <span style={{
              fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase',
              color:'var(--btn-txt)', background:'var(--accent)',
              borderRadius:'10px', padding:'0.2rem 0.7rem', marginLeft:'auto'
            }}>₹{reading.price}</span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:"'Cormorant Garamond', serif",
          fontSize:'2.2rem', fontWeight:500,
          color:'var(--text)', lineHeight:1.2,
          marginBottom:'2rem'
        }}>{reading.title}</h1>

        {/* Free hook — always visible */}
        <div style={{marginBottom:'2rem'}}>
          {hook.map((line, i) => (
            <p key={i} style={{
              color: i === 0 ? 'var(--text)' : 'var(--text-low)',
              lineHeight:'1.8',
              marginBottom:'0.75rem',
              fontFamily: i === 0 ? "'Cormorant Garamond', serif" : 'inherit',
              fontSize: i === 0 ? '1.15rem' : '0.95rem',
            } as React.CSSProperties}>{line}</p>
          ))}
        </div>

        {/* Divider */}
        <div style={{height:'0.5px', background:'var(--border)', margin:'1.5rem 0'}} />

        {/* Unlocked content */}
        {unlocked && content && (
          <div style={{marginBottom:'2rem'}}>
            {content.split('\n\n').map((para, i) => {
              if (para.startsWith('## ')) return (
                <h2 key={i} style={{color:'var(--accent)', fontSize:'1.3rem', margin:'1.5rem 0 0.75rem', fontFamily:"'Cormorant Garamond', serif"}}>{para.replace('## ','')}</h2>
              )
              if (para.startsWith('# ')) return (
                <h2 key={i} style={{color:'var(--accent)', fontSize:'1.6rem', margin:'1.5rem 0 0.75rem', fontFamily:"'Cormorant Garamond', serif"}}>{para.replace('# ','')}</h2>
              )
              return (
                <p key={i} style={{color:'var(--text-low)', lineHeight:'1.8', marginBottom:'1rem', fontSize:'0.95rem'}}>
                  {para.split('**').map((part, pi) =>
                    pi % 2 === 1 ? <strong key={pi} style={{color:'var(--text)'}}>{part}</strong> : part
                  )}
                </p>
              )
            })}
          </div>
        )}

        {unlocked && !content && (
          <div style={{
            background:'var(--surface)', border:'0.5px solid var(--border2)',
            borderRadius:'10px', padding:'2rem', textAlign:'center',
            marginBottom:'2rem', color:'var(--text-low)', fontSize:'0.82rem'
          }}>
            Loading your reading...
          </div>
        )}

        {/* Locked blur section */}
        {!unlocked && (
          <div style={{position:'relative', marginBottom:'2rem'}}>
            {/* Blurred preview */}
            <div style={{
              filter:'blur(4px)',
              userSelect:'none',
              pointerEvents:'none',
              opacity:0.6,
              lineHeight:'1.8',
              fontSize:'0.9rem',
              color:'var(--text-low)',
            }}>
              <p>The full reading reveals the specific pattern operating in your life right now. This is not general astrology — it is a precise analysis of your personal birth signature and what it means for this exact area of your life.</p>
              <p style={{marginTop:'1rem'}}>Most people who read this come back within 24 hours to unlock another reading. Not because they are addicted to content — but because for the first time, something they could not name suddenly has a name.</p>
              <p style={{marginTop:'1rem'}}>The information below covers the root cause, the pattern, the timing, and the practical implication for your life right now. It is uncomfortable in places. It is also freeing.</p>
            </div>

            {/* Fade gradient */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0,
              height:'80px',
              background:'linear-gradient(transparent, var(--bg))',
              pointerEvents:'none'
            }} />
          </div>
        )}

        {/* Unlock CTA */}
        {!unlocked && (
          <div style={{
            background:'var(--surface)',
            border:'0.5px solid var(--border2)',
            borderRadius:'14px',
            padding:'1.75rem',
            textAlign:'center',
            marginBottom:'2rem'
          }}>
            <div style={{
              fontSize:'0.62rem', letterSpacing:'0.14em',
              textTransform:'uppercase', color:'var(--text-low)',
              marginBottom:'0.5rem'
            }}>Your reading is waiting</div>
            <h3 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'1.35rem', color:'var(--text)',
              marginBottom:'0.5rem', fontWeight:500
            }}>Reveal the full truth</h3>
            <p style={{
              fontSize:'0.75rem', color:'var(--text-low)',
              lineHeight:'1.6', marginBottom:'1.25rem'
            }}>
              Unlock the complete {readMin} reading — the root cause, the pattern, the timing, and what to do now.
            </p>
            <button
              onClick={handleUnlock}
              disabled={loading}
              style={{
                width:'100%',
                background:'var(--accent)',
                border:'none',
                borderRadius:'8px',
                color:'var(--btn-txt)',
                fontSize:'0.82rem',
                fontWeight:700,
                letterSpacing:'0.12em',
                padding:'0.85rem',
                textTransform:'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition:'background 0.2s',
              }}
            >
              {loading ? 'Opening payment...' : `🔓 Continue Reading — ₹${reading.price}`}
            </button>
            <p style={{fontSize:'0.62rem', color:'var(--muted)', marginTop:'0.6rem', letterSpacing:'0.04em'}}>
              Instant unlock • Secure payment • No subscription
            </p>
          </div>
        )}

        {/* Also trending */}
        {related.length > 0 && (
          <div style={{marginTop:'3rem'}}>
            <div style={{
              fontSize:'0.62rem', letterSpacing:'0.18em', color:'var(--accent)',
              textTransform:'uppercase', marginBottom:'1rem',
              display:'flex', alignItems:'center', gap:'0.75rem'
            }}>
              Also trending
              <span style={{flex:1, height:'0.5px', background:'var(--border)'}} />
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
              {related.map(r => (
                <Link key={r.slug} href={`/read/${r.slug}`} style={{
                  background:'var(--surface)',
                  border:'0.5px solid var(--border2)',
                  borderRadius:'10px',
                  padding:'1rem 1.25rem',
                  textDecoration:'none',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                  transition:'border-color 0.2s',
                }}>
                  <span style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:'0.95rem', color:'var(--text)', lineHeight:1.3
                  }}>{r.title}</span>
                  <span style={{
                    fontSize:'0.62rem', color:'var(--accent)',
                    whiteSpace:'nowrap', marginLeft:'1rem',
                    letterSpacing:'0.08em'
                  }}>₹{r.price} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

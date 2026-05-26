'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { READING_DEFS } from '../reading-slugs'

const STRIP_SLUGS = [
  'when-will-i-get-married',
  'why-men-are-drawn-to-certain-body-types',
  'your-hidden-karmic-relationship-pattern',
  'who-you-should-never-trust',
  'the-dark-side-of-your-personality',
  'the-hidden-reason-your-life-feels-blocked',
  'why-some-women-attract-obsession',
  'birth-patterns-linked-to-betrayal',
  'the-emotional-wound-controlling-your-decisions',
  'what-your-birth-type-reveals',
  'who-secretly-desires-you',
  'why-relationships-keep-failing',
]

const STRIP_HOOKS: Record<string, string> = {
  'when-will-i-get-married':                       "The window is visible in your chart — and closer than you think.",
  'why-men-are-drawn-to-certain-body-types':       "Ancient, wired deep. Not what you've been told.",
  'your-hidden-karmic-relationship-pattern':       "Same dynamic. Different face. There's a reason.",
  'who-you-should-never-trust':                    "They smile. They help. And they are watching.",
  'the-dark-side-of-your-personality':             "What you hide is shaping your life more than what you show.",
  'the-hidden-reason-your-life-feels-blocked':     "You're doing everything right. And something keeps stopping you.",
  'why-some-women-attract-obsession':              "Not the most beautiful. They carry something else entirely.",
  'birth-patterns-linked-to-betrayal':             "It rarely comes from strangers.",
  'the-emotional-wound-controlling-your-decisions':"Every major choice has been quietly shaped by one thing.",
  'what-your-birth-type-reveals':                  "C-section or natural — it leaves a signature on your karma.",
  'who-secretly-desires-you':                      "Someone is thinking about you more than you know.",
  'why-relationships-keep-failing':                "One wound. Recreating itself. In every connection.",
}

export default function TrendingStrip() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 440 : -440, behavior: 'smooth' })
  }

  const strips = STRIP_SLUGS
    .map(slug => READING_DEFS.find(r => r.slug === slug))
    .filter(Boolean) as typeof READING_DEFS

  return (
    <section className="section">
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:'1.25rem' }}>
        <div className="section-label" style={{ marginBottom:0, flex:1 }}>
          🔥 Trending Readings
          <Link href="/read" style={{
            marginLeft:'auto',
            fontSize:'0.62rem', letterSpacing:'0.1em',
            color:'var(--accent)', textDecoration:'none',
            textTransform:'uppercase'
          }}>See All →</Link>
        </div>

        {/* Arrow buttons */}
        <div style={{ display:'flex', gap:'0.4rem', marginLeft:'1rem' }}>
          <button onClick={() => scroll('left')} aria-label="Scroll left" style={{
            background:'var(--surface)', border:'0.5px solid var(--border2)',
            borderRadius:'50%', width:'32px', height:'32px',
            cursor:'pointer', color:'var(--text)', fontSize:'0.9rem',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color='var(--accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border2)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text)' }}
          >‹</button>
          <button onClick={() => scroll('right')} aria-label="Scroll right" style={{
            background:'var(--surface)', border:'0.5px solid var(--border2)',
            borderRadius:'50%', width:'32px', height:'32px',
            cursor:'pointer', color:'var(--text)', fontSize:'0.9rem',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color='var(--accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border2)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text)' }}
          >›</button>
        </div>
      </div>

      {/* Scrollable row */}
      <div ref={scrollRef} style={{
        display:'flex',
        gap:'0.75rem',
        overflowX:'auto',
        paddingBottom:'0.75rem',
        scrollbarWidth:'none',
        msOverflowStyle:'none',
      }}>
        {strips.map(reading => (
          <Link
            key={reading.slug}
            href={`/read/${reading.slug}`}
            style={{
              flexShrink: 0,
              width: '200px',
              background: 'var(--surface)',
              border: '0.5px solid var(--border2)',
              borderRadius: '12px',
              padding: '1rem',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            className="trending-card"
          >
            <div style={{
              fontSize:'0.58rem', letterSpacing:'0.1em',
              textTransform:'uppercase', color:'var(--accent)',
              border:'0.5px solid var(--accent)',
              borderRadius:'8px', padding:'0.15rem 0.5rem',
              alignSelf:'flex-start'
            }}>₹{reading.price}</div>

            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'0.95rem', fontWeight:600,
              color:'var(--text)', lineHeight:1.3,
            }}>{reading.title}</div>

            <div style={{
              fontSize:'0.7rem', color:'var(--text-low)',
              lineHeight:1.6, flex:1,
            }}>{STRIP_HOOKS[reading.slug] ?? ''}</div>

            <div style={{
              fontSize:'0.62rem', color:'var(--accent)',
              letterSpacing:'0.08em', textTransform:'uppercase',
              marginTop:'0.25rem',
            }}>Unlock →</div>
          </Link>
        ))}
      </div>

      <style>{`
        .trending-card:hover {
          border-color: var(--accent) !important;
          transform: translateY(-2px);
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}

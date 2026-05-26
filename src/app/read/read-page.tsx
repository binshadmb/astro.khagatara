// src/app/read/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { READING_DEFS, CATEGORY_ORDER, type ReadingDef } from '../reading-slugs'
import { siteUrl } from '../seo'

export const metadata: Metadata = {
  title: 'Readings — Unlock Hidden Truths About Your Life | Khagatara',
  description: 'Explore 50+ personal readings on attraction, marriage, karma, beauty, and destiny. Free preview — unlock the full truth for ₹9–₹29.',
  alternates: { canonical: '/read' },
  openGraph: {
    title: 'Readings — Unlock Hidden Truths | Khagatara',
    description: 'Personal readings on love, attraction, karma, and destiny.',
    url: `${siteUrl}/read`,
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  Attraction: '🔥 Attraction',
  Marriage:   '💍 Marriage',
  Forbidden:  '⚠️ Forbidden',
  Beauty:     '✨ Beauty',
  Spiritual:  '🌙 Spiritual',
  Male:       '👨 Male',
  Female:     '👩 Female',
  Truth:      '🔮 Truth',
}

const HOOKS: Record<string, string> = {
  'why-men-are-drawn-to-certain-body-types':    'There is a reason certain body shapes stop a man mid-thought. It is not random. It is not shallow. It is ancient, wired deep, and most men cannot explain it even to themselves.',
  'why-some-women-attract-obsession':           'Some women walk into a room and something shifts. Men remember them for years. They are not always the most beautiful. They carry something else — something that bypasses logic entirely.',
  'face-types-that-dominate-attention':         'Before you speak a single word, your face has already made an impression. Certain facial geometries trigger trust, desire, and authority automatically in others.',
  'what-your-eyes-reveal-about-desire':         'The eyes hold what the mouth will never say. Ancient Vedic texts call them the windows of the soul\'s hunger. What yours reveal may surprise you deeply.',
  'body-signs-linked-to-irresistible-attraction': 'Beyond beauty, beyond fitness — there are specific physical signals that trigger primal attraction. Most people carry these signals without ever knowing it.',
  'birth-stars-that-create-magnetic-chemistry': 'Certain Nakshatra combinations create chemistry that defies logic. Two people meet and feel they have known each other for lifetimes. This is not coincidence.',
  'who-secretly-desires-you':                   'Right now, someone is thinking about you more than you know. Your birth chart holds clear signals about who is drawn to your energy — and has never told you.',
  'what-makes-someone-unforgettable-in-love':   'You have met people you cannot forget, no matter how much time passes. And others have met you. What creates this? It is not looks. It is something encoded deeper.',
  'why-some-people-look-younger':               'Two people born the same year. One looks forty. The other looks twenty-eight. The difference is not skincare. It is written in how they were born and how they live.',
  'when-will-i-get-married':                    'The question that keeps returning. You have waited, wondered, almost given up. Vedic astrology has a specific window for you — and it is closer than you think.',
  'why-marriage-gets-delayed':                  'For some people, love arrives easily but marriage does not. There is a specific planetary pattern behind this delay — and once you see it, everything makes sense.',
  'why-relationships-keep-failing':             'Same pattern. Different person. You have noticed it. There is one core wound in your chart that keeps attracting the wrong dynamic — until you see it clearly.',
  'who-you-should-never-marry':                 'Not every love is meant to become a marriage. Some connections are karmic — they arrive to teach, not to stay. Your chart shows clearly who will destroy your peace.',
  'signs-that-destroy-compatibility':           'Two people can love each other and still be completely wrong for each other. These are the signs that erode compatibility slowly — so slowly you do not see it coming.',
  'why-emotionally-unavailable-people-attract-you': 'You keep choosing people who cannot fully show up. This is not bad luck. It is a karmic pattern — and it has a very specific origin in your birth chart.',
  'your-hidden-karmic-relationship-pattern':    'Every relationship you have ever had follows a hidden thread. A pattern you chose before this lifetime. Once you see it, you cannot unsee it.',
  'one-marriage-or-many':                       'Some people are meant for one deep lifelong bond. Others are meant for multiple chapters of love. Your chart tells this truth clearly — and most people are shocked by what it reveals.',
  'dangerous-ages-for-relationships':           'There are specific ages in your life when relationships made or broken will shape everything that follows. These windows are visible in Vedic astrology.',
  'who-will-regret-leaving-you':                'Someone has already left thinking the choice was easy. Your chart shows clearly who carries the weight of that decision — and cannot put it down.',
  'who-you-should-never-trust':                 'Not everyone who smiles at you means well. Certain birth patterns are linked to betrayal, hidden agendas, and slow damage. Your chart shows you who to watch.',
  'birth-patterns-linked-to-betrayal':          'Betrayal rarely comes from strangers. It comes from those we trusted most. Certain planetary combinations at birth make someone prone to this pattern — knowingly or not.',
  'personalities-that-secretly-manipulate':     'They seem helpful. They seem caring. But something always feels slightly off. These are the personality patterns most linked to quiet, long-term manipulation.',
  'emotional-traits-of-dangerous-lovers':       'The most dangerous lovers do not arrive looking dangerous. They arrive looking like everything you ever wanted. Then slowly, the pattern begins.',
  'people-who-drain-your-energy':               'After spending time with certain people, you feel completely emptied. This is not your imagination. Energy drain is real — and predictable by birth pattern.',
  'signs-someone-is-emotionally-fake':          'They say the right things. They perform all the emotions. But something behind the eyes is absent. These are the signs that the connection is hollow.',
  'the-dark-side-of-your-personality':          'Every number has a shadow. Every Nakshatra has a wound. The traits you work hardest to hide are the ones shaping your life most powerfully right now.',
  'what-to-eat-before-bed':                     'What you eat in the last hour before sleep changes your skin, your hormones, and your dream quality. Most people are unknowingly sabotaging both beauty and rest.',
  'why-your-face-changes-after-certain-ages':   'Around 28. Again at 35. And dramatically at 42. The face shifts at these ages for reasons that go beyond biology — and Vedic astrology explains exactly why.',
  'foods-that-increase-attraction-energy':      'Certain foods raise your vibrational frequency — literally changing how others perceive your presence. Ancient Ayurvedic texts identified these foods thousands of years ago.',
  'sleep-habits-linked-to-beauty':              'The most beautiful people in history were not born that way. They protected something most people sacrifice without thinking — and it shows in every photograph.',
  'which-body-types-age-slower':                'Certain physical constitutions are built for longevity of appearance. If you have this body type, you carry something rare. If you do not, you can still learn from it.',
  'what-your-skin-reveals-emotionally':         'Breakouts, dullness, premature lines — these are not random. Your skin is the most honest mirror of your emotional life. It speaks what you refuse to say aloud.',
  'what-your-birth-type-reveals':               'Whether you arrived naturally or by caesarean is not just medical history. Ancient wisdom suggests your birth pathway leaves a signature on your energy and karma.',
  'why-some-births-carry-heavier-karma':        'Some souls arrive carrying more weight. More intensity. More challenge. This is not punishment — it is purpose. And your birth chart shows exactly what you came to work through.',
  'the-hidden-meaning-of-your-birth-time':      'The exact minute you arrived in this world was not random. That moment locked in a frequency — a Nakshatra, a Lagna, a Pada — that has been shaping your life ever since.',
  'what-recurring-dreams-reveal':               'The same dream returning again and again. Water. Falling. A house you do not recognise. These images are not noise. They are your deeper self sending a message.',
  'why-some-people-attract-strange-coincidences': 'Some people live in a world where things keep happening to them — signs, synchronicities, encounters that feel impossible. This is a real phenomenon. And it is traceable.',
  'what-childhood-patterns-reveal-about-destiny': 'The fears you carried before age seven. The thing you always wanted but could not have. These early patterns are not random — they are your karma playing its opening note.',
  'why-some-men-command-respect':               'Walk into any room and certain men are simply heard differently. It is not their title or their money. It is something in how they occupy space — and it can be learned.',
  'what-makes-a-man-emotionally-unforgettable': 'Women forget handsome men constantly. But certain men stay in memory for decades. It is not what they look like. It is what they make a woman feel seen as.',
  'habits-that-weaken-masculine-energy':        'There are specific daily patterns — innocent-seeming ones — that quietly drain masculine vitality. Most men do all of them without knowing the cost.',
  'what-your-voice-says-about-confidence':      'Before you finish your first sentence, the listener has already formed a judgment. Your voice carries your nervous system\'s truth in every syllable.',
  'the-hidden-psychology-of-dominance':         'Real dominance is not aggression. It is not volume. It is a specific internal state that others sense before you say a word. And it has a very precise origin.',
  'why-some-women-become-unforgettable':        'Some women are remembered by every person they meet — not because they tried to be. They carry a quality that bypasses the conscious mind entirely.',
  'feminine-energy-men-secretly-notice':        'Men rarely articulate what draws them. But there are specific qualities — subtle, non-physical — that activate something deep. Most women who have it do not know they have it.',
  'why-women-attract-emotionally-unavailable-men': 'If this is your pattern, it is not weakness and it is not bad luck. There is a very specific wound — almost always formed before age twelve — that keeps recreating this dynamic.',
  'what-your-smile-reveals-emotionally':        'Your smile tells people more about your inner world than you intend. And the way others respond to it is based on what they read there — not what you meant to show.',
  'women-who-become-magnetic-with-age':         'Some women grow more powerful, more beautiful, more compelling as they age. This is not vanity. It is a specific energetic phenomenon — and it is predictable.',
  'the-hidden-reason-your-life-feels-blocked':  'You are working hard. You are doing the right things. And yet something keeps not moving. There is a specific karmic knot in your chart causing this — and it has a name.',
  'the-emotional-wound-controlling-your-decisions': 'Every major decision you have made in the last five years has been quietly shaped by one wound you have never fully faced. This is the most important thing to understand about yourself.',
  'what-people-secretly-notice-about-you-first': 'You think people notice your appearance first. They do not. They notice something else entirely — an energy, a pattern, a signal you are broadcasting without awareness.',
  'the-one-trait-holding-you-back':             'Among all your qualities, there is one that is quietly undoing your progress. Not a flaw. A gift turned inward. Once you name it, everything shifts.',
  'your-secret-attraction-style':               'You attract in a completely unique way — different from what you think. The people most deeply drawn to you are responding to something you have never consciously offered.',
}

export default function ReadHubPage() {
  const grouped = CATEGORY_ORDER.reduce<Record<string, ReadingDef[]>>((acc, cat) => {
    acc[cat] = READING_DEFS.filter(r => r.category === cat)
    return acc
  }, {})

  return (
    <main style={{minHeight:'100vh', background:'var(--bg)'}}>

      {/* Header */}
      <div style={{
        padding:'2rem 2rem 1rem',
        borderBottom:'0.5px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div>
          <Link href="/" style={{fontSize:'0.68rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-low)'}}>
            ← Home
          </Link>
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:'2rem', color:'var(--text)', marginTop:'0.5rem', fontWeight:500
          }}>Readings</h1>
          <p style={{fontSize:'0.72rem', color:'var(--text-low)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:'0.25rem'}}>
            Unlock hidden truths about your life
          </p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:'0.65rem', color:'var(--text-low)', letterSpacing:'0.08em'}}>From</div>
          <div style={{fontSize:'1.4rem', color:'var(--accent)', fontFamily:"'Cormorant Garamond', serif", fontWeight:600}}>₹9</div>
          <div style={{fontSize:'0.65rem', color:'var(--text-low)', letterSpacing:'0.06em'}}>per reading</div>
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{
        padding:'1rem 2rem',
        display:'flex', flexWrap:'wrap', gap:'0.5rem',
        borderBottom:'0.5px solid var(--border)'
      }}>
        <a href="#all" style={{
          fontSize:'0.68rem', letterSpacing:'0.08em',
          background:'var(--accent)', color:'var(--btn-txt)',
          border:'none', borderRadius:'20px', padding:'0.35rem 0.9rem',
          textDecoration:'none', fontWeight:600
        }}>All</a>
        {CATEGORY_ORDER.map(cat => (
          <a key={cat} href={`#${cat.toLowerCase()}`} style={{
            fontSize:'0.68rem', letterSpacing:'0.08em',
            background:'var(--surface)', color:'var(--text-low)',
            border:'0.5px solid var(--border2)', borderRadius:'20px', padding:'0.35rem 0.9rem',
            textDecoration:'none'
          }}>
            {CATEGORY_LABELS[cat]}
          </a>
        ))}
      </div>

      {/* Pinterest masonry grid per category */}
      <div style={{padding:'2rem'}}>
        {CATEGORY_ORDER.map(cat => (
          <section key={cat} id={cat.toLowerCase()} style={{marginBottom:'3rem'}}>
            <div style={{
              fontSize:'0.62rem', letterSpacing:'0.18em', color:'var(--accent)',
              textTransform:'uppercase', marginBottom:'1.25rem',
              display:'flex', alignItems:'center', gap:'0.75rem'
            }}>
              {CATEGORY_LABELS[cat]}
              <span style={{flex:1, height:'0.5px', background:'var(--border)'}} />
            </div>

            {/* Masonry grid */}
            <div style={{
              columnCount: 3,
              columnGap: '1rem',
              columnFill: 'balance',
            }}>
              {grouped[cat]?.map(reading => (
                <ReadingCard key={reading.slug} reading={reading} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Mobile responsive style */}
      <style>{`
        @media (max-width: 900px) {
          .masonry-grid { column-count: 2 !important; }
        }
        @media (max-width: 560px) {
          .masonry-grid { column-count: 1 !important; }
        }
        .reading-card {
          break-inside: avoid;
          display: inline-block;
          width: 100%;
          margin-bottom: 1rem;
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 12px;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .reading-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .reading-card-price {
          display: inline-block;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: var(--accent);
          border: 0.5px solid var(--accent);
          border-radius: 10px;
          padding: 0.2rem 0.6rem;
          margin-bottom: 0.75rem;
        }
        .reading-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
          margin-bottom: 0.65rem;
        }
        .reading-card-hook {
          font-size: 0.75rem;
          color: var(--text-low);
          line-height: 1.7;
        }
        .reading-card-footer {
          margin-top: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .reading-card-read {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .reading-card-min {
          font-size: 0.6rem;
          color: var(--muted);
        }
      `}</style>
    </main>
  )
}

function ReadingCard({ reading }: { reading: ReadingDef }) {
  const hook = HOOKS[reading.slug] ?? ''
  const readMin = reading.price === 9 ? '3 min' : reading.price === 19 ? '6 min' : '10 min'

  return (
    <Link href={`/read/${reading.slug}`} className="reading-card">
      <div className="reading-card-price">₹{reading.price} · Unlock</div>
      <div className="reading-card-title">{reading.title}</div>
      <div className="reading-card-hook">
        {hook.split('. ').slice(0, 2).join('. ')}.
      </div>
      <div className="reading-card-footer">
        <span className="reading-card-read">Read →</span>
        <span className="reading-card-min">{readMin} read</span>
      </div>
    </Link>
  )
}

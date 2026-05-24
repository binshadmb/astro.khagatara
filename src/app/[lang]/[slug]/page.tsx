import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  TOPIC_DEFS, 
  LANGUAGE_CONFIG, 
  topicPath, 
  getTopicMeta, 
  pageAlternates, 
  type TopicKey, 
  type LangCode 
} from '../../seo'
import Calculator from '../../components/Calculator'
import BookPromo from '../../components/BookPromo'
import FadeIn from '../../components/FadeIn'

interface PageProps {
  params: Promise<{
    lang: string
    slug: string
  }>
}

// ─── Resolve topic and load markdown content ──────────────────────────────────
function getPageData(lang: string, slug: string) {
  // Find which topic matches the given localized slug in the given language
  const topic = TOPIC_DEFS.find(t => {
    const localizedSlug = t.slugs[lang] ?? t.defaultSlug
    return localizedSlug === slug
  })

  if (!topic) return null

  // Resolve content file path: fall back to master English if translation is missing
  let contentPath = path.join(process.cwd(), 'src', 'content', lang, `${topic.key}.md`)
  if (!fs.existsSync(contentPath)) {
    contentPath = path.join(process.cwd(), 'src', 'content', 'master', `${topic.key}.md`)
  }

  // Fallback check if master is also missing
  if (!fs.existsSync(contentPath)) return null

  const content = fs.readFileSync(contentPath, 'utf8')
  return {
    topicKey: topic.key as TopicKey,
    topicTitle: topic.defaultSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    content
  }
}

// ─── Generate Metadata dynamically for SEO ────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const data = getPageData(lang, slug)
  if (!data) return {}

  const meta = getTopicMeta(data.topicKey, lang)
  return {
    title: meta.title,
    description: meta.description,
    alternates: pageAlternates(data.topicKey, lang)
  }
}

// ─── Pre-render all 700 static routes at build time ───────────────────────────
export async function generateStaticParams() {
  const params: Array<{ lang: string; slug: string }> = []
  
  for (const [code] of LANGUAGE_CONFIG) {
    for (const topic of TOPIC_DEFS) {
      const slug = topic.slugs[code] ?? topic.defaultSlug
      params.push({
        lang: code,
        slug: slug
      })
    }
  }

  return params
}

// ─── Simple Markdown-to-JSX Parser ───────────────────────────────────────────
function parseMarkdown(md: string) {
  return md
    .split('\n\n')
    .map((block, idx) => {
      block = block.trim()
      if (!block) return null

      // Headings
      if (block.startsWith('# ')) {
        return <h2 key={idx} style={{color: '#f5c842', marginBottom: '16px', fontSize: '1.8rem'}}>{block.replace('# ', '')}</h2>
      }
      if (block.startsWith('## ')) {
        return <h3 key={idx} style={{color: '#f5c842', margin: '24px 0 12px', fontSize: '1.3rem'}}>{block.replace('## ', '')}</h3>
      }
      if (block.startsWith('### ')) {
        return <h4 key={idx} style={{color: '#f5c842', margin: '20px 0 10px', fontSize: '1.1rem'}}>{block.replace('### ', '')}</h4>
      }

      // Horizontal Rule
      if (block === '---') {
        return <hr key={idx} style={{border: 'none', borderTop: '1px solid #2a2a3a', margin: '24px 0'}} />
      }

      // Collapsible example block
      if (block.startsWith('Step-by-Step Example') || block.includes('If you were born on')) {
        return (
          <details key={idx} style={{marginBottom: '20px', borderLeft: '2px solid #f5c842', paddingLeft: '16px'}}>
            <summary style={{color: '#f5c842', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '8px'}}>
              Show example calculation
            </summary>
            <p style={{color: '#e8e0d0', lineHeight: '1.8', fontSize: '0.9rem', marginTop: '10px'}}>
              {block.split('**').map((part, pIdx) =>
                pIdx % 2 === 1
                  ? <strong key={pIdx} style={{color: '#ffffff'}}>{part}</strong>
                  : part
              )}
            </p>
          </details>
        )
      }

      // Chaldean number-letter table: lines like "1: A, I, J, Q, Y"
      const isChaldeanTable = block.split('\n').every(l => /^\d+:/.test(l.trim()))
      if (isChaldeanTable) {
        const rows = block.split('\n').map(l => l.trim())
        return (
          <div key={idx} style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px'}}>
            {rows.map((row, i) => {
              const [num, letters] = row.split(':')
              return (
                <div key={i} style={{background: '#1a1628', border: '0.5px solid #2a2330', borderRadius: '8px', padding: '10px 14px'}}>
                  <span style={{color: '#f5c842', fontWeight: 600, marginRight: '8px'}}>{num.trim()}</span>
                  <span style={{color: '#e8e0d0', fontSize: '0.85rem'}}>{letters?.trim()}</span>
                </div>
              )
            })}
          </div>
        )
      }

      // Unordered Lists
      if (block.startsWith('* ') || block.startsWith('- ')) {
        const items = block.split('\n').map(line => line.replace(/^[\*\-]\s+/, '').trim())
        return (
          <ul key={idx} style={{paddingLeft: '20px', marginBottom: '20px', listStyleType: 'disc'}}>
            {items.map((item, i) => {
              const parts = item.split('**')
              return (
                <li key={i} style={{marginBottom: '10px', color: '#e8e0d0', lineHeight: '1.7'}}>
                  {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{color: '#ffffff'}}>{part}</strong> : part)}
                </li>
              )
            })}
          </ul>
        )
      }

      // Standard Paragraph with bold support
      const parts = block.split('**')
      return (
        <p key={idx} style={{color: '#e8e0d0', marginBottom: '20px', lineHeight: '1.8', fontSize: '0.95rem'}}>
          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{color: '#ffffff'}}>{part}</strong> : part)}
        </p>
      )
    })
}

// ─── Core Page Render ─────────────────────────────────────────────────────────
export default async function UniversalPage({ params }: PageProps) {
  const { lang, slug } = await params
  const data = getPageData(lang, slug)

  if (!data) {
    notFound()
  }

  // Resolve language properties
  const langConfig = LANGUAGE_CONFIG.find(c => c[0] === lang)
  const langName = langConfig ? langConfig[1] : 'English'
  const direction = langConfig ? langConfig[2] : 'ltr'

  // Localized section headers
  const popularReadingsTitle: Record<string, string> = {
    es:'Lecturas Populares', pt:'Leituras Populares', fr:'Lectures Populaires',
    it:'Letture Popolari', de:'Beliebte Lesungen', hi:'लोकप्रिय पाठ',
    ar:'قراءات شائعة', 'zh-cn':'热门阅读', 'zh-tw':'熱門閱讀', ja:'人気の読み物',
    ru:'Популярные чтения', ko:'인기 독서', tr:'Popüler Okumalar',
    id:'Bacaan Populer', bn:'জনপ্রিয় পাঠ'
  }
  const readInYourLanguageTitle: Record<string, string> = {
    es:'Lee en tu Idioma', pt:'Leia no seu Idioma', fr:'Lisez dans votre Langue',
    it:'Leggi nella tua Lingua', de:'In deiner Sprache lesen', hi:'अपनी भाषा में पढ़ें',
    ar:'اقرأ بلغتك', 'zh-cn':'用你的语言阅读', 'zh-tw':'用你的語言閱讀', ja:'あなたの言語で読む',
    ru:'Читайте на своём языке', ko:'당신의 언어로 읽기', tr:'Dilinizde okuyun',
    id:'Baca dalam Bahasa Anda', bn:'আপনার ভাষায় পড়ুন'
  }

  return (
    <main className="page" dir={direction}>
      <div className="header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'0.5px solid var(--border)'}}>
        <div>
          <h1>Khagatara</h1>
          <p style={{fontSize:'0.85rem', opacity:0.7}}>{langName}</p>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <Link href="/en/free-numerology-reading" style={{fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-low)', border:'0.5px solid var(--border2)', borderRadius:'20px', padding:'0.4rem 1rem'}}>
            EN
          </Link>
          <Link href="/" style={{fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-low)', border:'0.5px solid var(--border2)', borderRadius:'20px', padding:'0.4rem 1rem'}}>
            ← Home
          </Link>
        </div>
      </div>

      {/* localized Client-Side Calculator Component */}
      <FadeIn><Calculator lang={lang} /></FadeIn>

      {/* Premium E-Book Promotion Card */}
      <FadeIn><BookPromo lang={lang} /></FadeIn>

      {/* Gold-Standard Premium SEO Article Content */}
      <FadeIn>
      <article className="card" style={{maxWidth: '760px', lineHeight: '1.8', marginTop: '32px'}}>
        {parseMarkdown(data.content)}
      </article>
      </FadeIn>

      {/* Dynamic SEO Internal Links: All 7 Topics Localized */}
      <FadeIn>
      <div className="card link-card">
        <h2>{popularReadingsTitle[lang] ?? 'Popular Free Readings'}</h2>
        <div className="internal-links" style={{display: 'flex', flexWrap: 'wrap', gap: '0.6rem'}}>
          {TOPIC_DEFS.map(t => {
            const path = topicPath(t.key, lang)
            const meta = getTopicMeta(t.key, lang)
            return (
              <Link key={t.key} href={path}>
                {meta.title.split(' — ')[0]}
              </Link>
            )
          })}
        </div>
      </div>
      </FadeIn>

      {/* Dynamic SEO Language Links: Major Global Clusters */}
      <FadeIn>
      <div className="card link-card">
        <h2>{readInYourLanguageTitle[lang] ?? 'Read in Your Language'}</h2>
        <div className="internal-links language-links" style={{display: 'flex', flexWrap: 'wrap', gap: '0.6rem'}}>
          {LANGUAGE_CONFIG.slice(0, 15).map(([code, name]) => {
            const path = topicPath(data.topicKey, code)
            return (
              <Link key={code} href={path}>
                {name}
              </Link>
            )
          })}
        </div>
      </div>
      </FadeIn>
    </main>
  )
}

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

      // Unordered Lists
      if (block.startsWith('* ') || block.startsWith('- ')) {
        const items = block.split('\n').map(line => line.replace(/^[\*\-]\s+/, '').trim())
        return (
          <ul key={idx} style={{paddingLeft: '20px', marginBottom: '20px', listStyleType: 'disc'}}>
            {items.map((item, i) => {
              const parts = item.split('**')
              return (
                <li key={i} style={{marginBottom: '10px', color: '#ccc', lineHeight: '1.7'}}>
                  {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{color: '#f5c842'}}>{part}</strong> : part)}
                </li>
              )
            })}
          </ul>
        )
      }

      // Standard Paragraph with bold support
      const parts = block.split('**')
      return (
        <p key={idx} style={{color: '#ccc', marginBottom: '20px', lineHeight: '1.8', fontSize: '0.95rem'}}>
          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{color: '#f5c842'}}>{part}</strong> : part)}
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
  const popularReadingsTitle = lang === 'es' ? 'Lecturas Gratuitas Populares' : 'Popular Free Readings'
  const readInYourLanguageTitle = lang === 'es' ? 'Leer en tu Idioma' : 'Read in Your Language'

  return (
    <main className="page" dir={direction}>
      <div className="header">
        <h1>Khagatara</h1>
        <p style={{fontSize: '1rem', opacity: 0.85}}>{langName}</p>
      </div>

      {/* localized Client-Side Calculator Component */}
      <Calculator lang={lang} />

      {/* Premium E-Book Promotion Card */}
      <BookPromo lang={lang} />

      {/* Gold-Standard Premium SEO Article Content */}
      <article className="card" style={{maxWidth: '760px', lineHeight: '1.8', marginTop: '32px'}}>
        {parseMarkdown(data.content)}
      </article>

      {/* Dynamic SEO Internal Links: All 7 Topics Localized */}
      <div className="card link-card">
        <h2>{popularReadingsTitle}</h2>
        <div className="internal-links">
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

      {/* Dynamic SEO Language Links: Major Global Clusters */}
      <div className="card link-card">
        <h2>{readInYourLanguageTitle}</h2>
        <div className="internal-links language-links">
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
    </main>
  )
}

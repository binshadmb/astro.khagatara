import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ClientTopicPage from './ClientTopicPage'
import { LANGUAGE_CONFIG, TOPIC_DEFS } from '../../seo-config'
import { TOPIC_META } from '../../topic-meta'
import { siteUrl } from '../../layout'

const LANG_CODES = LANGUAGE_CONFIG.map(([code]) => code)

export const revalidate = 86400

type PageProps = {
  params: Promise<{ lang: string; slug: string }>
}

function isKnownLanguage(lang: string) {
  return LANG_CODES.includes(lang as (typeof LANG_CODES)[number])
}

function topicSlugsFor(lang: string) {
  return TOPIC_DEFS.map((topic) => topic.slugs[lang] ?? topic.defaultSlug)
}

function findTopic(lang: string, slug: string) {
  return TOPIC_DEFS.find((topic) => (topic.slugs[lang] ?? topic.defaultSlug) === slug)
}

function topicPath(topicKey: string, lang: string) {
  const topic = TOPIC_DEFS.find((t) => t.key === topicKey)!
  const slug = topic.slugs[lang] ?? topic.defaultSlug
  return `/${lang}/${slug}`
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = []
  const seen = new Set<string>()

  for (const lang of LANG_CODES) {
    for (const slug of topicSlugsFor(lang)) {
      const key = `${lang}/${slug}`
      if (seen.has(key)) continue

      seen.add(key)
      params.push({ lang, slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params

  if (!isKnownLanguage(lang)) return {}

  const topic = findTopic(lang, slug)
  if (!topic) return {}

  const meta = TOPIC_META[topic.key]?.[lang] ?? TOPIC_META[topic.key]?.['en']
  const languages: Record<string, string> = {}
  for (const code of LANG_CODES) {
    languages[code] = topicPath(topic.key, code)
  }
  languages['x-default'] = topicPath(topic.key, 'en')

  return {
    title: meta?.title,
    description: meta?.description,
    alternates: {
      canonical: topicPath(topic.key, lang),
      languages,
    },
    openGraph: meta
      ? {
          title: meta.title,
          description: meta.description,
          url: `${siteUrl}${topicPath(topic.key, lang)}`,
          type: 'website',
        }
      : undefined,
  }
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params

  if (!isKnownLanguage(lang)) {
    notFound()
  }

  if (!topicSlugsFor(lang).includes(slug)) {
    notFound()
  }

  return <ClientTopicPage params={{ lang }} />
}

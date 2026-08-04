import { notFound } from 'next/navigation'
import ClientTopicPage from './ClientTopicPage'
import { LANGUAGE_CONFIG, TOPIC_DEFS } from '../../seo-config'

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

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ClientTopicPage from './ClientTopicPage'
import PremiumLandingPage from '../../premiumLandingPage'
import { LANGUAGE_CONFIG, TOPIC_DEFS } from '../../seo-config'
import { getPremiumLanding } from '../../premiumLandingMap'

const SITE_URL = 'https://www.khagatara.com'
const LANG_CODES = LANGUAGE_CONFIG.map(([code]) => code)

type PageProps = {
  params: Promise<{ lang: string; slug: string }>
}

function isKnownLanguage(lang: string) {
  return LANG_CODES.includes(lang as (typeof LANG_CODES)[number])
}

function topicSlugsFor(lang: string) {
  return TOPIC_DEFS.map((topic) => topic.slugs[lang] ?? topic.defaultSlug)
}

function premiumAlternates(slug: string) {
  const languages = Object.fromEntries(
    LANG_CODES.map((code) => [code, `${SITE_URL}/${code}/${slug}`]),
  )

  return {
    canonical: `/${slug === 'premium' ? 'premium' : `en/${slug}`}`,
    languages: {
      ...languages,
      'x-default': `${SITE_URL}/en/${slug}`,
    },
  }
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = []

  for (const lang of LANG_CODES) {
    for (const slug of topicSlugsFor(lang)) {
      params.push({ lang, slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const premiumPage = getPremiumLanding(slug)

  if (premiumPage && isKnownLanguage(lang)) {
    return {
      title: premiumPage.title,
      description: premiumPage.description,
      alternates: premiumAlternates(slug),
      openGraph: {
        title: premiumPage.title,
        description: premiumPage.description,
        type: 'website',
        url: `${SITE_URL}/${lang}/${slug}`,
        videos: [{ url: `${SITE_URL}${premiumPage.video.src}` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: premiumPage.title,
        description: premiumPage.description,
      },
    }
  }

  return {}
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params

  if (!isKnownLanguage(lang)) {
    notFound()
  }

  const premiumPage = getPremiumLanding(slug)
  if (premiumPage) {
    return <PremiumLandingPage lang={lang} page={premiumPage} />
  }

  if (!topicSlugsFor(lang).includes(slug)) {
    notFound()
  }

  return <ClientTopicPage params={{ lang }} />
}

import { NextResponse } from 'next/server'
import { LANGUAGE_CONFIG, TOPIC_SLUGS } from '../seo-config'
import { siteUrl } from '../layout'

export async function GET() {
  const urls: string[] = []

  for (const [code] of LANGUAGE_CONFIG) {
    for (const topicKey of Object.keys(TOPIC_SLUGS)) {
      const slug = TOPIC_SLUGS[topicKey]?.[code]
      if (!slug) continue
      urls.push(`
  <url>
    <loc>${siteUrl}/${code}/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}

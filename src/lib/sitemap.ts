import type { MetadataRoute } from 'next'
import { locales } from '@/config/i18n-config'

const PAGES = ['', 'checkout', 'contact', 'orders', 'plants'] as const

const join = (base: string, path: string) =>
  path ? `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}` : base.replace(/\/+$/, '')

export function buildSitemap(baseUrl: string, lastModified = new Date().toISOString()): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: join(baseUrl, ''), lastModified, changeFrequency: 'monthly', priority: 1 },
  ]
  for (const page of PAGES) {
    const languages = Object.fromEntries(
      locales.map((l) => [l, join(baseUrl, page ? `${l}/${page}` : l)]),
    )
    for (const locale of locales) {
      entries.push({
        url: languages[locale],
        lastModified,
        changeFrequency: 'monthly',
        priority: page === '' ? 1 : 0.8,
        alternates: { languages },
      })
    }
  }
  return entries
}

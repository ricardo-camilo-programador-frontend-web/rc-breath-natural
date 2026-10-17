import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { buildSitemap } from '@/lib/sitemap'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(SITE_URL)
}

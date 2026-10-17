import { SITE_URL } from '@/lib/site'
export const dynamic = 'force-static'

export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`.trim()

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

import { describe, expect, it } from 'vitest'
import { buildSitemap } from '../src/lib/sitemap'
import robots from '../src/app/robots'

describe('buildSitemap', () => {
  const entries = buildSitemap('https://example.com/', '2026-01-01')
  it('gera URLs válidas com barra separadora', () => {
    for (const e of entries) {
      expect(() => new URL(e.url)).not.toThrow()
      expect(e.url).not.toMatch(/example\.com[^/]/)
    }
    expect(entries.map((e) => e.url)).toContain('https://example.com/br/contact')
  })
  it('alternates apontam para o mesmo path em cada locale', () => {
    const contact = entries.find((e) => e.url === 'https://example.com/en/contact')
    expect(contact?.alternates?.languages).toMatchObject({ de: 'https://example.com/de/contact' })
  })
})

describe('robots', () => {
  it('aponta para o sitemap na raiz', () => {
    expect(robots().sitemap).toMatch(/^https:\/\/.+[^/]\/sitemap\.xml$/)
  })
})

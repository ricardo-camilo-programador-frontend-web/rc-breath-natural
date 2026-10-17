import { describe, expect, it } from 'vitest'
import { DEFAULT_SITE_URL, resolveSiteUrl } from '../src/lib/site'

describe('resolveSiteUrl', () => {
  it('falls back when missing or invalid', () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl('')).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl('not a url')).toBe(DEFAULT_SITE_URL)
  })
  it('strips trailing slash', () => {
    expect(resolveSiteUrl('https://example.com/')).toBe('https://example.com')
  })
})

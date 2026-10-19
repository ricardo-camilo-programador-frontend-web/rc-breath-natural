import { describe, expect, it } from 'vitest'
import { buildPagePath } from '../src/lib/analytics/page-path'

describe('buildPagePath', () => {
  it('inclui "?" quando há query string', () => {
    expect(buildPagePath('/plants', 'search=rose')).toBe('/plants?search=rose')
    expect(buildPagePath('/plants', '')).toBe('/plants')
  })
})

import { buildCsp } from '../src/lib/security-headers'

describe('buildCsp', () => {
  it('sem GTM não libera unsafe-eval', () => {
    expect(buildCsp(false)).not.toContain('unsafe-eval')
    expect(buildCsp(false)).toContain('https://*.clarity.ms')
    expect(buildCsp(false)).toContain("frame-ancestors 'self' https://app.netlify.com")
  })
  it('com GTM libera unsafe-eval e tagmanager', () => {
    expect(buildCsp(true)).toContain("'unsafe-eval' https://tagmanager.google.com")
  })
})

import { describe, expect, it } from 'vitest'
import { buildAdsterraScript, shouldLoadAdsterra, readAnalyticsConsent, adsterraScriptElementId, DEFAULT_BANNER_HOST } from '../src/lib/ads/adsterra'
import { buildCsp } from '../src/lib/security-headers'

describe('buildAdsterraScript', () => {
  it('returns null when explicitly disabled', () => {
    expect(buildAdsterraScript({ format: 'native', enabledFlag: 'false', nativeKey: 'abc', nativeHost: 'pl123.effectivegatecpm.com' })).toBeNull()
    expect(buildAdsterraScript({ format: 'native', enabledFlag: '0' })).toBeNull()
    expect(buildAdsterraScript({ format: 'native', enabledFlag: 'off' })).toBeNull()
  })

  it('returns null for native without key or host', () => {
    expect(buildAdsterraScript({ format: 'native' })).toBeNull()
    expect(buildAdsterraScript({ format: 'native', nativeKey: 'abc' })).toBeNull()
    expect(buildAdsterraScript({ format: 'native', nativeHost: 'pl123.effectivegatecpm.com' })).toBeNull()
  })

  it('builds native script with expected shape', () => {
    const s = buildAdsterraScript({ format: 'native', nativeKey: 'a1b2c3d4e5f6', nativeHost: 'pl1234.effectivegatecpm.com' })
    expect(s).not.toBeNull()
    if (!s) return
    expect(s.format).toBe('native')
    expect(s.key).toBe('a1b2c3d4e5f6')
    expect(s.host).toBe('pl1234.effectivegatecpm.com')
    expect(s.src).toBe('//pl1234.effectivegatecpm.com/a1b2c3d4e5f6/invoke.js')
    expect(s.containerId).toBe('container-a1b2c3d4e5f6')
    expect(s.width).toBe(728)
    expect(s.height).toBe(120)
    expect(s.atOptions).toBeUndefined()
  })

  it('falls back to default banner host', () => {
    const s = buildAdsterraScript({ format: 'banner', bannerKey: 'z9y8x7w6v5u4', viewportWidth: 320 })
    expect(s).not.toBeNull()
    if (!s) return
    expect(s.host).toBe(DEFAULT_BANNER_HOST)
    expect(s.src).toBe(`//${DEFAULT_BANNER_HOST}/z9y8x7w6v5u4/invoke.js`)
    expect(s.atOptions?.height).toBe(50)
    expect(s.atOptions?.width).toBe(320)
  })
})

describe('shouldLoadAdsterra', () => {
  const script = buildAdsterraScript({ format: 'native', nativeKey: 'abc123def456', nativeHost: 'pl123.effectivegatecpm.com' })!
  const HOST = 'breath-natural-nextjs-chronicles.netlify.app'

  it('blocks outside production', () => {
    expect(shouldLoadAdsterra({ script, nodeEnv: 'development', hostname: HOST, canonicalHostname: HOST, analyticsEnabled: null })).toBe(false)
  })

  it('blocks on deploy preview', () => {
    expect(shouldLoadAdsterra({ script, nodeEnv: 'production', hostname: 'deploy-preview-7--breath-natural.netlify.app', canonicalHostname: HOST, analyticsEnabled: null })).toBe(false)
    expect(shouldLoadAdsterra({ script, nodeEnv: 'production', hostname: 'localhost', canonicalHostname: HOST, analyticsEnabled: null })).toBe(false)
  })

  it('blocks when analytics consent is false', () => {
    expect(shouldLoadAdsterra({ script, nodeEnv: 'production', hostname: HOST, canonicalHostname: HOST, analyticsEnabled: false })).toBe(false)
  })

  it('loads in production on canonical host with absent or granted consent', () => {
    expect(shouldLoadAdsterra({ script, nodeEnv: 'production', hostname: HOST, canonicalHostname: HOST, analyticsEnabled: null })).toBe(true)
    expect(shouldLoadAdsterra({ script, nodeEnv: 'production', hostname: HOST, canonicalHostname: HOST, analyticsEnabled: true })).toBe(true)
  })

  it('rejects when script is null', () => {
    expect(shouldLoadAdsterra({ script: null, nodeEnv: 'production', hostname: HOST, canonicalHostname: HOST, analyticsEnabled: null })).toBe(false)
  })
})

describe('readAnalyticsConsent', () => {
  it('returns null when API is missing', () => {
    expect(readAnalyticsConsent(undefined)).toBeNull()
    expect(readAnalyticsConsent({} as never)).toBeNull()
  })

  it('returns boolean from isAnalyticsEnabled()', () => {
    expect(readAnalyticsConsent({ isAnalyticsEnabled: () => true })).toBe(true)
    expect(readAnalyticsConsent({ isAnalyticsEnabled: () => false })).toBe(false)
  })

  it('fails closed when isAnalyticsEnabled throws', () => {
    expect(readAnalyticsConsent({ isAnalyticsEnabled: () => { throw new Error('bad') } })).toBe(false)
  })
})

describe('adsterraScriptElementId', () => {
  it('has stable prefix', () => {
    expect(adsterraScriptElementId('k1')).toBe('adsterra-invoke-k1')
  })
})

describe('security headers include ad hosts', () => {
  it('includes native and display Adsterra hosts in script-src', () => {
    const csp = buildCsp(false)
    expect(csp).toContain('profitableratecpmnetwork.com')
    expect(csp).toContain('effectivegatecpm.com')
    expect(csp).toContain('highperformanceformat.com')
  })
  it('includes rotating invoke-hosts when CSP is built', () => {
    const csp = buildCsp(false)
    expect(csp).toContain('fizzyacerbitymellow.com')
    expect(csp).toContain('sleepoverlimitprofound.com')
    expect(csp).toContain('exemplarfederallithe.com')
    expect(csp).toContain('furiousexpansion.com')
    expect(csp).toContain('consumeririssalary.com')
    expect(csp).toContain('protrafficinspector.com')
    expect(csp).toContain('cdn.cloudvideosa.com')
  })
})

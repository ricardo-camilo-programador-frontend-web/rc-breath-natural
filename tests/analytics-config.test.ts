import { describe, expect, it } from 'vitest'
import { resolveAnalyticsConfig } from '../src/lib/analytics/config'

describe('resolveAnalyticsConfig', () => {
  it('loads GA4 + Clarity directly by default, GTM off', () => {
    const c = resolveAnalyticsConfig({})
    expect(c.ga4Id).toBe('G-F9LYZ0P52E')
    expect(c.clarityId).toBe('yyrpt8sig2')
    expect(c.loadGtag).toBe(true)
    expect(c.loadClarity).toBe(true)
    expect(c.loadGtm).toBe(false)
  })
  it('never references legacy IDs', () => {
    const s = JSON.stringify(resolveAnalyticsConfig({ NEXT_PUBLIC_GTM_ENABLED: 'true' }))
    expect(s).not.toContain('prss6enkpp')
    expect(s).not.toContain('G-E3JCH5GRKZ')
  })
  it('GTM ligado sem IDs declarados: pula as tags diretas (sem contagem dupla)', () => {
    const c = resolveAnalyticsConfig({ NEXT_PUBLIC_GTM_ENABLED: 'true' })
    expect(c.loadGtm).toBe(true)
    expect(c.loadGtag).toBe(false)
    expect(c.loadClarity).toBe(false)
  })
  it('GTM ligado com IDs diferentes: mantém as tags diretas', () => {
    const c = resolveAnalyticsConfig({
      NEXT_PUBLIC_GTM_ENABLED: 'true',
      NEXT_PUBLIC_GTM_GA4_ID: 'G-OTHER',
      NEXT_PUBLIC_GTM_CLARITY_ID: 'other',
    })
    expect(c.loadGtag).toBe(true)
    expect(c.loadClarity).toBe(true)
  })
  it('skips direct tags only when GTM declares the same IDs', () => {
    const c = resolveAnalyticsConfig({
      NEXT_PUBLIC_GTM_ENABLED: 'true',
      NEXT_PUBLIC_GTM_GA4_ID: 'G-F9LYZ0P52E',
      NEXT_PUBLIC_GTM_CLARITY_ID: 'yyrpt8sig2',
    })
    expect(c.loadGtm).toBe(true)
    expect(c.loadGtag).toBe(false)
    expect(c.loadClarity).toBe(false)
  })

  it('when GTM off, NEXT_PUBLIC_GTM_GA4_ID becomes extraGa4Id if different', () => {
    const c = resolveAnalyticsConfig({ NEXT_PUBLIC_GTM_GA4_ID: 'G-SECONDARY' })
    expect(c.loadGtm).toBe(false)
    expect(c.extraGa4Id).toBe('G-SECONDARY')
  })
  it('extraGa4Id empty when same as primary or GTM on', () => {
    expect(resolveAnalyticsConfig({ NEXT_PUBLIC_GTM_GA4_ID: 'G-F9LYZ0P52E' }).extraGa4Id).toBe('')
    expect(
      resolveAnalyticsConfig({
        NEXT_PUBLIC_GTM_ENABLED: 'true',
        NEXT_PUBLIC_GTM_GA4_ID: 'G-SECONDARY',
      }).extraGa4Id,
    ).toBe('')
  })
  it('can be disabled', () => {
    expect(resolveAnalyticsConfig({ NEXT_PUBLIC_ANALYTICS_ENABLED: 'false' }).loadGtag).toBe(false)
  })
})

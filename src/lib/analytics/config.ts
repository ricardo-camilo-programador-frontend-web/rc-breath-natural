/**
 * Analytics config: env wins, defaults are the fallback.
 * Default path: direct gtag (GA4). GTM is optional (NEXT_PUBLIC_GTM_ENABLED=true).
 * When GTM is enabled and its container already fires the same GA4 ID,
 * the direct gtag is skipped to avoid double counting.
 */
export const DEFAULTS = {
  ga4Id: 'G-DLRDXGG3V1',
  gtmId: 'GTM-TPFBQFX6',
  // GA4 ID published by the GTM container (checked in gtm.js)
  gtmGa4Id: 'G-E3JCH5GRKZ',
  counterId: 'f30df6f3-776d-4154-959d-0210ac8a8325',
  counterUtcOffset: '-3',
} as const

type Env = Record<string, string | undefined>

const pick = (...values: (string | undefined)[]): string => {
  for (const v of values) {
    const t = v?.trim()
    if (t && t !== 'G-XXXXXXXXXX' && t !== 'GTM-XXXXXXX') {
      return t
    }
  }
  return ''
}

export interface AnalyticsConfig {
  enabled: boolean
  ga4Id: string
  gtmId: string
  gtmEnabled: boolean
  loadGtag: boolean
  loadGtm: boolean
  counterId: string
  counterUtcOffset: string
}

export function resolveAnalyticsConfig(env: Env): AnalyticsConfig {
  const enabled =
    (env.NEXT_PUBLIC_ANALYTICS_ENABLED ?? 'true').trim() !== 'false'
  const ga4Id =
    pick(env.NEXT_PUBLIC_GA4_ID, env.NEXT_PUBLIC_GA_MEASUREMENT_ID) ||
    DEFAULTS.ga4Id
  const gtmId = pick(env.NEXT_PUBLIC_GTM_ID) || DEFAULTS.gtmId
  const gtmEnabled = (env.NEXT_PUBLIC_GTM_ENABLED ?? 'true').trim() === 'true'
  const gtmGa4Id = pick(env.NEXT_PUBLIC_GTM_GA4_ID) || DEFAULTS.gtmGa4Id
  const loadGtm = enabled && gtmEnabled && !!gtmId
  const loadGtag = enabled && !!ga4Id && !(loadGtm && gtmGa4Id === ga4Id)
  return {
    enabled,
    ga4Id,
    gtmId,
    gtmEnabled,
    loadGtag,
    loadGtm,
    counterId:
      pick(env.NEXT_PUBLIC_COUNTER_ID, env.NEXT_PUBLIC_COUNTER_DEV_ID) ||
      DEFAULTS.counterId,
    counterUtcOffset:
      pick(env.NEXT_PUBLIC_COUNTER_UTCOFFSET) || DEFAULTS.counterUtcOffset,
  }
}

// NEXT_PUBLIC_* must be referenced literally to be inlined at build time.
export const analyticsConfig = resolveAnalyticsConfig({
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_GTM_ENABLED: process.env.NEXT_PUBLIC_GTM_ENABLED,
  NEXT_PUBLIC_GTM_GA4_ID: process.env.NEXT_PUBLIC_GTM_GA4_ID,
  NEXT_PUBLIC_COUNTER_ID: process.env.NEXT_PUBLIC_COUNTER_ID,
  NEXT_PUBLIC_COUNTER_DEV_ID: process.env.NEXT_PUBLIC_COUNTER_DEV_ID,
  NEXT_PUBLIC_COUNTER_UTCOFFSET: process.env.NEXT_PUBLIC_COUNTER_UTCOFFSET,
})

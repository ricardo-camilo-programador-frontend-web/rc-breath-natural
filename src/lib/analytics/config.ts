/**
 * Analytics config: env wins, defaults are the fallback.
 * Default path: direct gtag (GA4 G-F9LYZ0P52E) + direct Clarity (yyrpt8sig2).
 * GTM is opt-in (NEXT_PUBLIC_GTM_ENABLED=true). Keep off until GTM-TPFBQFX6 Clarity is cleaned; with GTM off, NEXT_PUBLIC_GTM_GA4_ID can still fire a second GA4. Legacy note: the GTM-TPFBQFX6 container still
 * publishes legacy tags, so it stays off until the container is cleaned up.
 * When GTM is enabled, the container is assumed to fire GA4/Clarity, so the
 * direct tags are skipped unless NEXT_PUBLIC_GTM_GA4_ID / NEXT_PUBLIC_GTM_CLARITY_ID
 * declare a different ID than the direct one (avoids double counting).
 */
export const DEFAULTS = {
  clarityId: 'yyrpt8sig2',
  ga4Id: 'G-F9LYZ0P52E',
  gtmId: 'GTM-TPFBQFX6',
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
  clarityId: string
  loadClarity: boolean
  ga4Id: string
  /** Second GA4 when GTM is off (e.g. former GTM dual property via NEXT_PUBLIC_GTM_GA4_ID). */
  extraGa4Id: string
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
  const gtmEnabled = (env.NEXT_PUBLIC_GTM_ENABLED ?? 'false').trim() === 'true'
  const gtmGa4Id = pick(env.NEXT_PUBLIC_GTM_GA4_ID)
  const loadGtm = enabled && gtmEnabled && !!gtmId
  const loadGtag =
    enabled && !!ga4Id && !(loadGtm && (gtmGa4Id === '' || gtmGa4Id === ga4Id))
  const clarityId = pick(env.NEXT_PUBLIC_CLARITY_ID) || DEFAULTS.clarityId
  const gtmClarityId = pick(env.NEXT_PUBLIC_GTM_CLARITY_ID)
  const loadClarity =
    enabled &&
    !!clarityId &&
    !(loadGtm && (gtmClarityId === '' || gtmClarityId === clarityId))
  const extraGa4Id =
    !loadGtm && pick(env.NEXT_PUBLIC_GTM_GA4_ID) && pick(env.NEXT_PUBLIC_GTM_GA4_ID) !== ga4Id
      ? pick(env.NEXT_PUBLIC_GTM_GA4_ID)
      : ''
  return {
    enabled,
    clarityId,
    loadClarity,
    ga4Id,
    extraGa4Id,
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
  NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_GTM_ENABLED: process.env.NEXT_PUBLIC_GTM_ENABLED,
  NEXT_PUBLIC_GTM_GA4_ID: process.env.NEXT_PUBLIC_GTM_GA4_ID,
  NEXT_PUBLIC_GTM_CLARITY_ID: process.env.NEXT_PUBLIC_GTM_CLARITY_ID,
  NEXT_PUBLIC_COUNTER_ID: process.env.NEXT_PUBLIC_COUNTER_ID,
  NEXT_PUBLIC_COUNTER_DEV_ID: process.env.NEXT_PUBLIC_COUNTER_DEV_ID,
  NEXT_PUBLIC_COUNTER_UTCOFFSET: process.env.NEXT_PUBLIC_COUNTER_UTCOFFSET,
})

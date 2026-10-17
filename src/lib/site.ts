export const DEFAULT_SITE_URL = 'https://breath-natural-nextjs-chronicles.netlify.app'

/** Site URL without trailing slash; falls back when env is missing/invalid (local builds). */
export function resolveSiteUrl(value: string | undefined): string {
  const v = value?.trim()
  if (v) {
    try {
      return new URL(v).toString().replace(/\/+$/, '')
    } catch {
      /* invalid -> fallback */
    }
  }
  return DEFAULT_SITE_URL
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

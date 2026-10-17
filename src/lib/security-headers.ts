/** CSP montada no build: libera o GTM (unsafe-eval, tagmanager) só quando ele está ligado. */
export function buildCsp(gtmEnabled: boolean): string {
  const script = [
    "'self'",
    "'unsafe-inline'",
    ...(gtmEnabled ? ["'unsafe-eval'", 'https://tagmanager.google.com'] : []),
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://clarity.ms',
    'https://*.clarity.ms',
    'https://cdn.counter.dev',
  ]
  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://tagmanager.google.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Netlify deploy-preview drawer carrega o site num iframe de app.netlify.com
    "frame-ancestors 'self' https://app.netlify.com",
    'upgrade-insecure-requests',
  ].join('; ')
}

import { ADSTERRA_SCRIPT_HOSTS, ADSTERRA_CONNECT_HOSTS, ADSTERRA_FRAME_HOSTS } from './ads/adsterra';

/** CSP montada no build: libera o GTM (unsafe-eval, tagmanager) só quando ele está ligado. */
export function buildCsp(gtmEnabled: boolean): string {
  const analyticsScript = [
    "'self'",
    "'unsafe-inline'",
    ...(gtmEnabled ? ["'unsafe-eval'", 'https://tagmanager.google.com'] : []),
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://clarity.ms',
    'https://*.clarity.ms',
    'https://cdn.counter.dev',
  ];
  // Hosts Adsterra liberados nos mesmos policies onde aparecem em `<script src>` e conectividade do invoke.js.
  const adsterraScript = ADSTERRA_SCRIPT_HOSTS;
  const script = [...analyticsScript, ...adsterraScript];
  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://tagmanager.google.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' https: wss: ${ADSTERRA_CONNECT_HOSTS.join(' ')}`,
    `frame-src 'self' https: ${ADSTERRA_FRAME_HOSTS.join(' ')}`,
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

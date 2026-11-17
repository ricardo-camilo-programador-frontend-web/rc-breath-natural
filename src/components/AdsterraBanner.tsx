'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ADSTERRA_CONSENT_EVENT,
  type AdsterraBannerVariant,
  type AdsterraFormat,
  type AdsterraScript,
  buildAdsterraScript,
  mountAdsterraScript,
  readAnalyticsConsent,
  removeAdsterraScript,
  shouldLoadAdsterra,
} from '@/lib/ads/adsterra';
import { canonicalHostname } from '@/lib/site';

export type AdsterraBannerProps = {
  format: AdsterraFormat;
  /** Visible disclosure. Defaults to Publicidade / Advertisement from `documentElement.lang`. */
  label?: string;
  className?: string;
  /** `rectangle` is 300×250. `responsive` is 728×90 on desktop and 320×50 on mobile. */
  bannerVariant?: AdsterraBannerVariant;
};

function scriptFromEnv(
  format: AdsterraFormat,
  bannerVariant: AdsterraBannerVariant,
): AdsterraScript | null {
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth;
  return buildAdsterraScript({
    format,
    bannerVariant,
    enabledFlag: process.env.NEXT_PUBLIC_ADSTERRA_ENABLED,
    nativeKey: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY,
    nativeHost: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_HOST,
    bannerKey: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY,
    bannerHost: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_HOST,
    viewportWidth,
  });
}

function canLoadScript(script: AdsterraScript | null): boolean {
  if (typeof window === 'undefined') return false;
  return shouldLoadAdsterra({
    script,
    nodeEnv: process.env.NODE_ENV,
    hostname: window.location.hostname,
    canonicalHostname: canonicalHostname(process.env.NEXT_PUBLIC_SITE_URL),
    analyticsEnabled: readAnalyticsConsent(window.rcStudyModal),
  });
}

function disclosureLabel(label: string | undefined): string {
  const custom = label?.trim();
  if (custom) return custom;
  if (
    typeof document !== 'undefined' &&
    document.documentElement.lang.toLowerCase().startsWith('pt')
  ) {
    return 'Publicidade';
  }
  return 'Advertisement';
}

function scheduleIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => task(), { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 1);
  return () => window.clearTimeout(id);
}

/**
 * One labeled Adsterra slot. Renders nothing without a zone key.
 * Loads only in production, on the canonical host, after idle + intersection,
 * and only when the study modal (when present) has not disabled analytics.
 */
export default function AdsterraBanner({
  format,
  label,
  className = '',
  bannerVariant = 'responsive',
}: AdsterraBannerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [allowed, setAllowed] = useState(false);
  const script = scriptFromEnv(format, bannerVariant);

  useEffect(() => {
    const evaluate = () => setAllowed(canLoadScript(scriptFromEnv(format, bannerVariant)));
    evaluate();

    const onConsent = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      if (detail === false) {
        removeAdsterraScript(document, scriptFromEnv(format, bannerVariant)?.key);
        setAllowed(false);
        return;
      }
      evaluate();
    };

    window.addEventListener(ADSTERRA_CONSENT_EVENT, onConsent);
    return () => {
      window.removeEventListener(ADSTERRA_CONSENT_EVENT, onConsent);
      removeAdsterraScript(document, scriptFromEnv(format, bannerVariant)?.key);
    };
  }, [format, bannerVariant]);

  useEffect(() => {
    if (!allowed) return;
    const frame = frameRef.current;
    if (!frame) return;

    let cancelIdle: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const inject = () => {
      if (cancelled) return;
      const live = scriptFromEnv(format, bannerVariant);
      if (!live || !canLoadScript(live)) return;
      mountAdsterraScript(frame, live);
    };

    const schedule = () => {
      cancelIdle?.();
      cancelIdle = scheduleIdle(inject);
    };

    if (typeof window.IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          schedule();
        },
        { rootMargin: '200px' },
      );
      observer.observe(frame);
    } else {
      schedule();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cancelIdle?.();
    };
  }, [allowed, format, bannerVariant]);

  if (!script || !allowed) return null;

  const text = disclosureLabel(label);

  return (
    <aside
      aria-label={text}
      data-format={format}
      data-variant={bannerVariant}
      className={`mx-auto w-full max-w-6xl px-4 py-6 ${className}`.trim()}
    >
      <p className="mb-1 text-center text-xs uppercase tracking-widest text-gray-500">{text}</p>
      <div
        id={script.containerId}
        ref={frameRef}
        className="mx-auto"
        style={{ minHeight: script.height, maxWidth: script.width }}
      />
    </aside>
  );
}

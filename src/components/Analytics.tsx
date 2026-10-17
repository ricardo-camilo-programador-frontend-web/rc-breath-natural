'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import * as gtm from '@/lib/gtm'
import { analyticsConfig } from '@/lib/analytics/config'
import { useIntroModalStore } from '@/store/introModalStore'
import Loading from '@/components/Loading'
import { buildPagePath } from '@/lib/analytics/page-path'

type WindowWithGtag = Window & { gtag?: (...args: unknown[]) => void }

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Consentimento gravado pelo IntroWarningModal (zustand persist "intro-modal-storage")
  const isAnalyticsEnabled = useIntroModalStore((state) => state.analyticsEnabled)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isAnalyticsEnabled) {
      const timer = setTimeout(() => {
        document.getElementById('gtm-script')?.remove()
      }, 1500)
      return () => clearTimeout(timer)
    }
    if (!pathname) return

    const pagePath = buildPagePath(pathname, searchParams.toString())
    gtm.pageview(pagePath)

    // O gtag('config') inicial já conta a 1ª página; nas navegações do App Router,
    // envia page_view manual para o GA4 direto.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const w = window as WindowWithGtag
    if (analyticsConfig.loadGtag && typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: window.location.href,
        send_to: analyticsConfig.ga4Id,
      })
    }
  }, [pathname, searchParams, isAnalyticsEnabled])

  return null
}

export function Analytics() {
  return (
    <Suspense fallback={<Loading />}>
      <AnalyticsContent />
    </Suspense>
  )
}

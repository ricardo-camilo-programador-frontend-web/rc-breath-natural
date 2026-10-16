import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics/config";

/** gtag direto por padrão; GTM opcional; nunca os dois com o mesmo GA4 ID. */
export function AnalyticsScripts() {
  const { clarityId, loadClarity, ga4Id, gtmId, loadGtag, loadGtm, counterId, counterUtcOffset, enabled } = analyticsConfig;
  if (!enabled) return null;
  return (
    <>
      {loadGtag && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      )}
      {loadGtm && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {loadClarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarityId}');`}
        </Script>
      )}
      <Script src="https://cdn.counter.dev/script.js" strategy="lazyOnload" data-id={counterId} data-utcoffset={counterUtcOffset} />
    </>
  );
}

"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readCookieConsent } from "./cookie-consent";

function useGtmAllowed(gtmId?: string) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const c = readCookieConsent();
      setAllowed(Boolean(gtmId) && Boolean(c?.analytics || c?.marketing));
    };
    sync();
    window.addEventListener("nx-cookie-consent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nx-cookie-consent", sync);
      window.removeEventListener("storage", sync);
    };
  }, [gtmId]);

  return allowed;
}

const gtmScript = (gtmId: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

/** Google Tag Manager – script i &lt;head&gt; (efter cookiesamtycke). */
export function GtmHead({ gtmId }: { gtmId?: string }) {
  const allowed = useGtmAllowed(gtmId);
  if (!gtmId || !allowed) return null;

  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {gtmScript(gtmId)}
    </Script>
  );
}

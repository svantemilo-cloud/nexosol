"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteNavbar } from "@/components/SiteNavbar";

export function StickyCta() {
  const pathname = usePathname();
  const homeHeroNav = pathname === "/" || pathname === "";
  const [scrolled, setScrolled] = useState(false);

  const overlayNav = homeHeroNav && !scrolled;

  useEffect(() => {
    if (!homeHeroNav) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [homeHeroNav]);

  return (
    <header
      className={`safe-area-top fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-200 ${
        overlayNav
          ? "border-transparent bg-transparent shadow-none"
          : "border-forest/10 bg-surface/95 shadow-soft backdrop-blur-md"
      }`}
    >
      <SiteNavbar overlayNav={overlayNav} />
    </header>
  );
}

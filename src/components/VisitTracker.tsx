"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname == null) return;
    const path = pathname === "/" ? "/" : pathname;
    fetch(`/api/visits?path=${encodeURIComponent(path)}`, {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => {});
  }, [pathname]);
  return null;
}

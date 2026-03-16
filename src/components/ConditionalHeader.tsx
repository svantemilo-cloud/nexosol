"use client";

import { usePathname } from "next/navigation";
import { StickyCta } from "./StickyCta";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <StickyCta />;
}

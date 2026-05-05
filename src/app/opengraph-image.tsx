import { ImageResponse } from "next/og";
import { OgBrandImage } from "./og-brand";

export const runtime = "edge";
export const alt = "Nexosol – Jämför & Spara med grön el";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<OgBrandImage />, { ...size });
}

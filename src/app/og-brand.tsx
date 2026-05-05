/** Shared layout for route-level Open Graph / Twitter images (next/og). */
export function OgBrandImage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 72,
        background: "linear-gradient(135deg, #065a45 0%, #0d7a5c 55%, #0a5c47 100%)",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -2,
          lineHeight: 1.05,
        }}
      >
        Nexosol
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 34,
          fontWeight: 500,
          color: "rgba(255,255,255,0.92)",
          maxWidth: 900,
          lineHeight: 1.25,
        }}
      >
        Jämför & spara med grön el – upp till 4 offerter från kvalitetssäkrade
        installatörer
      </div>
      <div
        style={{
          marginTop: 48,
          fontSize: 22,
          color: "rgba(255,255,255,0.75)",
        }}
      >
        www.nexosol.se
      </div>
    </div>
  );
}

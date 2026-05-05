"use client";

/** Systemstack – undvik render‑blockande Google Fonts‑stylesheet i felgränsläge */
const UI_SANS =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sv">
      <head />
      <body
        style={{
          margin: 0,
          fontFamily: UI_SANS,
          padding: "2rem",
          background: "#f9fafb",
          color: "#065a45",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Något gick fel</h1>
          <p style={{ marginBottom: "1rem", color: "#374151" }}>{error.message || "Ett oväntat fel inträffade."}</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "#065a45",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Försök igen
          </button>
        </div>
      </body>
    </html>
  );
}

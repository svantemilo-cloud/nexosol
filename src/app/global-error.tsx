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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nexosol</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `*{box-sizing:border-box}body{margin:0;font-family:${UI_SANS};padding:2rem;background:#f9fafb;color:#065a45;line-height:1.5}h1{font-size:1.5rem;margin:0 0 1rem}p{margin:0 0 1rem;color:#374151}button{font:inherit}`,
          }}
        />
      </head>
      <body>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1>Något gick fel</h1>
          <p>{error.message || "Ett oväntat fel inträffade."}</p>
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

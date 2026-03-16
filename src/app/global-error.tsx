"use client";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Montserrat', system-ui, sans-serif", padding: "2rem", background: "#f9fafb", color: "#065a45" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Något gick fel</h1>
          <p style={{ marginBottom: "1rem", color: "#374151" }}>{error.message || "Ett oväntat fel inträffade."}</p>
          <button
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

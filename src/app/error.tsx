"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#f9fafb",
        color: "#065a45",
        fontFamily: "'Montserrat', system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Något gick fel</h2>
      <p style={{ marginBottom: "1rem", color: "#374151", maxWidth: "400px" }}>
        {error.message}
      </p>
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
  );
}

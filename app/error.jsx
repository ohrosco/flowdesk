"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 40, textAlign: "center", background: "#111008", color: "#F0EAD6", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#E05A5A", marginBottom: 12 }}>Something went wrong</h1>
      <p style={{ color: "#8A8470", marginBottom: 20 }}>{error?.message || "An unexpected error occurred."}</p>
      <button onClick={reset} style={{ padding: "10px 24px", background: "#F0B429", color: "#111", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
        Try again
      </button>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | PAYVORA",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "#ffffff",
        color: "#111827",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: 900, margin: 0, color: "#00D9A0" }}>
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "1rem", color: "#111827" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6B7280", marginTop: "0.75rem", maxWidth: "400px" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 2rem",
          background: "#111827",
          color: "#ffffff",
          borderRadius: "9999px",
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

/* ── tiny SVG helpers ─────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function IconDisposable() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M6 15h2M10 15h2" strokeDasharray="2 2" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconEyeOff() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Card screen descriptions ─────────────────────────── */
const DESCRIPTIONS = {
  virtual: {
    title: "Virtual card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores.",
  },
  disposable: {
    title: "Disposable virtual card",
    body: "Single-use card for extra security. Expires after one transaction.",
  },
} as const;
type CardType = keyof typeof DESCRIPTIONS;

/* ── Choose-a-Card screen (fits inside the phone mockup) ── */
function ChooseCardScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<CardType>("virtual");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 6px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#000", display: "flex", alignItems: "center" }}
        >
          <IconArrowLeft />
        </button>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#000", letterSpacing: -0.2 }}>Choose a card type</span>
        <div style={{ width: 22 }} />
      </div>

      {/* Card visual */}
      <div style={{ padding: "8px 14px 4px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "1.586 / 1",
            borderRadius: 14,
            backgroundColor: "#141414",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
          }}
        >
          {/* Subtle gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)", borderRadius: 14, pointerEvents: "none" }} />
          {/* Large "P" watermark */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-46%, -50%)", fontSize: 90, fontWeight: 900, color: "rgba(255,255,255,0.045)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>P</div>
          {/* CARD HOLDER */}
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.72)", fontSize: 5.5, fontWeight: 600, letterSpacing: 2.5, whiteSpace: "nowrap", userSelect: "none" }}>CARD HOLDER</div>
          {/* VIRTUAL */}
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.72)", fontSize: 5.5, fontWeight: 600, letterSpacing: 2.5, whiteSpace: "nowrap", userSelect: "none" }}>VIRTUAL</div>
          {/* Bottom row */}
          <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            {/* Mastercard circles */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EB001B", opacity: 0.95 }} />
              <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#F79E1B", opacity: 0.92, marginLeft: -7 }} />
            </div>
            {/* Payvora */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 7, fontWeight: 700 }}>P</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 5, letterSpacing: 1.5, fontWeight: 600 }}>PAYVORA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle row */}
      <div style={{ display: "flex", gap: 6, padding: "8px 12px 0" }}>
        <button
          onClick={() => setSelected("virtual")}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 10px", borderRadius: 50, border: "none", cursor: "pointer",
            backgroundColor: selected === "virtual" ? "#000" : "#F0F0F0",
            color: selected === "virtual" ? "#fff" : "#333",
            fontSize: 8.5, fontWeight: 600, whiteSpace: "nowrap",
          }}
        >
          <IconCard /> Virtual
        </button>
        <button
          onClick={() => setSelected("disposable")}
          style={{
            display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center",
            padding: "6px 8px", borderRadius: 50, cursor: "pointer",
            border: selected === "disposable" ? "none" : "1px solid #E0E0E0",
            backgroundColor: selected === "disposable" ? "#000" : "transparent",
            color: selected === "disposable" ? "#fff" : "#555",
            fontSize: 8, fontWeight: 500, whiteSpace: "nowrap",
          }}
        >
          <IconDisposable /> Disposable virtual
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#F0F0F0", margin: "8px 12px 0" }} />

      {/* Description */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px 0" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#F4F4F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IconShield />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, color: "#000", marginBottom: 3 }}>
            {DESCRIPTIONS[selected].title}
          </p>
          <p style={{ margin: 0, fontSize: 7.5, fontWeight: 400, color: "#888", lineHeight: 1.5 }}>
            {DESCRIPTIONS[selected].body}
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ padding: "0 12px 14px" }}>
        <button
          style={{
            width: "100%", padding: "10px 0", borderRadius: 50, border: "none",
            backgroundColor: "#000", color: "#fff", fontSize: 9, fontWeight: 600,
            cursor: "pointer", letterSpacing: -0.1,
          }}
        >
          Get virtual card
        </button>
      </div>
    </div>
  );
}

/* ── Dashboard screen ─────────────────────────────────── */
function DashboardScreen({ onCardPress }: { onCardPress: () => void }) {
  return (
    <div className="pt-10 flex flex-col h-full">

      {/* Brand name */}
      <div className="text-center py-2">
        <span className="text-[11px] font-semibold tracking-[3px] text-black uppercase">aza</span>
      </div>

      {/* Greeting row — Figma exact, no card/border/shadow */}
      <div
        style={{
          display: "flex", flexDirection: "row", alignItems: "center",
          gap: 6, padding: "0 14px", marginTop: 6, background: "#FFFFFF",
        }}
      >
        {/* Avatar */}
        <div style={{ width: 28, height: 27, flexShrink: 0, borderRadius: 4, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar_3d_16.png" alt="User avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Text stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
          <span style={{ fontFamily: "Roboto, system-ui, sans-serif", fontWeight: 700, fontSize: 9.6, lineHeight: "120%", color: "#1C1C1C" }}>Hi, Dove</span>
          <span style={{ fontFamily: "Roboto, system-ui, sans-serif", fontWeight: 400, fontSize: 7.7, lineHeight: "150%", color: "#595F67" }}>Your available balance</span>
        </div>
        {/* Spacer */}
        <div style={{ flex: 1 }} />
        {/* Balance */}
        <span style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 11.5, lineHeight: "120%", color: "#0B0A0A", whiteSpace: "nowrap" }}>₦200,590.00</span>
        {/* Eye icon */}
        <IconEyeOff />
      </div>

      {/* Action bar */}
      <div className="mx-3 mt-3 bg-black rounded-md py-2 flex items-center justify-around">
        {["Fund Wallet", "Sell", "Withdraw"].map((a) => (
          <span key={a} className="text-white text-[7px] font-bold">{a}</span>
        ))}
      </div>

      {/* Transactions */}
      <div className="mx-3 mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold text-[#0B0A0A]">Recent Transaction</span>
          <span className="text-[7px] text-black font-semibold">See All</span>
        </div>
        {[
          { label: "Deposit Giftcard", val: "₦200,40.00",   color: "#00B03C" },
          { label: "Withdraws",        val: "-₦400,000.00", color: "#FF0000" },
        ].map(({ label, val, color }) => (
          <div key={label} className="flex items-center justify-between bg-white py-1">
            <div className="w-4 h-4 rounded bg-gray-100 flex-shrink-0" />
            <span className="text-[7.5px] text-[#595F67] font-semibold flex-1 ml-2">{label}</span>
            <span className="text-[7.5px] font-extrabold" style={{ color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom nav */}
      <div
        style={{
          margin: "0 12px 12px",
          background: "#000",
          borderRadius: 28,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 6px",
          flexShrink: 0,
        }}
      >
        {/* Home */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#3D3585", borderRadius: 12, padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="14" viewBox="0 0 16 18" fill="white">
              <path d="M1 6.5L8 1l7 5.5V17H11v-5H5v5H1V6.5z" />
            </svg>
          </div>
        </div>
        {/* Card — navigates to Choose Card screen */}
        <button
          onClick={onCardPress}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
        >
          <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="22" height="16" rx="2" />
            <line x1="1" y1="6" x2="23" y2="6" />
          </svg>
        </button>
        {/* History */}
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: -2, right: 14, width: 5, height: 5, background: "red", borderRadius: "50%" }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────── */
export function Hero() {
  const [screen, setScreen] = useState<"dashboard" | "virtual-card">("dashboard");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(0,217,160,0.4) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,61,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,61,0.15)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-8">
          <Star size={14} fill="currentColor" />
          Nigeria&apos;s fastest-growing fintech app
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Your money,{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00D9A0, #00b8ff)" }}>
            supercharged.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#8F8FA3] max-w-2xl mx-auto mb-10 leading-relaxed">
          Trade gift cards for instant cash, pay every bill in seconds, recharge
          airtime, get a virtual dollar card, and manage your wallet — all in one powerful app.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/download" className="flex items-center gap-2 px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] text-base font-bold rounded-2xl hover:bg-[#00C490] transition-all hover:scale-105">
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link href="/features" className="flex items-center gap-2 px-8 py-4 bg-[#1C1C2A] text-white text-base font-semibold rounded-2xl border border-[#2A2A3D] hover:border-[#00D9A0] transition-all">
            See All Features
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "50K+", label: "Active Users" },
            { value: "₦2B+", label: "Transactions" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "App Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-5">
              <div className="text-2xl font-black text-[#00D9A0]">{value}</div>
              <div className="text-xs text-[#8F8FA3] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Phone mockup */}
        <div className="mt-20 relative flex justify-center">
          <div className="relative w-72 h-[580px]">
            {/* Phone shell */}
            <div className="absolute inset-0 rounded-[48px] bg-[#1C1C2A] border-4 border-[#2A2A3D] shadow-2xl overflow-hidden">
              {/* Screen — pure white */}
              <div className="absolute inset-[3px] rounded-[44px] bg-white overflow-hidden">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1C1C2A] rounded-full z-10" />

                {/* Screen router */}
                {screen === "dashboard" ? (
                  <DashboardScreen onCardPress={() => setScreen("virtual-card")} />
                ) : (
                  <ChooseCardScreen onBack={() => setScreen("dashboard")} />
                )}
              </div>
            </div>

            {/* Glow under phone */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-16 opacity-40 blur-2xl"
              style={{ background: "radial-gradient(ellipse, #00D9A0, transparent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

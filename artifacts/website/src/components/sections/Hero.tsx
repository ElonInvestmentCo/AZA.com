"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

/* ─── SVG icons ──────────────────────────────────────── */
function IcoHome({ active }: { active?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={active ? "white" : "rgba(255,255,255,0.5)"}>
      <path d="M3 9.5L12 3l9 6.5V21H15v-6H9v6H3V9.5z" />
    </svg>
  );
}
function IcoCard({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke={active ? "white" : "rgba(255,255,255,0.55)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="22" height="16" rx="2" />
      <line x1="1" y1="6" x2="23" y2="6" />
    </svg>
  );
}
function IcoHistory({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "rgba(255,255,255,0.55)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoBack() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
  );
}
function IcoShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Feature grid icons (inline mini SVGs) ─────────── */
const FEATURES = [
  { label: "Gift Card",    bg: "#FFF4E0", color: "#D97706", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M12 8c0-2.2 1.8-4 4-4a4 4 0 0 1 0 8H12m0-8C12 5.8 10.2 4 8 4a4 4 0 0 0 0 8h4"/></svg> },
  { label: "Airtime",      bg: "#E8F5E9", color: "#16A34A", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="3"/></svg> },
  { label: "Electricity",  bg: "#FEF3C7", color: "#D97706", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { label: "Cable TV",     bg: "#FEE2E2", color: "#DC2626", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> },
  { label: "Rates",        bg: "#EDE9FE", color: "#7C3AED", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { label: "Transactions", bg: "#DBEAFE", color: "#1D4ED8", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
  { label: "Betting",      bg: "#D1FAE5", color: "#059669", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: "Funding",      bg: "#E0E7FF", color: "#4338CA", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg> },
  { label: "More",         bg: "#F3F4F6", color: "#374151", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg> },
];

/* ─── Choose-a-Card Screen — faithful copy of VirtualCardScreen.tsx, scaled to phone ── */
type CardType = "virtual" | "disposable";
const DESCRIPTIONS: Record<CardType, { title: string; body: string }> = {
  virtual: {
    title: "Virtual card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  disposable: {
    title: "Disposable virtual card",
    body: "Single-use card for extra security. Expires after one transaction, keeping your main account safe.",
  },
};

/* sub-components matching VirtualCardScreen.tsx exactly */
function VCSMastercardLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
      <div style={{ position: "relative", width: 46, height: 28 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#EB001B", opacity: 0.95 }} />
        <div style={{ position: "absolute", left: 18, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#F79E1B", opacity: 0.92 }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: 0.3, fontWeight: 400, marginTop: 1 }}>
        mastercard<span style={{ fontSize: 7, position: "relative", top: -4 }}>®</span>
      </span>
    </div>
  );
}
function VCSPayvoraLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>P</span>
      </div>
      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, letterSpacing: 2.5, fontWeight: 600 }}>PAYVORA</span>
    </div>
  );
}
function VCSCardIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
}
function VCSDisposableIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><path d="M6 15h2M10 15h2" strokeDasharray="2 2" /></svg>;
}
function VCSShieldIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}

function ChooseCardScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<CardType>("virtual");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.637);

  /* Measure the real container width and recompute scale whenever it changes.
     NATURAL_W = the design width (430px). Scale = container / 430. */
  const NATURAL_W = 430;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(Math.min(1, w / NATURAL_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const SCALE = scale;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#fff" }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: NATURAL_W,
        transformOrigin: "top left",
        transform: `scale(${SCALE})`,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        minHeight: `${100 / SCALE}%`,
      }}>

        {/* Header — matches VirtualCardScreen.tsx */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 36, paddingBottom: 16, paddingLeft: 20, paddingRight: 20, backgroundColor: "#FFFFFF" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#000", display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#000000", letterSpacing: -0.2 }}>Choose a card type</span>
          <div style={{ width: 30 }} />
        </div>

        {/* Card — matches VirtualCardScreen.tsx */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 24, paddingBottom: 8, paddingLeft: 28, paddingRight: 28 }}>
          <div style={{ width: "100%", maxWidth: 340, aspectRatio: "1.586 / 1", borderRadius: 22, backgroundColor: "#141414", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18)", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)", borderRadius: 22, pointerEvents: "none" }} />
            {/* Watermark P */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-46%, -50%)", fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.045)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: -8 }}>P</div>
            {/* CARD HOLDER vertical left */}
            <div style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap", userSelect: "none" }}>CARD HOLDER</div>
            {/* VIRTUAL vertical right */}
            <div style={{ position: "absolute", right: 22, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap", userSelect: "none" }}>VIRTUAL</div>
            {/* Bottom logos */}
            <div style={{ position: "absolute", bottom: 20, left: 22, right: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <VCSMastercardLogo />
              <VCSPayvoraLogo />
            </div>
          </div>
        </div>

        {/* Toggle — matches VirtualCardScreen.tsx */}
        <div style={{ display: "flex", gap: 10, paddingTop: 28, paddingLeft: 24, paddingRight: 24 }}>
          <button onClick={() => setSelected("virtual")} style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 18, paddingRight: 18, paddingTop: 11, paddingBottom: 11, borderRadius: 50, border: "none", cursor: "pointer", transition: "all 0.2s ease", backgroundColor: selected === "virtual" ? "#000000" : "#F0F0F0", color: selected === "virtual" ? "#FFFFFF" : "#333333", fontSize: 14, fontWeight: 600, letterSpacing: -0.1, whiteSpace: "nowrap" }}>
            <span style={{ opacity: selected === "virtual" ? 1 : 0.6 }}><VCSCardIcon /></span>
            Virtual
          </button>
          <button onClick={() => setSelected("disposable")} style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 16, paddingRight: 16, paddingTop: 11, paddingBottom: 11, borderRadius: 50, border: selected === "disposable" ? "none" : "1.5px solid #E0E0E0", cursor: "pointer", transition: "all 0.2s ease", backgroundColor: selected === "disposable" ? "#000000" : "transparent", color: selected === "disposable" ? "#FFFFFF" : "#555555", fontSize: 14, fontWeight: 500, letterSpacing: -0.1, whiteSpace: "nowrap", flex: 1, justifyContent: "center" }}>
            <span style={{ opacity: selected === "disposable" ? 1 : 0.55 }}><VCSDisposableIcon /></span>
            Disposable virtual
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "#F0F0F0", marginTop: 24, marginLeft: 24, marginRight: 24 }} />

        {/* Description — matches VirtualCardScreen.tsx */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingTop: 20, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: "#F4F4F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <VCSShieldIcon />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#000000", letterSpacing: -0.2, marginBottom: 5 }}>{DESCRIPTIONS[selected].title}</p>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 400, color: "#888888", lineHeight: 1.5, letterSpacing: -0.1 }}>{DESCRIPTIONS[selected].body}</p>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 40 }} />

        {/* CTA — matches VirtualCardScreen.tsx */}
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 44, paddingTop: 16 }}>
          <button style={{ width: "100%", paddingTop: 17, paddingBottom: 17, borderRadius: 50, border: "none", backgroundColor: "#000000", color: "#FFFFFF", fontSize: 16, fontWeight: 600, letterSpacing: -0.2, cursor: "pointer" }}>
            Get virtual card
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared bottom nav ──────────────────────────────── */
function BottomNav({ active, onCardPress }: { active: "home" | "card" | "history"; onCardPress: () => void }) {
  return (
    <div style={{ margin: "0 12px 12px", background: "#000", borderRadius: 28, height: 44, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6px", flexShrink: 0 }}>
      {/* Home */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: active === "home" ? "#3D3585" : "transparent", borderRadius: 12, padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IcoHome active={active === "home"} />
        </div>
      </div>
      {/* Card */}
      <button onClick={onCardPress} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>
        <div style={{ background: active === "card" ? "rgba(255,255,255,0.12)" : "transparent", borderRadius: 12, padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IcoCard active={active === "card"} />
        </div>
      </button>
      {/* History */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: -2, right: 16, width: 5, height: 5, background: "red", borderRadius: "50%" }} />
        <IcoHistory active={active === "history"} />
      </div>
    </div>
  );
}

/* ─── Dashboard Screen ───────────────────────────────── */
function DashboardScreen({ onCardPress }: { onCardPress: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F6FA" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px", background: "#F5F6FA", flexShrink: 0 }}>
        <svg width="16" height="14" viewBox="0 0 20 18" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round">
          <line x1="0" y1="2" x2="20" y2="2" />
          <line x1="0" y1="9" x2="20" y2="9" />
          <line x1="0" y1="16" x2="20" y2="16" />
        </svg>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#111", textTransform: "uppercase" }}>PAYVORA.</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>

      {/* Balance card */}
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 16, padding: "10px 12px", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid #E5E7EB" }}>
            <Image src="/avatar_3d_16.png" alt="avatar" width={26} height={26} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#111" }}>Hi, Dove 👋</div>
            <div style={{ fontSize: 7.5, color: "#6B7280", marginTop: 1 }}>Your available balance</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0B0A0A", letterSpacing: -0.5 }}>₦200,590.00</span>
          <IcoEye />
        </div>
      </div>

      {/* Action bar */}
      <div style={{ margin: "0 10px 8px", background: "#111", borderRadius: 12, padding: "8px 0", display: "flex", alignItems: "center", flexShrink: 0 }}>
        {[
          { label: "Fund Wallet", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
          { label: "Sell",        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
          { label: "Withdraw",    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
        ].map(({ label, icon }, i) => (
          <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
            {icon}
            <span style={{ fontSize: 6.5, color: "white", fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Feature grid */}
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 12, padding: "8px 6px", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 4px" }}>
          {FEATURES.map(({ label, bg, color, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon}
              </div>
              <span style={{ fontSize: 5.5, color: "#374151", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promo card */}
      <div style={{ margin: "0 10px 8px", borderRadius: 12, background: "linear-gradient(135deg, #FCA5A5 0%, #FECDD3 60%, #FED7AA 100%)", padding: "10px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#B91C1C", marginBottom: 2 }}>50% OFF</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#7F1D1D", marginBottom: 2 }}>Summer special deal</div>
        <div style={{ fontSize: 6.5, color: "#991B1B", lineHeight: 1.4 }}>Get discount for every transaction this weekend</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom nav */}
      <BottomNav active="home" onCardPress={onCardPress} />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
export function Hero() {
  const [screen, setScreen] = useState<"dashboard" | "virtual-card">("dashboard");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(0,217,160,0.4) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,61,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,61,0.15)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* ── Two-column layout: text left · phone right ── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── LEFT: copy + stats ── */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-8">
            <Star size={14} fill="currentColor" />
            Nigeria&apos;s fastest-growing fintech app
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Your money,{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00D9A0, #00b8ff)" }}>
              supercharged.
            </span>
          </h1>

          <p className="text-lg text-[#8F8FA3] max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
            Trade gift cards for instant cash, pay every bill in seconds, recharge
            airtime, get a virtual dollar card, and manage your wallet — all in one powerful app.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
            <Link href="/download" className="flex items-center gap-2 px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] text-base font-bold rounded-2xl hover:bg-[#00C490] transition-all hover:scale-105">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/features" className="flex items-center gap-2 px-8 py-4 bg-[#1C1C2A] text-white text-base font-semibold rounded-2xl border border-[#2A2A3D] hover:border-[#00D9A0] transition-all">
              See All Features
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "₦2B+", label: "Transactions" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9★", label: "App Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4">
                <div className="text-xl font-black text-[#00D9A0]">{value}</div>
                <div className="text-xs text-[#8F8FA3] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: phone mockup — responsive across all screen sizes ── */}
        <div className="flex-shrink-0 flex justify-center lg:justify-end">
          <div className="relative w-64 h-[540px] xl:w-[300px] xl:h-[640px] 2xl:w-[340px] 2xl:h-[730px]">
            {/* Phone shell */}
            <div className="absolute inset-0 rounded-[44px] xl:rounded-[52px] 2xl:rounded-[56px] bg-[#1C1C2A] border-4 border-[#2A2A3D] shadow-2xl overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-[3px] rounded-[40px] xl:rounded-[48px] 2xl:rounded-[52px] overflow-hidden" style={{ background: "#F5F6FA" }}>
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1C1C2A] rounded-full z-10" />

                {/* Screen router */}
                {screen === "dashboard"
                  ? <DashboardScreen onCardPress={() => setScreen("virtual-card")} />
                  : <ChooseCardScreen onBack={() => setScreen("dashboard")} />
                }
              </div>
            </div>

            {/* Glow under phone */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 xl:w-52 2xl:w-64 h-12 xl:h-16 2xl:h-20 opacity-50 blur-2xl"
              style={{ background: "radial-gradient(ellipse, #00D9A0, transparent)" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

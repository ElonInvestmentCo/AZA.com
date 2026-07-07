"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

/* ─── SVG icons (phone UI) ───────────────────────────────────────────────── */
function IcoHome({ active }: { active?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={active ? "#111827" : "rgba(0,0,0,0.3)"}>
      <path d="M3 9.5L12 3l9 6.5V21H15v-6H9v6H3V9.5z" />
    </svg>
  );
}
function IcoCard({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke={active ? "#111827" : "rgba(0,0,0,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="22" height="16" rx="2" />
      <line x1="1" y1="6" x2="23" y2="6" />
    </svg>
  );
}
function IcoHistory({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#111827" : "rgba(0,0,0,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Feature grid ───────────────────────────────────────────────────────── */
const FEATURES = [
  { label: "Gift Card",    bg: "#FEF3C7", color: "#D97706", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M12 8c0-2.2 1.8-4 4-4a4 4 0 0 1 0 8H12m0-8C12 5.8 10.2 4 8 4a4 4 0 0 0 0 8h4"/></svg> },
  { label: "Airtime",      bg: "#D1FAE5", color: "#059669", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="3"/></svg> },
  { label: "Electricity",  bg: "#FEF3C7", color: "#D97706", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { label: "Cable TV",     bg: "#FEE2E2", color: "#DC2626", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> },
  { label: "Rates",        bg: "#EDE9FE", color: "#7C3AED", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { label: "Transactions", bg: "#DBEAFE", color: "#1D4ED8", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
  { label: "Betting",      bg: "#D1FAE5", color: "#059669", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: "Funding",      bg: "#E0E7FF", color: "#4338CA", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg> },
  { label: "More",         bg: "#F3F4F6", color: "#374151", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg> },
];

/* ─── Card picker screen ─────────────────────────────────────────────────── */
type CardType = "virtual" | "disposable";
const DESCRIPTIONS: Record<CardType, { title: string; body: string }> = {
  virtual:    { title: "Virtual card",            body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card." },
  disposable: { title: "Disposable virtual card", body: "Single-use card for extra security. Expires after one transaction, keeping your main account safe." },
};

function ChooseCardScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<CardType>("virtual");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.637);
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

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#fff" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: NATURAL_W, transformOrigin: "top left", transform: `scale(${scale})`, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", minHeight: `${100 / scale}%`, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 36, paddingBottom: 16, paddingLeft: 20, paddingRight: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#000" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7" /></svg>
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#111827", letterSpacing: -0.2 }}>Choose a card type</span>
          <div style={{ width: 30 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 28px 8px" }}>
          <div style={{ width: "100%", maxWidth: 340, aspectRatio: "1.586 / 1", borderRadius: 22, backgroundColor: "#141414", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.28)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)", borderRadius: 22 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-46%, -50%)", fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.045)", lineHeight: 1, userSelect: "none" }}>P</div>
            <div style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap" }}>CARD HOLDER</div>
            <div style={{ position: "absolute", right: 22, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap" }}>VIRTUAL</div>
            <div style={{ position: "absolute", bottom: 20, left: 22, right: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ position: "relative", width: 46, height: 28 }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#EB001B", opacity: 0.95 }} />
                <div style={{ position: "absolute", left: 18, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#F79E1B", opacity: 0.92 }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, letterSpacing: 2.5, fontWeight: 600 }}>PAYVORA</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "28px 24px 0" }}>
          {(["virtual", "disposable"] as CardType[]).map(t => (
            <button key={t} onClick={() => setSelected(t)} style={{ flex: t === "disposable" ? 1 : undefined, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 18px", borderRadius: 50, border: selected === t ? "none" : "1.5px solid #E5E7EB", cursor: "pointer", backgroundColor: selected === t ? "#111827" : "transparent", color: selected === t ? "#fff" : "#555", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
              {t === "virtual" ? "Virtual" : "Disposable virtual"}
            </button>
          ))}
        </div>
        <div style={{ height: 1, backgroundColor: "#F0F0F0", margin: "24px 24px 0" }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px 0" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: "#F4F4F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 5 }}>{DESCRIPTIONS[selected].title}</p>
            <p style={{ margin: 0, fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.5 }}>{DESCRIPTIONS[selected].body}</p>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 40 }} />
        <div style={{ padding: "16px 24px 44px" }}>
          <button style={{ width: "100%", paddingTop: 17, paddingBottom: 17, borderRadius: 50, border: "none", backgroundColor: "#111827", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Get virtual card</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Bottom nav ─────────────────────────────────────────────────────────── */
function BottomNav({ active, onCardPress }: { active: "home" | "card" | "history"; onCardPress: () => void }) {
  return (
    <div style={{ margin: "0 12px 12px", background: "#F7F8FA", borderRadius: 28, height: 44, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6px", flexShrink: 0, border: "1px solid #E5E7EB" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: active === "home" ? "#111827" : "transparent", borderRadius: 12, padding: "4px 10px" }}>
          <IcoHome active={active === "home"} />
        </div>
      </div>
      <button onClick={onCardPress} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>
        <div style={{ background: active === "card" ? "rgba(0,0,0,0.06)" : "transparent", borderRadius: 12, padding: "4px 8px" }}>
          <IcoCard active={active === "card"} />
        </div>
      </button>
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: -2, right: 16, width: 5, height: 5, background: "#EF4444", borderRadius: "50%" }} />
        <IcoHistory active={active === "history"} />
      </div>
    </div>
  );
}

/* ─── Dashboard screen ───────────────────────────────────────────────────── */
function DashboardScreen({ onCardPress }: { onCardPress: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F7F8FA" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px", background: "#F7F8FA", flexShrink: 0 }}>
        <svg width="16" height="14" viewBox="0 0 20 18" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><line x1="0" y1="2" x2="20" y2="2" /><line x1="0" y1="9" x2="20" y2="9" /><line x1="0" y1="16" x2="20" y2="16" /></svg>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#111827", textTransform: "uppercase" }}>PAYVORA.</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
      </div>
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 16, padding: "10px 12px", flexShrink: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid #E5E7EB" }}>
            <Image src="/avatar_3d_16.png" alt="avatar" width={26} height={26} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#111827" }}>Hi, Dove 👋</div>
            <div style={{ fontSize: 7.5, color: "#9CA3AF", marginTop: 1 }}>Your available balance</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>₦200,590.00</span>
          <IcoEye />
        </div>
      </div>
      <div style={{ margin: "0 10px 8px", background: "#111827", borderRadius: 12, padding: "8px 0", display: "flex", alignItems: "center", flexShrink: 0 }}>
        {[
          { label: "Fund Wallet", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
          { label: "Sell",        icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
          { label: "Withdraw",    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
        ].map(({ label, icon }, i) => (
          <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
            {icon}
            <span style={{ fontSize: 6.5, color: "white", fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 12, padding: "8px 6px", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 4px" }}>
          {FEATURES.map(({ label, bg, color, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
              <span style={{ fontSize: 5.5, color: "#374151", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "0 10px 8px", borderRadius: 12, background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 60%, #6EE7B7 100%)", padding: "10px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#065F46", marginBottom: 2 }}>50% OFF</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#047857", marginBottom: 2 }}>Summer special deal</div>
        <div style={{ fontSize: 6.5, color: "#059669", lineHeight: 1.4 }}>Get discount for every transaction this weekend</div>
      </div>
      <div style={{ flex: 1 }} />
      <BottomNav active="home" onCardPress={onCardPress} />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export function Hero() {
  const [screen, setScreen] = useState<"dashboard" | "virtual-card">("dashboard");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 bg-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Very light green glow, far top-right */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(0,217,160,0.12) 0%, transparent 70%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, #D1D5DB 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.5 }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── LEFT: copy ── */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.10)] border border-[rgba(0,217,160,0.25)] text-[#00B88A] text-sm font-semibold mb-8">
            <Star size={13} fill="currentColor" />
            Nigeria&apos;s fastest-growing fintech app
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Your money,{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00D9A0, #00b8ff)" }}>
              supercharged.
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
            Trade gift cards for instant cash, pay every bill in seconds, recharge
            airtime, get a virtual dollar card, and manage your wallet — all in one powerful app.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
            <Link
              href="/download"
              className="flex items-center gap-2 px-8 py-4 bg-[#111827] text-white text-base font-bold rounded-2xl hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-px active:translate-y-0"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/features"
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-[#00D9A0] hover:text-[#00B88A] hover:shadow-md transition-all"
            >
              See All Features
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "Active Users"  },
              { value: "₦2B+", label: "Transactions"  },
              { value: "99.9%",label: "Uptime"        },
              { value: "4.9★", label: "App Rating"    },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="text-xl font-black text-[#00D9A0]">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: phone mockup ── */}
        <div className="flex-shrink-0 flex justify-center lg:justify-end">
          <div className="relative w-64 h-[540px] xl:w-[300px] xl:h-[640px] 2xl:w-[340px] 2xl:h-[730px]">
            {/* Floating cards */}
            <div className="absolute -left-16 top-16 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 hidden xl:block">
              <div className="text-xs text-gray-500 mb-1">Gift Card Traded</div>
              <div className="text-sm font-bold text-gray-900">+₦87,400</div>
              <div className="text-[10px] text-[#00D9A0] font-semibold mt-0.5">● Settled instantly</div>
            </div>
            <div className="absolute -right-16 bottom-32 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 hidden xl:block">
              <div className="text-xs text-gray-500 mb-1">Electricity Token</div>
              <div className="text-sm font-bold text-gray-900">₦5,000</div>
              <div className="text-[10px] text-[#00D9A0] font-semibold mt-0.5">● Delivered</div>
            </div>

            {/* Phone shell */}
            <div className="absolute inset-0 rounded-[44px] xl:rounded-[52px] bg-[#111827] border-4 border-gray-800 shadow-2xl overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-[3px] rounded-[40px] xl:rounded-[48px] overflow-hidden bg-[#F7F8FA]">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#111827] rounded-full z-10" />
                {screen === "dashboard"
                  ? <DashboardScreen onCardPress={() => setScreen("virtual-card")} />
                  : <ChooseCardScreen onBack={() => setScreen("dashboard")} />
                }
              </div>
            </div>

            {/* Soft glow under phone */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 xl:w-52 h-12 xl:h-16 opacity-40 blur-2xl"
              style={{ background: "radial-gradient(ellipse, #00D9A0, transparent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

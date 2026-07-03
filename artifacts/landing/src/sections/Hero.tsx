import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

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
function IcoEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const FEATURES = [
  { label: "Gift Card", bg: "#FFF4E0", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M12 8c0-2.2 1.8-4 4-4a4 4 0 0 1 0 8H12m0-8C12 5.8 10.2 4 8 4a4 4 0 0 0 0 8h4"/></svg> },
  { label: "Airtime", bg: "#E8F5E9", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="3"/></svg> },
  { label: "Electricity", bg: "#FEF3C7", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { label: "Cable TV", bg: "#FEE2E2", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> },
  { label: "Rates", bg: "#EDE9FE", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { label: "Transactions", bg: "#DBEAFE", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
  { label: "Betting", bg: "#D1FAE5", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: "Funding", bg: "#E0E7FF", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg> },
  { label: "More", bg: "#F3F4F6", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg> },
];

function MastercardLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
      <div style={{ position: "relative", width: 46, height: 28 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#EB001B", opacity: 0.95 }} />
        <div style={{ position: "absolute", left: 18, top: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#F79E1B", opacity: 0.92 }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: 0.3, fontWeight: 400, marginTop: 1 }}>mastercard</span>
    </div>
  );
}
function PayvoraCardLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>P</span>
      </div>
      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, letterSpacing: 2.5, fontWeight: 600 }}>PAYVORA</span>
    </div>
  );
}

type CardType = "virtual" | "disposable";
const CARD_DESC: Record<CardType, { title: string; body: string }> = {
  virtual: { title: "Virtual card", body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card." },
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
      <div style={{ position: "absolute", top: 0, left: 0, width: NATURAL_W, transformOrigin: "top left", transform: `scale(${scale})`, fontFamily: "system-ui, sans-serif", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", minHeight: `${100 / scale}%` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 36, paddingBottom: 16, paddingLeft: 20, paddingRight: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#000", display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7" /></svg>
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>Choose a card type</span>
          <div style={{ width: 30 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 24, paddingBottom: 8, paddingLeft: 28, paddingRight: 28 }}>
          <div style={{ width: "100%", maxWidth: 340, aspectRatio: "1.586 / 1", borderRadius: 22, backgroundColor: "#141414", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.28)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)", borderRadius: 22 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-46%, -50%)", fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.045)", lineHeight: 1, userSelect: "none" }}>P</div>
            <div style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap" }}>CARD HOLDER</div>
            <div style={{ position: "absolute", right: 22, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", color: "rgba(255,255,255,0.82)", fontSize: 10, fontWeight: 600, letterSpacing: 3.5, whiteSpace: "nowrap" }}>VIRTUAL</div>
            <div style={{ position: "absolute", bottom: 20, left: 22, right: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <MastercardLogo />
              <PayvoraCardLogo />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, paddingTop: 28, paddingLeft: 24, paddingRight: 24 }}>
          <button onClick={() => setSelected("virtual")} style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 18, paddingRight: 18, paddingTop: 11, paddingBottom: 11, borderRadius: 50, border: "none", cursor: "pointer", backgroundColor: selected === "virtual" ? "#000" : "#F0F0F0", color: selected === "virtual" ? "#fff" : "#333", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Virtual</button>
          <button onClick={() => setSelected("disposable")} style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 16, paddingRight: 16, paddingTop: 11, paddingBottom: 11, borderRadius: 50, border: selected === "disposable" ? "none" : "1.5px solid #E0E0E0", cursor: "pointer", backgroundColor: selected === "disposable" ? "#000" : "transparent", color: selected === "disposable" ? "#fff" : "#555", fontSize: 14, fontWeight: 500, flex: 1, justifyContent: "center" }}>Disposable virtual</button>
        </div>
        <div style={{ height: 1, backgroundColor: "#F0F0F0", marginTop: 24, marginLeft: 24, marginRight: 24 }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingTop: 20, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: "#F4F4F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 5 }}>{CARD_DESC[selected].title}</p>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 400, color: "#888", lineHeight: 1.5 }}>{CARD_DESC[selected].body}</p>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 40 }} />
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 44, paddingTop: 16 }}>
          <button style={{ width: "100%", paddingTop: 17, paddingBottom: 17, borderRadius: 50, border: "none", backgroundColor: "#000", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Get virtual card</button>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onCardPress }: { active: "home" | "card" | "history"; onCardPress: () => void }) {
  return (
    <div style={{ margin: "0 12px 12px", background: "#000", borderRadius: 28, height: 44, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6px", flexShrink: 0 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: active === "home" ? "#3D3585" : "transparent", borderRadius: 12, padding: "4px 10px" }}>
          <IcoHome active={active === "home"} />
        </div>
      </div>
      <button onClick={onCardPress} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>
        <div style={{ background: active === "card" ? "rgba(255,255,255,0.12)" : "transparent", borderRadius: 12, padding: "4px 8px" }}>
          <IcoCard active={active === "card"} />
        </div>
      </button>
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: -2, right: 16, width: 5, height: 5, background: "red", borderRadius: "50%" }} />
        <IcoHistory active={active === "history"} />
      </div>
    </div>
  );
}

function DashboardScreen({ onCardPress }: { onCardPress: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F6FA" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px", background: "#F5F6FA", flexShrink: 0 }}>
        <svg width="16" height="14" viewBox="0 0 20 18" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round"><line x1="0" y1="2" x2="20" y2="2" /><line x1="0" y1="9" x2="20" y2="9" /><line x1="0" y1="16" x2="20" y2="16" /></svg>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#111", textTransform: "uppercase" }}>Payvora.</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
      </div>
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 16, padding: "10px 12px", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#00D9A0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>D</span>
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
      <div style={{ margin: "0 10px 8px", background: "#111", borderRadius: 12, padding: "8px 0", display: "flex", alignItems: "center", flexShrink: 0 }}>
        {[
          { label: "Fund Wallet", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
          { label: "Sell", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
          { label: "Withdraw", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
        ].map(({ label, icon }, i) => (
          <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
            {icon}
            <span style={{ fontSize: 6.5, color: "white", fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 10px 8px", background: "#FFFFFF", borderRadius: 12, padding: "8px 6px", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 4px" }}>
          {FEATURES.map(({ label, bg, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
              <span style={{ fontSize: 5.5, color: "#374151", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "0 10px 8px", borderRadius: 12, background: "linear-gradient(135deg, #FCA5A5 0%, #FECDD3 60%, #FED7AA 100%)", padding: "10px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#B91C1C", marginBottom: 2 }}>50% OFF</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#7F1D1D", marginBottom: 2 }}>Summer special deal</div>
        <div style={{ fontSize: 6.5, color: "#991B1B", lineHeight: 1.4 }}>Get discount for every transaction this weekend</div>
      </div>
      <div style={{ flex: 1 }} />
      <BottomNav active="home" onCardPress={onCardPress} />
    </div>
  );
}

export function Hero() {
  const [screen, setScreen] = useState<"dashboard" | "virtual-card">("dashboard");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(0,217,160,0.4) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,61,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,61,0.15)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-8">
            <Star size={14} fill="currentColor" />
            Nigeria's fastest-growing fintech app
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Your money,{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00D9A0, #00b8ff)" }}>
              supercharged.
            </span>
          </h1>
          <p className="text-lg text-[#8F8FA3] max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
            Trade gift cards for instant cash, pay every bill in seconds, recharge airtime, get a virtual dollar card, and manage your wallet — all in one powerful app.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
            <Link to="/download" className="flex items-center gap-2 px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] text-base font-bold rounded-2xl hover:bg-[#00C490] transition-all hover:scale-105">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="flex items-center gap-2 px-8 py-4 bg-[#1C1C2A] text-white text-base font-semibold rounded-2xl border border-[#2A2A3D] hover:border-[#00D9A0] transition-all">
              See All Features
            </Link>
          </div>
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

        <div className="flex-shrink-0 flex justify-center lg:justify-end">
          <div className="relative w-64 h-[540px] xl:w-[300px] xl:h-[640px] 2xl:w-[340px] 2xl:h-[730px]">
            <div className="absolute inset-0 rounded-[44px] xl:rounded-[52px] bg-[#1C1C2A] border-4 border-[#2A2A3D] shadow-2xl overflow-hidden">
              <div className="absolute inset-[3px] rounded-[40px] xl:rounded-[48px] overflow-hidden" style={{ background: "#F5F6FA" }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1C1C2A] rounded-full z-10" />
                {screen === "dashboard"
                  ? <DashboardScreen onCardPress={() => setScreen("virtual-card")} />
                  : <ChooseCardScreen onBack={() => setScreen("dashboard")} />
                }
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 xl:w-52 h-12 xl:h-16 opacity-50 blur-2xl" style={{ background: "radial-gradient(ellipse, #00D9A0, transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

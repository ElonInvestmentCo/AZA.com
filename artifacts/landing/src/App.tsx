import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const NAV_LINKS = ["Features", "How it Works", "App"];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#0B0A0A", minHeight: "100vh", color: "#fff" }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw",
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(11,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
          PayVora<span style={{ color: "#35C2C1" }}>.</span>
        </span>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.7)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >{l}</a>
          ))}
          <a href="#app" style={{
            background: "#35C2C1", color: "#0B0A0A", fontWeight: 700,
            fontSize: 14, padding: "10px 22px", borderRadius: 50,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Get the App</a>
        </div>

        <button onClick={() => setMenuOpen(o => !o)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
          className="hamburger">
          <div style={{ width: 24, height: 2, background: "#fff", marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 18, height: 2, background: "#fff", marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, zIndex: 99,
          background: "rgba(11,10,10,0.97)", backdropFilter: "blur(20px)",
          padding: "20px 5vw 28px",
          display: "flex", flexDirection: "column", gap: 24,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}
            >{l}</a>
          ))}
          <a href="#app" onClick={() => setMenuOpen(false)} style={{
            background: "#35C2C1", color: "#0B0A0A", fontWeight: 700,
            fontSize: 15, padding: "13px 24px", borderRadius: 50, textAlign: "center",
          }}>Get the App</a>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "100px 5vw 60px",
        gap: 60,
      }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "35%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(53,194,193,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(53,194,193,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Left: Text content */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 560 }} className="hero-text">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(53,194,193,0.12)", border: "1px solid rgba(53,194,193,0.25)",
            borderRadius: 50, padding: "7px 18px", marginBottom: 28,
            fontSize: 13, fontWeight: 600, color: "#35C2C1", letterSpacing: "0.02em",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#35C2C1", display: "inline-block" }} />
            Now available on iOS & Android
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 72px)",
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: "-2px", color: "#fff",
            margin: "0 0 24px",
          }}>
            Sell Gift Cards.<br />
            <span style={{ color: "#35C2C1" }}>Pay Bills.</span> Do More.
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.5vw, 20px)", fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, margin: "0 0 44px",
          }}>
            PayVora is the fastest way to trade gift cards, fund your wallet, and pay bills — all in one beautifully simple app.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#app" style={{
              background: "#35C2C1", color: "#0B0A0A", fontWeight: 700,
              fontSize: 16, padding: "16px 36px", borderRadius: 50,
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Download Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#0B0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#features" style={{
              background: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 600,
              fontSize: 16, padding: "16px 36px", borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >See Features</a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, marginTop: 60, flexWrap: "wrap" }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#35C2C1", letterSpacing: "-1px" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Phone mockup with Dashboard */}
        <div className="hero-phone" style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            transform: "scale(0.72)",
            transformOrigin: "top center",
            position: "relative",
          }}>
            {/* Subtle glow behind phone */}
            <div style={{
              position: "absolute", top: "15%", left: "50%",
              transform: "translateX(-50%)",
              width: 300, height: 600,
              background: "radial-gradient(ellipse, rgba(53,194,193,0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Dashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "100px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#35C2C1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            Everything you need
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15 }}>
            One app, infinite possibilities
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24, maxWidth: 1200, margin: "0 auto",
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "32px 28px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(53,194,193,0.35)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "rgba(53,194,193,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20, fontSize: 24,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: "100px 5vw", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#35C2C1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            Simple & fast
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-1px" }}>
            How PayVora works
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32, maxWidth: 1000, margin: "0 auto",
        }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ textAlign: "center" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "linear-gradient(135deg, #35C2C1, #22A8A7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 22, fontWeight: 800, color: "#0B0A0A",
              }}>{i + 1}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dashboard Showcase ── */}
      <section id="app" style={{
        padding: "100px 5vw 120px",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(53,194,193,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <p style={{ fontSize: 13, fontWeight: 700, color: "#35C2C1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
          Live App Preview
        </p>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800,
          letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
          textAlign: "center", position: "relative",
        }}>
          Your wallet, your rules
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto 60px", lineHeight: 1.65, textAlign: "center", position: "relative" }}>
          Everything you need to trade cards and manage money — in one clean, fast interface.
        </p>

        {/* Dashboard centered, full-size */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            position: "absolute", top: "20%", left: "50%",
            transform: "translateX(-50%)",
            width: 350, height: 600,
            background: "radial-gradient(ellipse, rgba(53,194,193,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Dashboard />
          </div>
        </div>

        {/* Download buttons below */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 60, position: "relative" }}>
          <StoreButton store="apple" />
          <StoreButton store="google" />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "40px 5vw",
        display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
        gap: 16,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>PayVora<span style={{ color: "#35C2C1" }}>.</span></span>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} PayVora. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 28 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .hero-phone { display: none !important; }
          .hero-text { max-width: 100% !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .hero-phone div[style*="scale(0.72)"] {
            transform: scale(0.56) !important;
          }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function StoreButton({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <a href="#" style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      background: isApple ? "#fff" : "#35C2C1",
      color: "#0B0A0A",
      borderRadius: 16, padding: "14px 28px",
      fontWeight: 700, fontSize: 16,
      transition: "opacity 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {isApple ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.18 23.76a2.5 2.5 0 0 0 2.73-.27l.07-.06L16.76 12 6 1.56l-.07-.06A2.5 2.5 0 0 0 2 3.5v17a2.5 2.5 0 0 0 1.18 2.26zM19.84 10.44l-2.51-1.44-3.17 3 3.17 3 2.54-1.46a2.5 2.5 0 0 0 0-4.1zM5.93 2.56L16.1 12l-3.46 3.27-6.7-12.71z"/>
        </svg>
      )}
      {isApple ? "App Store" : "Google Play"}
    </a>
  );
}

const FEATURES = [
  { icon: "🎁", title: "Sell Gift Cards", desc: "Trade Amazon, iTunes, Steam and 50+ gift card brands instantly at the best rates." },
  { icon: "💳", title: "Fund Your Wallet", desc: "Top up your PayVora wallet via bank transfer and manage your balance with ease." },
  { icon: "⚡", title: "Pay Bills", desc: "Airtime, data, electricity, cable TV — pay any bill in seconds from one place." },
  { icon: "📊", title: "Track Transactions", desc: "Full history of every trade, deposit, and payment with detailed receipts." },
  { icon: "🔒", title: "Bank-level Security", desc: "Your funds are protected with end-to-end encryption and two-factor authentication." },
  { icon: "🌍", title: "Multiple Countries", desc: "Support for gift cards from the US, UK, Canada, Australia and more." },
];

const STEPS = [
  { title: "Create Account", desc: "Sign up in under 2 minutes with just your email address." },
  { title: "Upload Your Card", desc: "Select your gift card brand, enter the details, and submit." },
  { title: "Get Paid Instantly", desc: "Funds hit your PayVora wallet the moment your card is verified." },
  { title: "Spend or Withdraw", desc: "Pay bills directly or withdraw to your bank account anytime." },
];

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "₦2B+", label: "Cards Traded" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 5min", label: "Avg Payout" },
];

import { useState } from "react";

function ArrowLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function DisposableCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M6 15h2M10 15h2" strokeDasharray="2 2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
      <div style={{ position: "relative", width: 46, height: 28 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#EB001B",
            opacity: 0.95,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#F79E1B",
            opacity: 0.92,
          }}
        />
      </div>
      <span
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 9,
          letterSpacing: 0.3,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 400,
          marginTop: 1,
        }}
      >
        mastercard
        <span style={{ fontSize: 7, position: "relative", top: -4 }}>®</span>
      </span>
    </div>
  );
}

function PayvoraCardLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1,
            }}
          >
            P
          </span>
        </div>
      </div>
      <span
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 9,
          letterSpacing: 2.5,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 600,
        }}
      >
        PAYVORA
      </span>
    </div>
  );
}

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

export default function VirtualCardScreen() {
  const [selected, setSelected] = useState<CardType>("virtual");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F2F2F7",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 56,
            paddingBottom: 16,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: "#FFFFFF",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#000",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft />
          </button>
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#000000",
              letterSpacing: -0.2,
            }}
          >
            Choose a card type
          </span>
          <div style={{ width: 30 }} />
        </div>

        {/* Card container with shadow */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 24,
            paddingBottom: 8,
            paddingLeft: 28,
            paddingRight: 28,
          }}
        >
          {/* The Credit Card */}
          <div
            style={{
              width: "100%",
              maxWidth: 340,
              aspectRatio: "1.586 / 1",
              borderRadius: 22,
              backgroundColor: "#141414",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18)",
              flexShrink: 0,
            }}
          >
            {/* Subtle card texture gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)",
                borderRadius: 22,
                pointerEvents: "none",
              }}
            />

            {/* Large watermark "P" */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-46%, -50%)",
                fontSize: 160,
                fontWeight: 900,
                color: "rgba(255,255,255,0.045)",
                lineHeight: 1,
                fontFamily: "system-ui, -apple-system, sans-serif",
                userSelect: "none",
                pointerEvents: "none",
                letterSpacing: -8,
              }}
            >
              P
            </div>

            {/* CARD HOLDER — vertical left */}
            <div
              style={{
                position: "absolute",
                left: 22,
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                transformOrigin: "center center",
                color: "rgba(255,255,255,0.82)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 3.5,
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              CARD HOLDER
            </div>

            {/* VIRTUAL — vertical right */}
            <div
              style={{
                position: "absolute",
                right: 22,
                top: "50%",
                transform: "translateY(-50%) rotate(90deg)",
                transformOrigin: "center center",
                color: "rgba(255,255,255,0.82)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 3.5,
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              VIRTUAL
            </div>

            {/* Bottom row: Mastercard + Payvora */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 22,
                right: 22,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <MastercardLogo />
              <PayvoraCardLogo />
            </div>
          </div>
        </div>

        {/* Toggle row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            paddingTop: 28,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          {/* Virtual button */}
          <button
            onClick={() => setSelected("virtual")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              paddingLeft: 18,
              paddingRight: 18,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selected === "virtual" ? "#000000" : "#F0F0F0",
              color: selected === "virtual" ? "#FFFFFF" : "#333333",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.1,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ opacity: selected === "virtual" ? 1 : 0.6 }}>
              <CardIcon />
            </span>
            Virtual
          </button>

          {/* Disposable virtual button */}
          <button
            onClick={() => setSelected("disposable")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: 50,
              border: selected === "disposable" ? "none" : "1.5px solid #E0E0E0",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selected === "disposable" ? "#000000" : "transparent",
              color: selected === "disposable" ? "#FFFFFF" : "#555555",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: -0.1,
              whiteSpace: "nowrap",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <span style={{ opacity: selected === "disposable" ? 1 : 0.55 }}>
              <DisposableCardIcon />
            </span>
            Disposable virtual
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "#F0F0F0", marginTop: 24, marginLeft: 24, marginRight: 24 }} />

        {/* Description row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            paddingTop: 20,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          {/* Shield icon circle */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              backgroundColor: "#F4F4F4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldIcon />
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "#000000",
                letterSpacing: -0.2,
                marginBottom: 5,
              }}
            >
              {DESCRIPTIONS[selected].title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 400,
                color: "#888888",
                lineHeight: 1.5,
                letterSpacing: -0.1,
              }}
            >
              {DESCRIPTIONS[selected].body}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA Button */}
        <div
          style={{
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 44,
            paddingTop: 16,
          }}
        >
          <button
            style={{
              width: "100%",
              paddingTop: 17,
              paddingBottom: 17,
              borderRadius: 50,
              border: "none",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: -0.2,
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get virtual card
          </button>
        </div>
      </div>
    </div>
  );
}

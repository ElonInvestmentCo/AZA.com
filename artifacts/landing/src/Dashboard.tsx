import React, { useState } from "react";

const TEAL = "#35C2C1";

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  );
}

function GiftCardIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v10H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function SettingsIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" />
      <circle cx="7" cy="6" r="2" fill={color} stroke="none" />
      <circle cx="18" cy="12" r="2" fill={color} stroke="none" />
      <circle cx="11" cy="18" r="2" fill={color} stroke="none" />
    </svg>
  );
}

function ElectricityIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CableTVIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function RatesIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function TransactionIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function BetIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function MoreIcon({ color = "#1C1C1C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function HomeNavIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={active ? "#fff" : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="9 22 9 12 15 12 15 22" stroke={active ? "#fff" : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardNavIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={active ? "#6B21A8" : "rgba(255,255,255,0.7)"} strokeWidth="2" />
      <line x1="2" y1="10" x2="22" y2="10" stroke={active ? "#6B21A8" : "rgba(255,255,255,0.7)"} strokeWidth="2" />
      <line x1="12" y1="6" x2="12" y2="20" stroke={active ? "#6B21A8" : "rgba(255,255,255,0.7)"} strokeWidth="2" />
      <line x1="6" y1="13" x2="10" y2="13" stroke={active ? "#6B21A8" : "rgba(255,255,255,0.7)"} strokeWidth="2" />
    </svg>
  );
}

function HistoryNavIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="3 3 3 8 8 8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="7" x2="12" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="12" x2="16" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DepositIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2L5 14h14L12 2zm0 4l3.5 6h-7L12 6z" fill="#1C1B1F" />
    </svg>
  );
}

function WithdrawsIcon() {
  return (
    <div style={{
      width: 25, height: 25,
      background: "#EEFFFE",
      borderRadius: 3,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <line x1="12" y1="22" x2="12" y2="7" />
      </svg>
    </div>
  );
}

/* ── Avatar SVG ─────────────────────────────────────────────────────────────── */
function AvatarSVG() {
  return (
    <div style={{
      width: 46, height: 44,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #87CEEB 0%, #A8D5E8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
      border: "2px solid #E5E7EB",
    }}>
      <svg width="46" height="44" viewBox="0 0 46 44" fill="none">
        {/* sky background */}
        <rect width="46" height="44" fill="#A8D8EA" />
        {/* body yellow shirt */}
        <ellipse cx="23" cy="38" rx="12" ry="10" fill="#F5C518" />
        {/* neck */}
        <rect x="20" y="26" width="6" height="8" fill="#5C3D2E" />
        {/* head */}
        <ellipse cx="23" cy="22" rx="9" ry="10" fill="#5C3D2E" />
        {/* pink headscarf */}
        <ellipse cx="23" cy="15" rx="10" ry="6" fill="#F472B6" />
        <path d="M13 16 Q14 8 23 12 Q32 8 33 16" fill="#EC4899" />
        {/* knot at top */}
        <ellipse cx="23" cy="10" rx="4" ry="3" fill="#F472B6" />
        {/* eyes */}
        <circle cx="19.5" cy="22" r="1.5" fill="#1C1C1C" />
        <circle cx="26.5" cy="22" r="1.5" fill="#1C1C1C" />
        {/* blue headphones */}
        <path d="M14 20 Q14 12 23 12 Q32 12 32 20" stroke="#1E40AF" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="12" y="19" width="4" height="6" rx="2" fill="#1E40AF" />
        <rect x="30" y="19" width="4" height="6" rx="2" fill="#1E40AF" />
        {/* grab handle suggestion */}
        <line x1="38" y1="8" x2="38" y2="20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        <rect x="35" y="6" width="6" height="3" rx="1.5" fill="#9CA3AF" />
      </svg>
    </div>
  );
}

/* ── Service Grid Item ──────────────────────────────────────────────────────── */
function ServiceItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 5, cursor: "pointer",
    }}>
      <div style={{
        width: 44, height: 44,
        background: "#F9FAFB",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "Roboto, sans-serif",
        fontSize: 10.5, fontWeight: 500,
        color: "#595F67", textAlign: "center",
        lineHeight: 1.3,
      }}>{label}</span>
    </div>
  );
}

/* ── Main Dashboard Component ──────────────────────────────────────────────── */
export default function Dashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div style={{
      width: 393,
      height: 852,
      background: "#FFFFFF",
      borderRadius: 40,
      position: "relative",
      overflow: "hidden",
      fontFamily: "Roboto, sans-serif",
      flexShrink: 0,
      boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 0 0 10px #1a1a1a, 0 0 0 12px #333",
    }}>

      {/* ── Status Bar ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 44,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px 0 20px",
        zIndex: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0B0A0A", fontFamily: "Roboto, sans-serif" }}>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {/* Signal */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#0B0A0A" />
            <rect x="4" y="5" width="3" height="7" rx="0.5" fill="#0B0A0A" />
            <rect x="8" y="2" width="3" height="10" rx="0.5" fill="#0B0A0A" />
            <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#0B0A0A" />
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
            <path d="M1 6C5.5 1.5 18.5 1.5 23 6" stroke="#0B0A0A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M4.5 10C7.5 7 16.5 7 19.5 10" stroke="#0B0A0A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8.5 14C10 12.5 14 12.5 15.5 14" stroke="#0B0A0A" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.5" fill="#0B0A0A" />
          </svg>
          {/* Battery */}
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="#0B0A0A" strokeWidth="1" />
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="#0B0A0A" />
            <path d="M19.5 4v4" stroke="#0B0A0A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Top Bar: PayVora Title ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "Roboto, sans-serif", fontWeight: 800,
          fontSize: 20, color: "#0B0A0A", letterSpacing: "0.5px",
        }}>PayVora</span>
      </div>

      {/* ── Greeting Row ───────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 88, left: 22, right: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Left: Avatar + Text */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AvatarSVG />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{
              fontFamily: "Roboto, sans-serif", fontWeight: 700,
              fontSize: 15.75, lineHeight: "120%", color: "#1C1C1C",
            }}>Hi, Dove</span>
            <span style={{
              fontFamily: "Roboto, sans-serif", fontWeight: 400,
              fontSize: 12.6, lineHeight: "150%", color: "#595F67",
            }}>Your available balance</span>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600,
              fontSize: 18.9, lineHeight: "120%", color: "#0B0A0A",
            }}>
              {balanceVisible ? "₦200,590.00" : "₦••••••••"}
            </span>
          </div>
        </div>

        {/* Right: Eye icon */}
        <button
          onClick={() => setBalanceVisible(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <EyeOffIcon />
        </button>
      </div>

      {/* ── Main Action Bar ─────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 172, left: 21,
        width: 351, height: 61,
        background: "#000000",
        borderRadius: 5,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12.6px 11.8px",
      }}>
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "center", alignItems: "center",
          gap: 0, width: "100%",
        }}>
          {/* Fund Wallet */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, cursor: "pointer",
          }}>
            <PlusCircleIcon />
            <span style={{
              fontFamily: "Roboto, sans-serif", fontWeight: 700,
              fontSize: 9.45, lineHeight: "150%", color: "#FFFFFF",
              textAlign: "center",
            }}>Fund Wallet</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.15)" }} />

          {/* Sell */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, cursor: "pointer",
          }}>
            <SendIcon />
            <span style={{
              fontFamily: "Roboto, sans-serif", fontWeight: 700,
              fontSize: 9.45, lineHeight: "150%", color: "#FFFFFF",
              textAlign: "center",
            }}>Sell</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.15)" }} />

          {/* Withdraw */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, cursor: "pointer",
          }}>
            <WithdrawIcon />
            <span style={{
              fontFamily: "Roboto, sans-serif", fontWeight: 700,
              fontSize: 9.45, lineHeight: "150%", color: "#FFFFFF",
              textAlign: "center",
            }}>Withdraw</span>
          </div>
        </div>
      </div>

      {/* ── Light separator band ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 246, left: 0, right: 0, height: 16,
        background: "#F3F4F6",
      }} />

      {/* ── Services Grid ───────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 262, left: 22, right: 22,
      }}>
        {/* Row 1 */}
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between", marginBottom: 18,
        }}>
          <ServiceItem icon={<GiftCardIcon />} label="Gift Card" />
          <ServiceItem icon={<SettingsIcon />} label="Settings" />
          <ServiceItem icon={<ElectricityIcon />} label="Electricity" />
          <ServiceItem icon={<CableTVIcon />} label="Cable TV" />
        </div>
        {/* Row 2 */}
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between",
        }}>
          <ServiceItem icon={<RatesIcon />} label="Rates" />
          <ServiceItem icon={<TransactionIcon />} label="Transaction" />
          <ServiceItem icon={<BetIcon />} label="Bet Funding" />
          <ServiceItem icon={<MoreIcon />} label="More" />
        </div>
      </div>

      {/* ── Light separator band ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 388, left: 0, right: 0, height: 16,
        background: "#F3F4F6",
      }} />

      {/* ── Promo Banners ───────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 404, left: 0, right: 0,
        display: "flex", flexDirection: "row", gap: 10,
        overflowX: "auto", paddingLeft: 21, paddingRight: 21,
        scrollbarWidth: "none",
      }}>
        {/* Pink card */}
        <div style={{
          minWidth: 221, height: 98,
          background: "#FCB3C5",
          borderRadius: 3.15,
          padding: "14px 16px",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 800,
            fontSize: 18, color: "#0B0A0A", lineHeight: "120%", marginBottom: 2,
          }}>50% OFF</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 700,
            fontSize: 12.6, color: "#0B0A0A", marginBottom: 6,
          }}>Summer special deal</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 400,
            fontSize: 10.5, color: "rgba(11,10,10,0.75)", lineHeight: "150%",
          }}>Get discount for every<br />transaction this weekend</div>
        </div>

        {/* Yellow card */}
        <div style={{
          minWidth: 221, height: 98,
          background: "#FFF2CF",
          borderRadius: 3.15,
          padding: "14px 16px",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 800,
            fontSize: 18, color: "#0B0A0A", lineHeight: "120%", marginBottom: 2,
          }}>50% OFF</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 700,
            fontSize: 12.6, color: "#0B0A0A", marginBottom: 6,
          }}>Black friday deal</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 400,
            fontSize: 10.5, color: "rgba(11,10,10,0.75)", lineHeight: "150%",
          }}>Get discount for every<br />up and payment</div>
        </div>

        {/* Blue card (partially visible) */}
        <div style={{
          minWidth: 221, height: 98,
          background: "#D6E1FF",
          borderRadius: 3.15,
          padding: "14px 16px",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 800,
            fontSize: 18, color: "#0B0A0A", lineHeight: "120%", marginBottom: 2,
          }}>30% OFF</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 700,
            fontSize: 12.6, color: "#0B0A0A", marginBottom: 6,
          }}>Festive season deal</div>
          <div style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 400,
            fontSize: 10.5, color: "rgba(11,10,10,0.75)", lineHeight: "150%",
          }}>Limited time offer<br />on all gift cards</div>
        </div>
      </div>

      {/* ── Recent Transaction ──────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 518, left: 21, right: 21,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between", alignItems: "center",
          marginBottom: 12.6,
        }}>
          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600,
            fontSize: 18.9, lineHeight: "120%", color: "#0B0A0A",
          }}>Recent Transaction</span>
          <span style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 600,
            fontSize: 12.6, lineHeight: "150%", color: "#000000",
            cursor: "pointer",
          }}>See All</span>
        </div>

        {/* Transaction 1: Deposit Giftcard */}
        <div style={{
          width: "100%", height: 48.6,
          background: "#FFFFFF",
          borderRadius: 3.15,
          display: "flex", flexDirection: "row",
          alignItems: "center",
          padding: "6.3px 12.6px",
          justifyContent: "space-between",
          marginBottom: 6,
        }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12.6 }}>
            <DepositIcon />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{
                fontFamily: "Roboto, sans-serif", fontWeight: 600,
                fontSize: 12.6, lineHeight: "150%", color: "#595F67",
              }}>Deposit Giftcard</span>
              <span style={{
                fontFamily: "Roboto, sans-serif", fontWeight: 500,
                fontSize: 11, lineHeight: "150%", color: "#AAAFB5",
              }}>February 24,2022</span>
            </div>
          </div>
          <span style={{
            fontFamily: "Roboto, sans-serif", fontWeight: 800,
            fontSize: 12.6, lineHeight: "150%", color: "#00B03C",
            textAlign: "right",
          }}>₦200,40.00</span>
        </div>

        {/* Transaction 2: Withdraws */}
        <div style={{
          width: "100%", height: 48.6,
          background: "#FFFFFF",
          borderRadius: 3.15,
          display: "flex", flexDirection: "row",
          alignItems: "center",
          padding: "6.3px 12.6px",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12.6 }}>
            <WithdrawsIcon />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{
                fontFamily: "Manrope, sans-serif", fontWeight: 600,
                fontSize: 12.6, lineHeight: "150%", color: "#595F67",
              }}>Withdraws</span>
              <span style={{
                fontFamily: "Manrope, sans-serif", fontWeight: 500,
                fontSize: 11, lineHeight: "150%", color: "#AAAFB5",
              }}>February 24,2022</span>
            </div>
          </div>
          <span style={{
            fontFamily: "Manrope, sans-serif", fontWeight: 800,
            fontSize: 12.6, lineHeight: "150%", color: "#F44336",
            textAlign: "right",
          }}>₦400,000.00</span>
        </div>
      </div>

      {/* ── Bottom Navigation Bar ───────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 20, left: 21, right: 21,
        height: 53,
        background: "#000000",
        borderRadius: 26.5,
        display: "flex", flexDirection: "row",
        alignItems: "center", justifyContent: "space-around",
        padding: "0 16px",
      }}>
        {/* Home */}
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HomeNavIcon />
        </div>

        {/* Card (active) */}
        <div style={{
          background: "#E8DEF8",
          borderRadius: 16,
          width: 64, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#6B21A8" strokeWidth="2" />
            <line x1="2" y1="10" x2="22" y2="10" stroke="#6B21A8" strokeWidth="2" />
            <line x1="12" y1="5" x2="12" y2="19" stroke="#6B21A8" strokeWidth="2" />
            <line x1="6.5" y1="13.5" x2="9.5" y2="13.5" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* History with red dot */}
        <div style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <HistoryNavIcon />
          <div style={{
            position: "absolute", top: -2, right: -2,
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#FF0000",
          }} />
        </div>
      </div>
    </div>
  );
}

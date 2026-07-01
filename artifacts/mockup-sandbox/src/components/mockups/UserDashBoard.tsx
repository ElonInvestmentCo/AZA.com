import { useState } from "react";
import avatarImg from "@/assets/avatar_3d_16.png";

function EyeOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke="#0D0D0D"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#0D0D0D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="#0D0D0D"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#0D0D0D" strokeWidth="1.8" />
    </svg>
  );
}

function GiftCardIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C5.9 0 5 .9 5 2H2C.9 2 0 2.9 0 4v7c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V4c0-1.1-.9-2-2-2H9C9 .9 8.1 0 7 0zm0 1.5c.3 0 .5.2.5.5S7.3 2.5 7 2.5 6.5 2.3 6.5 2s.2-.5.5-.5zm-6 3h12v1.5H6.25V11H7.75V6H13V11H1V4.5zm5.25 0v.75h1.5V4.5h-1.5z"
        fill="#1C1B1F"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="10.5" r="6.3" stroke="#020202" strokeWidth="1.4" />
      <circle cx="10.5" cy="10.5" r="2.1" fill="#020202" />
    </svg>
  );
}

function ThunderIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <polygon points="11,2 4,11 9,11 8,17 15,8 10,8" fill="#FFF2CF" />
      <path d="M11 2L4 11h5l-1 6 7-9h-5l1-6z" stroke="#0B0A0A" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="2.36" y="6.3" width="14.18" height="8.66" fill="#FCB3C5" />
      <path d="M1.58 5.52h15.75v10.24H1.58V5.52zm1.57 1.58v7.09h12.6V7.1H3.15zM6.3 3.94l2.36 2.36m4.73-2.36L11.03 5.7M7.09 15.76v1.57h5.51v-1.57H7.09z" fill="black" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 14V9h2.5v5H0zm4 0V5h2.5v9H4zm4 0V0h2.5v14H8zm4 0V7h2.5v7H12z" fill="#0C0C0C" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0h13v1.58H0V0zm0 4.21h13v1.58H0V4.21zm0 4.21h13V10H0V8.42z" fill="#0B0A0A" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="3.02" y="3.94" width="13.39" height="13.39" fill="#BCE2FE" />
      <path d="M1.58 2.36h15.75v15.75H1.58V2.36zm1.57 1.58v12.6h12.6V3.94H3.15zm4.72 2.36a2.36 2.36 0 1 0 4.72 0 2.36 2.36 0 0 0-4.72 0zM2.36 13.39h14.18v1.57H2.36v-1.57z" fill="black" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="3.15" y="3.94" width="13.39" height="13.39" fill="#D6E1FF" />
      <path d="M1.58 2.36h15.75v15.75H1.58V2.36zm1.57 1.58v12.6h12.6V3.94H3.15zm5.51 0v5.51H3.15V3.94h5.51zm6.3 0v5.51H9.45V3.94h5.51zM3.15 9.45h5.51v5.51H3.15V9.45zm6.3 0h5.51v5.51H9.45V9.45z" fill="black" />
    </svg>
  );
}

function FundIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.45" cy="9.45" r="8.66" stroke="white" strokeWidth="1.58" />
      <path d="M9.45 5.51v7.88M5.51 9.45h7.88" stroke="white" strokeWidth="1.58" strokeLinecap="round" />
    </svg>
  );
}

function SellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M16.54 2.36 8.66 10.24M10.24 2.36h6.3v6.3M7.88 4.72H2.36v12.6h12.6V11.8" stroke="white" strokeWidth="1.58" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg width="17" height="16" viewBox="0 0 17.33 15.75" fill="none">
      <path d="M1.58 1.58h14.17v9.45H1.58V1.58zm2.36 11.02h9.45m-4.72 0v2.36M5.51 6.3a2.36 2.36 0 1 0 4.72 0 2.36 2.36 0 0 0-4.72 0z" stroke="white" strokeWidth="1.58" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeNavIcon({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path d="M1 6.5L8 1l7 5.5V17H11v-5H5v5H1V6.5z" fill={active ? "white" : "none"} stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function CardNavIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="17" viewBox="0 0 21.6 16.8" fill="none">
      <rect x="1" y="1" width="19.6" height="14.8" rx="2" stroke={active ? "white" : "#1C1B1F"} strokeWidth="1.6" />
      <path d="M1 5.4h19.6M5.4 10.8h4.8" stroke={active ? "white" : "#1C1B1F"} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HistoryNavIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16.8 16.8" fill="none">
      <path d="M8.4 16.8A8.4 8.4 0 1 0 8.4 0a8.4 8.4 0 0 0 0 16.8z" stroke="white" strokeWidth="1.6" />
      <path d="M8.4 4.2v4.2l2.8 2.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
}

const ROW1: QuickAction[] = [
  { label: "Gift Card",    icon: <GiftCardIcon /> },
  { label: "Settings",    icon: <SettingsIcon /> },
  { label: "Electricity", icon: <ThunderIcon /> },
  { label: "Cable TV",    icon: <TvIcon /> },
];

const ROW2: QuickAction[] = [
  { label: "Rates",       icon: <BarChartIcon /> },
  { label: "Transaction", icon: <ListIcon /> },
  { label: "Bet Funding", icon: <MoneyIcon /> },
  { label: "More",        icon: <GridIcon /> },
];

export default function UserDashBoard() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F2F2F2",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 388,
          minHeight: "100vh",
          background: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Status bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            paddingBottom: 6,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <span style={{ fontSize: 8.68, fontWeight: 600, color: "#0B0B0B", letterSpacing: -0.22 }}>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="3" width="3" height="9" rx="0.5" fill="#0B0B0B" />
              <rect x="4.5" y="2" width="3" height="10" rx="0.5" fill="#0B0B0B" />
              <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" fill="#0B0B0B" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5C10.2 2.5 12.2 3.4 13.7 4.9L15 3.6C13.2 1.8 10.7 0.7 8 0.7S2.8 1.8 1 3.6l1.3 1.3C3.8 3.4 5.8 2.5 8 2.5z" fill="#0B0B0B" />
              <path d="M8 5.3c1.5 0 2.8.6 3.8 1.6L13 5.7C11.7 4.4 9.9 3.6 8 3.6S4.3 4.4 3 5.7l1.2 1.2C5.2 5.9 6.5 5.3 8 5.3z" fill="#0B0B0B" />
              <circle cx="8" cy="9.5" r="1.5" fill="#0B0B0B" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="#0B0B0B" strokeOpacity="0.35" />
              <rect x="1.5" y="1.5" width="18" height="9" rx="1.5" fill="#0B0B0B" />
              <path d="M23 4v4a2 2 0 0 0 0-4z" fill="#0B0B0B" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── Brand name ── */}
        <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 4 }}>
          <span
            style={{
              fontSize: 18.902,
              fontWeight: 400,
              color: "#000",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "'Georgia', serif",
            }}
          >
            aza
          </span>
        </div>

        {/* ══════════════════════════════════════════════════
            GREETING / BALANCE ROW — FIGMA EXACT
            No card, no container, no border, no shadow.
            Pure white background (#FFFFFF).
        ══════════════════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 0,
            gap: 10,
            marginLeft: 22,
            marginRight: 22,
            marginTop: 12,
            height: 44,
          }}
        >
          {/* Avatar — 46×44 */}
          <div style={{ width: 46, height: 44, flexShrink: 0, position: "relative", overflow: "hidden" }}>
            <img
              src={avatarImg}
              alt="User avatar"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Text stack — Hi, Dove + Your available balance */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1.58,
              flexShrink: 0,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'Roboto', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 15.7516,
                lineHeight: "120%",
                color: "#1C1C1C",
                whiteSpace: "nowrap",
              }}
            >
              Hi, Dove
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Roboto', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: 12.6013,
                lineHeight: "150%",
                color: "#595F67",
                whiteSpace: "nowrap",
              }}
            >
              Your available balance
            </p>
          </div>

          {/* Spacer — pushes balance + eye to the right */}
          <div style={{ flex: 1 }} />

          {/* Balance amount */}
          <p
            style={{
              margin: 0,
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 18.902,
              lineHeight: "120%",
              color: "#0B0A0A",
              whiteSpace: "nowrap",
            }}
          >
            {balanceVisible ? "₦200,590.00" : "••••••••"}
          </p>

          {/* Eye icon — far right, vertically centered */}
          <button
            onClick={() => setBalanceVisible((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label={balanceVisible ? "Hide balance" : "Show balance"}
          >
            {balanceVisible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>

        {/* ── Main Action bar ── */}
        <div
          style={{
            margin: "18px 22px 0",
            background: "#000",
            borderRadius: 5,
            padding: "12px 12px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {[
            { label: "Fund Wallet", Icon: FundIcon },
            { label: "Sell",        Icon: SellIcon },
            { label: "Withdraw",    Icon: WithdrawIcon },
          ].map(({ label, Icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3.94, flex: 1 }}>
              <Icon />
              <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 9.451, color: "#FFFFFF", lineHeight: "150%" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Quick-action grid ── */}
        {[ROW1, ROW2].map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "0 12.6px",
              marginTop: ri === 0 ? 28 : 18,
            }}
          >
            {row.map(({ label, icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3.15,
                  width: 56.706,
                }}
              >
                <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icon}
                </div>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 9.451, color: "#595F67", lineHeight: "150%", textAlign: "center", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* ── Promo banners ── */}
        <div style={{ display: "flex", gap: 6.3, overflowX: "auto", padding: "24px 22px 0", scrollbarWidth: "none" }}>
          {[
            { pct: "50% OFF", title: "Summer special deal", desc: "Get discount for every transaction this weekend", bg: "#FCB3C5" },
            { pct: "50% OFF", title: "Black friday deal",   desc: "Get discount for every sign up and payment",     bg: "#FFF2CF" },
          ].map(({ pct, title, desc, bg }) => (
            <div
              key={pct + title}
              style={{
                flexShrink: 0,
                width: 263.84,
                height: 97.66,
                background: bg,
                borderRadius: 3.15,
                padding: "12.6px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 15.752, color: "#0B0A0A", lineHeight: "120%", marginBottom: 2 }}>{pct}</div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 12.601, color: "#0B0A0A", lineHeight: "150%" }}>{title}</div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 9.451, color: "#595F67", lineHeight: "150%", width: 114, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* ── Recent Transaction ── */}
        <div style={{ padding: "24px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12.601 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 18.902, color: "#0B0A0A", lineHeight: "120%" }}>Recent Transaction</span>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 12.601, color: "#000", lineHeight: "150%" }}>See All</span>
          </div>

          {/* Transaction row 1 */}
          <div style={{ background: "#FFF", borderRadius: 3.15, height: 48.601, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 12.6, paddingRight: 12.6, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12.601 }}>
              <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}><GiftCardIcon /></div>
              <div>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 12.601, color: "#595F67", lineHeight: "150%" }}>Deposit Giftcard</div>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, fontSize: 11.026, color: "#AAAFB5", lineHeight: "150%" }}>February 24,2022</div>
              </div>
            </div>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, fontSize: 12.601, color: "#00B03C", lineHeight: "150%" }}>₦200,40.00</span>
          </div>

          {/* Transaction row 2 */}
          <div style={{ background: "#FFF", borderRadius: 3.15, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 12.6, paddingRight: 12.6, paddingTop: 6.3, paddingBottom: 6.3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12.601 }}>
              <div style={{ width: 25.203, height: 25.203, background: "#EEFFFE", borderRadius: 3.15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7 0L14 7l-7 7-7-7 7-7z" fill="#0B0A0A" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 12.601, color: "#595F67", lineHeight: "150%" }}>Withdraws</div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 11.026, color: "#AAAFB5", lineHeight: "150%" }}>February 24,2022</div>
              </div>
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 12.601, color: "red", lineHeight: "150%" }}>₦400,000.00</span>
          </div>
        </div>

        {/* ── Bottom nav ── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            margin: "24px 22px 16px",
            background: "#000",
            borderRadius: 34,
            height: 53,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 8px",
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px" }}>
            <HomeNavIcon active />
          </div>
          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#E8DEF8", borderRadius: 16, padding: "4px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CardNavIcon />
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px" }}>
            <div style={{ position: "absolute", top: 6, right: 16, width: 6, height: 6, background: "red", borderRadius: "50%" }} />
            <HistoryNavIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

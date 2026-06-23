import { useState } from "react";
import UserDashBoard from "@/imports/UserDashBoard/index";
import GiftCardButton from "@/imports/GiftCardButton/index";
import SellGiftCard from "@/imports/SellGiftCard/index";
import ConfrimTransaction from "@/imports/ConfrimTransaction/index";
import Submited from "@/imports/Submited/index";

type Screen = "dashboard" | "giftcard" | "sell" | "confirm" | "submitted";

const SCREEN_LABELS: Record<Screen, string> = {
  dashboard: "Dashboard",
  giftcard: "Gift Card",
  sell: "Sell Gift Card",
  confirm: "Confirm",
  submitted: "Submitted",
};

const SCREENS: Screen[] = ["dashboard", "giftcard", "sell", "confirm", "submitted"];

export default function App() {
  const [current, setCurrent] = useState<Screen>("dashboard");

  function renderScreen() {
    switch (current) {
      case "dashboard":
        return <UserDashBoard />;
      case "giftcard":
        return <GiftCardButton />;
      case "sell":
        return <SellGiftCard />;
      case "confirm":
        return <ConfrimTransaction />;
      case "submitted":
        return <Submited />;
    }
  }

  const currentIndex = SCREENS.indexOf(current);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4 gap-6">
      {/* Phone frame */}
      <div
        className="relative bg-white overflow-hidden shadow-2xl"
        style={{
          width: 393,
          height: 852,
          borderRadius: 48,
          border: "10px solid #1a1a1a",
          boxShadow: "0 0 0 2px #333, 0 32px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* Side buttons (decorative) */}
        <div
          className="absolute -right-[12px] top-[120px] bg-[#1a1a1a] rounded-r-[4px]"
          style={{ width: 4, height: 64 }}
        />
        <div
          className="absolute -left-[12px] top-[100px] bg-[#1a1a1a] rounded-l-[4px]"
          style={{ width: 4, height: 40 }}
        />
        <div
          className="absolute -left-[12px] top-[155px] bg-[#1a1a1a] rounded-l-[4px]"
          style={{ width: 4, height: 40 }}
        />
        <div
          className="absolute -left-[12px] top-[215px] bg-[#1a1a1a] rounded-l-[4px]"
          style={{ width: 4, height: 60 }}
        />

        {/* Dynamic island */}
        <div
          className="absolute top-[14px] left-1/2 -translate-x-1/2 bg-black z-50"
          style={{ width: 126, height: 37, borderRadius: 20 }}
        />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 38 }}>
          {renderScreen()}
        </div>
      </div>

      {/* Navigation pills */}
      <nav className="flex gap-1 bg-white rounded-full shadow-lg px-2 py-2">
        {SCREENS.map((screen, i) => {
          const isActive = current === screen;
          const isPast = i < currentIndex;
          return (
            <button
              key={screen}
              onClick={() => setCurrent(screen)}
              className={[
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-black text-white shadow"
                  : isPast
                  ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  : "text-gray-400 hover:bg-gray-100",
              ].join(" ")}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {SCREEN_LABELS[screen]}
            </button>
          );
        })}
      </nav>

      {/* Flow arrows */}
      <div className="flex items-center gap-2 text-gray-400 text-xs" style={{ fontFamily: "Manrope, sans-serif" }}>
        {SCREENS.map((screen, i) => (
          <span key={screen} className="flex items-center gap-2">
            <span
              className={current === screen ? "text-black font-semibold" : ""}
            >
              {i + 1}. {SCREEN_LABELS[screen]}
            </span>
            {i < SCREENS.length - 1 && <span>→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

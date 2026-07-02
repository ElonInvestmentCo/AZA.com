import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import RegularCardAsset from "@/imports/Card06/index";
import PremiumCardAsset from "@/imports/Card07/index";

type CardType = "regular" | "premium";

/**
 * Both card assets were authored in Figma as landscape frames.
 * All absolute pixel positions inside them assume this landscape space.
 *
 * To display portrait (PORTRAIT_W × PORTRAIT_H) we:
 *   1. Render the card in its natural landscape box (FRAME_W × FRAME_H).
 *   2. Rotate that box 90° CW around the top-left corner.
 *      The visual footprint becomes PORTRAIT_W × PORTRAIT_H.
 *   3. Scale the portrait result so its width equals `displayW`.
 *   4. Clip with an outer container sized to the final display dimensions.
 */
const FRAME_W = 332; // landscape Figma frame width
const FRAME_H = 210; // landscape Figma frame height
const PORTRAIT_W = FRAME_H; // 210 — portrait width after 90° rotation
const PORTRAIT_H = FRAME_W; // 332 — portrait height after 90° rotation

const CARD_DISPLAY_W = 185; // single card width on screen
const CARD_DISPLAY_H = Math.round(PORTRAIT_H * (CARD_DISPLAY_W / PORTRAIT_W)); // ≈ 292

const cardData: Record<
  CardType,
  { label: string; title: string; description: string; cta: string }
> = {
  regular: {
    label: "Regular",
    title: "Regular Card",
    description:
      "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
    cta: "Get Regular Card",
  },
  premium: {
    label: "Premium",
    title: "Premium Card",
    description:
      "Unlock higher limits, premium benefits, and enhanced features designed for frequent users.",
    cta: "Get Premium Card",
  },
};

/** Renders the imported card asset in portrait orientation at a given display width. */
function PortraitCard({ type }: { type: CardType }) {
  const scale = CARD_DISPLAY_W / PORTRAIT_W; // 185/210 ≈ 0.881

  return (
    // Layer 3 — outer clip: holds the final rendered size
    <div
      style={{
        width: CARD_DISPLAY_W,
        height: CARD_DISPLAY_H,
        overflow: "hidden",
        position: "relative",
        borderRadius: 14,
      }}
    >
      {/* Layer 2 — scale: shrinks portrait (210×332) to displayW×displayH */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: PORTRAIT_W,
          height: PORTRAIT_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Layer 1 — rotate: turns landscape frame (332×210) into portrait (210×332).
            rotate(90deg) around top-left maps (x,y) → (y, FRAME_W − x),
            so the right edge of landscape becomes the top of portrait. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: FRAME_W,
            height: FRAME_H,
            transform: "rotate(90deg)",
            transformOrigin: "top left",
          }}
        >
          {/* Explicit box so size-full on the card root resolves correctly */}
          <div style={{ width: FRAME_W, height: FRAME_H, position: "relative" }}>
            {type === "regular" ? <RegularCardAsset /> : <PremiumCardAsset />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<CardType>("regular");
  const info = cardData[selected];

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-[390px] flex flex-col min-h-screen">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 pt-14 pb-6">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F7FA] active:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
          </button>
          <h1 className="text-[17px] font-semibold text-gray-900 tracking-[-0.3px]">
            Choose a Card Type
          </h1>
          <div className="w-9" />
        </div>

        {/* ── Card showcase ── */}
        <div className="mx-4 rounded-2xl bg-[#F5F7FA] py-8 flex flex-col items-center gap-6">

          {/* Tab switcher */}
          <div className="flex bg-white rounded-full p-1 shadow-sm gap-1">
            {(["regular", "premium"] as CardType[]).map((type) => {
              const active = selected === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelected(type)}
                  className={[
                    "px-6 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200",
                    active
                      ? "bg-[#1A1A2E] text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600",
                  ].join(" ")}
                >
                  {cardData[type].label}
                </button>
              );
            })}
          </div>

          {/* Sliding card track — one card visible at a time */}
          <div
            style={{
              width: CARD_DISPLAY_W,
              height: CARD_DISPLAY_H,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                width: CARD_DISPLAY_W * 2,
                transform:
                  selected === "regular"
                    ? "translateX(0)"
                    : `translateX(-${CARD_DISPLAY_W}px)`,
                transition: "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Regular card slot */}
              <div style={{ width: CARD_DISPLAY_W, flexShrink: 0 }}>
                <PortraitCard type="regular" />
              </div>
              {/* Premium card slot */}
              <div style={{ width: CARD_DISPLAY_W, flexShrink: 0 }}>
                <PortraitCard type="premium" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="px-6 mt-8 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-gray-400 mb-2">
            {selected === "premium" ? "Premium" : "Standard"}
          </p>
          <h2 className="text-[22px] font-bold text-gray-900 tracking-[-0.5px] mb-3">
            {info.title}
          </h2>
          <p className="text-[15px] text-gray-500 leading-[1.65]">
            {info.description}
          </p>
        </div>

        {/* ── CTA button ── */}
        <div className="px-5 pb-12 pt-8">
          <button
            className={[
              "w-full h-14 rounded-full text-white text-[16px] font-semibold tracking-[-0.2px]",
              "transition-all duration-200 active:scale-[0.97]",
              selected === "premium"
                ? "bg-gradient-to-r from-[#5B8DB8] to-[#7FBCD2]"
                : "bg-[#1A1A2E]",
            ].join(" ")}
          >
            {info.cta}
          </button>
        </div>

      </div>
    </div>
  );
}

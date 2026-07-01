"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0,217,160,0.4) 0%, transparent 70%)",
          }}
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
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #00D9A0, #00b8ff)",
            }}
          >
            supercharged.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#8F8FA3] max-w-2xl mx-auto mb-10 leading-relaxed">
          Trade gift cards for instant cash, pay every bill in seconds, recharge
          airtime, get a virtual dollar card, and manage your wallet — all in
          one powerful app.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/download"
            className="flex items-center gap-2 px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] text-base font-bold rounded-2xl hover:bg-[#00C490] transition-all hover:scale-105"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link
            href="/features"
            className="flex items-center gap-2 px-8 py-4 bg-[#1C1C2A] text-white text-base font-semibold rounded-2xl border border-[#2A2A3D] hover:border-[#00D9A0] transition-all"
          >
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
            <div
              key={label}
              className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-5"
            >
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
              {/* Screen — pure white background */}
              <div className="absolute inset-[3px] rounded-[44px] bg-white overflow-hidden">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1C1C2A] rounded-full z-10" />

                {/* Screen content */}
                <div className="pt-10 flex flex-col h-full">

                  {/* Brand name */}
                  <div className="text-center py-2">
                    <span className="text-[11px] font-semibold tracking-[3px] text-black uppercase">aza</span>
                  </div>

                  {/* ── GREETING ROW — Figma exact, no card/border/shadow ── */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      padding: "0 14px",
                      marginTop: 6,
                      background: "#FFFFFF",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ width: 28, height: 27, flexShrink: 0, borderRadius: 4, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/avatar_3d_16.png"
                        alt="User avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Text stack */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
                      <span style={{ fontFamily: "Roboto, system-ui, sans-serif", fontWeight: 700, fontSize: 9.6, lineHeight: "120%", color: "#1C1C1C" }}>
                        Hi, Dove
                      </span>
                      <span style={{ fontFamily: "Roboto, system-ui, sans-serif", fontWeight: 400, fontSize: 7.7, lineHeight: "150%", color: "#595F67" }}>
                        Your available balance
                      </span>
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Balance amount */}
                    <span style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 11.5, lineHeight: "120%", color: "#0B0A0A", whiteSpace: "nowrap" }}>
                      ₦200,590.00
                    </span>

                    {/* Eye icon */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
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
                      { label: "Deposit Giftcard", val: "₦200,40.00",  color: "#00B03C" },
                      { label: "Withdraws",         val: "-₦400,000.00", color: "#FF0000" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex items-center justify-between bg-white py-1">
                        <div className="w-4 h-4 rounded bg-gray-100 flex-shrink-0" />
                        <span className="text-[7.5px] text-[#595F67] font-semibold flex-1 ml-2">{label}</span>
                        <span className="text-[7.5px] font-extrabold" style={{ color }}>{val}</span>
                      </div>
                    ))}
                  </div>

                </div>
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

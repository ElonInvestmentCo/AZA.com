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
              {/* Screen */}
              <div className="absolute inset-[3px] rounded-[44px] bg-[#0A0A0F] overflow-hidden">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1C1C2A] rounded-full z-10" />
                {/* Screen content preview */}
                <div className="pt-16 px-4 space-y-3">
                  <div className="bg-[#14141F] rounded-2xl p-4">
                    <p className="text-[#8F8FA3] text-xs mb-1">Total Balance</p>
                    <p className="text-white text-2xl font-black">₦124,580.00</p>
                    <div className="flex gap-2 mt-3">
                      {["Fund", "Send", "Bills"].map((a) => (
                        <div
                          key={a}
                          className="flex-1 bg-[#1C1C2A] rounded-xl py-2 text-center text-xs text-[#00D9A0] font-semibold"
                        >
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#14141F] rounded-2xl p-3 space-y-2">
                    {[
                      { label: "Amazon Gift Card", val: "+₦15,200", color: "#00D9A0" },
                      { label: "Electricity Bill", val: "-₦4,500", color: "#FF5B7A" },
                      { label: "Airtime MTN", val: "-₦500", color: "#FF5B7A" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex items-center justify-between py-1">
                        <div className="w-6 h-6 rounded-lg bg-[#1C1C2A]" />
                        <span className="text-white text-xs flex-1 ml-2">{label}</span>
                        <span className="text-xs font-semibold" style={{ color }}>{val}</span>
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

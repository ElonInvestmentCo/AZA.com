import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { CheckCircle2, Globe, ShoppingBag, Repeat, Shield, Zap, CreditCard, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Virtual Dollar Cards – PayVora",
  description:
    "Get a free USD virtual card with PayVora. Shop internationally, pay for subscriptions, and make online payments securely.",
};

const usecases = [
  "Netflix, Spotify, Apple Music",
  "Amazon, Alibaba, eBay",
  "ChatGPT Plus, Midjourney",
  "Google Ads, Meta Ads",
  "Namecheap, GoDaddy domains",
  "Upwork, Fiverr payments",
  "Digital Ocean, AWS",
  "Any international website",
];

const cardTypes = [
  {
    title: "Standard Virtual Card",
    desc: "Your primary USD card for everyday international payments. Save it to Netflix, Spotify, ChatGPT and more.",
    badge: "Free",
    badgeColor: "#00D9A0",
    features: ["Accepted on any Visa website", "Instant top-up from wallet", "Freeze/unfreeze anytime", "No monthly fee"],
  },
  {
    title: "Disposable Virtual Card",
    desc: "Single-use card for one-off payments. Expires after one transaction to keep your main balance safe.",
    badge: "Secure",
    badgeColor: "#00b8ff",
    features: ["Expires after one use", "Perfect for untrusted sites", "Create as many as you need", "Minimal fee per card"],
  },
];

export default function VirtualCardsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
                Free virtual card
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
                Your USD card for{" "}
                <span className="text-[#00D9A0]">the world.</span>
              </h1>
              <p className="text-[#8F8FA3] text-xl leading-relaxed mb-8">
                Get a free virtual USD Visa card instantly. Shop on any international website, pay for subscriptions, and make cross-border payments — all funded from your PayVora wallet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {[
                  { icon: Globe, text: "Accepted worldwide" },
                  { icon: ShoppingBag, text: "No foreign transaction fees" },
                  { icon: Repeat, text: "Instant top-up from wallet" },
                  { icon: CheckCircle2, text: "Freeze/unfreeze anytime" },
                  { icon: Shield, text: "Fraud protection included" },
                  { icon: Zap, text: "Issued in seconds" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[#8F8FA3] text-sm">
                    <Icon size={16} className="text-[#00D9A0] flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Card visual */}
            <div className="flex justify-center">
              <div className="relative w-80 space-y-4">
                {/* Card */}
                <div
                  className="w-full aspect-[1.586/1] rounded-3xl p-8 flex flex-col justify-between shadow-2xl"
                  style={{
                    background: "linear-gradient(145deg, #141414 0%, #1C1C2A 60%, #0A1A12 100%)",
                    border: "1px solid rgba(0,217,160,0.3)",
                    boxShadow: "0 0 60px rgba(0,217,160,0.1), 0 20px 60px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none">P</div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[#8F8FA3] text-xs">Virtual Card</p>
                      <p className="text-white font-bold text-lg">PayVora</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#00D9A0] flex items-center justify-center">
                      <span className="text-[#0A0A0F] font-black">P</span>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-white font-mono text-xl tracking-widest mb-3">
                      •••• •••• •••• 4891
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[#8F8FA3] text-xs mb-0.5">Card Holder</p>
                        <p className="text-white font-semibold">JOHN DOE</p>
                      </div>
                      <div>
                        <p className="text-[#8F8FA3] text-xs mb-0.5">Expires</p>
                        <p className="text-white font-semibold">12/28</p>
                      </div>
                      <p className="text-[#00D9A0] font-black text-2xl">VISA</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats below card */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Balance", value: "$250.00" },
                    { label: "Spent", value: "$43.99" },
                    { label: "Status", value: "Active" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#14141F] border border-[#2A2A3D] rounded-xl p-3 text-center">
                      <p className="text-[#8F8FA3] text-xs mb-1">{label}</p>
                      <p className="text-white text-sm font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card types */}
          <div className="mb-24">
            <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-10">
              Choose your card type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cardTypes.map(({ title, desc, badge, badgeColor, features }) => (
                <div key={title} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 hover:border-[#3A3A4D] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center">
                      <CreditCard size={22} className="text-[#00D9A0]" />
                    </div>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ background: `${badgeColor}20`, color: badgeColor }}
                    >
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                  <p className="text-[#8F8FA3] text-sm leading-relaxed mb-5">{desc}</p>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#8F8FA3]">
                        <CheckCircle2 size={14} className="text-[#00D9A0] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-white text-center mb-10">
              Works everywhere you shop
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {usecases.map((u) => (
                <div key={u} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 flex items-center gap-3 hover:border-[#00D9A0] transition-all group">
                  <CheckCircle2 size={16} className="text-[#00D9A0] flex-shrink-0" />
                  <span className="text-[#8F8FA3] text-sm group-hover:text-white transition-colors">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-[rgba(0,217,160,0.06)] border border-[rgba(0,217,160,0.2)] rounded-2xl p-8 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
              <Lock size={22} className="text-[#00D9A0]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Your card is protected</h3>
              <p className="text-[#8F8FA3] leading-relaxed">
                Every PayVora virtual card is protected with real-time fraud monitoring, instant freeze capability, and full transaction history. If you ever notice unauthorized charges, freeze your card instantly from the app and contact our 24/7 support.
              </p>
            </div>
          </div>
        </div>
      </section>
      <DownloadCTA />
    </>
  );
}

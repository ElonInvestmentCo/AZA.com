import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Clock, TrendingUp, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Gift Card Trading – PAYVORA",
  description:
    "Trade Amazon, iTunes, Google Play, Steam, and 50+ gift card brands for instant Naira. Best rates in Nigeria.",
};

const brands = [
  { name: "Amazon", color: "#FF9900" },
  { name: "iTunes", color: "#FA233B" },
  { name: "Google Play", color: "#34A853" },
  { name: "Steam", color: "#1B2838" },
  { name: "Razer Gold", color: "#44D62C" },
  { name: "Walmart", color: "#0071CE" },
  { name: "eBay", color: "#E53238" },
  { name: "Visa Gift", color: "#1A1F71" },
  { name: "Netflix", color: "#E50914" },
  { name: "Xbox", color: "#107C10" },
  { name: "PlayStation", color: "#003791" },
  { name: "Footlocker", color: "#D32F2F" },
  { name: "Nike", color: "#111111" },
  { name: "Target", color: "#CC0000" },
  { name: "Best Buy", color: "#0046BE" },
  { name: "Nordstrom", color: "#000000" },
  { name: "Sephora", color: "#D4145A" },
  { name: "GameStop", color: "#AC2012" },
  { name: "JCPenney", color: "#8B0000" },
  { name: "American Express", color: "#007BC1" },
];

const steps = [
  { step: "1", title: "Select your card", desc: "Choose the gift card brand and enter the denomination." },
  { step: "2", title: "Upload the card", desc: "Photo the card code or enter it manually in the app." },
  { step: "3", title: "Get your rate", desc: "See the exact Naira value before confirming — no surprises." },
  { step: "4", title: "Receive cash", desc: "Funds hit your wallet in under 60 seconds. Withdraw anytime." },
];

export default function GiftCardsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.1)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Best rates in Nigeria
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
              Trade gift cards,{" "}
              <span className="text-[#00D9A0]">get cash instantly.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-12">
              Upload your gift card, get the best market rate, and receive Naira in your wallet within 60 seconds. No stress. No delays. No guessing.
            </p>

            {/* Key benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-16">
              {[
                { icon: Clock, title: "60-second settlement", desc: "Funds hit your wallet in under a minute." },
                { icon: TrendingUp, title: "Real-time rates", desc: "Rates updated live based on market conditions." },
                { icon: ShieldCheck, title: "Verified & secure", desc: "Every card verified by our expert team." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:border-[#00D9A0] hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.1)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[#00D9A0]" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-24">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8">
              50+ brands accepted
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {brands.map(({ name }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 hover:border-[#00D9A0] hover:text-gray-900 transition-all cursor-default group"
                >
                  <CheckCircle2 size={13} className="text-[#00D9A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {name}
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,217,160,0.08)] border border-[rgba(0,217,160,0.2)] rounded-xl text-sm text-[#00D9A0] font-semibold">
                <Zap size={13} />
                + many more
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gray-100" />
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[rgba(0,217,160,0.4)] flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm">
                    <span className="text-[#00D9A0] font-black">{step}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
            <h3 className="text-gray-900 font-bold text-xl mb-6">Trusted by traders across Nigeria</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "50K+", label: "Happy traders" },
                { value: "₦2B+", label: "Gift cards traded" },
                { value: "< 60s", label: "Avg. settlement" },
                { value: "4.9★", label: "Average rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-[#00D9A0] text-2xl font-black mb-1">{value}</p>
                  <p className="text-gray-500 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <DownloadCTA />
    </>
  );
}

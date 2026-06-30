import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Clock, TrendingUp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Gift Card Trading – PayVora",
  description:
    "Trade Amazon, iTunes, Google Play, Steam, and 50+ gift card brands for instant Naira. Best rates in Nigeria.",
};

const brands = [
  "Amazon", "iTunes", "Google Play", "Steam", "Razer Gold",
  "Walmart", "eBay", "Visa Gift", "Netflix", "Xbox",
  "PlayStation", "Footlocker", "Nike", "Target", "Best Buy",
  "Nordstrom", "Sephora", "GameStop", "JCPenney", "American Express",
];

export default function GiftCardsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Best rates in Nigeria
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
              Trade gift cards,{" "}
              <span className="text-[#00D9A0]">get cash instantly.</span>
            </h1>
            <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto mb-12">
              Upload your gift card, get the best market rate, and receive Naira in your wallet within 60 seconds. No stress. No delays.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              {[
                { icon: Clock, title: "60-second settlement", desc: "Funds hit your wallet in under a minute." },
                { icon: TrendingUp, title: "Real-time rates", desc: "Rates updated live based on market conditions." },
                { icon: ShieldCheck, title: "Verified & secure", desc: "Every card verified by our expert team." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[#00D9A0]" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-[#8F8FA3] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h2 className="text-2xl font-black text-white text-center mb-8">
              50+ brands accepted
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="px-4 py-2 bg-[#14141F] border border-[#2A2A3D] rounded-xl text-sm text-[#8F8FA3] hover:border-[#00D9A0] hover:text-white transition-all cursor-default"
                >
                  {brand}
                </div>
              ))}
              <div className="px-4 py-2 bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] rounded-xl text-sm text-[#00D9A0]">
                + many more
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-24">
            <h2 className="text-3xl font-black text-white text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Select your card", desc: "Choose the gift card brand and enter the denomination." },
                { step: "2", title: "Upload the card", desc: "Photo the card code or enter it manually." },
                { step: "3", title: "Get your rate", desc: "See the exact Naira value before confirming." },
                { step: "4", title: "Receive cash", desc: "Funds hit your wallet in under 60 seconds." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#00D9A0] font-black">{step}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-[#8F8FA3] text-sm">{desc}</p>
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

import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { CheckCircle2, Globe, ShoppingBag, Repeat } from "lucide-react";

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

export default function VirtualCardsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[#8F8FA3] text-sm">
                    <Icon size={16} className="text-[#00D9A0] flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Card mockup */}
            <div className="flex justify-center">
              <div className="relative w-80">
                <div
                  className="w-full aspect-[1.586/1] rounded-3xl p-8 flex flex-col justify-between shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #1C1C2A 0%, #0A0A0F 100%)",
                    border: "1px solid rgba(0,217,160,0.3)",
                    boxShadow: "0 0 60px rgba(0,217,160,0.1)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#8F8FA3] text-xs">Virtual Card</p>
                      <p className="text-white font-bold text-lg">PayVora</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#00D9A0] flex items-center justify-center">
                      <span className="text-[#0A0A0F] font-black">P</span>
                    </div>
                  </div>
                  <div>
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
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div className="mt-24">
            <h2 className="text-3xl font-black text-white text-center mb-10">
              Works everywhere you shop
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {usecases.map((u) => (
                <div key={u} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#00D9A0] flex-shrink-0" />
                  <span className="text-[#8F8FA3] text-sm">{u}</span>
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

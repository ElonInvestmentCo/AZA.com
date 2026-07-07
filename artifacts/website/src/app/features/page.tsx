import type { Metadata } from "next";
import { Features } from "@/components/sections/Features";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import {
  CreditCard, Zap, Wifi, Lightbulb, Tv, Dice6,
  ArrowLeftRight, Gift, Wallet, ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore all PAYVORA features: gift cards, virtual cards, airtime, data, electricity, cable TV, betting, and bank transfers.",
};

const featurePages = [
  { icon: Gift, title: "Gift Cards", href: "/gift-cards", desc: "Trade 50+ gift card brands for instant cash." },
  { icon: CreditCard, title: "Virtual Cards", href: "/virtual-cards", desc: "USD virtual card for international payments." },
  { icon: Lightbulb, title: "Bill Payments", href: "/bill-payments", desc: "Pay electricity, water, and more bills instantly." },
  { icon: Zap, title: "Airtime & Data", href: "/airtime-data", desc: "Recharge any network at the best rates." },
  { icon: Tv, title: "Cable TV", href: "/bill-payments", desc: "Renew DStv, GOtv, Showmax and more." },
  { icon: Dice6, title: "Betting Wallet", href: "/bill-payments", desc: "Fund your betting platforms seamlessly." },
  { icon: ArrowLeftRight, title: "Bank Transfers", href: "/features", desc: "Instant transfers to any Nigerian bank." },
  { icon: Wallet, title: "Digital Wallet", href: "/features", desc: "Fund, store, and withdraw Naira easily." },
  { icon: Wifi, title: "Data Bundles", href: "/airtime-data", desc: "Cheapest data plans for all networks." },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.1)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Everything in one app
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Features built for{" "}
            <span className="text-[#00D9A0]">real Nigerians.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-12">
            PAYVORA combines every financial service you need into one app that&apos;s fast, reliable, and beautifully designed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {featurePages.map(({ icon: Icon, title, href, desc }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#00D9A0] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.1)] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#00D9A0]" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-1 text-[#00D9A0] text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Features />
      <DownloadCTA />
    </>
  );
}

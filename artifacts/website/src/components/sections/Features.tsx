"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard, Zap, Wifi, Lightbulb, Tv, Dice6,
  ArrowLeftRight, Gift, Wallet, ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Gift,
    title: "Gift Card Trading",
    description: "Trade Amazon, iTunes, Google Play, Steam and 50+ gift card brands for instant Naira or crypto. Best rates, 60-second settlement.",
    accent: "#00D9A0",
    href: "/gift-cards",
    badge: "Most Popular",
  },
  {
    icon: CreditCard,
    title: "Virtual Dollar Cards",
    description: "Get a free USD virtual card for international payments, subscriptions, and online shopping — powered directly from your wallet.",
    accent: "#3B82F6",
    href: "/virtual-cards",
    badge: null,
  },
  {
    icon: Wallet,
    title: "Digital Wallet",
    description: "Store Naira, fund instantly via bank transfer, and withdraw to any Nigerian bank account. Zero hidden charges, ever.",
    accent: "#EF4444",
    href: "/features",
    badge: null,
  },
  {
    icon: Lightbulb,
    title: "Electricity Bills",
    description: "Pay EKEDC, IKEDC, AEDC, PHED and every DISCO directly from your wallet. Token delivered in under 30 seconds.",
    accent: "#F59E0B",
    href: "/bill-payments",
    badge: null,
  },
  {
    icon: Zap,
    title: "Airtime Recharge",
    description: "Recharge MTN, Airtel, Glo, and 9mobile with the best rates and instant delivery. Never run out of credit again.",
    accent: "#00D9A0",
    href: "/airtime-data",
    badge: null,
  },
  {
    icon: Wifi,
    title: "Data Bundles",
    description: "Buy internet data plans for all networks at prices cheaper than USSD codes. Up to 38GB for under ₦3,500.",
    accent: "#3B82F6",
    href: "/airtime-data",
    badge: "Best Value",
  },
  {
    icon: Tv,
    title: "Cable TV",
    description: "Renew DStv, GOtv, StarTimes, and Showmax subscriptions without leaving the app. Auto-renew available.",
    accent: "#EF4444",
    href: "/bill-payments",
    badge: null,
  },
  {
    icon: Dice6,
    title: "Betting Wallet",
    description: "Fund Sportybet, Bet9ja, 1xBet, and other betting platforms directly from your wallet in seconds.",
    accent: "#F59E0B",
    href: "/bill-payments",
    badge: null,
  },
  {
    icon: ArrowLeftRight,
    title: "Bank Transfers",
    description: "Send money to any Nigerian bank account instantly with zero hidden charges. Transfers clear within seconds.",
    accent: "#00D9A0",
    href: "/features",
    badge: null,
  },
];

export function Features() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.10)] border border-[rgba(0,217,160,0.25)] text-[#00B88A] text-sm font-semibold mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            One app, endless possibilities
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            PAYVORA combines everything you need to manage your finances in one
            sleek, fast, and secure app.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, accent, href, badge }) => (
            <Link
              key={title}
              href={href}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
              style={{ "--accent": accent } as React.CSSProperties}
              onMouseEnter={() => setHovered(title)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Subtle accent border on hover */}
              <div
                className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: `${accent}40` }}
              />

              {badge && (
                <div
                  className="absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  {badge}
                </div>
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${accent}12` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>

              <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>

              <div
                className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:gap-2"
                style={{ color: accent }}
              >
                Learn more <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-[#00D9A0] hover:text-[#00B88A] hover:shadow-md transition-all"
          >
            Explore all features <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

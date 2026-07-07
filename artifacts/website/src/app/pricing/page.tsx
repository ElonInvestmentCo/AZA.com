import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Check, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing – No Hidden Fees | PAYVORA",
  description:
    "PAYVORA is free to download. See our transparent fee schedule for gift card trading, virtual cards, bill payments, and airtime.",
  alternates: { canonical: "https://www.payvora.org/pricing" },
};

const feeTable = [
  {
    category: "Gift Card Trading",
    items: [
      { service: "Gift card submission", fee: "Free", note: "No listing fee" },
      { service: "Trading commission", fee: "0–5%", note: "Deducted from trade value; shown before confirmation" },
      { service: "Instant payout to wallet", fee: "Free", note: "Credited within seconds" },
    ],
  },
  {
    category: "Wallet & Withdrawals",
    items: [
      { service: "Wallet funding", fee: "Free", note: "No deposit charges" },
      { service: "Bank withdrawal", fee: "₦50 flat", note: "Per transaction" },
      { service: "Wallet-to-wallet transfer", fee: "Free", note: "Between PAYVORA users" },
    ],
  },
  {
    category: "Virtual Dollar Card",
    items: [
      { service: "Card creation", fee: "Free", note: "One card per account (Tier 2+)" },
      { service: "Card funding (USD)", fee: "1%", note: "Of the funded amount" },
      { service: "Card maintenance", fee: "Free", note: "No monthly fee" },
      { service: "Card transactions", fee: "Free", note: "Standard Visa network rates apply" },
    ],
  },
  {
    category: "Bill Payments",
    items: [
      { service: "Electricity (prepaid)", fee: "Free", note: "No service charge" },
      { service: "Cable TV (DStv, GOtv)", fee: "Free", note: "No service charge" },
      { service: "Betting wallet funding", fee: "Free", note: "No service charge" },
      { service: "Internet / broadband", fee: "Free", note: "No service charge" },
    ],
  },
  {
    category: "Airtime & Data",
    items: [
      { service: "Airtime recharge", fee: "Free", note: "Any Nigerian network" },
      { service: "Data bundles", fee: "Free", note: "MTN, Airtel, Glo, 9mobile" },
    ],
  },
];

const kyc = [
  {
    tier: "Tier 1",
    label: "Basic",
    description: "Email + phone verification",
    limits: [
      "Wallet balance: ₦300,000",
      "Daily withdrawal: ₦100,000",
      "Gift card trades: ₦200,000/day",
      "No virtual card access",
    ],
  },
  {
    tier: "Tier 2",
    label: "Verified",
    description: "BVN + government ID",
    limits: [
      "Wallet balance: ₦5,000,000",
      "Daily withdrawal: ₦1,000,000",
      "Gift card trades: ₦2,000,000/day",
      "Virtual card access included",
    ],
    highlight: true,
  },
  {
    tier: "Tier 3",
    label: "Business",
    description: "CAC + directors' IDs",
    limits: [
      "Wallet balance: Unlimited",
      "Daily withdrawal: Unlimited",
      "Gift card trades: Unlimited",
      "Priority support + dedicated manager",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Transparent pricing
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            No hidden fees.{" "}
            <span className="text-[#00D9A0]">Ever.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto leading-relaxed">
            PAYVORA is free to download and free to use for most services. Where fees apply, they&apos;re shown clearly before you confirm — no surprises.
          </p>
        </div>
      </section>

      {/* Free badge strip */}
      <section className="py-8 bg-[rgba(0,217,160,0.06)] border-y border-[rgba(0,217,160,0.15)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {["Free account", "Free bill payments", "Free airtime", "Free wallet funding", "Free card creation"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#00D9A0] font-semibold">
                <Check size={15} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee table */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white mb-3">Fee schedule</h2>
          <p className="text-[#8F8FA3] mb-12">
            All fees shown are the maximum possible. Many transactions have zero fees.
          </p>
          <div className="space-y-10">
            {feeTable.map(({ category, items }) => (
              <div key={category}>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#00D9A0]" />
                  {category}
                </h3>
                <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-3 px-6 py-3 border-b border-[#2A2A3D] text-xs font-bold text-[#8F8FA3] uppercase tracking-widest">
                    <span>Service</span>
                    <span className="text-center">Fee</span>
                    <span className="text-right">Note</span>
                  </div>
                  {items.map(({ service, fee, note }, i) => (
                    <div
                      key={service}
                      className={`grid grid-cols-3 px-6 py-4 ${i < items.length - 1 ? "border-b border-[#2A2A3D]" : ""}`}
                    >
                      <span className="text-white text-sm">{service}</span>
                      <span
                        className={`text-center text-sm font-bold ${fee === "Free" ? "text-[#00D9A0]" : "text-white"}`}
                      >
                        {fee}
                      </span>
                      <span className="text-right text-[#8F8FA3] text-xs">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KYC tiers */}
      <section className="py-24 bg-[#14141F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Account limits by KYC tier</h2>
            <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
              Verify your identity to unlock higher limits. Upgrading takes less than 5 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kyc.map(({ tier, label, description, limits, highlight }) => (
              <div
                key={tier}
                className={`rounded-2xl p-8 border ${
                  highlight
                    ? "bg-[rgba(0,217,160,0.08)] border-[rgba(0,217,160,0.35)]"
                    : "bg-[#1C1C2A] border-[#2A2A3D]"
                }`}
              >
                {highlight && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00D9A0] text-[#0A0A0F] text-xs font-bold mb-4">
                    Most popular
                  </div>
                )}
                <div className="text-[#00D9A0] text-xs font-bold uppercase tracking-widest mb-2">{tier}</div>
                <h3 className="text-white font-black text-2xl mb-1">{label}</h3>
                <p className="text-[#8F8FA3] text-sm mb-6">{description}</p>
                <ul className="space-y-3">
                  {limits.map((limit) => (
                    <li key={limit} className="flex items-start gap-3 text-sm text-[#8F8FA3]">
                      <Check size={14} className="text-[#00D9A0] mt-0.5 flex-shrink-0" />
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ note */}
      <section className="py-16 bg-[#0A0A0F] border-t border-[#2A2A3D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle size={32} className="text-[#00D9A0] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Still have questions?</h2>
          <p className="text-[#8F8FA3] mb-6">
            Our support team is available 24/7 to help with any pricing questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/faq"
              className="px-6 py-3 bg-[#14141F] border border-[#2A2A3D] text-white rounded-xl text-sm font-semibold hover:border-[#00D9A0] transition-colors"
            >
              Read the FAQ
            </a>
            <a
              href="mailto:support@payvora.com"
              className="px-6 py-3 bg-[#00D9A0] text-[#0A0A0F] rounded-xl text-sm font-bold hover:bg-[#00C490] transition-colors"
            >
              Contact support
            </a>
          </div>
        </div>
      </section>

      <DownloadCTA />
    </>
  );
}

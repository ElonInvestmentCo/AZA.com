import type { Metadata } from "next";
import Link from "next/link";
import { Search, ChevronRight, MessageCircle, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center – PAYVORA Support",
  description:
    "Get help with your PAYVORA account. Find answers about gift card trading, virtual cards, bill payments, withdrawals, KYC, and more.",
  alternates: { canonical: "https://www.payvora.org/help-center" },
};

const categories = [
  {
    icon: "🎁",
    title: "Gift Card Trading",
    count: 12,
    href: "#gift-cards",
    articles: [
      "How do I submit a gift card for trading?",
      "Why was my gift card rate lower than expected?",
      "How long does a gift card trade take?",
      "What gift card brands does PAYVORA accept?",
      "My gift card was rejected — what should I do?",
    ],
  },
  {
    icon: "💳",
    title: "Virtual Dollar Card",
    count: 8,
    href: "#virtual-card",
    articles: [
      "How do I create a virtual dollar card?",
      "Why was my virtual card declined?",
      "How do I fund my virtual card?",
      "Can I use my card on Amazon / PayPal / Netflix?",
      "How do I freeze or delete my card?",
    ],
  },
  {
    icon: "💰",
    title: "Wallet & Withdrawals",
    count: 10,
    href: "#wallet",
    articles: [
      "How do I withdraw funds to my bank account?",
      "How long do withdrawals take?",
      "Why is my withdrawal pending?",
      "What is my daily withdrawal limit?",
      "How do I add a bank account?",
    ],
  },
  {
    icon: "⚡",
    title: "Bill Payments & Airtime",
    count: 9,
    href: "#bills",
    articles: [
      "My electricity token didn't arrive — what do I do?",
      "How do I pay my DStv / GOtv subscription?",
      "Can I pay for any Nigerian utility?",
      "My airtime recharge failed but money was deducted",
      "How do I get a receipt for a bill payment?",
    ],
  },
  {
    icon: "🔐",
    title: "Account & Security",
    count: 14,
    href: "#account",
    articles: [
      "How do I reset my PIN?",
      "How do I enable biometric login?",
      "My account was locked — how do I unlock it?",
      "How do I upgrade my KYC tier?",
      "How do I change my email or phone number?",
    ],
  },
  {
    icon: "🪪",
    title: "KYC Verification",
    count: 6,
    href: "#kyc",
    articles: [
      "What documents do I need for verification?",
      "How long does KYC verification take?",
      "Why was my KYC rejected?",
      "What are the limits for each KYC tier?",
      "Can I use a foreign passport for verification?",
    ],
  },
];

const popularArticles = [
  "How do I submit a gift card for trading?",
  "Why was my withdrawal delayed?",
  "How do I create a virtual dollar card?",
  "My electricity token didn't arrive",
  "How do I upgrade my KYC tier?",
  "My account was locked",
];

export default function HelpCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            How can we{" "}
            <span className="text-[#00D9A0]">help you?</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl mb-10">
            Search our knowledge base or browse by category.
          </p>
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8F8FA3] pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search for answers…"
              className="w-full pl-11 pr-4 py-4 bg-[#14141F] border border-[#2A2A3D] rounded-2xl text-white placeholder:text-[#8F8FA3] focus:outline-none focus:border-[#00D9A0] transition-colors text-sm"
            />
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {popularArticles.slice(0, 4).map((article) => (
              <button
                key={article}
                className="text-xs text-[#8F8FA3] border border-[#2A2A3D] rounded-full px-3 py-1.5 hover:text-white hover:border-[#00D9A0]/40 transition-colors"
              >
                {article}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#14141F] border-y border-[#2A2A3D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white mb-10">Browse by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(({ icon, title, count, href, articles }) => (
              <div
                key={title}
                id={href.replace("#", "")}
                className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-6 hover:border-[#00D9A0]/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="text-white font-bold">{title}</h3>
                    <p className="text-[#8F8FA3] text-xs">{count} articles</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {articles.map((article) => (
                    <li key={article}>
                      <a
                        href={`mailto:support@payvora.com?subject=${encodeURIComponent(article)}`}
                        className="flex items-center gap-2 text-sm text-[#8F8FA3] hover:text-[#00D9A0] transition-colors group"
                      >
                        <ChevronRight
                          size={13}
                          className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                        />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact support */}
      <section className="py-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Still need help?</h2>
            <p className="text-[#8F8FA3]">
              Our support team is available 24/7 and responds within 2 hours on average.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: MessageCircle,
                title: "Live chat",
                desc: "Chat with a support agent in real time through the PAYVORA app.",
                action: "Open the app",
                href: "/download",
              },
              {
                icon: Mail,
                title: "Email support",
                desc: "We reply to all emails within 2 business hours.",
                action: "support@payvora.com",
                href: "mailto:support@payvora.com",
              },
              {
                icon: Phone,
                title: "Call us",
                desc: "Speak to a human agent Monday–Saturday, 8am–8pm WAT.",
                action: "+234 800 PAYVORA",
                href: "tel:+2348002748672",
              },
            ].map(({ icon: Icon, title, desc, action, href }) => (
              <a
                key={title}
                href={href}
                className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-7 hover:border-[#00D9A0]/40 transition-all group text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#00D9A0]" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-[#8F8FA3] text-sm leading-relaxed mb-4">{desc}</p>
                <span className="text-[#00D9A0] text-sm font-semibold group-hover:underline">{action}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick link to FAQ */}
      <section className="py-12 bg-[#14141F] border-t border-[#2A2A3D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold">Looking for our FAQ?</p>
            <p className="text-[#8F8FA3] text-sm">Quick answers to the most common questions.</p>
          </div>
          <Link
            href="/faq"
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl text-white text-sm font-semibold hover:border-[#00D9A0] transition-colors"
          >
            Visit FAQ <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}

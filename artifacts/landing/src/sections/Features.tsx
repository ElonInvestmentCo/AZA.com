import { Link } from "react-router-dom";
import { CreditCard, Zap, Wifi, Lightbulb, Tv, Dice6, ArrowLeftRight, Gift, Wallet, ArrowRight } from "lucide-react";

const features = [
  { icon: Gift, title: "Gift Card Trading", description: "Trade Amazon, iTunes, Google Play, Steam and 50+ gift card brands for instant Naira or crypto. Best rates, 60-second settlement.", accent: "#00D9A0", href: "/gift-cards", badge: "Most Popular" },
  { icon: CreditCard, title: "Virtual Dollar Cards", description: "Get a free USD virtual card for international payments, subscriptions, and online shopping — powered directly from your wallet.", accent: "#00b8ff", href: "/virtual-cards", badge: null },
  { icon: Wallet, title: "Digital Wallet", description: "Store Naira, fund instantly via bank transfer, and withdraw to any Nigerian bank account. Zero hidden charges, ever.", accent: "#FF5B7A", href: "/features", badge: null },
  { icon: Lightbulb, title: "Electricity Bills", description: "Pay EKEDC, IKEDC, AEDC, PHED and every DISCO directly from your wallet. Token delivered in under 30 seconds.", accent: "#F59E0B", href: "/bill-payments", badge: null },
  { icon: Zap, title: "Airtime Recharge", description: "Recharge MTN, Airtel, Glo, and 9mobile with the best rates and instant delivery. Never run out of credit again.", accent: "#00D9A0", href: "/airtime-data", badge: null },
  { icon: Wifi, title: "Data Bundles", description: "Buy internet data plans for all networks at prices cheaper than USSD codes. Up to 38GB for under ₦3,500.", accent: "#00b8ff", href: "/airtime-data", badge: "Best Value" },
  { icon: Tv, title: "Cable TV", description: "Renew DStv, GOtv, StarTimes, and Showmax subscriptions without leaving the app. Auto-renew available.", accent: "#FF5B7A", href: "/bill-payments", badge: null },
  { icon: Dice6, title: "Betting Wallet", description: "Fund Sportybet, Bet9ja, 1xBet, and other betting platforms directly from your wallet in seconds.", accent: "#F59E0B", href: "/bill-payments", badge: null },
  { icon: ArrowLeftRight, title: "Bank Transfers", description: "Send money to any Nigerian bank account instantly with zero hidden charges. Transfers clear within seconds.", accent: "#00D9A0", href: "/features", badge: null },
];

export function Features() {
  return (
    <section className="py-24 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            All your financial tools,{" "}
            <span className="text-[#00D9A0]">one app.</span>
          </h2>
          <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
            From gift card trading to bill payments — PayVora handles everything so you never need another fintech app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, accent, href, badge }) => (
            <Link
              key={title}
              to={href}
              className="group relative bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-6 hover:border-opacity-60 transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "#2A2A3D" }}
            >
              {badge && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${accent}22`, color: accent }}>
                  {badge}
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${accent}18` }}>
                <Icon size={22} style={{ color: accent }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed mb-4">{description}</p>
              <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
                Learn more <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

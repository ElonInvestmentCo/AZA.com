import {
  CreditCard,
  Zap,
  Wifi,
  Lightbulb,
  Tv,
  Dice6,
  ArrowLeftRight,
  Gift,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Gift,
    title: "Gift Card Trading",
    description:
      "Trade Amazon, iTunes, Google Play, Steam and 50+ other gift cards for instant Naira or crypto.",
    accent: "#00D9A0",
  },
  {
    icon: CreditCard,
    title: "Virtual Dollar Cards",
    description:
      "Get a free USD virtual card for international payments, subscriptions, and online shopping.",
    accent: "#00b8ff",
  },
  {
    icon: Wallet,
    title: "Digital Wallet",
    description:
      "Store Naira, fund instantly via bank transfer, and withdraw to any Nigerian bank account.",
    accent: "#FF5B7A",
  },
  {
    icon: Lightbulb,
    title: "Electricity Bills",
    description:
      "Pay EKEDC, IKEDC, AEDC, PHED and every DISCO directly from your wallet in seconds.",
    accent: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Airtime Recharge",
    description:
      "Recharge MTN, Airtel, Glo, and 9mobile with the best rates and instant delivery.",
    accent: "#00D9A0",
  },
  {
    icon: Wifi,
    title: "Data Bundles",
    description:
      "Buy internet data plans for all networks at prices cheaper than USSD codes.",
    accent: "#00b8ff",
  },
  {
    icon: Tv,
    title: "Cable TV",
    description:
      "Renew DStv, GOtv, StarTimes, and Showmax subscriptions without leaving the app.",
    accent: "#FF5B7A",
  },
  {
    icon: Dice6,
    title: "Betting Wallet",
    description:
      "Fund Sportybet, Bet9ja, 1xBet, and other betting platforms directly from your wallet.",
    accent: "#F59E0B",
  },
  {
    icon: ArrowLeftRight,
    title: "Bank Transfers",
    description:
      "Send money to any Nigerian bank account instantly with zero hidden charges.",
    accent: "#00D9A0",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-[#0A0A0F]" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            One app, endless possibilities
          </h2>
          <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
            PayVora combines everything you need to manage your finances in one
            sleek, fast, and secure app.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="group bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 hover:border-[#2A2A3D] transition-all duration-300 hover:bg-[#1C1C2A]"
              style={
                {
                  "--accent": accent,
                } as React.CSSProperties
              }
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${accent}20` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

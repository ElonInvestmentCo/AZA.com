import { CheckCircle2, TrendingUp, Clock, Users, Star } from "lucide-react";
import Link from "next/link";

const reasons = [
  {
    title: "Instant settlements",
    description: "Gift card trades settle in under 60 seconds. Wallet funding is instant via bank transfer.",
  },
  {
    title: "Best rates, always",
    description: "We offer the best gift card rates in Nigeria, updated in real-time based on market conditions.",
  },
  {
    title: "Bank-grade security",
    description: "256-bit encryption, biometric authentication, and 2FA protect every transaction.",
  },
  {
    title: "Zero hidden fees",
    description: "What you see is what you pay. No surprise charges, ever.",
  },
  {
    title: "24/7 customer support",
    description: "Our team is always available via live chat to resolve any issue fast.",
  },
  {
    title: "Works for everyone",
    description: "Whether you're an individual or a business, PAYVORA scales with your needs.",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Users", color: "#00D9A0" },
  { icon: TrendingUp, value: "₦2B+", label: "Processed", color: "#00b8ff" },
  { icon: Clock, value: "< 60s", label: "Settlement", color: "#F59E0B" },
  { icon: Star, value: "4.9★", label: "App Rating", color: "#FF5B7A" },
];

const recentTrades = [
  { card: "Amazon $100", amount: "₦87,400", time: "2 min ago", status: "settled" },
  { card: "iTunes $50", amount: "₦42,500", time: "5 min ago", status: "settled" },
  { card: "Steam $25", amount: "₦20,100", time: "8 min ago", status: "settled" },
  { card: "Google Play $100", amount: "₦84,000", time: "12 min ago", status: "settled" },
];

export function WhyPayVora() {
  return (
    <section className="py-24 bg-[#14141F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Why choose us
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Built different, built{" "}
              <span className="text-[#00D9A0]">for you.</span>
            </h2>
            <p className="text-[#8F8FA3] text-lg leading-relaxed mb-10">
              PAYVORA was built from the ground up by Nigerians who understand
              the unique needs of the Nigerian market. Fast, reliable, and
              always improving.
            </p>
            <div className="space-y-5 mb-10">
              {reasons.map(({ title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-[#00D9A0]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{title}</h4>
                    <p className="text-[#8F8FA3] text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-xl hover:bg-[#00C490] transition-all"
            >
              See all features
            </Link>
          </div>

          {/* Right: live stats + trade feed */}
          <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${color}20` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-white text-2xl font-black mb-0.5">{value}</p>
                  <p className="text-[#8F8FA3] text-sm">{label}</p>
                </div>
              ))}
            </div>

            {/* Live trade feed */}
            <div className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm">Live Trades</h3>
                <span className="flex items-center gap-1.5 text-xs text-[#00D9A0] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {recentTrades.map(({ card, amount, time, status }) => (
                  <div
                    key={card}
                    className="flex items-center justify-between py-2.5 border-b border-[#2A2A3D] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center">
                        <span className="text-[#00D9A0] text-xs font-black">
                          {card.split(" ")[0][0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{card}</p>
                        <p className="text-[#8F8FA3] text-xs">{time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00D9A0] text-sm font-bold">{amount}</p>
                      <p className="text-[#00D9A0] text-xs capitalize">{status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual card mockup */}
            <div
              className="w-full aspect-[2.1/1] rounded-2xl p-5 flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, #141414 0%, #1C1C2A 60%, rgba(0,217,160,0.08) 100%)",
                border: "1px solid rgba(0,217,160,0.2)",
                boxShadow: "0 8px 32px rgba(0,217,160,0.08)",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#8F8FA3] text-xs">Virtual Card</p>
                  <p className="text-white font-bold">PAYVORA</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#00D9A0] flex items-center justify-center">
                  <span className="text-[#0A0A0F] font-black text-sm">P</span>
                </div>
              </div>
              <div>
                <p className="text-white font-mono text-base tracking-widest mb-2">
                  •••• •••• •••• 4891
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[#8F8FA3] text-xs mb-0.5">Card Holder</p>
                    <p className="text-white text-sm font-semibold">JOHN D.</p>
                  </div>
                  <div>
                    <p className="text-[#8F8FA3] text-xs mb-0.5">Expires</p>
                    <p className="text-white text-sm font-semibold">12/28</p>
                  </div>
                  <p className="text-[#00D9A0] font-black text-lg">VISA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

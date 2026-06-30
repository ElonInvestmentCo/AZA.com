import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Instant settlements",
    description:
      "Gift card trades settle in under 60 seconds. Wallet funding is instant via bank transfer.",
  },
  {
    title: "Best rates, always",
    description:
      "We offer the best gift card rates in Nigeria, updated in real-time based on market conditions.",
  },
  {
    title: "Bank-grade security",
    description:
      "256-bit encryption, biometric authentication, and 2FA protect every transaction.",
  },
  {
    title: "Zero hidden fees",
    description:
      "What you see is what you pay. No surprise charges, ever.",
  },
  {
    title: "24/7 customer support",
    description:
      "Our team is always available via live chat to resolve any issue fast.",
  },
  {
    title: "Works for everyone",
    description:
      "Whether you're an individual or a business, PayVora scales with your needs.",
  },
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
              PayVora was built from the ground up by Nigerians who understand
              the unique needs of the Nigerian market. Fast, reliable, and
              always improving.
            </p>
            <div className="space-y-5">
              {reasons.map(({ title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-[#00D9A0]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{title}</h4>
                    <p className="text-[#8F8FA3] text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div className="relative">
            <div className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-3xl p-8 space-y-4">
              {/* Virtual card mockup */}
              <div
                className="w-full aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between"
                style={{
                  background:
                    "linear-gradient(135deg, #0A0A0F 0%, #1C1C2A 50%, #00D9A0 200%)",
                  border: "1px solid rgba(0,217,160,0.2)",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#8F8FA3] text-xs">Virtual Card</p>
                    <p className="text-white font-bold">PayVora</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#00D9A0] flex items-center justify-center">
                    <span className="text-[#0A0A0F] font-black text-sm">P</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-mono text-lg tracking-widest mb-2">
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
                    <p className="text-[#00D9A0] font-bold text-lg">VISA</p>
                  </div>
                </div>
              </div>

              {/* Transaction list */}
              <div className="space-y-3">
                {[
                  { label: "Netflix Subscription", amount: "$15.99", time: "2m ago" },
                  { label: "Spotify Premium", amount: "$9.99", time: "1h ago" },
                  { label: "ChatGPT Plus", amount: "$20.00", time: "Yesterday" },
                ].map(({ label, amount, time }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-[#2A2A3D] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#14141F]" />
                      <div>
                        <p className="text-white text-sm font-medium">{label}</p>
                        <p className="text-[#8F8FA3] text-xs">{time}</p>
                      </div>
                    </div>
                    <p className="text-[#FF5B7A] text-sm font-semibold">-{amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

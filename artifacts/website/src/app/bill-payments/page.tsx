import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Lightbulb, Tv, Droplets, Dice6, CheckCircle2, Zap, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Bill Payments – PAYVORA",
  description:
    "Pay electricity, cable TV, water, internet and betting wallet bills instantly with PAYVORA. No queues, no delays.",
};

const billTypes = [
  {
    icon: Lightbulb,
    title: "Electricity",
    color: "#F59E0B",
    desc: "Pay your prepaid or postpaid electricity bills across all 11 Nigerian DISCOs. Token delivered in 30 seconds.",
    providers: [
      "EKEDC (Eko)", "IKEDC (Ikeja)", "AEDC (Abuja)", "PHED (Port Harcourt)",
      "EEDC (Enugu)", "KEDCO (Kano)", "YEDC (Yola)", "JED (Jos)",
      "BEDC (Benin)", "IBEDC (Ibadan)", "KSEDC (Kaduna)",
    ],
  },
  {
    icon: Tv,
    title: "Cable TV",
    color: "#00b8ff",
    desc: "Renew all your cable TV and streaming subscriptions with one tap. Auto-renew available.",
    providers: ["DStv", "GOtv", "StarTimes", "Showmax", "Netflix", "YouTube Premium"],
  },
  {
    icon: Droplets,
    title: "Water Bills",
    color: "#00D9A0",
    desc: "Pay water utility bills across major Nigerian states without visiting any office.",
    providers: ["Lagos Water Corporation", "Abuja FCDA Water", "State water boards"],
  },
  {
    icon: Dice6,
    title: "Betting Wallets",
    color: "#FF5B7A",
    desc: "Fund any betting platform directly from your PAYVORA wallet. No bank delays.",
    providers: ["Sportybet", "Bet9ja", "1xBet", "BetWay", "MSport", "Melbet", "NairaBet", "AccessBet"],
  },
];

const steps = [
  { step: "1", title: "Open PAYVORA", desc: "Launch the app and go to Bills from your home screen." },
  { step: "2", title: "Select category", desc: "Choose from Electricity, Cable TV, Water, or Betting." },
  { step: "3", title: "Enter your details", desc: "Input your meter number, decoder, or account ID." },
  { step: "4", title: "Confirm & pay", desc: "Review the amount and tap confirm. Done in under 30 seconds." },
];

export default function BillPaymentsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              All bills, one app
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
              Pay every bill{" "}
              <span className="text-[#00D9A0]">in seconds.</span>
            </h1>
            <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto mb-10">
              No more queues, no more USSD codes, no more stress. PAYVORA lets you pay every utility bill from your phone in under 30 seconds.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { icon: Zap, label: "30-second payment" },
                { icon: Clock, label: "24/7 availability" },
                { icon: Shield, label: "100% secure" },
                { icon: CheckCircle2, label: "Instant confirmation" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[#8F8FA3]">
                  <Icon size={15} className="text-[#00D9A0]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Bill type cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
            {billTypes.map(({ icon: Icon, title, color, desc, providers }) => (
              <div key={title} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 hover:bg-[#1C1C2A] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="text-white font-bold text-xl">{title}</h3>
                </div>
                <p className="text-[#8F8FA3] text-sm mb-5 leading-relaxed">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {providers.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1.5 text-xs text-[#8F8FA3] bg-[#0A0A0F] border border-[#2A2A3D] rounded-lg px-2.5 py-1"
                    >
                      <CheckCircle2 size={11} className="text-[#00D9A0]" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[#2A2A3D]" />
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.3)] flex items-center justify-center mx-auto mb-4 relative z-10 bg-[#0A0A0F]">
                    <span className="text-[#00D9A0] font-black">{step}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-[#8F8FA3] text-sm leading-relaxed">{desc}</p>
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

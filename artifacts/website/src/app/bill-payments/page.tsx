import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Lightbulb, Tv, Droplets, Dice6, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bill Payments – PayVora",
  description:
    "Pay electricity, cable TV, water, internet and betting wallet bills instantly with PayVora. No queues, no delays.",
};

const billTypes = [
  {
    icon: Lightbulb,
    title: "Electricity",
    color: "#F59E0B",
    providers: ["EKEDC (Eko)", "IKEDC (Ikeja)", "AEDC (Abuja)", "PHED (Port Harcourt)", "EEDC (Enugu)", "KEDCO (Kano)", "YEDC (Yola)", "JED (Jos)", "BEDC (Benin)", "IBEDC (Ibadan)"],
  },
  {
    icon: Tv,
    title: "Cable TV",
    color: "#00b8ff",
    providers: ["DStv", "GOtv", "StarTimes", "Showmax", "Netflix", "YouTube Premium"],
  },
  {
    icon: Droplets,
    title: "Water Bills",
    color: "#00D9A0",
    providers: ["Lagos Water Corporation", "Abuja FCDA Water", "State water boards"],
  },
  {
    icon: Dice6,
    title: "Betting Wallets",
    color: "#FF5B7A",
    providers: ["Sportybet", "Bet9ja", "1xBet", "BetWay", "MSport", "Melbet", "NairaBet", "AccessBet"],
  },
];

export default function BillPaymentsPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              All bills, one app
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
              Pay every bill{" "}
              <span className="text-[#00D9A0]">in seconds.</span>
            </h1>
            <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto">
              No more queues, no more USSD codes, no more stress. PayVora lets you pay every utility bill from your phone in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {billTypes.map(({ icon: Icon, title, color, providers }) => (
              <div key={title} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="text-white font-bold text-xl">{title}</h3>
                </div>
                <div className="space-y-2">
                  {providers.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#00D9A0] flex-shrink-0" />
                      <span className="text-[#8F8FA3] text-sm">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <DownloadCTA />
    </>
  );
}

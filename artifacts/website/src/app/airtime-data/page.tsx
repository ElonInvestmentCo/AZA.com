import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Zap, Wifi, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Airtime & Data – PayVora",
  description:
    "Recharge MTN, Airtel, Glo, and 9mobile airtime and data bundles at the cheapest rates in Nigeria.",
};

const networks = [
  { name: "MTN", color: "#FFCC00", plans: ["500MB – ₦100", "1GB – ₦200", "2GB – ₦500", "5GB – ₦1,000", "10GB – ₦2,000", "20GB – ₦3,500"] },
  { name: "Airtel", color: "#FF0000", plans: ["500MB – ₦100", "1.5GB – ₦200", "3GB – ₦500", "6GB – ₦1,000", "12GB – ₦2,000", "24GB – ₦3,500"] },
  { name: "Glo", color: "#00A651", plans: ["1GB – ₦100", "2.5GB – ₦200", "5GB – ₦500", "10GB – ₦1,000", "18.25GB – ₦2,000", "38GB – ₦3,500"] },
  { name: "9mobile", color: "#00AA4F", plans: ["150MB – ₦100", "500MB – ₦200", "1.5GB – ₦500", "3.5GB – ₦1,000", "7.5GB – ₦2,000", "15GB – ₦3,500"] },
];

export default function AirtimeDataPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              All networks supported
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
              Stay connected,{" "}
              <span className="text-[#00D9A0]">always.</span>
            </h1>
            <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto mb-12">
              Recharge airtime or buy data bundles for any Nigerian network in seconds. The cheapest rates, guaranteed.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-16">
              {[
                { icon: Zap, label: "Instant airtime top-up" },
                { icon: Wifi, label: "All data bundle sizes" },
                { icon: CheckCircle2, label: "No USSD codes needed" },
                { icon: CheckCircle2, label: "24/7 availability" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[#8F8FA3] text-sm">
                  <Icon size={16} className="text-[#00D9A0] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {networks.map(({ name, color, plans }) => (
              <div key={name} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: color, color: "#0A0A0F" }}>
                    {name[0]}
                  </div>
                  <h3 className="text-white font-bold text-xl">{name}</h3>
                </div>
                <div className="space-y-2">
                  {plans.map((p) => (
                    <div key={p} className="flex items-center justify-between py-1.5 border-b border-[#2A2A3D] last:border-0">
                      <span className="text-[#8F8FA3] text-sm">{p.split(" – ")[0]}</span>
                      <span className="text-[#00D9A0] text-sm font-semibold">{p.split(" – ")[1]}</span>
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

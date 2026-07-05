import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Zap, Wifi, CheckCircle2, Clock, Shield, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Airtime & Data – PAYVORA",
  description:
    "Recharge MTN, Airtel, Glo, and 9mobile airtime and data bundles at the cheapest rates in Nigeria.",
};

const networks = [
  {
    name: "MTN",
    color: "#FFCC00",
    textColor: "#0A0A0F",
    plans: [
      { size: "500MB", price: "₦100" },
      { size: "1GB", price: "₦200" },
      { size: "2GB", price: "₦500" },
      { size: "5GB", price: "₦1,000" },
      { size: "10GB", price: "₦2,000" },
      { size: "20GB", price: "₦3,500" },
    ],
  },
  {
    name: "Airtel",
    color: "#FF0000",
    textColor: "#FFFFFF",
    plans: [
      { size: "500MB", price: "₦100" },
      { size: "1.5GB", price: "₦200" },
      { size: "3GB", price: "₦500" },
      { size: "6GB", price: "₦1,000" },
      { size: "12GB", price: "₦2,000" },
      { size: "24GB", price: "₦3,500" },
    ],
  },
  {
    name: "Glo",
    color: "#00A651",
    textColor: "#FFFFFF",
    plans: [
      { size: "1GB", price: "₦100" },
      { size: "2.5GB", price: "₦200" },
      { size: "5GB", price: "₦500" },
      { size: "10GB", price: "₦1,000" },
      { size: "18.25GB", price: "₦2,000" },
      { size: "38GB", price: "₦3,500" },
    ],
  },
  {
    name: "9mobile",
    color: "#006B3F",
    textColor: "#FFFFFF",
    plans: [
      { size: "150MB", price: "₦100" },
      { size: "500MB", price: "₦200" },
      { size: "1.5GB", price: "₦500" },
      { size: "3.5GB", price: "₦1,000" },
      { size: "7.5GB", price: "₦2,000" },
      { size: "15GB", price: "₦3,500" },
    ],
  },
];

const perks = [
  { icon: Zap, label: "Instant airtime delivery" },
  { icon: Wifi, label: "All data bundle sizes" },
  { icon: Smartphone, label: "Any phone number" },
  { icon: CheckCircle2, label: "No USSD codes needed" },
  { icon: Clock, label: "24/7 availability" },
  { icon: Shield, label: "Secure transactions" },
];

const steps = [
  { step: "1", title: "Open PAYVORA", desc: "Go to Airtime or Data from your home dashboard." },
  { step: "2", title: "Pick your network", desc: "Select MTN, Airtel, Glo, or 9mobile." },
  { step: "3", title: "Enter number & amount", desc: "Type the phone number and choose a plan." },
  { step: "4", title: "Done!", desc: "Airtime or data lands on the number instantly." },
];

export default function AirtimeDataPage() {
  return (
    <>
      <section className="pt-32 pb-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              All networks supported
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
              Stay connected,{" "}
              <span className="text-[#00D9A0]">always.</span>
            </h1>
            <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto mb-12">
              Recharge airtime or buy data bundles for any Nigerian network in seconds. The cheapest rates, guaranteed — no USSD, no queues.
            </p>

            {/* Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-16">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[#8F8FA3] text-sm bg-[#14141F] border border-[#2A2A3D] rounded-xl px-3 py-2.5">
                  <Icon size={15} className="text-[#00D9A0] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Network data plans */}
          <div className="mb-24">
            <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
              Data bundle prices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {networks.map(({ name, color, textColor, plans }) => (
                <div key={name} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden hover:border-[#3A3A4D] transition-all">
                  {/* Network header */}
                  <div className="flex items-center gap-3 p-5 border-b border-[#2A2A3D]" style={{ background: `${color}12` }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ background: color, color: textColor }}
                    >
                      {name[0]}
                    </div>
                    <h3 className="text-white font-bold text-xl">{name}</h3>
                    <span className="ml-auto text-xs text-[#00D9A0] font-semibold">Best rates</span>
                  </div>

                  {/* Plans */}
                  <div className="p-4 space-y-1">
                    {plans.map(({ size, price }) => (
                      <div
                        key={size}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#1C1C2A] transition-colors group cursor-default"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-white text-sm font-medium">{size}</span>
                        </div>
                        <span className="text-[#00D9A0] text-sm font-bold">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12">
              Recharge in 4 easy steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0A0A0F] border border-[rgba(0,217,160,0.3)] flex items-center justify-center mx-auto mb-4">
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

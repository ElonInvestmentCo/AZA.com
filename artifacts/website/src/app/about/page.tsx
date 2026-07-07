import type { Metadata } from "next";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Users, Target, Heart, Zap, Globe, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About PAYVORA – Nigeria's Premium Fintech Platform",
  description:
    "Learn about PAYVORA's mission, team, and story. We're building Nigeria's most trusted fintech platform for everyday financial services.",
  alternates: { canonical: "https://www.payvora.org/about" },
};

const values = [
  {
    icon: Heart,
    title: "Built for Nigerians",
    desc: "Every feature is designed around the real financial needs of Nigerians — from gift card trading to instant bill payments.",
  },
  {
    icon: Zap,
    title: "Speed first",
    desc: "We obsess over every millisecond. Transactions that used to take hours now take seconds on PAYVORA.",
  },
  {
    icon: Target,
    title: "Radical transparency",
    desc: "No hidden fees. No fine print traps. Every rate, every charge is shown before you confirm.",
  },
  {
    icon: Globe,
    title: "Global reach, local feel",
    desc: "Trade gift cards from Amazon, iTunes, Steam and more — all converted to Naira instantly in your wallet.",
  },
  {
    icon: Users,
    title: "Community driven",
    desc: "We listen to our users. Our roadmap is shaped by the 50,000+ Nigerians who use PAYVORA every day.",
  },
  {
    icon: TrendingUp,
    title: "Always improving",
    desc: "We ship new features every week. If something doesn't work perfectly, we fix it — fast.",
  },
];

const stats = [
  { value: "50K+", label: "Active users" },
  { value: "₦2B+", label: "Transactions processed" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "4.9★", label: "App store rating" },
];

const team = [
  {
    name: "Adewale Okonkwo",
    role: "Co-founder & CEO",
    bio: "Former product lead at Flutterwave. Passionate about making financial services accessible to every Nigerian.",
  },
  {
    name: "Chidinma Eze",
    role: "Co-founder & CTO",
    bio: "10 years of engineering experience across fintech and e-commerce. Built systems handling millions of transactions.",
  },
  {
    name: "Emeka Nwosu",
    role: "Head of Product",
    bio: "UX researcher and product strategist. Previously at PiggyVest. Obsessed with delightful user experiences.",
  },
  {
    name: "Fatima Bello",
    role: "Head of Compliance",
    bio: "Regulatory expert with deep knowledge of Nigerian fintech law, AML, and KYC compliance frameworks.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Our story
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            We&apos;re building the financial{" "}
            <span className="text-[#00D9A0]">OS for Nigeria.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto leading-relaxed">
            PAYVORA was founded with a simple belief: every Nigerian deserves fast, safe, and fair access to financial services — no bank queues, no hidden fees, no frustration.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#14141F] border-y border-[#2A2A3D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-black text-[#00D9A0] mb-2">{value}</div>
                <div className="text-[#8F8FA3] text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(0,217,160,0.08)" }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">Our mission</h2>
              <p className="text-[#8F8FA3] text-lg leading-relaxed mb-6">
                Financial services in Nigeria have historically been slow, expensive, and exclusionary. Long queues, multiple apps, hidden fees, and unreliable infrastructure left millions underserved.
              </p>
              <p className="text-[#8F8FA3] text-lg leading-relaxed mb-6">
                PAYVORA exists to change that. We&apos;re building a single platform where every Nigerian can trade gift cards, pay bills, buy airtime, get a virtual dollar card, and manage their wallet — all in one beautifully designed app that just works.
              </p>
              <p className="text-white font-semibold text-lg">
                Fast. Transparent. Yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#14141F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">What we stand for</h2>
            <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
              These aren&apos;t just values on a wall. They shape every product decision, every hire, and every line of code we write.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-7 hover:border-[#00D9A0]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#00D9A0]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-[#8F8FA3] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Meet the team</h2>
            <p className="text-[#8F8FA3] text-lg max-w-xl mx-auto">
              A small, focused team of builders obsessed with making financial services better for Nigeria.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map(({ name, role, bio }) => (
              <div
                key={name}
                className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-8 hover:border-[#00D9A0]/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center mb-5">
                  <span className="text-[#00D9A0] font-black text-xl">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
                <p className="text-[#00D9A0] text-sm font-medium mb-4">{role}</p>
                <p className="text-[#8F8FA3] text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="py-16 bg-[#14141F] border-t border-[#2A2A3D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">We&apos;re hiring</h2>
          <p className="text-[#8F8FA3] text-lg mb-8">
            Want to help build Nigeria&apos;s most trusted fintech platform? We&apos;re looking for engineers, designers, and operators who care deeply about their craft.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-2xl hover:bg-[#00C490] transition-colors"
          >
            See open positions
          </a>
        </div>
      </section>

      <DownloadCTA />
    </>
  );
}

import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at PAYVORA – Join Our Team",
  description:
    "Help build Nigeria's most trusted fintech platform. See open roles in engineering, design, product, and operations at PAYVORA.",
  alternates: { canonical: "https://www.payvora.org/careers" },
};

const openRoles = [
  {
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    description:
      "Build the systems that process millions of naira in transactions every day. You&apos;ll work on our Node.js/TypeScript API, PostgreSQL database, and third-party payment integrations.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    description:
      "Shape the experience of PAYVORA for 50,000+ users. You&apos;ll own the end-to-end design of new features — from user research through to polished Figma handoffs.",
  },
  {
    title: "Mobile Engineer (React Native)",
    department: "Engineering",
    location: "Remote (Nigeria)",
    type: "Full-time",
    description:
      "Own the PAYVORA mobile app on iOS and Android. You&apos;ll build new features, optimize performance, and work closely with our design team to bring beautiful interfaces to life.",
  },
  {
    title: "Customer Support Lead",
    department: "Operations",
    location: "Lagos, Nigeria",
    type: "Full-time",
    description:
      "Be the voice of PAYVORA for our users. You&apos;ll build and lead a support team that resolves issues fast and collects feedback that shapes our product roadmap.",
  },
  {
    title: "Compliance Officer",
    department: "Legal & Compliance",
    location: "Lagos, Nigeria",
    type: "Full-time",
    description:
      "Keep PAYVORA on the right side of Nigerian fintech regulation. You&apos;ll manage AML monitoring, KYC processes, regulatory reporting, and relationships with our compliance partners.",
  },
  {
    title: "Growth Marketer",
    department: "Marketing",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    description:
      "Drive user acquisition and retention for PAYVORA. You&apos;ll run campaigns across social, email, referral, and paid channels — measuring everything and doubling down on what works.",
  },
];

const perks = [
  { emoji: "💰", label: "Competitive salary", desc: "Top-of-market pay for Nigeria, paid in Naira" },
  { emoji: "🏥", label: "Health insurance", desc: "Comprehensive HMO cover for you and your family" },
  { emoji: "🌴", label: "Flexible leave", desc: "25 days annual leave + Nigerian public holidays" },
  { emoji: "📚", label: "Learning budget", desc: "₦200,000/year for courses, books, and conferences" },
  { emoji: "🏠", label: "Remote flexibility", desc: "Most roles support hybrid or fully remote arrangements" },
  { emoji: "🚀", label: "Equity options", desc: "Share in the company's success as we grow" },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            We&apos;re hiring
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Build something that{" "}
            <span className="text-[#00D9A0]">matters for Nigeria.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto leading-relaxed">
            At PAYVORA, you&apos;ll work on hard problems with a small, talented team that moves fast, ships often, and cares deeply about the people using our product.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-[#14141F] border-y border-[#2A2A3D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white text-center mb-12">Why work at PAYVORA?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map(({ emoji, label, desc }) => (
              <div key={label} className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-6">
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="text-white font-bold mb-2">{label}</h3>
                <p className="text-[#8F8FA3] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white mb-3">Open roles</h2>
          <p className="text-[#8F8FA3] mb-12">
            Don&apos;t see a perfect fit?{" "}
            <a href="mailto:careers@payvora.com" className="text-[#00D9A0] hover:underline">
              Send us your CV anyway
            </a>{" "}
            — we hire great people even when we don&apos;t have a listed role.
          </p>
          <div className="space-y-4">
            {openRoles.map(({ title, department, location, type, description }) => (
              <a
                key={title}
                href={`mailto:careers@payvora.com?subject=Application: ${encodeURIComponent(title)}`}
                className="block bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-7 hover:border-[#00D9A0]/40 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-[#00D9A0] bg-[rgba(0,217,160,0.1)] px-2.5 py-1 rounded-lg">
                        {department}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                    <p className="text-[#8F8FA3] text-sm leading-relaxed mb-4">{description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#8F8FA3]">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#00D9A0] text-sm font-semibold sm:pt-1 group-hover:gap-3 transition-all">
                    Apply <ArrowRight size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* No roles CTA */}
      <section className="py-16 bg-[#14141F] border-t border-[#2A2A3D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase size={32} className="text-[#00D9A0] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Didn&apos;t find your role?</h2>
          <p className="text-[#8F8FA3] mb-6">
            We&apos;re always open to exceptional people. Send us a note about yourself and what you&apos;d bring to PAYVORA.
          </p>
          <a
            href="mailto:careers@payvora.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-2xl hover:bg-[#00C490] transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  );
}

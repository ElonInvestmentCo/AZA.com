import type { Metadata } from "next";
import { Download, ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Press & Media – PAYVORA",
  description:
    "Press kit, brand assets, and media contact for PAYVORA. Journalists and media professionals can access logos, screenshots, and company information here.",
  alternates: { canonical: "https://www.payvora.org/press" },
};

const coverage = [
  {
    outlet: "TechCabal",
    headline: "PAYVORA is solving gift card trading for Nigerian users with a slick new app",
    date: "June 2026",
    href: "#",
  },
  {
    outlet: "Nairametrics",
    headline: "How PAYVORA's virtual dollar card is helping Nigerians pay for international services",
    date: "May 2026",
    href: "#",
  },
  {
    outlet: "Techpoint Africa",
    headline: "Nigerian fintech PAYVORA processes ₦2B in transactions in its first year",
    date: "April 2026",
    href: "#",
  },
  {
    outlet: "BusinessDay",
    headline: "PAYVORA raises seed funding to expand bill payment and virtual card services",
    date: "March 2026",
    href: "#",
  },
];

const stats = [
  { value: "2025", label: "Founded" },
  { value: "Lagos", label: "Headquartered" },
  { value: "50K+", label: "Active users" },
  { value: "₦2B+", label: "Processed" },
];

const assets = [
  { name: "PAYVORA Wordmark (SVG)", type: "Logo", size: "SVG" },
  { name: "PAYVORA Icon (PNG 1024px)", type: "Logo", size: "PNG" },
  { name: "App Screenshots Pack", type: "Screenshots", size: "ZIP" },
  { name: "Brand Guidelines", type: "Document", size: "PDF" },
  { name: "Founder Headshots", type: "Photos", size: "ZIP" },
  { name: "Press Release (Latest)", type: "Document", size: "PDF" },
];

export default function PressPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.1)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Press & Media
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
            PAYVORA in the{" "}
            <span className="text-[#00D9A0]">press.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed mb-10">
            Download our press kit, access brand assets, or get in touch with our communications team. We respond to press enquiries within 24 hours.
          </p>
          <a
            href="mailto:press@payvora.com"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
          >
            <Mail size={16} /> Contact press team
          </a>
        </div>
      </section>

      {/* Company snapshot */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-[#00D9A0] mb-1">{value}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-gray-900 font-bold text-xl mb-4">About PAYVORA</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              PAYVORA is a Lagos-based fintech platform that enables Nigerians to trade gift cards for instant cash, pay utility bills, recharge airtime and data, and access virtual USD cards — all from a single mobile application.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Founded in 2025, PAYVORA has processed over ₦2 billion in transactions and serves more than 50,000 active users across Nigeria. The platform is available on iOS and Android, with a web app at payvora.org.
            </p>
          </div>
        </div>
      </section>

      {/* Press kit download */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Brand assets</h2>
          <p className="text-gray-500 mb-8">
            Use these assets in accordance with our{" "}
            <a href="mailto:press@payvora.com" className="text-[#00D9A0] hover:underline">
              brand guidelines
            </a>
            . Do not alter logos or brand colors.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {assets.map(({ name, type, size }) => (
              <div
                key={name}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-[#00D9A0]/40 transition-colors group"
              >
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {type} · {size}
                  </p>
                </div>
                <span
                  aria-label={`${name} (coming soon)`}
                  title="Download available soon"
                  className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300 cursor-not-allowed"
                >
                  <Download size={15} />
                </span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            Need a higher-resolution asset or something not listed here?{" "}
            <a href="mailto:press@payvora.com" className="text-[#00D9A0] hover:underline">
              Email press@payvora.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-10">Recent coverage</h2>
          <div className="space-y-4">
            {coverage.map(({ outlet, headline, date, href }) => (
              <a
                key={headline}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-[#00D9A0]/40 transition-colors group"
              >
                <div>
                  <p className="text-[#00D9A0] text-xs font-bold uppercase tracking-wider mb-2">{outlet}</p>
                  <p className="text-gray-900 font-semibold leading-snug mb-1 group-hover:text-[#00D9A0] transition-colors">
                    {headline}
                  </p>
                  <p className="text-gray-500 text-xs">{date}</p>
                </div>
                <ExternalLink size={15} className="text-gray-400 flex-shrink-0 mt-1" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Press enquiries</h2>
          <p className="text-gray-500 mb-6">
            For interviews, exclusives, or media requests, contact our communications team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="mailto:press@payvora.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              <Mail size={15} /> press@payvora.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

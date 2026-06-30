"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How do I create a PayVora account?",
    a: "Download the PayVora app, tap 'Register', enter your email, phone number, and create a password. Verify your email via OTP and you're ready to go.",
  },
  {
    q: "How long does gift card trading take?",
    a: "Most gift card trades are processed within 60 seconds. In rare cases of high traffic, it may take up to 5 minutes.",
  },
  {
    q: "Is PayVora safe to use?",
    a: "Yes. PayVora uses 256-bit encryption, 2FA, and continuous fraud monitoring. Your funds and data are always protected.",
  },
  {
    q: "What gift cards does PayVora accept?",
    a: "We accept Amazon, iTunes, Google Play, Steam, Razer Gold, Walmart, eBay, Visa, and 50+ more brands.",
  },
  {
    q: "Can I withdraw my balance to my bank account?",
    a: "Yes. You can withdraw to any Nigerian bank account instantly with zero fees for amounts above ₦5,000.",
  },
];

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#0A0A0F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-[#8F8FA3] text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-white font-semibold text-sm sm:text-base">
                  {q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#8F8FA3] flex-shrink-0 ml-4 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#8F8FA3] text-sm leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[#00D9A0] font-semibold hover:gap-3 transition-all"
          >
            View all FAQs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

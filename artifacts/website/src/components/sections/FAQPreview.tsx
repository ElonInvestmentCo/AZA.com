"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  { q: "How do I create a PAYVORA account?",         a: "Download the PAYVORA app, tap 'Register', enter your email, phone number, and create a password. Verify your email via OTP and you're ready to go."         },
  { q: "How long does gift card trading take?",       a: "Most gift card trades are processed within 60 seconds. In rare cases of high traffic, it may take up to 5 minutes."                                          },
  { q: "Is PAYVORA safe to use?",                    a: "Yes. PAYVORA uses 256-bit encryption, 2FA, and continuous fraud monitoring. Your funds and data are always protected."                                        },
  { q: "What gift cards does PAYVORA accept?",        a: "We accept Amazon, iTunes, Google Play, Steam, Razer Gold, Walmart, eBay, Visa, and 50+ more brands."                                                        },
  { q: "Can I withdraw my balance to my bank account?",a: "Yes. You can withdraw to any Nigerian bank account instantly with zero fees for amounts above ₦5,000."                                                      },
];

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-lg">Got questions? We&apos;ve got answers.</p>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-gray-900 font-semibold text-sm sm:text-base">{q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${openIndex === i ? "rotate-180 text-[#00D9A0]" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-gray-50">
                  <p className="text-gray-500 text-sm leading-relaxed pt-4">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[#00D9A0] font-semibold hover:gap-3 transition-all hover:text-[#00B88A]"
          >
            View all FAQs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

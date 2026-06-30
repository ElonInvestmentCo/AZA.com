"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    title: "Account & Registration",
    faqs: [
      {
        q: "How do I create a PayVora account?",
        a: "Download the PayVora app, tap 'Register', enter your email, phone number, and a strong password. Verify your email via OTP and your account is ready immediately.",
      },
      {
        q: "What documents do I need to register?",
        a: "A basic account only requires a valid email address and phone number. To unlock higher transaction limits, complete KYC verification with a government-issued ID (NIN, BVN, or International Passport).",
      },
      {
        q: "Can I have multiple PayVora accounts?",
        a: "No. One account per user is enforced. Multiple accounts violate our Terms of Service and may result in a permanent ban.",
      },
      {
        q: "Is PayVora available outside Nigeria?",
        a: "PayVora is optimised for Nigerian users. Gift card trading is available internationally, but local bill payment services are Nigeria-only.",
      },
    ],
  },
  {
    title: "Security",
    faqs: [
      {
        q: "Is PayVora safe to use?",
        a: "Yes. We use 256-bit AES encryption, TLS 1.3 for data in transit, two-factor authentication, and AI-powered fraud monitoring. Your data is never sold to third parties.",
      },
      {
        q: "What should I do if I suspect unauthorised access?",
        a: "Immediately tap 'Freeze Account' in the app settings, then contact our support team via live chat. We'll investigate and restore your account within 24 hours.",
      },
      {
        q: "How is my PIN and password stored?",
        a: "Passwords are hashed with bcrypt using a unique salt per user. PINs are encrypted with AES-256. Even our engineers cannot access your credentials.",
      },
      {
        q: "Does PayVora support two-factor authentication?",
        a: "Yes. Enable OTP-based 2FA from your account settings. We strongly recommend this for an extra layer of security.",
      },
    ],
  },
  {
    title: "Gift Cards",
    faqs: [
      {
        q: "What gift card brands does PayVora accept?",
        a: "We accept 50+ brands including Amazon, iTunes, Google Play, Steam, Razer Gold, Walmart, eBay, Visa Gift Cards, Netflix, Xbox, PlayStation, Nike, Target, Best Buy, and many more.",
      },
      {
        q: "How long does gift card verification take?",
        a: "Most cards are verified and settled within 60 seconds. In rare high-traffic periods, it may take up to 5 minutes.",
      },
      {
        q: "What happens if my gift card is rejected?",
        a: "Cards can be rejected if already used, expired, or counterfeit. You'll receive a notification with a reason and can request a manual review within 24 hours.",
      },
      {
        q: "Can I sell partially used gift cards?",
        a: "Yes, as long as the remaining balance is above the minimum threshold for that brand.",
      },
    ],
  },
  {
    title: "Withdrawals & Payments",
    faqs: [
      {
        q: "How do I withdraw from my PayVora wallet?",
        a: "Go to 'Wallet' → 'Withdraw', enter the amount and your bank account details. Withdrawals above ₦5,000 are instant and free.",
      },
      {
        q: "What are the withdrawal limits?",
        a: "Basic accounts: up to ₦100,000 per day. Verified accounts: ₦2,000,000 per day. Contact support for business-tier limits.",
      },
      {
        q: "How long do withdrawals take?",
        a: "Most withdrawals reach your bank account within 30 seconds. In rare cases it can take up to 1 business hour depending on your bank.",
      },
      {
        q: "Are there hidden fees?",
        a: "None. Airtime and data purchases have zero fees. Bill payments have a flat ₦50 service charge. Withdrawals above ₦5,000 are free. Gift card rates shown are what you get.",
      },
    ],
  },
  {
    title: "Virtual Cards",
    faqs: [
      {
        q: "How do I get a virtual card?",
        a: "Complete KYC verification, then go to the 'Cards' tab, tap 'Create Card', fund it from your wallet — your card details appear instantly.",
      },
      {
        q: "What currency is the virtual card in?",
        a: "PayVora virtual cards are USD-denominated Visa cards, accepted on any international website.",
      },
      {
        q: "Can I use the virtual card for recurring payments?",
        a: "Yes. Save your card for recurring charges like Netflix, Spotify, ChatGPT, and other subscriptions.",
      },
      {
        q: "Is there a monthly fee?",
        a: "No monthly fee. A small one-time card creation fee may apply; all subsequent transactions are free.",
      },
    ],
  },
  {
    title: "Bill Payments",
    faqs: [
      {
        q: "Which electricity DISCOs are supported?",
        a: "All 11 Nigerian DISCOs: EKEDC, IKEDC, AEDC, PHED, EEDC, KEDCO, YEDC, JED, BEDC, IBEDC, and KSEDC.",
      },
      {
        q: "How quickly does the electricity token arrive?",
        a: "Tokens are delivered to the registered phone number within 30 seconds of payment confirmation.",
      },
      {
        q: "Which cable TV subscriptions can I renew?",
        a: "DStv, GOtv, StarTimes, Showmax, and YouTube Premium are all supported.",
      },
      {
        q: "Can I schedule recurring bill payments?",
        a: "Yes. PayVora supports auto-pay scheduling — set any bill to renew monthly automatically from your wallet balance.",
      },
    ],
  },
];

export function FAQClient() {
  const [activeCategory, setActiveCategory] = useState(categories[0].title);
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    categories[0].faqs[0].q
  );

  const activeFaqs =
    categories.find((c) => c.title === activeCategory)?.faqs ?? [];

  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#8F8FA3] text-xl">
            Everything you need to know about PayVora.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map(({ title }) => (
            <button
              key={title}
              onClick={() => {
                setActiveCategory(title);
                setOpenQuestion(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === title
                  ? "bg-[#00D9A0] text-[#0A0A0F]"
                  : "bg-[#14141F] border border-[#2A2A3D] text-[#8F8FA3] hover:text-white"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {activeFaqs.map(({ q, a }) => (
            <div
              key={q}
              className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() =>
                  setOpenQuestion(openQuestion === q ? null : q)
                }
              >
                <span className="text-white font-semibold pr-4">{q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#8F8FA3] flex-shrink-0 transition-transform duration-200 ${
                    openQuestion === q ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openQuestion === q && (
                <div className="px-6 pb-5">
                  <p className="text-[#8F8FA3] leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

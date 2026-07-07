import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service – PAYVORA",
  description:
    "Read PAYVORA's Terms of Service. By using our platform you agree to these terms.",
  alternates: { canonical: "https://www.payvora.org/terms" },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By downloading the PAYVORA app, accessing our website, registering an account, or using any of our services (collectively, the \"Services\"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use our Services.\n\nWe may update these Terms of Service at any time. We will provide at least 14 days' notice of material changes via in-app notification or email. Continued use of the Services after the effective date constitutes your acceptance of the updated terms.",
  },
  {
    title: "2. Eligibility",
    body: "To use PAYVORA, you must:\n\n• Be at least 18 years of age\n• Be a resident of Nigeria or a country in which PAYVORA is licensed to operate\n• Have the legal capacity to enter into a binding agreement\n• Not be prohibited from receiving our Services under applicable law\n\nBy creating an account, you confirm that all information you provide is accurate, complete, and truthful.",
  },
  {
    title: "3. Account Responsibilities",
    body: "You are solely responsible for:\n\n• Maintaining the confidentiality of your account credentials (email, password, and transaction PIN)\n• All activities that occur under your account, whether authorized by you or not\n• Enabling and protecting any two-factor or biometric authentication features\n\nYou must notify us immediately at support@payvora.com if you suspect unauthorized access to your account. PAYVORA will never ask for your password or PIN via email, phone call, or SMS.",
  },
  {
    title: "4. Gift Card Trading",
    body: "PAYVORA facilitates gift card trades at rates set by us and updated in real time. By submitting a gift card for trade, you confirm that:\n\n• The card is genuine, unaltered, and has not been tampered with\n• The card is unused or partially used, as accurately declared\n• The card was legally obtained by you or given to you as a legitimate gift\n• You are not acting as an agent or intermediary for another person\n\nTrading stolen, counterfeit, fraudulently obtained, or illegally resold gift cards is strictly prohibited and may result in immediate account termination and referral to law enforcement.",
  },
  {
    title: "5. Wallet and Funds",
    body: "PAYVORA wallet balances are denominated in Nigerian Naira (NGN). Key terms:\n\n• Funds held in your PAYVORA wallet are held in trust on your behalf.\n• We do not pay interest on wallet balances.\n• Withdrawals are processed to verified Nigerian bank accounts only, subject to daily limits by KYC tier.\n• Wallet funds are not insured by the NDIC as PAYVORA is not a licensed deposit-taking bank.\n• In the event of PAYVORA's insolvency, wallet funds are ring-fenced and held separately from operating funds.",
  },
  {
    title: "6. Virtual Dollar Cards",
    body: "Virtual USD cards issued through PAYVORA are subject to:\n\n• Availability based on your KYC verification tier\n• Applicable funding limits and transaction caps\n• Our card partner's terms and conditions\n\nCard balances are non-refundable except in cases of a documented platform error. Fraudulent chargebacks may result in permanent account suspension.",
  },
  {
    title: "7. Bill Payments and Airtime",
    body: "Bill payments and airtime/data purchases are processed in real time through licensed third-party providers. Once a transaction is submitted and confirmed, it cannot be reversed.\n\nPAYVORA is not responsible for service disruptions caused by the utility provider or telco, or for incorrect details entered by the user.\n\nFor failed transactions where funds are deducted but service is not delivered, contact support@payvora.com within 24 hours.",
  },
  {
    title: "8. Prohibited Activities",
    body: "You may not use PAYVORA to:\n\n(a) Launder money, finance terrorism, or engage in any AML/CTF violations\n(b) Trade stolen, counterfeit, or fraudulently obtained gift cards\n(c) Create multiple accounts for any reason\n(d) Impersonate another person or provide false identity information\n(e) Reverse-engineer, decompile, or copy any part of our platform\n(f) Use automated scripts, bots, or tools to access our Services\n(g) Engage in market manipulation or exploit rate arbitrage\n(h) Violate any applicable law, regulation, or third-party rights\n\nViolations may result in immediate account termination and referral to regulatory or law enforcement authorities.",
  },
  {
    title: "9. Fees and Charges",
    body: "Our fee schedule is displayed clearly in-app before each transaction is confirmed. By confirming a transaction, you agree to the applicable fees. Fees are subject to change with at least 7 days' notice for existing users. Disputed fees must be reported within 30 days of the transaction date.",
  },
  {
    title: "10. Intellectual Property",
    body: "All content, features, and design elements of the PAYVORA platform — including logos, wordmarks, icons, text, graphics, and software — are owned by PAYVORA or its licensors. You may not reproduce, distribute, modify, or commercially exploit any part of our platform without our prior written consent.",
  },
  {
    title: "11. Disclaimer of Warranties",
    body: "The Services are provided on an \"as is\" and \"as available\" basis without warranties of any kind. To the fullest extent permitted by Nigerian law, PAYVORA disclaims all warranties including fitness for a particular purpose, merchantability, non-infringement, and uninterrupted or error-free operation.",
  },
  {
    title: "12. Limitation of Liability",
    body: "To the fullest extent permitted by Nigerian law, PAYVORA's aggregate liability to you shall not exceed the total fees you paid to PAYVORA in the 3 calendar months immediately preceding the claim.\n\nPAYVORA is not liable for indirect, consequential, special, or punitive damages, or for losses resulting from network outages, third-party failures, or your failure to maintain account security.",
  },
  {
    title: "13. Dispute Resolution",
    body: "Contact our support team at support@payvora.com first. Most issues resolve within 48 business hours.\n\nIf a dispute cannot be resolved informally within 30 days, it shall be submitted to binding arbitration under the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria 2004. The seat of arbitration shall be Lagos, Nigeria.",
  },
  {
    title: "14. Governing Law",
    body: "These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal proceedings not subject to arbitration shall be brought exclusively in the courts of Lagos State, Nigeria.",
  },
  {
    title: "15. Termination",
    body: "PAYVORA reserves the right to suspend or terminate your account at any time if you violate these Terms, we are required to do so by law, or we reasonably suspect fraudulent activity.\n\nYou may close your account at any time by contacting support@payvora.com. Upon closure, your wallet balance will be paid out within 10 business days, subject to any pending investigations.",
  },
  {
    title: "16. Contact",
    body: "For questions about these Terms:\n\nLegal: legal@payvora.com\nGeneral Support: support@payvora.com\nPrivacy: privacy@payvora.com\n\nPAYVORA, Lagos, Nigeria",
  },
];

export default function TermsPage() {
  const toc = sections.map((s) => ({
    anchor: s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: s.title,
  }));

  return (
    <main className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00D9A0]/10 border border-[#00D9A0]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D9A0]" />
            <span className="text-[#00D9A0] text-sm font-semibold">Legal Document</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-base">
            Last updated: <span className="text-gray-900 font-medium">July 6, 2026</span>
          </p>
          <p className="text-gray-500 mt-4 leading-relaxed max-w-2xl">
            Please read these terms carefully before using PAYVORA. By creating an account
            or using any of our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          {/* Table of Contents */}
          <aside className="hidden lg:block sticky top-28">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </h2>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    className="block text-sm text-gray-500 hover:text-[#00D9A0] py-1.5 transition-colors leading-snug"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-12">
            {sections.map(({ title, body }) => {
              const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <section key={title} id={anchor} className="scroll-mt-32">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 rounded-full bg-[#00D9A0] flex-shrink-0" />
                    {title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed whitespace-pre-line pl-4 border-l border-gray-100">
                    {body}
                  </p>
                </section>
              );
            })}

            {/* Contact card */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Questions about these terms?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Our legal team is happy to clarify anything. We aim to respond within 72 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:legal@payvora.com"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  legal@payvora.com
                </a>
                <a
                  href="mailto:support@payvora.com"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-gray-300 transition-colors"
                >
                  support@payvora.com
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                For information about how we handle your data, see our{" "}
                <Link href="/privacy" className="text-[#00D9A0] hover:underline">Privacy Policy</Link>.
                {" "}For our AML/KYC commitments, see our{" "}
                <Link href="/aml-kyc" className="text-[#00D9A0] hover:underline">AML/KYC Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

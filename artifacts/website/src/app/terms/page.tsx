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
    body: "To use PAYVORA, you must:\n\n• Be at least 18 years of age\n• Be a resident of Nigeria or a country in which PAYVORA is licensed to operate\n• Have the legal capacity to enter into a binding agreement\n• Not be prohibited from receiving our Services under applicable law\n\nBy creating an account, you confirm that all information you provide is accurate, complete, and truthful. We reserve the right to suspend or terminate accounts where information is found to be false, misleading, or incomplete.",
  },
  {
    title: "3. Account Responsibilities",
    body: "You are solely responsible for:\n\n• Maintaining the confidentiality of your account credentials (email, password, and transaction PIN)\n• All activities that occur under your account, whether authorized by you or not\n• Enabling and protecting any two-factor or biometric authentication features\n\nYou must notify us immediately at support@payvora.com if you suspect unauthorized access to your account. You may not transfer, sell, lease, or assign your PAYVORA account to any other person.\n\nPAYVORA will never ask for your password or PIN via email, phone call, or SMS.",
  },
  {
    title: "4. Gift Card Trading",
    body: "PAYVORA facilitates gift card trades at rates set by us and updated in real time. By submitting a gift card for trade, you confirm that:\n\n• The card is genuine, unaltered, and has not been tampered with\n• The card is unused or partially used, as accurately declared\n• The card was legally obtained by you or given to you as a legitimate gift\n• You are not acting as an agent or intermediary for another person\n\nTrading stolen, counterfeit, fraudulently obtained, or illegally resold gift cards is strictly prohibited and may result in:\n• Immediate account termination\n• Withholding of outstanding wallet funds pending investigation\n• Referral of the matter to law enforcement authorities\n\nAll trades are final once confirmed. Exchange rates shown at submission are guaranteed for that session only. PAYVORA reserves the right to reverse or hold transactions suspected of fraud.",
  },
  {
    title: "5. Wallet and Funds",
    body: "PAYVORA wallet balances are denominated in Nigerian Naira (NGN). Key terms:\n\n• Funds held in your PAYVORA wallet are held in trust on your behalf. They are not PAYVORA's property.\n• We do not pay interest on wallet balances.\n• Withdrawals are processed to verified Nigerian bank accounts only, and are subject to daily limits determined by your KYC verification tier.\n• Wallet funds are not insured by the Nigeria Deposit Insurance Corporation (NDIC) as PAYVORA is not a licensed deposit-taking bank.\n• In the event of PAYVORA's insolvency, wallet funds are ring-fenced and held separately from PAYVORA's operating funds.\n\nPAYVORA is not a bank and is not regulated by the Central Bank of Nigeria (CBN) as a deposit-taking institution.",
  },
  {
    title: "6. Virtual Dollar Cards",
    body: "Virtual USD cards issued through PAYVORA are subject to:\n\n• Availability based on your KYC verification tier\n• Applicable funding limits and transaction caps\n• Our card partner's terms and conditions\n\nCard balances are non-refundable except in cases of a documented platform error. You are responsible for all authorized and unauthorized charges on your virtual card — you must report unauthorized charges within 48 hours. Fraudulent chargebacks may result in permanent account suspension and referral to law enforcement.",
  },
  {
    title: "7. Bill Payments and Airtime",
    body: "Bill payments (electricity, cable TV, internet, betting) and airtime/data purchases are processed in real time through licensed third-party providers. Once a transaction is submitted and confirmed, it cannot be reversed.\n\nPAYVORA is not responsible for:\n• Service disruptions or outages caused by the utility provider or telco\n• Incorrect subscriber numbers, meter IDs, or decoder numbers entered by the user\n• Delays caused by the recipient provider's infrastructure\n\nFor failed transactions where funds are deducted but the service is not delivered, contact support@payvora.com within 24 hours and we will investigate within 48 business hours.",
  },
  {
    title: "8. Prohibited Activities",
    body: "You may not use PAYVORA to:\n\n(a) Launder money, finance terrorism, or engage in any activity that violates anti-money laundering (AML) or counter-terrorism financing (CTF) laws\n(b) Trade stolen, counterfeit, or fraudulently obtained gift cards or vouchers\n(c) Create multiple accounts for any reason\n(d) Impersonate another person or provide false identity information\n(e) Reverse-engineer, decompile, or copy any part of our platform\n(f) Use automated scripts, bots, or tools to access our Services\n(g) Engage in market manipulation or exploit rate arbitrage using our platform\n(h) Violate any applicable law, regulation, or third-party rights\n\nViolation of any prohibited activity may result in immediate account termination without refund of pending transactions, and may be referred to regulatory or law enforcement authorities.",
  },
  {
    title: "9. Fees and Charges",
    body: "Our fee schedule is displayed clearly in-app before each transaction is confirmed. By confirming a transaction, you agree to the applicable fees. Key terms:\n\n• Fees are subject to change with at least 7 days' notice for existing users\n• We will never apply fees retroactively to completed transactions\n• Disputed fees must be reported to support@payvora.com within 30 days of the transaction date\n• Promotional rates or zero-fee periods are time-limited and may be withdrawn at any time",
  },
  {
    title: "10. Intellectual Property",
    body: "All content, features, functionality, and design elements of the PAYVORA platform — including but not limited to logos, wordmarks, icons, text, graphics, user interfaces, and software — are owned by PAYVORA or its licensors and are protected by Nigerian and international intellectual property laws.\n\nYou may not reproduce, distribute, modify, create derivative works from, or commercially exploit any part of our platform without our prior written consent.",
  },
  {
    title: "11. Disclaimer of Warranties",
    body: "The Services are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied. To the fullest extent permitted by Nigerian law, PAYVORA disclaims all warranties including:\n\n• Fitness for a particular purpose\n• Merchantability\n• Non-infringement\n• Uninterrupted or error-free operation\n\nPAYVORA does not warrant that the Services will meet your requirements or that any errors will be corrected.",
  },
  {
    title: "12. Limitation of Liability",
    body: "To the fullest extent permitted by Nigerian law, PAYVORA's aggregate liability to you for any claim arising from your use of our Services shall not exceed the total fees you paid to PAYVORA in the 3 calendar months immediately preceding the claim.\n\nPAYVORA is not liable for:\n• Indirect, consequential, special, incidental, or punitive damages\n• Loss of profits, revenue, data, or business opportunities\n• Network outages, third-party payment processing failures, or force majeure events\n• Losses resulting from your failure to maintain account security",
  },
  {
    title: "13. Dispute Resolution",
    body: "If you have a dispute with PAYVORA, we encourage you to contact our support team at support@payvora.com first. Most issues are resolved within 48 business hours.\n\nIf a dispute cannot be resolved informally within 30 calendar days, it shall be submitted to binding arbitration under the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria 2004. The seat of arbitration shall be Lagos, Nigeria. The language of arbitration shall be English.\n\nYou agree that any dispute will be resolved on an individual basis, and you waive any right to participate in a class action lawsuit or class-wide arbitration.",
  },
  {
    title: "14. Governing Law",
    body: "These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict-of-law provisions. Any legal proceedings that are not subject to arbitration shall be brought exclusively in the courts of Lagos State, Nigeria.",
  },
  {
    title: "15. Termination",
    body: "PAYVORA reserves the right to suspend or terminate your account and access to the Services at any time, with or without notice, if:\n\n• You violate any provision of these Terms\n• We are required to do so by law or regulatory order\n• We reasonably suspect fraudulent, abusive, or illegal activity\n\nYou may close your account at any time by contacting support@payvora.com. Upon termination, your wallet balance (after deduction of any outstanding fees or chargebacks) will be paid out to your verified bank account within 10 business days, subject to completion of any pending investigations.",
  },
  {
    title: "16. Contact",
    body: "For questions about these Terms of Service:\n\nLegal: legal@payvora.com\nGeneral Support: support@payvora.com\nPrivacy: privacy@payvora.com\n\nPAYVORA\nLagos, Nigeria",
  },
];

export default function TermsPage() {
  const toc = sections.map((s) => ({
    anchor: s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: s.title,
  }));

  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00D9A0]/10 border border-[#00D9A0]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D9A0]" />
            <span className="text-[#00D9A0] text-sm font-semibold">Legal Document</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-[#8F8FA3] text-base">
            Last updated: <span className="text-white font-medium">July 6, 2026</span>
          </p>
          <p className="text-[#8F8FA3] mt-4 leading-relaxed max-w-2xl">
            Please read these terms carefully before using PAYVORA. By creating an account
            or using any of our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          {/* Table of Contents (sticky on desktop) */}
          <aside className="hidden lg:block sticky top-28">
            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-[#8F8FA3] uppercase tracking-widest mb-4">
                Contents
              </h2>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    className="block text-sm text-[#8F8FA3] hover:text-[#00D9A0] py-1.5 transition-colors leading-snug"
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
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 rounded-full bg-[#00D9A0] flex-shrink-0" />
                    {title}
                  </h2>
                  <p className="text-[#8F8FA3] leading-relaxed whitespace-pre-line pl-4 border-l border-[#2A2A3D]">
                    {body}
                  </p>
                </section>
              );
            })}

            {/* Contact card */}
            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-8 mt-8">
              <h2 className="text-lg font-bold text-white mb-2">Questions about these terms?</h2>
              <p className="text-[#8F8FA3] text-sm mb-6">
                Our legal team is happy to clarify anything. We aim to respond within 72 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:legal@payvora.com"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00D9A0] text-[#0A0A0F] text-sm font-semibold rounded-xl hover:bg-[#00C490] transition-colors"
                >
                  legal@payvora.com
                </a>
                <a
                  href="mailto:support@payvora.com"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1C1C2A] border border-[#2A2A3D] text-[#8F8FA3] text-sm font-semibold rounded-xl hover:text-white hover:border-[#3A3A5D] transition-colors"
                >
                  support@payvora.com
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-[#2A2A3D]">
              <p className="text-[#8F8FA3] text-sm">
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

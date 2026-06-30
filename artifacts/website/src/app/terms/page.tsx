import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – PayVora",
  description:
    "Read PayVora's Terms of Service. By using our platform you agree to these terms.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By downloading the PayVora app, accessing our website, or using any of our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use our Services. We may update these terms at any time with 14 days' notice.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old and a resident of a country where PayVora operates to use our Services. By registering, you confirm that all information provided is accurate, complete, and truthful. We reserve the right to suspend accounts where information is found to be false.",
  },
  {
    title: "3. Account Responsibilities",
    body: "You are solely responsible for maintaining the confidentiality of your account credentials. All activities that occur under your account are your responsibility. You must notify us immediately at support@payvora.com if you suspect unauthorized access. You may not transfer, sell, or assign your account to another person.",
  },
  {
    title: "4. Gift Card Trading",
    body: "PayVora facilitates gift card trades at rates set by us, updated in real-time. By submitting a gift card for trade, you confirm it is genuine, unaltered, unused (or partially used as declared), and legally obtained. Trading stolen, counterfeit, or illegally obtained gift cards is strictly prohibited and may result in account termination, withholding of funds, and referral to law enforcement. All trades are final once confirmed. Rates shown at submission are guaranteed for that session only.",
  },
  {
    title: "5. Wallet and Funds",
    body: "PayVora wallet balances are denominated in Nigerian Naira (NGN). Funds in your wallet are held in trust and are not PayVora's property. We do not pay interest on wallet balances. Withdrawals are subject to daily limits based on your KYC verification tier. PayVora is not a bank and is not regulated by the CBN as a deposit-taking institution.",
  },
  {
    title: "6. Virtual Cards",
    body: "Virtual USD cards issued through PayVora are subject to availability and KYC requirements. Card balances are non-refundable except in cases of platform error. You are responsible for all charges made on your virtual card. Fraudulent chargebacks may result in permanent account suspension and legal action.",
  },
  {
    title: "7. Prohibited Activities",
    body: "You may not use PayVora to: (a) launder money or finance terrorism; (b) trade stolen, counterfeit, or fraudulently obtained gift cards; (c) create multiple accounts; (d) reverse-engineer or copy our platform; (e) use automated tools or bots; (f) violate any applicable law or regulation. Violation may result in immediate termination without refund.",
  },
  {
    title: "8. Fees and Charges",
    body: "Our fee schedule is displayed in-app before each transaction. Fees are subject to change with 7 days' notice for existing users. We will never apply fees retroactively to completed transactions. Disputed fees must be reported within 30 days of the transaction date.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the fullest extent permitted by Nigerian law, PayVora's aggregate liability for any claim arising from use of our Services shall not exceed the total fees you paid us in the 3 months preceding the claim. We are not liable for indirect, consequential, special, or punitive damages. We are not liable for network outages, third-party payment failures, or force majeure events.",
  },
  {
    title: "10. Dispute Resolution",
    body: "We encourage you to contact support@payvora.com first to resolve any dispute informally. If a dispute cannot be resolved within 30 days, it shall be referred to arbitration under Nigerian law, with the seat of arbitration in Lagos, Nigeria. Class action waivers apply to the fullest extent permitted.",
  },
  {
    title: "11. Governing Law",
    body: "These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict-of-law provisions.",
  },
  {
    title: "12. Contact",
    body: "For questions about these Terms: legal@payvora.com\nFor support: support@payvora.com",
  },
];

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
          Terms of Service
        </h1>
        <p className="text-[#8F8FA3] mb-12">Last updated: June 30, 2026</p>
        <div className="space-y-10">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
              <p className="text-[#8F8FA3] leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

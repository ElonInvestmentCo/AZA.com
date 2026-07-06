import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – PAYVORA",
  description:
    "Read PAYVORA's Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://www.payvora.org/privacy" },
};

const sections = [
  {
    title: "1. Introduction",
    body: `PAYVORA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Services"). Please read this policy carefully. If you do not agree with its terms, please discontinue use of our Services.\n\nBy accessing or using PAYVORA, you consent to the practices described in this Privacy Policy.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect the following categories of information:\n\n• Account Information: Full name, email address, phone number, date of birth, and username.\n\n• Identity Verification (KYC): Government-issued ID type and number, KYC submission date, and verification status — collected to comply with financial regulations.\n\n• Financial Information: Wallet balance, transaction history, and bank account numbers (for withdrawal processing only). We do not store full card numbers.\n\n• Device Information: Device type, operating system version, IP address, and unique device identifiers.\n\n• Usage Data: App usage patterns, feature interactions, screen views, and session timestamps.\n\n• Communications: Support tickets, in-app chat messages, and email correspondence with our team.\n\n• Authentication Data: Login method (email/password, Google, or Apple), hashed passwords (never stored in plaintext), and session tokens.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to:\n\n• Create and manage your PAYVORA account\n• Process gift card trades, bill payments, airtime purchases, and wallet transactions\n• Verify your identity and comply with KYC/AML regulations\n• Send transaction confirmations, receipts, and account alerts\n• Respond to customer support inquiries in a timely manner\n• Detect, investigate, and prevent fraud and unauthorized access\n• Improve our Services, fix bugs, and develop new features\n• Send product updates and promotional communications (you may opt out at any time)\n• Comply with applicable Nigerian laws and regulatory requirements`,
  },
  {
    title: "4. How We Share Your Information",
    body: `We do not sell your personal information to third parties. We may share it with:\n\n• Service Providers: Trusted third-party companies that help us operate our Services (payment processors, cloud infrastructure providers, analytics tools, and KYC verification vendors), under strict data processing agreements that prohibit them from using your data for any other purpose.\n\n• Regulatory Authorities: Government agencies and regulators as required by Nigerian law, including the Central Bank of Nigeria (CBN) and the Economic and Financial Crimes Commission (EFCC).\n\n• Law Enforcement: When required by valid court order, subpoena, or to prevent imminent harm to users or the public.\n\n• Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your data may be transferred. We will notify you before your data becomes subject to a different privacy policy.\n\nAll third parties are contractually obligated to maintain appropriate security standards and are prohibited from using your data beyond what is necessary to perform their services.`,
  },
  {
    title: "5. Data Security",
    body: `We implement industry-standard security measures to protect your information:\n\n• AES-256 encryption for data at rest\n• TLS 1.3 for all data in transit\n• Bcrypt hashing for all passwords (never stored in plaintext)\n• JWT-based authentication with short-lived, signed tokens\n• Continuous intrusion detection and monitoring\n• Regular third-party security audits and penetration testing\n• Strict access controls — only authorized personnel can access user data\n\nWhile we take every reasonable precaution, no digital system is perfectly secure. In the event of a data breach that affects your personal information, we will notify you promptly in accordance with applicable law.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your personal data for as long as your account is active and for 7 years after account closure to comply with Nigerian financial regulations (as required by the CBN and FIRS). You may request deletion of non-regulated personal data at any time by contacting privacy@payvora.com.\n\nTransaction records are retained for a minimum of 5 years as required by the Money Laundering (Prohibition) Act. After the applicable retention period, data is securely deleted or anonymized.`,
  },
  {
    title: "7. Your Rights",
    body: `Under the Nigeria Data Protection Regulation (NDPR) and Nigeria Data Protection Act (NDPA) 2023, you have the right to:\n\n• Access: Request a copy of the personal data we hold about you\n• Rectification: Request correction of inaccurate or incomplete data\n• Erasure: Request deletion of your personal data (subject to legal retention requirements)\n• Objection: Object to certain types of data processing\n• Portability: Request your data in a machine-readable format\n• Restriction: Request that we limit how we process your data\n• Withdraw Consent: Withdraw consent for optional processing at any time\n\nTo exercise any of these rights, contact us at privacy@payvora.com. We will respond within 72 hours and fulfill eligible requests within 30 days.`,
  },
  {
    title: "8. Children's Privacy",
    body: `PAYVORA is not intended for users under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a minor, please contact us immediately at privacy@payvora.com and we will delete the information promptly.`,
  },
  {
    title: "9. Cookies & Tracking Technologies",
    body: `Our website uses cookies and similar tracking technologies to:\n\n• Maintain your session and remember your preferences\n• Analyse website traffic and usage patterns (using anonymized data)\n• Improve the performance and functionality of our Services\n\nWe do not use cookies for cross-site advertising or tracking. You may disable cookies in your browser settings; however, some features of the website may not function correctly without them.\n\nThe PAYVORA mobile app does not use browser cookies but may use device identifiers and analytics SDKs for crash reporting and usage analytics.`,
  },
  {
    title: "10. International Data Transfers",
    body: `Your data may be processed on servers located outside Nigeria (including in the European Union and United States) by our cloud infrastructure and service providers. Where we transfer data internationally, we ensure appropriate safeguards are in place, including standard contractual clauses approved by the relevant data protection authorities, to protect your information in accordance with Nigerian data protection law.`,
  },
  {
    title: "11. Third-Party Links",
    body: `Our Services may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of any third-party sites you visit. This Privacy Policy applies solely to information collected by PAYVORA.`,
  },
  {
    title: "12. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes via email or in-app notification at least 14 days before the changes take effect. The "Last updated" date at the top of this page indicates when the policy was last revised. Continued use of the Services after the effective date constitutes your acceptance of the updated policy.`,
  },
  {
    title: "13. Contact Us",
    body: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:\n\nPrivacy Team: privacy@payvora.com\nGeneral Support: support@payvora.com\nLegal: legal@payvora.com\n\nWe aim to respond to all privacy-related inquiries within 72 hours. For formal data subject requests under the NDPA, we will respond within 30 days.`,
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-[#8F8FA3] text-base">
            Last updated: <span className="text-white font-medium">July 6, 2026</span>
          </p>
          <p className="text-[#8F8FA3] mt-4 leading-relaxed max-w-2xl">
            PAYVORA is committed to protecting your privacy. This policy explains how we collect,
            use, and safeguard your information when you use our app and website.
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
                  <div className="text-[#8F8FA3] leading-relaxed whitespace-pre-line pl-4 border-l border-[#2A2A3D]">
                    {body}
                  </div>
                </section>
              );
            })}

            {/* Contact card */}
            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-8 mt-8">
              <h2 className="text-lg font-bold text-white mb-2">Questions about your privacy?</h2>
              <p className="text-[#8F8FA3] text-sm mb-6">
                Our privacy team is here to help. Reach out and we&apos;ll respond within 72 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:privacy@payvora.com"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00D9A0] text-[#0A0A0F] text-sm font-semibold rounded-xl hover:bg-[#00C490] transition-colors"
                >
                  privacy@payvora.com
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
                This Privacy Policy applies to all users of the PAYVORA mobile application and website.
                For our full legal terms, see our{" "}
                <Link href="/terms" className="text-[#00D9A0] hover:underline">Terms of Service</Link>.
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – PAYVORA",
  description: "Read PAYVORA's Privacy Policy to understand how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Privacy Policy</h1>
        <p className="text-[#8F8FA3] mb-12">Last updated: June 30, 2026</p>

        <div className="prose prose-invert max-w-none space-y-10">
          {[
            {
              title: "1. Introduction",
              body: `PAYVORA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Services"). Please read this policy carefully. If you do not agree with its terms, please discontinue use of our Services.`,
            },
            {
              title: "2. Information We Collect",
              body: `We collect the following categories of information:\n\n**Account Information:** Name, email address, phone number, date of birth, and government-issued ID details (for KYC verification).\n\n**Financial Information:** Bank account numbers (for withdrawal processing only), wallet balance and transaction history.\n\n**Device Information:** Device type, operating system, IP address, and unique device identifiers.\n\n**Usage Data:** App usage patterns, feature interactions, and session timestamps.\n\n**Communications:** Support tickets, chat messages, and email correspondence with our team.`,
            },
            {
              title: "3. How We Use Your Information",
              body: `We use your information to:\n\n• Create and manage your PAYVORA account\n• Process transactions and facilitate gift card trades\n• Verify your identity in compliance with KYC/AML regulations\n• Send transaction confirmations and account alerts\n• Respond to customer support inquiries\n• Detect and prevent fraud and unauthorized access\n• Improve our Services and develop new features\n• Comply with applicable laws and regulatory requirements`,
            },
            {
              title: "4. How We Share Your Information",
              body: `We do not sell your personal information. We may share it with:\n\n**Service Providers:** Trusted third-party companies that help us operate our Services (payment processors, cloud providers, analytics tools), under strict data processing agreements.\n\n**Regulatory Authorities:** Government agencies and regulators as required by Nigerian law, including the CBN and EFCC.\n\n**Law Enforcement:** When required by court order or to prevent imminent harm.\n\nWe require all third parties to maintain appropriate security and use your data only for specified purposes.`,
            },
            {
              title: "5. Data Security",
              body: `We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, multi-factor authentication, continuous intrusion detection, and regular third-party security audits. While we take every reasonable precaution, no system is perfectly secure. We will notify you promptly of any breach that affects your data.`,
            },
            {
              title: "6. Data Retention",
              body: `We retain your personal data for as long as your account is active and for 7 years after closure to comply with Nigerian financial regulations. You may request deletion of non-regulated data at any time by contacting support@payvora.com.`,
            },
            {
              title: "7. Your Rights",
              body: `Under the Nigeria Data Protection Regulation (NDPR), you have the right to:\n\n• Access your personal data\n• Correct inaccurate data\n• Request deletion (subject to legal retention requirements)\n• Object to certain processing\n• Data portability\n• Withdraw consent at any time\n\nTo exercise any of these rights, contact us at privacy@payvora.com.`,
            },
            {
              title: "8. Children's Privacy",
              body: `PAYVORA is not intended for users under 18 years of age. We do not knowingly collect data from minors. If we discover we have inadvertently collected data from a minor, we will delete it immediately.`,
            },
            {
              title: "9. Changes to This Policy",
              body: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 14 days before the changes take effect. Continued use of the Services after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: "10. Contact Us",
              body: `For privacy-related questions or to exercise your rights:\n\nEmail: privacy@payvora.com\nGeneral Support: support@payvora.com\n\nWe aim to respond to all privacy requests within 72 hours.`,
            },
          ].map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
              <div className="text-[#8F8FA3] leading-relaxed whitespace-pre-line">{body}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

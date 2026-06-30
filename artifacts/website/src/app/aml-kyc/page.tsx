import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AML/KYC Policy – PayVora",
  description:
    "PayVora's Anti-Money Laundering and Know Your Customer policy. We are committed to preventing financial crime.",
};

const sections = [
  {
    title: "1. Introduction & Purpose",
    body: "PayVora is committed to full compliance with applicable Anti-Money Laundering (AML), Counter-Terrorism Financing (CTF), and Know Your Customer (KYC) regulations in Nigeria and internationally. This policy applies to all users, employees, contractors, and partners of PayVora.\n\nOur AML/KYC programme is designed to: prevent our platform from being used for money laundering, terrorism financing, or other financial crimes; detect and report suspicious activity to the appropriate authorities; and maintain the integrity and trustworthiness of our Services.",
  },
  {
    title: "2. Regulatory Framework",
    body: "PayVora operates in compliance with:\n\n• The Money Laundering (Prevention and Prohibition) Act 2022 (Nigeria)\n• The Terrorism (Prevention and Prohibition) Act 2022 (Nigeria)\n• CBN AML/CFT Regulations\n• NFIU Guidelines and Suspicious Transaction Reporting requirements\n• FATF (Financial Action Task Force) Recommendations\n• Nigeria Data Protection Regulation (NDPR)",
  },
  {
    title: "3. Customer Due Diligence (KYC)",
    body: "Before accessing full platform functionality, all users must complete identity verification:\n\n**Tier 1 (Basic):** Email address and phone number. Daily limit: ₦50,000.\n\n**Tier 2 (Standard):** Government-issued ID (NIN or BVN), selfie verification. Daily limit: ₦500,000.\n\n**Tier 3 (Enhanced):** Utility bill (proof of address), additional identity documents. Daily limit: ₦2,000,000+.\n\n**Business Accounts:** Certificate of Incorporation, CAC documents, director IDs, and business address verification.\n\nWe reserve the right to request additional documentation at any time based on risk assessment.",
  },
  {
    title: "4. Enhanced Due Diligence (EDD)",
    body: "Enhanced due diligence is applied to:\n\n• Politically Exposed Persons (PEPs) and their associates\n• Users from high-risk jurisdictions as defined by FATF\n• Transactions exceeding ₦5,000,000 in a single day\n• Accounts showing unusual transaction patterns\n• Businesses in high-risk sectors\n\nEDD may include source-of-funds documentation, in-person verification, and increased monitoring frequency.",
  },
  {
    title: "5. Transaction Monitoring",
    body: "PayVora employs automated transaction monitoring to detect:\n\n• Structuring (splitting transactions to avoid reporting thresholds)\n• Rapid movement of funds through accounts\n• Transactions inconsistent with the user's profile or stated business purpose\n• High-value gift card transactions from newly created accounts\n• Geographic anomalies and impossible travel scenarios\n• Patterns associated with known fraud or money laundering typologies\n\nFlagged transactions are reviewed by our compliance team within 24 hours.",
  },
  {
    title: "6. Suspicious Transaction Reporting",
    body: "PayVora submits Suspicious Transaction Reports (STRs) to the Nigerian Financial Intelligence Unit (NFIU) as required by law. We are legally prohibited from informing the subject of an STR that a report has been filed ('tipping off' prohibition).\n\nUsers whose accounts are under investigation may have their accounts frozen and funds held pending regulatory clearance. PayVora cooperates fully with law enforcement requests made through proper legal channels.",
  },
  {
    title: "7. Record Keeping",
    body: "All KYC documentation and transaction records are retained for a minimum of 5 years after the end of the customer relationship, as required by Nigerian law. Records are stored securely with access restricted to authorised compliance personnel.",
  },
  {
    title: "8. Employee Training",
    body: "All PayVora employees and contractors who interact with customer data or transactions receive mandatory AML/KYC training upon onboarding and annually thereafter. Our compliance team receives specialist training on emerging typologies and regulatory updates.",
  },
  {
    title: "9. Prohibited Users & Jurisdictions",
    body: "PayVora does not provide services to:\n\n• Individuals or entities on OFAC, UN, EU, or Nigerian sanctions lists\n• Users from FATF-blacklisted jurisdictions\n• Anonymous or pseudonymous users seeking to circumvent KYC\n• Shell companies with no demonstrable legitimate business purpose\n\nAccounts found to belong to prohibited persons will be immediately suspended and funds held pending legal review.",
  },
  {
    title: "10. Contact & Reporting",
    body: "To report suspicious activity or for compliance enquiries:\n\nCompliance Team: compliance@payvora.com\nGeneral Support: support@payvora.com\n\nIf you believe you have been incorrectly flagged, contact our compliance team with supporting documentation. We aim to resolve all compliance queries within 5 business days.",
  },
];

export default function AMLKYCPage() {
  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
          AML / KYC Policy
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

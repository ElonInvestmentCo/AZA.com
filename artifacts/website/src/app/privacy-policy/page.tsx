import type { Metadata } from "next";
import { Container } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "Privacy Policy | PAYVORA",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-bg)]">
      <Container className="max-w-4xl">
        <h1 className="h1 mb-4">Privacy Policy</h1>
        <p className="text-[var(--color-muted)] mb-12">Last updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-sec)]">
          <p>
            At PAYVORA, your privacy is our priority. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our mobile application and services, in compliance with the Nigerian Data Protection Regulation (NDPR).
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">1. Information We Collect</h2>
          <p>We collect information to provide, improve, and secure our Services. This includes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li><strong>Personal Identity Information:</strong> Name, email address, phone number, physical address, and date of birth.</li>
            <li><strong>KYC Data:</strong> Bank Verification Number (BVN), government-issued ID (NIN, Passport), and facial verification data.</li>
            <li><strong>Financial Data:</strong> Transaction history, wallet balances, linked bank accounts, and card details.</li>
            <li><strong>Device & Usage Data:</strong> IP address, device type, operating system, and app interaction logs.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">2. How We Use Your Information</h2>
          <p>We use the collected data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li>To create and manage your account.</li>
            <li>To process transactions (bill payments, transfers, virtual card creation).</li>
            <li>To verify your identity and prevent fraud or money laundering (AML/CFT).</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To improve our app performance and develop new features.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may share your information with trusted third parties only when necessary:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li><strong>Partner Banks & Payment Processors:</strong> To facilitate your transactions and issue virtual cards.</li>
            <li><strong>Identity Verification Services:</strong> To validate your BVN and ID documents.</li>
            <li><strong>Law Enforcement:</strong> If required by Nigerian law or a valid court order.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">4. Data Retention</h2>
          <p>
            We retain your personal data as long as your account is active. To comply with CBN financial regulations, we are required to retain transaction records and KYC data for a minimum of five (5) years even after account closure.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">5. Your Privacy Rights</h2>
          <p>Under the NDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (subject to legal retention requirements).</li>
            <li>Opt-out of marketing communications.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">6. Contact Our DPO</h2>
          <p>
            If you have questions or wish to exercise your data rights, please contact our Data Protection Officer at:
            <br />
            Email: privacy@payvora.org
          </p>
        </div>
      </Container>
    </div>
  );
}

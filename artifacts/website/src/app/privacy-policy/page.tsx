import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-4xl">
        <FadeIn>
          <div className="mb-12 border-b border-[var(--color-border)] pb-8">
            <h1 className="h1 mb-4">Privacy Policy</h1>
            <p className="text-[var(--color-text-sec)]">Last Updated: October 2024</p>
          </div>

          <div className="prose prose-invert max-w-none text-[var(--color-text-sec)]">
            <p className="text-lg mb-8">
              At PAYVORA, your privacy and data security are our highest priorities. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">1. Information We Collect</h3>
            <p className="mb-4">We collect information to provide, maintain, and improve our services, as well as to comply with legal obligations.</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth.</li>
              <li><strong>Verification Data:</strong> Government-issued ID, facial scan, proof of address (for KYC compliance).</li>
              <li><strong>Financial Data:</strong> Transaction history, bank account details for withdrawals.</li>
              <li><strong>Device Data:</strong> IP address, device model, operating system, and app usage metrics.</li>
            </ul>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">2. How We Use Your Information</h3>
            <p className="mb-4">Your data is used strictly for operational and compliance purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>To process your transactions and manage your account.</li>
              <li>To verify your identity and prevent fraud (AML/KYC).</li>
              <li>To provide customer support and send critical account alerts.</li>
              <li>To improve app performance and user experience.</li>
            </ul>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">3. Data Sharing</h3>
            <p className="mb-6">
              We do not sell your personal data. We only share information with trusted third-party partners (such as card issuers, identity verification services, and regulatory bodies) strictly as necessary to provide the service or comply with the law.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">4. Data Security</h3>
            <p className="mb-6">
              We employ bank-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Access to personal data is strictly limited to authorized personnel.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">5. Your Rights</h3>
            <p className="mb-6">
              You have the right to request access to, correction of, or deletion of your personal data, subject to legal data retention requirements for financial institutions. Contact support@payvora.org to exercise these rights.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}

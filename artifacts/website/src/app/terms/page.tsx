import type { Metadata } from "next";
import { Container } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "Terms of Service | PAYVORA",
  description: "Terms of Service and User Agreement.",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-bg)]">
      <Container className="max-w-4xl">
        <h1 className="h1 mb-4">Terms of Service</h1>
        <p className="text-[var(--color-muted)] mb-12">Last updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-sec)]">
          <p>
            Welcome to PAYVORA. These Terms of Service ("Terms") govern your use of the PAYVORA mobile application, website, and related services (collectively, the "Services") provided by PAYVORA Technologies Ltd. ("we," "us," or "our").
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">1. Acceptance of Terms</h2>
          <p>
            By creating an account, downloading our app, or using our Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">2. Eligibility and User Accounts</h2>
          <p>
            To use PAYVORA, you must be at least 18 years old and a resident of Nigeria with a valid Bank Verification Number (BVN). You must provide accurate, current, and complete information during registration and keep your account details updated.
          </p>
          <p>
            You are responsible for safeguarding your account credentials, PIN, and two-factor authentication codes. PAYVORA is not liable for unauthorized access caused by your failure to secure your device or credentials.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">3. Virtual Cards and Transactions</h2>
          <p>
            PAYVORA provides virtual USD cards through our international banking partners. These cards are subject to limits based on your KYC verification tier. 
          </p>
          <p>
            We process transactions immediately. Once a bill payment, airtime top-up, or gift card trade is initiated, it cannot be reversed. You are responsible for ensuring the accuracy of the recipient details.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">4. Prohibited Activities</h2>
          <p>You agree not to use the Services to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li>Violate any local, state, national, or international law, including CBN regulations.</li>
            <li>Engage in fraudulent activities, money laundering, or terrorist financing.</li>
            <li>Trade stolen or illegally acquired gift cards.</li>
            <li>Attempt to bypass our security measures or KYC requirements.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">5. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising out of these Terms or your use of the Services shall be resolved through binding arbitration in Lagos, Nigeria.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact our legal team at:
            <br />
            Email: legal@payvora.org
          </p>
        </div>
      </Container>
    </div>
  );
}

import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-4xl">
        <FadeIn>
          <div className="mb-12 border-b border-[var(--color-border)] pb-8">
            <h1 className="h1 mb-4">Terms of Service</h1>
            <p className="text-[var(--color-text-sec)]">Last Updated: October 2024</p>
          </div>

          <div className="prose prose-invert max-w-none text-[var(--color-text-sec)]">
            <p className="text-lg mb-8">
              Welcome to PAYVORA. Please read these Terms of Service ("Terms") carefully before using our mobile application or website.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">1. Acceptance of Terms</h3>
            <p className="mb-6">
              By accessing or using the PAYVORA platform, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">2. Account Registration & Eligibility</h3>
            <p className="mb-4">
              To use PAYVORA, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You must pass our mandatory KYC (Know Your Customer) checks to access specific features.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            </ul>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">3. Virtual Cards</h3>
            <p className="mb-6">
              Virtual USD cards are issued by our partner financial institutions. By creating a card, you agree to their specific issuing terms. PAYVORA reserves the right to suspend or terminate card privileges if suspicious activity is detected.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">4. Prohibited Activities</h3>
            <p className="mb-4">You may not use PAYVORA for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Any illegal activities or transactions.</li>
              <li>Money laundering or terrorist financing.</li>
              <li>Attempting to bypass our security measures or API rate limits.</li>
              <li>Operating multiple accounts without explicit permission.</li>
            </ul>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">5. Limitation of Liability</h3>
            <p className="mb-6">
              PAYVORA shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}

import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
};

export default function RefundPage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-4xl">
        <FadeIn>
          <div className="mb-12 border-b border-[var(--color-border)] pb-8">
            <h1 className="h1 mb-4">Refund Policy</h1>
            <p className="text-[var(--color-text-sec)]">Last Updated: October 2024</p>
          </div>

          <div className="prose prose-invert max-w-none text-[var(--color-text-sec)]">
            <p className="text-lg mb-8">
              This policy outlines the conditions under which PAYVORA processes refunds and cancellations for various transactions on our platform.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">1. General Rule</h3>
            <p className="mb-6">
              Due to the immediate and digital nature of our services, most transactions processed on PAYVORA are final and non-refundable once successfully completed.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">2. Airtime & Data Purchases</h3>
            <p className="mb-6">
              Purchases of airtime, data bundles, and electricity tokens are instant and irreversible. If you provide the wrong phone number or meter number, PAYVORA cannot issue a refund. Refunds are only issued if the transaction fails on our end but your wallet is debited.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">3. Virtual Cards</h3>
            <p className="mb-6">
              Virtual Card creation fees ($2) are non-refundable. If you cancel or delete your virtual card, any remaining balance on the card will be converted back to your main Naira or USD wallet at the prevailing exchange rate, minus any applicable network fees.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">4. Failed Transactions</h3>
            <p className="mb-6">
              If a transaction fails or times out (e.g., bank network issues) but your PAYVORA wallet is debited, the system will automatically attempt to reverse the charge within 24 hours. If the funds are not returned automatically, please contact support with your transaction ID.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy – PayVora",
  description:
    "Understand PayVora's refund policy for gift card trades, bill payments, virtual cards, and wallet transactions.",
};

const sections = [
  {
    title: "1. Overview",
    body: "PayVora processes all transactions in real-time and most are irreversible once confirmed. This policy explains the specific circumstances under which refunds are issued and the process to request one.\n\nAll refund requests must be submitted within 72 hours of the original transaction unless otherwise stated below.",
  },
  {
    title: "2. Gift Card Trades",
    body: "**Non-refundable:** Gift card trades are final once confirmed. The rate and amount shown at submission are what you receive. We do not offer refunds for:\n\n• Change of mind after confirmation\n• Rates changing after your trade was confirmed\n• Cards submitted with incorrect denominations\n\n**Eligible for refund:** If our system incorrectly credits a lower amount than the confirmed rate due to a platform error, we will refund the difference within 24 hours upon verification. Report errors to support@payvora.com with your transaction ID.",
  },
  {
    title: "3. Bill Payments",
    body: "**Electricity (DISCO payments):** If payment is confirmed in our system but the token is not delivered within 30 minutes, you are entitled to a full refund or re-attempt. Contact support with your meter number and transaction ID.\n\n**Cable TV:** Subscriptions are activated directly with the provider. If activation fails within 1 hour of confirmed payment, a full refund will be issued.\n\n**Airtime & Data:** Airtime and data are delivered instantly. No refunds are offered once delivery is confirmed. If delivery fails, we will credit your wallet within 24 hours.\n\n**Betting Wallets:** Funds credited to betting platforms cannot be reversed once confirmed by the platform.",
  },
  {
    title: "4. Virtual Card Transactions",
    body: "**Card top-ups:** If you top up your virtual card but funds are not credited within 5 minutes due to a platform error, contact support for a full refund.\n\n**Merchant charges:** PayVora cannot reverse charges made by third-party merchants. For disputed merchant charges, contact the merchant directly. We can provide transaction evidence for chargebacks if needed.\n\n**Unused card balance:** Virtual card balances can be withdrawn back to your PayVora wallet at any time at no charge.",
  },
  {
    title: "5. Wallet Deposits",
    body: "If you fund your PayVora wallet via bank transfer and funds do not reflect within 30 minutes, contact support with your bank transaction reference. We will investigate and credit your wallet within 2 hours of confirmation from your bank.",
  },
  {
    title: "6. Wallet Withdrawals",
    body: "Once a withdrawal is initiated and confirmed, it cannot be cancelled or reversed. If a withdrawal is debited from your wallet but not received by your bank within 24 hours, contact support immediately. We will investigate and resolve within 1 business day.",
  },
  {
    title: "7. How to Request a Refund",
    body: "To request a refund:\n\n1. Contact support@payvora.com with subject line: 'Refund Request – [Transaction ID]'\n2. Include your account email, transaction ID, amount, date, and a description of the issue.\n3. Our team will acknowledge within 2 hours and resolve within 24–72 hours depending on the transaction type.\n\nAlternatively, use the live chat in the PayVora app for faster response.",
  },
  {
    title: "8. Refund Processing",
    body: "Approved refunds are credited to your PayVora wallet balance. We do not refund directly to bank accounts unless the original payment was made by bank transfer and the wallet has since been suspended or closed.",
  },
  {
    title: "9. Fraudulent Refund Claims",
    body: "Submitting false refund claims is a violation of our Terms of Service and may constitute fraud under Nigerian law. Accounts found submitting fraudulent claims will be permanently banned and may be reported to the EFCC and relevant authorities.",
  },
  {
    title: "10. Contact",
    body: "Refund support: support@payvora.com\nBusiness hours: Monday–Sunday, 8 AM – 10 PM WAT\nEmergency (account freeze): Available 24/7 via in-app live chat",
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
          Refund Policy
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

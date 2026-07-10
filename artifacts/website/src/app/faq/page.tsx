import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";
import { ChevronDown, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about PAYVORA accounts, cards, and transactions.",
};

const faqs = [
  {
    category: "Virtual Cards",
    items: [
      { q: "How do I create a virtual dollar card?", a: "Once your account is verified (Tier 2), navigate to the 'Cards' tab, select 'Create Virtual Card', and fund it from your Naira or crypto wallet balance. The card is generated instantly." },
      { q: "Where can I use my PAYVORA virtual card?", a: "Your virtual card is accepted on millions of platforms globally, including Netflix, Apple Music, Spotify, Amazon, Facebook Ads, AWS, and AliExpress." },
      { q: "What is the maintenance fee?", a: "Virtual cards have a minimal creation fee of $2 and a monthly maintenance fee of $1. There are zero transaction fees for purchases." }
    ]
  },
  {
    category: "Account & Verification",
    items: [
      { q: "How long does KYC verification take?", a: "Automated verification usually takes less than 5 minutes. Ensure your ID document is clear and matches the face scan." },
      { q: "Are there limits on my account?", a: "Yes. Tier 1 users have a maximum balance of ₦300,000. Upgrading to Tier 2 (Government ID) removes these limits." }
    ]
  },
  {
    category: "Transfers & Funding",
    items: [
      { q: "How do I fund my wallet?", a: "You can fund your wallet via bank transfer to your dedicated PAYVORA account number, or by depositing supported cryptocurrencies like USDT." },
      { q: "How long do withdrawals take?", a: "Withdrawals to local Nigerian banks are processed instantly, usually arriving within seconds." }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              Find quick answers to your questions about using PAYVORA.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((group, groupIdx) => (
            <FadeIn key={groupIdx} delay={groupIdx * 0.1} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-2 border-[var(--color-accent)]">
                {group.category}
              </h2>
              <div className="flex flex-col gap-4">
                {group.items.map((faq, i) => (
                  <details key={i} className="group glass rounded-2xl border border-[var(--color-border)] [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                      {faq.q}
                      <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center group-open:rotate-45 transition-transform duration-300">
                        <Plus className="w-4 h-4" />
                      </span>
                    </summary>
                    <div className="p-6 pt-0 text-[var(--color-text-sec)] leading-relaxed border-t border-[var(--color-border)] mt-2">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-20 text-center glass rounded-3xl p-10 border border-[var(--color-border)] max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-[var(--color-text-sec)] mb-8">
            Our support team is always ready to assist you with any inquiries.
          </p>
          <Button href="/contact">Contact Support</Button>
        </FadeIn>
      </Container>
    </div>
  );
}

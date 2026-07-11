import type { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | PAYVORA",
  description: "Frequently asked questions about PAYVORA.",
};

const faqs = [
  {
    q: "How do I create a PAYVORA account?",
    a: "Download the PAYVORA app from the Apple App Store or Google Play Store. Tap 'Sign Up', enter your details, verify your email and BVN, and you're good to go in less than 2 minutes."
  },
  {
    q: "Is there a maintenance fee for the virtual dollar card?",
    a: "No! Unlike traditional banks, we do not charge any monthly or annual maintenance fees for your virtual USD card. You only pay standard conversion rates when funding it."
  },
  {
    q: "How long do gift card trades take to settle?",
    a: "Gift card trades are typically processed and settled to your Naira wallet instantly after verification. Some specific card brands might take up to 5 minutes."
  },
  {
    q: "What is the daily transaction limit?",
    a: "For unverified accounts (Tier 1), the daily transfer limit is ₦50,000. Once you verify your identity with a valid ID (Tier 3), your limit increases to ₦5,000,000 daily."
  },
  {
    q: "Is my money safe with PAYVORA?",
    a: "Absolutely. We use bank-grade AES-256 encryption, and our partner banks are fully insured and regulated by the Central Bank of Nigeria (CBN). We also require 2FA for all major transactions."
  },
  {
    q: "Can I use my virtual card on Apple Pay and Google Pay?",
    a: "Yes, your PAYVORA virtual dollar card can be linked to Apple Pay, Google Pay, and works on major platforms like Netflix, Spotify, Amazon, and Adobe."
  },
  {
    q: "Are there fees for paying utility bills?",
    a: "No. Paying for electricity, cable TV, and internet through PAYVORA is 100% free. We do not charge convenience fees."
  },
  {
    q: "What if I have an issue with a transaction?",
    a: "Our customer support team is available 24/7. You can reach out directly via the in-app live chat, or email us at support@payvora.org."
  }
];

export default function FaqPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20">
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="h1 mb-6">Frequently asked questions.</h1>
            <p className="text-xl text-[var(--color-muted)]">
              Everything you need to know about the product and how it works.
            </p>
          </FadeIn>
          
          <FadeIn className="max-w-3xl mx-auto">
            <FaqAccordion faqs={faqs} />
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}

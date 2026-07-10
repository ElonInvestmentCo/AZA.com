import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the PAYVORA support team.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mb-16">
          <FadeIn>
            <h1 className="h1 mb-6">We're here to help.</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              Have a question about your account, a transaction, or our services? Our dedicated support team is available 24/7.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <FadeIn delay={0.1} className="glass p-8 rounded-3xl border border-[var(--color-border)]">
            <Mail className="w-8 h-8 text-[var(--color-accent)] mb-6" />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-[var(--color-text-sec)] mb-4">For general inquiries and account assistance.</p>
            <a href="mailto:support@payvora.org" className="text-white font-medium hover:text-[var(--color-accent)] transition-colors">support@payvora.org</a>
          </FadeIn>
          
          <FadeIn delay={0.2} className="glass p-8 rounded-3xl border border-[var(--color-border)]">
            <MessageSquare className="w-8 h-8 text-[var(--color-accent)] mb-6" />
            <h3 className="text-xl font-bold mb-2">In-App Chat</h3>
            <p className="text-[var(--color-text-sec)] mb-4">Fastest response time. Chat with us directly in the app.</p>
            <span className="text-white font-medium">Available 24/7 in app</span>
          </FadeIn>

          <FadeIn delay={0.3} className="glass p-8 rounded-3xl border border-[var(--color-border)]">
            <MapPin className="w-8 h-8 text-[var(--color-accent)] mb-6" />
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-[var(--color-text-sec)] mb-4">Lagos, Nigeria</p>
            <span className="text-[var(--color-muted)] text-sm">For official correspondence only. No walk-in support.</span>
          </FadeIn>
        </div>

        <FadeIn className="max-w-3xl mx-auto glass p-10 md:p-12 rounded-3xl border border-[var(--color-border)]">
          <h2 className="h3 mb-8">Send us a message</h2>
          <ContactForm />
        </FadeIn>
      </Container>
    </div>
  );
}

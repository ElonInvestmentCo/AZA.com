import type { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";
import { Mail, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | PAYVORA",
  description: "Get in touch with the PAYVORA team.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20">
        <Container>
          <FadeIn className="mb-16">
            <h1 className="h1 mb-6">Let's talk.</h1>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl">
              Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            <FadeIn delay={0.1} className="lg:col-span-1 space-y-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-muted)] mb-1">Email us</p>
                      <a href="mailto:hello@payvora.org" className="text-white hover:text-[var(--color-accent)] font-medium transition-colors">hello@payvora.org</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-muted)] mb-1">Visit us</p>
                      <p className="text-white font-medium">Lagos, Nigeria</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="lg:col-span-2">
              <ContactForm />
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}

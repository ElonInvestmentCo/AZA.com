import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Globe2, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | PAYVORA",
  description: "We're building Africa's financial future.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20">
        <Container>
          <FadeIn className="max-w-4xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Our Mission
            </div>
            <h1 className="h1 mb-6">We're building Africa's financial future.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              At PAYVORA, we believe that geographical borders shouldn't limit financial potential. We are designing the most robust and elegant financial infrastructure for Nigerians—giving them seamless access to the global digital economy.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">Our Core Values</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Globe2, title: "Borderless Mindset", desc: "We build tools that break down financial walls, allowing you to operate on a global scale." },
              { icon: ShieldCheck, title: "Uncompromising Security", desc: "Trust is our currency. We employ bank-grade encryption to protect every kobo you entrust to us." },
              { icon: Zap, title: "Relentless Speed", desc: "In the digital age, speed is a feature. Our transactions settle instantly, keeping you moving." },
            ].map((v, i) => (
              <StaggerItem key={i} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6">
                  <v.icon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{v.title}</h3>
                <p className="text-[var(--color-muted)]">{v.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">Meet the Team</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Oluwaseun Adebayo", role: "Chief Executive Officer", initials: "OA" },
              { name: "Chioma Nnadi", role: "Chief Technology Officer", initials: "CN" },
              { name: "Emmanuel Osei", role: "Head of Product", initials: "EO" },
            ].map((member, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-2xl font-bold text-[var(--color-muted)]">
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[var(--color-accent)] font-medium text-sm">{member.role}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <FadeIn className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] border border-[var(--color-border)] rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="h2 mb-6">Help us shape the future</h2>
            <p className="text-lg text-[var(--color-muted)] mb-8">
              We are constantly looking for brilliant minds to join our mission. If you're passionate about fintech and building great products, let's talk.
            </p>
            <Button href="/careers" size="lg">View Open Positions</Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}

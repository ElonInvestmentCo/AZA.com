import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Briefcase, ArrowRight, HeartPulse, BrainCircuit, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | PAYVORA",
  description: "Join the PAYVORA team and help build Africa's financial future.",
};

const roles = [
  { title: "Frontend Engineer", dept: "Engineering", location: "Lagos / Remote", type: "Full-time" },
  { title: "Backend Engineer", dept: "Engineering", location: "Lagos / Remote", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Lagos / Remote", type: "Full-time" },
  { title: "Customer Support Lead", dept: "Operations", location: "Lagos", type: "Full-time" },
  { title: "Growth Marketer", dept: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Data Analyst", dept: "Data", location: "Lagos / Remote", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Careers
            </div>
            <h1 className="h1 mb-6">Join the PAYVORA team.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              We are a team of builders, dreamers, and problem solvers working to democratize financial access for Nigerians. We do hard work, but we do it together.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16">Life at PAYVORA</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {[
              { icon: BrainCircuit, title: "Continuous Learning", desc: "We provide an annual learning stipend to help you grow your skills and attend conferences." },
              { icon: HeartPulse, title: "Comprehensive Health", desc: "Premium HMO coverage for you and your dependents, plus mental health support." },
              { icon: Rocket, title: "Ownership", desc: "Everyone gets equity. We want you to think and act like an owner because you are one." },
            ].map((v, i) => (
              <StaggerItem key={i} className="p-8 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <v.icon className="w-10 h-10 text-[var(--color-accent)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-[var(--color-muted)]">{v.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16">Open Roles</h2>
          </FadeIn>
          <StaggerContainer className="space-y-4">
            {roles.map((role, i) => (
              <StaggerItem key={i} className="group block">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-300">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> {role.dept}</span>
                      <span>•</span>
                      <span>{role.location}</span>
                      <span>•</span>
                      <span>{role.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[var(--color-accent)] font-medium">
                    Apply Now <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <FadeIn className="mt-16 text-center">
            <p className="text-[var(--color-muted)] mb-6">Don't see a role that fits? We're always looking for talent.</p>
            <Button href="mailto:careers@payvora.org" variant="outline">Email careers@payvora.org</Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}

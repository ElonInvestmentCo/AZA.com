import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Briefcase, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the PAYVORA team and help build the future of African finance.",
};

const jobs = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote / Lagos" },
  { title: "Product Designer", dept: "Design", location: "Remote" },
  { title: "Compliance Officer", dept: "Legal", location: "Lagos, Nigeria" },
  { title: "Customer Success Specialist", dept: "Support", location: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">Build the future with us.</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              We are always looking for ambitious, talented individuals who are passionate about redefining digital finance for the next billion users.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Why work at PAYVORA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-3 text-white">Impact</h3>
              <p className="text-[var(--color-text-sec)]">Your work will directly improve the financial lives of hundreds of thousands of people.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-3 text-white">Autonomy</h3>
              <p className="text-[var(--color-text-sec)]">We hire smart people and get out of their way. Own your projects from end to end.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-3 text-white">Benefits</h3>
              <p className="text-[var(--color-text-sec)]">Competitive salary, comprehensive health coverage, flexible remote work, and learning stipends.</p>
            </div>
          </div>
        </FadeIn>

        <div>
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          <StaggerContainer className="flex flex-col gap-4">
            {jobs.map((job, i) => (
              <StaggerItem key={i} className="glass p-6 md:p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-[var(--color-text-sec)]">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  </div>
                </div>
                <Button variant="outline" href="/contact">Apply Now</Button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </div>
  );
}

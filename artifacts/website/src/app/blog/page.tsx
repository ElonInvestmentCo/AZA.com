import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Updates",
  description: "Latest news, company updates, and financial guides from PAYVORA.",
};

const posts = [
  {
    title: "Introducing PAYVORA Virtual Dollar Cards",
    excerpt: "Shop globally without limits. Learn how our new 3D-secure virtual cards work and how to get yours in minutes.",
    date: "Oct 12, 2024",
    category: "Product Update"
  },
  {
    title: "How to safely trade Gift Cards online",
    excerpt: "Avoid scams and get the best rates. A comprehensive guide to selling your digital gift cards safely.",
    date: "Sep 28, 2024",
    category: "Guide"
  },
  {
    title: "Understanding the new KYC Verification Tiers",
    excerpt: "We've updated our AML policy. See what's changed and how to upgrade your account tier easily.",
    date: "Sep 15, 2024",
    category: "Compliance"
  },
  {
    title: "Why we chose zero hidden fees",
    excerpt: "Transparency isn't a feature, it's a foundation. A look into our pricing philosophy and business model.",
    date: "Aug 02, 2024",
    category: "Company"
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">Blog & Updates</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              The latest news, product releases, and thoughts from the PAYVORA team.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <StaggerItem key={i} className="glass p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors group flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                <span className="text-[var(--color-accent)]">{post.category}</span>
                <span className="text-[var(--color-muted)]">&bull;</span>
                <span className="text-[var(--color-muted)]">{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--color-accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--color-text-sec)] mb-8 leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="inline-flex items-center text-white font-medium group-hover:text-[var(--color-accent)] transition-colors mt-auto">
                Read article <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </div>
  );
}

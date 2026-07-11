import type { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | PAYVORA",
  description: "Latest news, product updates, and financial tips from PAYVORA.",
};

const posts = [
  {
    category: "Product Update",
    title: "Introducing Virtual USD Cards: Global Payments Made Easy",
    date: "Oct 12, 2026",
    excerpt: "We're thrilled to announce the launch of our virtual dollar cards. Now you can pay for international subscriptions without limits.",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    category: "Company News",
    title: "PAYVORA secures Microfinance Bank License from CBN",
    date: "Sep 28, 2026",
    excerpt: "This milestone allows us to offer more robust financial products and strengthens our commitment to regulatory compliance.",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  {
    category: "Tips & Tricks",
    title: "How to spot and avoid P2P trading scams",
    date: "Sep 15, 2026",
    excerpt: "Your security is our priority. Learn the common red flags in peer-to-peer trading and how to keep your funds safe.",
    color: "bg-green-500/10 text-green-400 border-green-500/20"
  },
  {
    category: "Product Update",
    title: "Zero-fee Utility Bill Payments are live!",
    date: "Aug 30, 2026",
    excerpt: "Stop paying convenience fees. You can now pay your electricity and cable TV bills directly on PAYVORA for free.",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    category: "Company News",
    title: "We're expanding our customer support team to 24/7",
    date: "Aug 10, 2026",
    excerpt: "Money never sleeps, and neither do we. Our dedicated support team is now available around the clock.",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  {
    category: "Tips & Tricks",
    title: "Understanding foreign exchange rates in Nigeria",
    date: "Jul 22, 2026",
    excerpt: "A simple guide to navigating the FX market, parallel market rates, and how to get the best value for your conversions.",
    color: "bg-green-500/10 text-green-400 border-green-500/20"
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20">
        <Container>
          <FadeIn className="max-w-3xl mb-16">
            <h1 className="h1 mb-6">Latest news & updates.</h1>
            <p className="text-xl text-[var(--color-muted)]">
              Product announcements, company news, and financial guides from the PAYVORA team.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <StaggerItem key={i} className="group cursor-pointer flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 hover:border-[var(--color-border-light)] transition-colors">
                <div className="mb-6 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${post.color}`}>
                    {post.category}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[var(--color-muted)] mb-8 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm font-medium text-white group-hover:text-[var(--color-accent)] transition-colors mt-auto">
                  Read Article <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </div>
  );
}

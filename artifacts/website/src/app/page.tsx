import type { Metadata } from "next";
import Image from "next/image";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { AudienceSwitcher } from "@/components/AudienceSwitcher";
import { PressMarquee } from "@/components/PressMarquee";

export const metadata: Metadata = {
  title: "PAYVORA – Digital Fintech App for Nigeria",
  description: "Finance without borders. Made for Nigerians.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AudienceSwitcher />

      <section className="relative pt-12 pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-8">
                <span className="text-sm font-medium text-white">Now available in Nigeria 🇳🇬</span>
              </div>
              <h1 className="h1 mb-6">
                <span className="block text-white">Finance without borders.</span>
                <span className="block text-white">Made for</span>
                <span className="block text-[var(--color-accent)]">Nigerians.</span>
              </h1>
              <p className="text-lg text-[var(--color-muted)] mb-10 max-w-lg leading-relaxed">
                Send, receive, convert, and manage money in one app. Open a virtual dollar card, trade gift cards, pay bills — all from your phone, free.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/download" size="lg" icon>
                  Get started — it's free
                </Button>
                <Button href="/virtual-cards" variant="ghost" size="lg">
                  See how it works
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="relative h-[600px] w-full rounded-3xl overflow-hidden glass border border-[var(--color-border-light)] shadow-2xl">
              <Image 
                src="/images/hero-person.png"
                alt="Nigerian person using PAYVORA app"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </FadeIn>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] text-[var(--color-bg)]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,35.29,141.48,59.35,217.1,70.52,252.1,75.69,287.4,79.08,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      <PressMarquee />

      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[var(--color-accent)] opacity-[0.03] blur-[100px] pointer-events-none" />
        <Container>
          <FadeIn className="text-center max-w-4xl mx-auto">
            <span className="text-[var(--color-accent)] font-bold tracking-widest text-sm uppercase mb-6 block">NO LIMITS, NO BORDERS</span>
            <h2 className="text-[clamp(4rem,10vw,8rem)] font-bold tracking-tighter leading-none text-transparent" style={{ WebkitTextStroke: '2px var(--color-border-light)' }}>
              Go global
            </h2>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 space-y-32">
        <Container>
          <FadeIn className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-3xl overflow-hidden glass border border-[var(--color-border)]">
              <Image src="/images/feature-virtual-card.png" alt="Virtual Dollar Card" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                VIRTUAL DOLLAR CARDS
              </div>
              <h2 className="h2 mb-6">Generate your card<br/>in minutes</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Shop on Netflix, Amazon, Apple, and 10,000+ global merchants. Your PAYVORA virtual dollar card works everywhere international payments do.
              </p>
              <Button href="/virtual-cards" variant="outline" icon>Get your card</Button>
            </div>
          </FadeIn>
        </Container>

        <Container>
          <FadeIn className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                GIFT CARD TRADING
              </div>
              <h2 className="h2 mb-6">Trade at the<br/>best rates</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Sell unused Amazon, iTunes, Google Play, Steam, and 50+ other gift cards for instant Naira payout. Competitive rates, instant settlement.
              </p>
              <Button href="/gift-cards" variant="outline" icon>Trade now</Button>
            </div>
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden glass border border-[var(--color-border)]">
              <Image src="/images/feature-gift-cards.png" alt="Gift Card Trading" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </FadeIn>
        </Container>

        <Container>
          <FadeIn className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-3xl overflow-hidden glass border border-[var(--color-border)]">
              <Image src="/images/feature-bills.png" alt="Bill Payments" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                BILL PAYMENTS
              </div>
              <h2 className="h2 mb-6">Pay bills before<br/>they're due</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Electricity, cable TV, internet, and more — pay any Nigerian utility bill in seconds with zero service fees. Automated reminders keep you ahead.
              </p>
              <Button href="/bill-payments" variant="outline" icon>Pay a bill</Button>
            </div>
          </FadeIn>
        </Container>

        <Container>
          <FadeIn className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                AIRTIME & DATA
              </div>
              <h2 className="h2 mb-6">Stay connected,<br/>always</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Top up any Nigerian network — MTN, Airtel, Glo, 9mobile — with data bundles and airtime at zero markup. Instant delivery, always.
              </p>
              <Button href="/airtime-data" variant="outline" icon>Buy airtime</Button>
            </div>
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden glass border border-[var(--color-border)]">
              <Image src="/images/feature-airtime.png" alt="Airtime and Data" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <div className="grid lg:grid-cols-3 gap-16">
            <FadeIn className="lg:col-span-1">
              <h2 className="h2 mb-4">A truly global<br/>fintech account.</h2>
              <p className="text-lg text-[var(--color-muted)]">
                Get an account that puts you in total control of your money.
              </p>
            </FadeIn>
            <div className="lg:col-span-2">
              <StaggerContainer className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { num: "01", text: "Zero account & card maintenance fees" },
                  { num: "02", text: "Competitive exchange rates on all conversions" },
                  { num: "03", text: "Instant transaction notifications" },
                  { num: "04", text: "Virtual USD card for global payments" },
                  { num: "05", text: "P2P transfers — free and instant" },
                  { num: "06", text: "Full expense tracking & history" },
                ].map((feature, i) => (
                  <StaggerItem key={i} className="flex gap-6 border-t border-[var(--color-border)] pt-6">
                    <span className="text-2xl font-light text-[var(--color-muted)]">{feature.num}</span>
                    <p className="text-lg text-white font-medium">{feature.text}</p>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-stretch h-full">
            <FadeIn className="bg-[var(--color-surface)] p-12 rounded-3xl border border-[var(--color-border)] flex flex-col justify-center">
              <h2 className="h2 mb-6">Making a <br/><span className="text-[var(--color-accent)]">difference together</span></h2>
              <p className="text-xl text-[var(--color-muted)] leading-relaxed">
                At PAYVORA, we believe every Nigerian deserves access to world-class financial tools. We're building the infrastructure for Africa's digital economy — one transaction at a time.
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="relative h-[400px] lg:h-auto rounded-3xl overflow-hidden glass border border-[var(--color-border)]">
              <Image src="/images/community.png" alt="PAYVORA Community" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">More than just banking</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Gift Cards", desc: "Surprise loved ones with digital vouchers" },
              { title: "Bill Payments", desc: "Pay the important bills before they're due" },
              { title: "Security", desc: "Bank-grade AES-256 encryption" },
              { title: "Expense Management", desc: "Track and understand your spending" },
              { title: "Instant Transfers", desc: "Send money to any Nigerian bank account" },
              { title: "USDT Conversion", desc: "Convert USDT to Naira at real-time rates" },
            ].map((f, i) => (
              <StaggerItem key={i} className="p-8 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors">{f.title}</h3>
                <p className="text-[var(--color-muted)]">{f.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-32">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">Trusted by thousands<br/>of Nigerians</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { text: "PAYVORA's virtual card has completely changed how I pay for my international subscriptions. No more card declines or crazy bank rates. Highly recommend!", name: "Chinedu Okafor", role: "Software Engineer" },
              { text: "Trading gift cards used to be so stressful with unreliable agents. The app does it instantly, and the rates are actually the best I've seen in Nigeria.", name: "Aisha Mohammed", role: "Digital Marketer" },
              { text: "The app is so smooth. Paying for electricity and buying data has never been this fast. It's truly a world-class banking experience.", name: "Tobi Adeyemi", role: "Business Owner" },
            ].map((t, i) => (
              <StaggerItem key={i} className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col">
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-lg text-white mb-8 flex-grow">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-[var(--color-muted)] text-sm">{t.role}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-24 pb-32">
        <Container>
          <FadeIn className="relative overflow-hidden rounded-[3rem] bg-[var(--color-surface)] border border-[var(--color-border)] p-12 md:p-20 text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-[var(--color-accent)] opacity-[0.05] blur-[80px] pointer-events-none" />
            <h2 className="h2 mb-8 relative z-10 max-w-2xl">
              Get digital banking<br/>at your fingertips
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <a href="#" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 7.114c-.657 0-1.638.647-2.128 1.488-.415.717-.79 1.764-.537 2.686 1.01.077 1.849-.496 2.279-1.229.418-.711.666-1.678.386-2.945zm1.503 3.659c-1.393.033-2.617.926-3.28 1.455-.662-.53-1.921-1.442-3.415-1.41-1.916.039-3.692 1.11-4.664 2.805-1.979 3.447-.506 8.535 1.424 11.318.94 1.353 2.052 2.898 3.535 2.842 1.414-.055 1.956-.913 3.666-.913 1.708 0 2.193.913 3.665.882 1.528-.032 2.473-1.396 3.407-2.756 1.085-1.584 1.533-3.12 1.533-3.12s-2.92-1.114-2.997-4.484c-.068-2.825 2.302-4.168 2.302-4.168-1.317-1.918-3.344-2.176-4.176-2.285M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/></svg>
                Download on the App Store
              </a>
              <a href="#" className="flex items-center gap-3 bg-transparent border border-[var(--color-border-light)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-bg)] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.895 14.593v-9.18l6.786 4.59-6.786 4.59z"/></svg>
                Get it on Google Play
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}

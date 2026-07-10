"use client";

import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import Image from "next/image";
import { ShieldCheck, CreditCard, ArrowRightLeft, Smartphone, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)] blur-[150px] opacity-10 rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-indigo-500 blur-[150px] opacity-10 rounded-full pointer-events-none mix-blend-screen"></div>
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl relative z-10">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-6 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse-slow"></span>
                  <span className="text-[var(--color-text-sec)]">The premium wallet for global citizens</span>
                </div>
                <h1 className="h1 mb-6 text-balance">
                  Finance without borders. <br />
                  <span className="text-gradient-accent">Made for you.</span>
                </h1>
                <p className="text-xl text-[var(--color-text-sec)] mb-10 leading-relaxed max-w-lg">
                  Open a free account in minutes. Get a global virtual dollar card, trade gift cards, pay bills, and convert assets seamlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button href="/download" size="lg" icon>
                    Download App
                  </Button>
                  <Button href="/pricing" variant="outline" size="lg">
                    View Pricing
                  </Button>
                </div>
              </FadeIn>
            </div>
            
            {/* Hero Visual */}
            <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
              <FadeIn delay={0.2} className="relative w-full aspect-square max-w-[500px]">
                <div className="absolute inset-0 glass rounded-full border border-[var(--color-border)] opacity-20 scale-110"></div>
                <div className="absolute inset-0 glass rounded-full border border-[var(--color-accent)] opacity-40 scale-90 animate-pulse-slow"></div>
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden glass border border-[var(--color-border-light)] shadow-2xl p-4 bg-[var(--color-bg)]">
                   <div className="relative w-full h-full rounded-xl overflow-hidden bg-[var(--color-surface)]">
                     <Image 
                        src="/images/feature-app-dashboard.png" 
                        alt="PAYVORA Dashboard" 
                        fill 
                        className="object-cover object-center opacity-80"
                        priority
                     />
                   </div>
                </div>
                {/* Floating elements */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -right-8 top-1/4 glass p-4 rounded-2xl border border-[var(--color-border)] shadow-xl hidden md:flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Payment Secure</div>
                    <div className="text-xs text-[var(--color-text-sec)]">Verified by PAYVORA</div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats ticker */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-8 overflow-hidden">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 md:gap-24 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">250K+</div>
              <div className="text-sm text-[var(--color-muted)] font-medium uppercase tracking-wider">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">120+</div>
              <div className="text-sm text-[var(--color-muted)] font-medium uppercase tracking-wider">Supported Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">0%</div>
              <div className="text-sm text-[var(--color-muted)] font-medium uppercase tracking-wider">Hidden Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-[var(--color-muted)] font-medium uppercase tracking-wider">Customer Support</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Features Overview */}
      <section className="py-32 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <h2 className="h2 mb-6">Everything you need in one wallet.</h2>
              <p className="text-xl text-[var(--color-text-sec)]">
                A single unified platform to manage your lifestyle and finances, designed for unmatched speed and reliability.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <StaggerItem className="lg:col-span-2 glass rounded-[2rem] p-8 md:p-12 border border-[var(--color-border)] relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-accent)]">
                  <CreditCard />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Virtual Dollar Cards</h3>
                <p className="text-[var(--color-text-sec)] mb-8 leading-relaxed">
                  Generate a USD card instantly. Shop on global platforms like Netflix, Apple, and Amazon without failing transactions.
                </p>
                <Link href="/virtual-cards" className="inline-flex items-center text-white font-medium hover:text-[var(--color-accent)] transition-colors">
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 hidden md:block">
                <Image src="/images/hero-card.png" alt="Virtual Card" fill className="object-cover object-left" />
              </div>
            </StaggerItem>

            {/* Feature 2 */}
            <StaggerItem className="glass rounded-[2rem] p-8 md:p-12 border border-[var(--color-border)] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-purple-400">
                  <ArrowRightLeft />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Gift Card Trading</h3>
                <p className="text-[var(--color-text-sec)] mb-8 leading-relaxed">
                  Sell unused gift cards for instant Naira at the most competitive market rates.
                </p>
                <Link href="/gift-cards" className="inline-flex items-center text-white font-medium hover:text-[var(--color-accent)] transition-colors">
                  Trade now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>

            {/* Feature 3 */}
            <StaggerItem className="glass rounded-[2rem] p-8 md:p-12 border border-[var(--color-border)] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-blue-400">
                  <Smartphone />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Bills & Airtime</h3>
                <p className="text-[var(--color-text-sec)] mb-8 leading-relaxed">
                  Pay electricity, renew TV subs, and buy data with zero markup.
                </p>
                <Link href="/bill-payments" className="inline-flex items-center text-white font-medium hover:text-[var(--color-accent)] transition-colors">
                  Pay bills <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>

            {/* Feature 4 */}
            <StaggerItem className="lg:col-span-2 glass rounded-[2rem] p-8 md:p-12 border border-[var(--color-border)] relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-cyan-400">
                  <Globe />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Global Network</h3>
                <p className="text-[var(--color-text-sec)] mb-8 leading-relaxed">
                  Receive USDT and instantly convert it to Naira. Seamless borderless transactions straight to your local bank.
                </p>
                <Link href="/features" className="inline-flex items-center text-white font-medium hover:text-[var(--color-accent)] transition-colors">
                  Explore features <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 hidden md:block">
                <Image src="/images/feature-globe.png" alt="Global Network" fill className="object-cover object-center" />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* Security Banner */}
      <section className="py-24">
        <Container>
          <FadeIn className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-accent-dim)] opacity-50"></div>
            <div className="relative z-10 flex-1">
              <h2 className="h2 mb-6">Bank-grade security. <br/>Zero compromises.</h2>
              <p className="text-[var(--color-text-sec)] text-lg mb-8 max-w-lg">
                Your funds and personal data are protected by AES-256 encryption, continuous fraud monitoring, and strict compliance with global AML regulations.
              </p>
              <Button href="/security" variant="outline">View Security Policy</Button>
            </div>
            <div className="relative z-10 shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full border border-[var(--color-accent)] flex items-center justify-center bg-[var(--color-bg)] shadow-[0_0_50px_var(--color-accent-dim)]">
              <ShieldCheck className="w-16 h-16 text-[var(--color-accent)]" />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-accent)] opacity-[0.03]"></div>
        <Container className="text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight max-w-3xl mx-auto">
              Ready to upgrade your financial experience?
            </h2>
            <p className="text-xl text-[var(--color-text-sec)] mb-12 max-w-2xl mx-auto">
              Join thousands of users who trust PAYVORA for their everyday digital payments and global transactions.
            </p>
            <Button href="/download" size="lg" icon>Open a Free Account</Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

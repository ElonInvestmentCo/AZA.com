import Link from "next/link";
import { Container } from "./ui/core";
import { Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold tracking-tighter flex items-center">
                <span className="text-white">PAY</span>
                <span className="text-[var(--color-accent)]">VORA</span>
              </div>
            </Link>
            <p className="text-[var(--color-muted)] mb-6 max-w-sm">
              Finance without borders. Send, receive, convert, and manage money in one premium app designed for Nigerians.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--color-muted)]">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@payvora.org" className="hover:text-white transition-colors text-sm">hello@payvora.org</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/virtual-cards" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Virtual Cards</Link></li>
              <li><Link href="/gift-cards" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Gift Cards</Link></li>
              <li><Link href="/bill-payments" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Bill Payments</Link></li>
              <li><Link href="/airtime-data" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Airtime & Data</Link></li>
              <li><Link href="/pricing" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link href="/security" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Security</Link></li>
              <li><Link href="/blog" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link href="/download" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Download App</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-muted)] text-sm text-center md:text-left">
            PAYVORA is a financial technology company. &copy; 2026 PAYVORA Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span aria-hidden="true">·</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { Container } from "./ui/core";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Products: [
      { name: "Virtual Dollar Cards", href: "/virtual-cards" },
      { name: "Gift Card Trading", href: "/gift-cards" },
      { name: "Bill Payments", href: "/bill-payments" },
      { name: "Airtime & Data", href: "/airtime-data" },
      { name: "Pricing", href: "/pricing" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    Legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "AML/KYC Policy", href: "/security" },
    ],
    Help: [
      { name: "FAQ", href: "/faq" },
      { name: "Support Center", href: "/contact" },
      { name: "Security", href: "/security" },
    ],
  };

  return (
    <footer className="bg-[var(--color-bg)] pt-24 pb-12 border-t border-[var(--color-border)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-20"></div>
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="text-3xl font-bold tracking-tighter flex items-center">
                <span className="text-white">PAY</span>
                <span className="text-[var(--color-accent)]">VORA</span>
              </div>
            </Link>
            <p className="text-[var(--color-text-sec)] text-sm leading-relaxed max-w-sm mb-8">
              The premium digital wallet for global citizens. Buy gift cards, pay bills, get virtual dollar cards, and manage your finances seamlessly.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-6">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-[var(--color-text-sec)] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            &copy; {currentYear} PAYVORA. All rights reserved.
          </p>
          <div className="text-xs text-[var(--color-muted)] text-center md:text-right max-w-2xl">
            PAYVORA is a financial technology company, not a bank. Services are provided in partnership with licensed financial institutions in respective jurisdictions.
          </div>
        </div>
      </Container>
    </footer>
  );
}

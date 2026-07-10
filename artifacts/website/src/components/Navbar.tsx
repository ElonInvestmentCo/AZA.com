"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, Container } from "./ui/core";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    name: "Products",
    dropdown: [
      { name: "Virtual Cards", href: "/virtual-cards", desc: "Global dollar cards" },
      { name: "Gift Cards", href: "/gift-cards", desc: "Buy & trade top brands" },
      { name: "Bill Payments", href: "/bill-payments", desc: "Zero-fee utility bills" },
      { name: "Airtime & Data", href: "/airtime-data", desc: "Instant mobile recharge" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Company",
    dropdown: [
      { name: "About Us", href: "/about", desc: "Our story and mission" },
      { name: "Careers", href: "/careers", desc: "Join our growing team" },
      { name: "Security", href: "/security", desc: "How we protect you" },
      { name: "Blog", href: "/blog", desc: "Latest news & updates" },
    ],
  },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] py-3" : "bg-transparent py-5"
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 relative z-50">
              {/* Fallback text logo if SVG is missing/broken */}
              <div className="text-2xl font-bold tracking-tighter flex items-center">
                <span className="text-white">PAY</span>
                <span className="text-[var(--color-accent)]">VORA</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors ${
                        pathname === link.href ? "text-white" : "text-[var(--color-text-sec)] hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-sec)] hover:text-white transition-colors py-2">
                      {link.name}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                    </button>
                  )}

                  {/* Desktop Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] rounded-2xl glass p-3 border border-[var(--color-border-light)] shadow-2xl overflow-hidden"
                        >
                          <div className="flex flex-col gap-1">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="group/item p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors flex flex-col"
                              >
                                <span className="text-white font-medium text-sm group-hover/item:text-[var(--color-accent)] transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-[var(--color-muted)] text-xs mt-0.5">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-white hover:text-[var(--color-accent)] transition-colors">
                Sign In
              </Link>
              <Button href="/download" size="sm">
                Get the App
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden relative z-50 p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg)] pt-24 pb-6 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col border-b border-[var(--color-border)] pb-4 last:border-0">
                  {link.href ? (
                    <Link href={link.href} className="text-xl font-semibold text-white">
                      {link.name}
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <span className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider">{link.name}</span>
                      <div className="flex flex-col gap-3 pl-2 border-l-2 border-[var(--color-border)]">
                        {link.dropdown?.map((item) => (
                          <Link key={item.name} href={item.href} className="flex flex-col">
                            <span className="text-lg text-white font-medium">{item.name}</span>
                            <span className="text-sm text-[var(--color-text-sec)]">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-4 flex flex-col gap-4">
                <Button href="/download" className="w-full text-center py-4 text-lg">
                  Download PAYVORA
                </Button>
                <Link href="/login" className="w-full text-center py-4 text-lg font-medium text-white border border-[var(--color-border)] rounded-full">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

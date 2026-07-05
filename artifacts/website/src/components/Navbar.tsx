"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const products = [
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Virtual Cards", href: "/virtual-cards" },
  { label: "Bill Payments", href: "/bill-payments" },
  { label: "Airtime & Data", href: "/airtime-data" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-[#2A2A3D]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/payvora-wordmark.svg"
              alt="PAYVORA"
              className="nav-logo"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Products Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-[#8F8FA3] hover:text-white transition-colors text-sm font-medium"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                Products <ChevronDown size={14} />
              </button>
              {productsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl shadow-2xl py-2 z-50"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  {products.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2.5 text-sm text-[#8F8FA3] hover:text-white hover:bg-[#2A2A3D] transition-colors"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/features"
              className="text-[#8F8FA3] hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="/security"
              className="text-[#8F8FA3] hover:text-white transition-colors text-sm font-medium"
            >
              Security
            </Link>
            <Link
              href="/faq"
              className="text-[#8F8FA3] hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-[#8F8FA3] hover:text-white transition-colors text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/download"
              className="px-5 py-2.5 bg-[#00D9A0] text-[#0A0A0F] text-sm font-semibold rounded-xl hover:bg-[#00C490] transition-colors"
            >
              Download App
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#14141F] border-t border-[#2A2A3D]">
          <div className="px-4 py-6 space-y-1">
            {products.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[#8F8FA3] hover:text-white hover:bg-[#1C1C2A] rounded-xl transition-colors"
              >
                {p.label}
              </Link>
            ))}
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-[#8F8FA3] hover:text-white hover:bg-[#1C1C2A] rounded-xl transition-colors"
            >
              Features
            </Link>
            <Link
              href="/security"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-[#8F8FA3] hover:text-white hover:bg-[#1C1C2A] rounded-xl transition-colors"
            >
              Security
            </Link>
            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-[#8F8FA3] hover:text-white hover:bg-[#1C1C2A] rounded-xl transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-[#8F8FA3] hover:text-white hover:bg-[#1C1C2A] rounded-xl transition-colors"
            >
              Contact
            </Link>
            <div className="pt-4">
              <Link
                href="/download"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-5 py-3 bg-[#00D9A0] text-[#0A0A0F] font-semibold rounded-xl"
              >
                Download App
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

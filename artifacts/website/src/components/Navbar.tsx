"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const products = [
  { label: "Gift Cards",    href: "/gift-cards"    },
  { label: "Virtual Cards", href: "/virtual-cards" },
  { label: "Bill Payments", href: "/bill-payments" },
  { label: "Airtime & Data",href: "/airtime-data"  },
];

const company = [
  { label: "About",    href: "/about"    },
  { label: "Blog",     href: "/blog"     },
  { label: "Careers",  href: "/careers"  },
  { label: "Press",    href: "/press"    },
];

export function Navbar() {
  const [open, setOpen]               = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [companyOpen,  setCompanyOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/payvora-wordmark.svg"
              alt="PAYVORA"
              width={180}
              height={72}
              style={{ filter: "brightness(0)" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                Products
                <ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
              </button>
              {productsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  {products.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-xl mx-1"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/features"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Pricing
            </Link>

            {/* Company Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                Company
                <ChevronDown size={14} className={`transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`} />
              </button>
              {companyOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50"
                  onMouseEnter={() => setCompanyOpen(true)}
                  onMouseLeave={() => setCompanyOpen(false)}
                >
                  {company.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-xl mx-1"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/help-center"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Help
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/download"
              className="px-5 py-2.5 bg-[#00D9A0] text-white text-sm font-semibold rounded-xl hover:bg-[#00B88A] transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0"
            >
              Download App
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-gray-700 p-2 rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-1">
            <p className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Products</p>
            {products.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {p.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Explore</p>
              {[
                { label: "Features",    href: "/features"    },
                { label: "Pricing",     href: "/pricing"     },
                { label: "Security",    href: "/security"    },
                { label: "FAQ",         href: "/faq"         },
                { label: "Help Center", href: "/help-center" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <p className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Company</p>
              {company.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/download"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-5 py-3.5 bg-[#00D9A0] text-white font-semibold rounded-xl hover:bg-[#00B88A] transition-colors"
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

import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  Products: [
    { label: "Gift Cards",    href: "/gift-cards"    },
    { label: "Virtual Cards", href: "/virtual-cards" },
    { label: "Bill Payments", href: "/bill-payments" },
    { label: "Airtime & Data",href: "/airtime-data"  },
    { label: "Pricing",       href: "/pricing"       },
  ],
  Company: [
    { label: "About",    href: "/about"    },
    { label: "Features", href: "/features" },
    { label: "Security", href: "/security" },
    { label: "Blog",     href: "/blog"     },
    { label: "Careers",  href: "/careers"  },
    { label: "Press",    href: "/press"    },
  ],
  Support: [
    { label: "Help Center", href: "/help-center" },
    { label: "FAQ",         href: "/faq"         },
    { label: "Contact Us",  href: "/contact"     },
    { label: "Download App",href: "/download"    },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy"        },
    { label: "Terms of Service", href: "/terms"          },
    { label: "Cookie Policy",    href: "/cookie-policy"  },
    { label: "AML/KYC Policy",   href: "/aml-kyc"        },
    { label: "Refund Policy",    href: "/refund-policy"  },
  ],
};

const socials = [
  { icon: Twitter,   href: "#", label: "Twitter"   },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook,  href: "#", label: "Facebook"  },
  { icon: Youtube,   href: "#", label: "YouTube"   },
];

export function Footer() {
  return (
    <footer className="bg-[#F7F8FA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/payvora-wordmark.svg"
                alt="PAYVORA"
                width={140}
                height={38}
                style={{ filter: "brightness(0)" }}
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Nigeria&apos;s premium fintech platform. Trade gift cards, pay bills,
              recharge airtime, and manage your digital wallet — all in one app.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#00D9A0] hover:border-[#00D9A0] transition-all hover:shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-gray-900 font-semibold text-sm mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PAYVORA. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">Made with ❤️ in Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

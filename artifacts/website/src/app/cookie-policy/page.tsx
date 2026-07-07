import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy – PAYVORA",
  description:
    "Learn how PAYVORA uses cookies and similar technologies on our website. Find out how to manage your cookie preferences.",
  alternates: { canonical: "https://www.payvora.org/cookie-policy" },
};

const sections = [
  {
    title: "1. What Are Cookies?",
    body: "Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.\n\nSimilar technologies include web beacons, pixel tags, and local storage — we refer to all of these collectively as \"cookies\" in this policy.",
  },
  {
    title: "2. How We Use Cookies",
    body: "PAYVORA uses cookies on our website (www.payvora.org) for the following purposes:\n\n• To make our website work correctly (essential cookies)\n• To remember your preferences and settings\n• To analyze how visitors use our site so we can improve it\n• To understand which marketing campaigns are effective\n• To prevent fraud and improve security",
  },
  {
    title: "3. Types of Cookies We Use",
    body: "Essential cookies — These cookies are necessary for the website to function. They include session management, security tokens, and load balancing. You cannot opt out of essential cookies.\n\nAnalytics cookies — We use analytics tools to understand how visitors interact with our website. This data is aggregated and anonymous. It helps us understand page performance, traffic sources, and user journeys.\n\nPreference cookies — These cookies remember choices you make, such as your language preference, to provide a more personalised experience.\n\nMarketing cookies — If you arrive at PAYVORA through an advertisement, we may use cookies to track the effectiveness of that ad campaign. We do not sell this data to third parties.",
  },
  {
    title: "4. Third-Party Cookies",
    body: "Some cookies on our website are set by third-party services we use. These include:\n\n• Google Analytics — for website traffic analysis (you can opt out at analytics.google.com/analytics/optout)\n• Vercel Analytics — for performance monitoring\n\nThese third parties have their own privacy policies governing how they use this data. PAYVORA does not control these cookies.",
  },
  {
    title: "5. Cookie Retention",
    body: "Session cookies are deleted when you close your browser.\n\nPersistent cookies remain on your device until they expire or you delete them. The retention period varies by cookie:\n\n• Essential cookies: Session or up to 1 year\n• Analytics cookies: Up to 2 years\n• Preference cookies: Up to 1 year\n• Marketing cookies: Up to 90 days",
  },
  {
    title: "6. How to Manage Cookies",
    body: "You can control and/or delete cookies at any time using your browser settings. Most browsers allow you to:\n\n• View which cookies are stored on your device\n• Block cookies from specific or all websites\n• Delete all cookies when you close the browser\n\nPlease note that disabling certain cookies may affect the functionality of our website. Essential cookies cannot be disabled without breaking the site.\n\nFor instructions specific to your browser, visit:\n• Chrome: chrome://settings/cookies\n• Firefox: about:preferences#privacy\n• Safari: Preferences > Privacy\n• Edge: edge://settings/cookies",
  },
  {
    title: "7. Do Not Track",
    body: "Some browsers include a \"Do Not Track\" (DNT) feature that signals to websites that you do not want your online activity tracked. Our website does not currently respond to DNT signals, as there is no industry-wide standard for how websites should respond to them. We will update this policy if a standard is adopted.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Cookie Policy from time to time. We will notify you of significant changes by updating the \"Last updated\" date at the top of this page. We encourage you to review this policy periodically.",
  },
  {
    title: "9. Contact Us",
    body: "If you have questions about our use of cookies, please contact:\n\nPrivacy: privacy@payvora.com\nGeneral Support: support@payvora.com\n\nPAYVORA\nLagos, Nigeria",
  },
];

export default function CookiePolicyPage() {
  const toc = sections.map((s) => ({
    anchor: s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: s.title,
  }));

  return (
    <main className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00D9A0]/10 border border-[#00D9A0]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D9A0]" />
            <span className="text-[#00D9A0] text-sm font-semibold">Legal Document</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Cookie Policy
          </h1>
          <p className="text-gray-500 text-base">
            Last updated: <span className="text-gray-900 font-medium">July 6, 2026</span>
          </p>
          <p className="text-gray-500 mt-4 leading-relaxed max-w-2xl">
            This policy explains how PAYVORA uses cookies and similar technologies on our website, and how you can control them.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          {/* Table of Contents */}
          <aside className="hidden lg:block sticky top-28">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </h2>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    className="block text-sm text-gray-500 hover:text-[#00D9A0] py-1.5 transition-colors leading-snug"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-12">
            {sections.map(({ title, body }) => {
              const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <section key={title} id={anchor} className="scroll-mt-32">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 rounded-full bg-[#00D9A0] flex-shrink-0" />
                    {title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed whitespace-pre-line pl-4 border-l border-gray-100">
                    {body}
                  </p>
                </section>
              );
            })}

            {/* Links to other policies */}
            <div className="pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                For information about how we handle your personal data, see our{" "}
                <Link href="/privacy" className="text-[#00D9A0] hover:underline">Privacy Policy</Link>.
                {" "}For our full legal terms, see our{" "}
                <Link href="/terms" className="text-[#00D9A0] hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

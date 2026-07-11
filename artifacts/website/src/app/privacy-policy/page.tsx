import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "Privacy Policy | PAYVORA",
  description:
    "Learn how PAYVORA collects, uses, and protects your personal data. Compliant with NDPR, Google services requirements, and international data protection standards.",
  alternates: {
    canonical: "https://www.payvora.org/privacy-policy",
  },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "July 11, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-bg)]">
      <Container className="max-w-4xl">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {EFFECTIVE_DATE}
          </p>
          <p className="mt-6 text-[var(--color-text-sec)] text-lg leading-relaxed">
            PAYVORA Technologies Ltd. ("<strong className="text-white">PAYVORA</strong>", "<strong className="text-white">we</strong>",
            "<strong className="text-white">us</strong>", or "<strong className="text-white">our</strong>") is committed to
            protecting your privacy. This Privacy Policy explains what personal data we collect, why we collect it, how we
            use and share it, and what rights you have. It applies to your use of the PAYVORA mobile application, website
            at <strong className="text-white">www.payvora.org</strong>, and all related services (collectively, the "Services").
          </p>
          <p className="mt-4 text-[var(--color-text-sec)]">
            By using our Services you agree to the terms of this Privacy Policy. If you do not agree, please do not use
            our Services. For our full user agreement, please review our{" "}
            <Link href="/terms" className="text-[var(--color-accent)] underline underline-offset-2 hover:text-white transition-colors">
              Terms of Service
            </Link>.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-12">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Table of Contents</h2>
          <ol className="space-y-2 text-sm text-[var(--color-text-sec)] list-decimal list-inside">
            {[
              ["#who-we-are", "Who We Are"],
              ["#data-we-collect", "Data We Collect"],
              ["#how-we-use", "How We Use Your Data"],
              ["#legal-basis", "Legal Basis for Processing"],
              ["#data-sharing", "Data Sharing and Disclosure"],
              ["#google-services", "Google Services and Third-Party SDKs"],
              ["#cookies", "Cookies and Tracking Technologies"],
              ["#data-transfers", "International Data Transfers"],
              ["#data-retention", "Data Retention"],
              ["#your-rights", "Your Privacy Rights"],
              ["#children", "Children's Privacy"],
              ["#security", "Security Measures"],
              ["#changes", "Changes to This Policy"],
              ["#contact", "Contact Us"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-[var(--color-accent)] transition-colors">{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="space-y-14 text-[var(--color-text-sec)] leading-relaxed">

          <section id="who-we-are">
            <h2 className="text-2xl font-bold text-white mb-4">1. Who We Are</h2>
            <p>
              PAYVORA Technologies Ltd. is a financial technology company registered in Nigeria and operating under the
              oversight of the Central Bank of Nigeria (CBN). We provide digital financial services including virtual
              dollar cards, gift card trading, bill payments, airtime and data top-ups, and wallet management through our
              mobile application and website.
            </p>
            <p className="mt-4">
              Our registered address and Data Protection Officer contact:
            </p>
            <address className="not-italic mt-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 text-sm space-y-1">
              <p className="text-white font-semibold">PAYVORA Technologies Ltd.</p>
              <p>Lagos, Nigeria</p>
              <p>Email: <a href="mailto:privacy@payvora.org" className="text-[var(--color-accent)] hover:underline">privacy@payvora.org</a></p>
              <p>Support: <a href="mailto:hello@payvora.org" className="text-[var(--color-accent)] hover:underline">hello@payvora.org</a></p>
              <p>Website: <a href="https://www.payvora.org" className="text-[var(--color-accent)] hover:underline">www.payvora.org</a></p>
            </address>
          </section>

          <section id="data-we-collect">
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p>We collect information in the following ways:</p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.1 Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Account Information:</strong> Full name, email address, phone number, date of birth, and password (stored as a secure hash).</li>
              <li><strong className="text-white">KYC / Identity Verification:</strong> Bank Verification Number (BVN), National Identification Number (NIN), international passport, driver's licence, and facial/biometric verification data required by CBN regulations.</li>
              <li><strong className="text-white">Financial Information:</strong> Linked bank account details, transaction amounts, recipient information, gift card details, and wallet funding data.</li>
              <li><strong className="text-white">Communication Data:</strong> Messages sent to our support team, survey responses, and feedback forms.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Device Data:</strong> Device model, operating system version, unique device identifiers, and mobile network information.</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, tap/click interactions, session duration, and in-app navigation paths.</li>
              <li><strong className="text-white">Log Data:</strong> IP address, browser type, timestamps, referring URLs, and error reports.</li>
              <li><strong className="text-white">Location Data:</strong> Approximate location derived from IP address. We do not request or store precise GPS location.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Google Sign-In:</strong> If you choose to sign in with Google, we receive your name, email address, and profile photo from Google's API. We do not receive or store your Google password. See Section 6 for more details.</li>
              <li><strong className="text-white">Apple Sign-In:</strong> If you choose to sign in with Apple, we receive a unique Apple user identifier and, if permitted, your name and email address.</li>
              <li><strong className="text-white">Identity Verification Partners:</strong> Results of BVN and NIN lookups conducted through NIBSS or licensed identity verification providers.</li>
              <li><strong className="text-white">Payment Partners:</strong> Transaction status and confirmation data from partner banks and payment processors.</li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <div className="mt-4 space-y-4">
              {[
                ["Account Creation and Management", "To register your account, verify your identity, set up your wallet, and manage your profile settings."],
                ["Transaction Processing", "To execute bill payments, airtime top-ups, gift card trades, fund transfers, and virtual card issuance."],
                ["Identity Verification and Compliance", "To verify your identity under CBN KYC requirements and comply with Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) obligations."],
                ["Fraud Prevention and Security", "To detect, investigate, and prevent fraudulent transactions, unauthorized account access, and other security incidents."],
                ["Customer Support", "To respond to your inquiries, troubleshoot issues, and process refund or dispute requests."],
                ["Service Improvement", "To analyze usage patterns, fix bugs, develop new features, and improve the overall performance of our Services."],
                ["Communications", "To send transactional emails (e.g., payment confirmations, security alerts) and, with your consent, marketing communications about new features or promotions."],
                ["Legal Obligations", "To comply with applicable Nigerian laws, CBN directives, court orders, and regulatory requirements."],
              ].map(([title, desc]) => (
                <div key={title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">{title}</p>
                  <p className="text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="legal-basis">
            <h2 className="text-2xl font-bold text-white mb-4">4. Legal Basis for Processing</h2>
            <p>
              We process your personal data under the following legal bases as required by the Nigerian Data Protection
              Regulation (NDPR) and, where applicable, the EU General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong className="text-white">Contract Performance:</strong> Processing necessary to provide the Services you have signed up for (e.g., executing your transactions, creating your virtual card).</li>
              <li><strong className="text-white">Legal Obligation:</strong> Processing required to comply with CBN regulations, AML/CTF laws, and other applicable Nigerian statutes.</li>
              <li><strong className="text-white">Legitimate Interests:</strong> Processing for fraud prevention, security monitoring, and service analytics, where these interests are not overridden by your data protection rights.</li>
              <li><strong className="text-white">Consent:</strong> For marketing communications and non-essential cookies, we will ask for your explicit consent and you may withdraw it at any time.</li>
            </ul>
          </section>

          <section id="data-sharing">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal data. We share information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong className="text-white">Service Providers:</strong> Trusted third-party vendors who help us operate our Services (cloud hosting, database management, push notifications, email delivery, customer support tools). All vendors are contractually required to protect your data and process it only for the purposes we specify.</li>
              <li><strong className="text-white">Payment and Banking Partners:</strong> Banks, card networks, and payment processors necessary to execute your financial transactions and issue virtual cards.</li>
              <li><strong className="text-white">Identity Verification Partners:</strong> Providers licensed to verify BVN, NIN, and other KYC documents as required by CBN regulations.</li>
              <li><strong className="text-white">Regulatory Authorities:</strong> The Central Bank of Nigeria (CBN), NFIU, EFCC, or other government bodies when required by law, regulation, or a valid court order.</li>
              <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity, subject to the same privacy protections described here.</li>
              <li><strong className="text-white">With Your Consent:</strong> We will share your data with any other party when you have given us explicit consent to do so.</li>
            </ul>
          </section>

          <section id="google-services">
            <h2 className="text-2xl font-bold text-white mb-4">6. Google Services and Third-Party SDKs</h2>
            <p>
              PAYVORA integrates with several Google and third-party services. This section explains what data each service
              receives and how it is used.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Google Sign-In (OAuth 2.0)</h3>
            <p>
              When you use "Sign in with Google," we access your Google Account profile using OAuth 2.0. The data
              received is limited to: your name, email address, and profile photo. We use this data solely to create or
              authenticate your PAYVORA account. We do not access your Google Drive, Gmail, contacts, or any other Google
              services. Your use of Google Sign-In is also governed by{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                Google's Privacy Policy
              </a>.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Google Analytics</h3>
            <p>
              We use Google Analytics to understand how users interact with our website. Google Analytics collects
              anonymized data including page views, session duration, device type, and approximate geographic location.
              IP addresses are anonymized before storage. You can opt out of Google Analytics by installing the{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Firebase (Google)</h3>
            <p>
              We may use Firebase services (Crashlytics, Cloud Messaging) to monitor app stability and send push
              notifications. Firebase may collect device identifiers and crash logs. This data is used solely for
              improving app performance and is governed by{" "}
              <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                Firebase's Privacy and Security terms
              </a>.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Other Third-Party SDKs</h3>
            <p>
              Our application may incorporate additional third-party SDKs for features such as in-app customer support,
              analytics, and security. Each SDK is subject to its own privacy policy. We review all third-party
              integrations for compliance with NDPR requirements before deployment.
            </p>

            <p className="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 text-sm">
              <strong className="text-white">Important — Limited Use Disclosure:</strong> PAYVORA's use of data received
              from Google APIs adheres to the{" "}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                Google API Services User Data Policy
              </a>, including the Limited Use requirements. We do not use Google user data to serve advertising, profile
              users for non-service purposes, or transfer data to third parties except as required to provide our Services.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking technologies. You can manage your cookie preferences at any
              time. See our{" "}
              <Link href="/cookie-policy" className="text-[var(--color-accent)] hover:underline">
                Cookie Policy
              </Link>{" "}
              for full details.
            </p>
            <div className="mt-4 space-y-3">
              {[
                ["Essential Cookies", "Required for the website to function (session management, security tokens). Cannot be disabled."],
                ["Analytics Cookies", "Help us understand how users navigate our site. Collected in anonymized, aggregated form. Opt-out available."],
                ["Preference Cookies", "Remember your settings such as language or region. Disabled by default."],
                ["Marketing Cookies", "Used to deliver relevant content and measure campaign effectiveness. Only set with your explicit consent."],
              ].map(([name, desc]) => (
                <div key={name} className="flex gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
                  <div className="text-sm">
                    <p className="text-white font-semibold mb-1">{name}</p>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="data-transfers">
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p>
              Your data is primarily processed and stored in Nigeria. To provide certain Services, your data may be
              transferred to and processed in other countries (for example, our cloud infrastructure hosted in the EU or
              US). Wherever we transfer data internationally, we ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Standard Contractual Clauses (SCCs) approved by applicable data protection authorities.</li>
              <li>Data processing agreements requiring recipient parties to maintain NDPR-equivalent protections.</li>
              <li>Technical measures including end-to-end encryption in transit and at rest.</li>
            </ul>
          </section>

          <section id="data-retention">
            <h2 className="text-2xl font-bold text-white mb-4">9. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide the Services and to comply with our legal
              obligations:
            </p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li><strong className="text-white">Active Accounts:</strong> We retain your data for the duration your account is active.</li>
              <li><strong className="text-white">Closed Accounts:</strong> Upon account closure, we delete or anonymize your personal data within 90 days, except as required by law.</li>
              <li><strong className="text-white">Transaction Records and KYC Data:</strong> CBN regulations require us to retain transaction history, KYC documents, and AML records for a minimum of five (5) years after account closure.</li>
              <li><strong className="text-white">Marketing Data:</strong> Retained until you withdraw consent or we determine it is no longer needed.</li>
              <li><strong className="text-white">Support Communications:</strong> Retained for up to 3 years to support dispute resolution.</li>
            </ul>
          </section>

          <section id="your-rights">
            <h2 className="text-2xl font-bold text-white mb-4">10. Your Privacy Rights</h2>
            <p>
              Under the Nigerian Data Protection Regulation (NDPR) and, where applicable, the GDPR, you have the
              following rights:
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                ["Right to Access", "Request a copy of the personal data we hold about you."],
                ["Right to Rectification", "Request correction of any inaccurate or incomplete data."],
                ["Right to Erasure", "Request deletion of your data, subject to legal retention requirements."],
                ["Right to Portability", "Request a machine-readable export of your personal data."],
                ["Right to Object", "Object to processing based on legitimate interests, including direct marketing."],
                ["Right to Restrict Processing", "Request that we limit how we use your data in certain circumstances."],
                ["Right to Withdraw Consent", "Withdraw consent for marketing or non-essential cookies at any time."],
                ["Right to Lodge a Complaint", "File a complaint with the Nigerian Data Protection Commission (NDPC) at ndpc.gov.ng."],
              ].map(([right, desc]) => (
                <div key={right} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">{right}</p>
                  <p className="text-sm">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              To exercise any of these rights, contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@payvora.org" className="text-[var(--color-accent)] hover:underline">
                privacy@payvora.org
              </a>. We will respond within 30 days.
            </p>
          </section>

          <section id="children">
            <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
            <p>
              PAYVORA's Services are not directed at individuals under the age of 18. We do not knowingly collect
              personal data from children. If we become aware that we have collected data from a person under 18
              without parental consent, we will promptly delete that information. If you believe a minor has registered
              for our Services, please contact us at{" "}
              <a href="mailto:privacy@payvora.org" className="text-[var(--color-accent)] hover:underline">
                privacy@payvora.org
              </a>.
            </p>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-white mb-4">12. Security Measures</h2>
            <p>
              We implement industry-standard technical and organisational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>AES-256 encryption for data at rest.</li>
              <li>TLS 1.3 encryption for all data in transit (HTTPS only).</li>
              <li>Multi-factor authentication for account access and high-value transactions.</li>
              <li>Continuous fraud monitoring and anomaly detection.</li>
              <li>Role-based access controls limiting employee access to personal data.</li>
              <li>Regular security audits and penetration testing.</li>
            </ul>
            <p className="mt-4">
              No security system is impenetrable. If you suspect unauthorized access to your account, contact us
              immediately at{" "}
              <a href="mailto:security@payvora.org" className="text-[var(--color-accent)] hover:underline">
                security@payvora.org
              </a>{" "}
              or visit our{" "}
              <Link href="/security" className="text-[var(--color-accent)] hover:underline">
                Security page
              </Link>.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or
              applicable law. When we make material changes, we will notify you by email or through a prominent notice
              in the app at least 14 days before the changes take effect. The updated policy will always be accessible
              at{" "}
              <Link href="/privacy-policy" className="text-[var(--color-accent)] hover:underline">
                www.payvora.org/privacy-policy
              </Link>.
              Your continued use of the Services after the effective date constitutes acceptance of the revised policy.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
            <p>
              For questions, data subject requests, or privacy concerns, contact our Data Protection Officer:
            </p>
            <address className="not-italic mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-2 text-sm">
              <p className="text-white font-semibold">Data Protection Officer — PAYVORA Technologies Ltd.</p>
              <p>Email: <a href="mailto:privacy@payvora.org" className="text-[var(--color-accent)] hover:underline">privacy@payvora.org</a></p>
              <p>General Support: <a href="mailto:hello@payvora.org" className="text-[var(--color-accent)] hover:underline">hello@payvora.org</a></p>
              <p>Security Issues: <a href="mailto:security@payvora.org" className="text-[var(--color-accent)] hover:underline">security@payvora.org</a></p>
              <p>Website: <a href="https://www.payvora.org" className="text-[var(--color-accent)] hover:underline">www.payvora.org</a></p>
            </address>
          </section>

          {/* Cross-link to Terms */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold mb-1">Related Legal Documents</p>
              <p className="text-sm text-[var(--color-muted)]">
                Review our other legal policies that govern your use of PAYVORA.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-white text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                Terms of Service →
              </Link>
              <Link
                href="/cookie-policy"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-white text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                Cookie Policy →
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

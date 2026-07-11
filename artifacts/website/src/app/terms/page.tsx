import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "Terms of Service | PAYVORA",
  description:
    "PAYVORA's Terms of Service governing your use of the app, website, virtual cards, gift card trading, bill payments, and related financial services.",
  alternates: {
    canonical: "https://www.payvora.org/terms",
  },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "July 11, 2026";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-bg)]">
      <Container className="max-w-4xl">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {EFFECTIVE_DATE}
          </p>
          <p className="mt-6 text-[var(--color-text-sec)] text-lg leading-relaxed">
            Welcome to PAYVORA. These Terms of Service ("<strong className="text-white">Terms</strong>") are a legally
            binding agreement between you and PAYVORA Technologies Ltd. ("<strong className="text-white">PAYVORA</strong>",
            "<strong className="text-white">we</strong>", "<strong className="text-white">us</strong>", or{" "}
            "<strong className="text-white">our</strong>"). They govern your access to and use of the PAYVORA mobile
            application, the website at <strong className="text-white">www.payvora.org</strong>, and all related
            services (collectively, the "Services").
          </p>
          <p className="mt-4 text-[var(--color-text-sec)]">
            By creating an account, downloading our app, or using our Services, you confirm that you have read,
            understood, and agree to these Terms. If you do not agree, please do not use our Services. For information
            on how we handle your personal data, please read our{" "}
            <Link href="/privacy-policy" className="text-[var(--color-accent)] underline underline-offset-2 hover:text-white transition-colors">
              Privacy Policy
            </Link>.
          </p>
          <div className="mt-6 bg-[var(--color-surface)] border border-amber-500/30 rounded-xl p-4 text-sm">
            <p className="text-amber-400 font-semibold mb-1">⚠ Important Notice</p>
            <p className="text-[var(--color-text-sec)]">
              Section 15 of these Terms contains a binding arbitration clause and class action waiver that affects your
              legal rights. Please read it carefully.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-12">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Table of Contents</h2>
          <ol className="space-y-2 text-sm text-[var(--color-text-sec)] list-decimal list-inside">
            {[
              ["#eligibility", "Eligibility and Account Registration"],
              ["#services", "Description of Services"],
              ["#account", "Account Security and Responsibilities"],
              ["#kyc", "KYC, AML, and Regulatory Compliance"],
              ["#virtual-cards", "Virtual Cards"],
              ["#gift-cards", "Gift Card Trading"],
              ["#bill-payments", "Bill Payments and Airtime"],
              ["#fees", "Fees and Pricing"],
              ["#prohibited", "Prohibited Activities"],
              ["#intellectual-property", "Intellectual Property"],
              ["#disclaimers", "Disclaimers and Warranties"],
              ["#liability", "Limitation of Liability"],
              ["#indemnification", "Indemnification"],
              ["#termination", "Termination and Suspension"],
              ["#dispute", "Dispute Resolution and Arbitration"],
              ["#governing-law", "Governing Law"],
              ["#changes", "Changes to These Terms"],
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

          <section id="eligibility">
            <h2 className="text-2xl font-bold text-white mb-4">1. Eligibility and Account Registration</h2>
            <p>To register for and use PAYVORA's Services, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Be at least 18 years of age.</li>
              <li>Be a resident of Nigeria or an eligible jurisdiction where our Services are available.</li>
              <li>Possess a valid Bank Verification Number (BVN) issued by the Central Bank of Nigeria.</li>
              <li>Have the legal capacity to enter into a binding contract.</li>
              <li>Not be prohibited from using financial services under applicable law.</li>
            </ul>
            <p className="mt-4">
              By registering, you represent and warrant that all information you provide is accurate, current, and
              complete. You agree to promptly update your information if it changes. PAYVORA reserves the right to
              decline registration or restrict access to anyone at its sole discretion.
            </p>
          </section>

          <section id="services">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
            <p>PAYVORA provides the following financial technology services:</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                ["Virtual Dollar Cards", "Instant virtual USD prepaid cards for international online payments, subscriptions, and purchases."],
                ["Gift Card Trading", "A marketplace to sell unused gift cards from supported brands in exchange for Naira wallet credit."],
                ["Bill Payments", "Zero-fee payment of Nigerian utility bills including electricity (PHCN/DisCos), DSTV/GOtv, LCC, and internet services."],
                ["Airtime & Data", "Instant recharge for MTN, Airtel, Glo, and 9mobile — airtime and data bundles at face value."],
                ["Naira Wallet", "A digital wallet for storing, sending, and receiving Nigerian Naira to and from any Nigerian bank account."],
                ["USDT Conversion", "Conversion of USDT (TRC-20/ERC-20) to Nigerian Naira at real-time exchange rates."],
              ].map(([name, desc]) => (
                <div key={name} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">{name}</p>
                  <p className="text-sm">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              PAYVORA is a financial technology company, not a bank. Banking, card issuance, and regulated financial
              services are provided through our licensed banking and payment partners in accordance with CBN guidelines.
              The availability and features of these Services may change over time.
            </p>
          </section>

          <section id="account">
            <h2 className="text-2xl font-bold text-white mb-4">3. Account Security and Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Maintaining the confidentiality of your login credentials, transaction PIN, and two-factor authentication (2FA) codes.</li>
              <li>All activity that occurs under your account, whether authorized by you or not.</li>
              <li>Immediately notifying PAYVORA at <a href="mailto:security@payvora.org" className="text-[var(--color-accent)] hover:underline">security@payvora.org</a> if you suspect unauthorized access, loss of your device, or a compromised PIN.</li>
              <li>Ensuring your device is protected with a screen lock, up-to-date operating system, and current security patches.</li>
            </ul>
            <p className="mt-4">
              PAYVORA will never ask for your full password, PIN, or 2FA code via email, SMS, phone call, or any channel
              outside the official app. Any request for these credentials is fraudulent.
            </p>
            <p className="mt-4">
              You may not create more than one account per person. Multiple accounts may be merged or terminated at
              PAYVORA's discretion.
            </p>
          </section>

          <section id="kyc">
            <h2 className="text-2xl font-bold text-white mb-4">4. KYC, AML, and Regulatory Compliance</h2>
            <p>
              PAYVORA operates under the regulatory oversight of the Central Bank of Nigeria (CBN) and complies with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>CBN Know Your Customer (KYC) and customer due diligence requirements.</li>
              <li>The Money Laundering (Prevention and Prohibition) Act 2022.</li>
              <li>The Terrorism Prevention Act 2011 (as amended) — Anti-Terrorism Financing obligations.</li>
              <li>NFIU reporting requirements for suspicious transactions.</li>
            </ul>
            <p className="mt-4">
              You agree to provide accurate KYC documents (including BVN, NIN, or government-issued ID) as required to
              upgrade your account tier or increase transaction limits. We may suspend or restrict your account pending
              completion of KYC verification. We may report suspicious activity to the appropriate Nigerian authorities
              without notifying you in advance, as required by law.
            </p>
          </section>

          <section id="virtual-cards">
            <h2 className="text-2xl font-bold text-white mb-4">5. Virtual Cards</h2>
            <p>By using PAYVORA virtual cards, you acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Virtual cards are prepaid instruments funded exclusively from your PAYVORA Naira wallet at the prevailing USD/NGN exchange rate at the time of funding.</li>
              <li>Cards are subject to daily and monthly spending limits based on your KYC verification tier, as displayed in the app.</li>
              <li>PAYVORA is not liable for transactions declined by merchants due to merchant-side restrictions, insufficient card funds, or address verification failures.</li>
              <li>You may not use virtual cards for gambling, adult content, narcotics, firearms, or any activity prohibited by Nigerian law or the card network's acceptable use policy.</li>
              <li>Unused balances on terminated cards may be refunded to your wallet at PAYVORA's discretion, subject to CBN guidelines.</li>
            </ul>
          </section>

          <section id="gift-cards">
            <h2 className="text-2xl font-bold text-white mb-4">6. Gift Card Trading</h2>
            <p>When trading gift cards on PAYVORA, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You are the rightful owner of the gift cards you submit for trading.</li>
              <li>The cards were obtained through lawful means and are not stolen, fraudulent, or linked to any illegal activity.</li>
              <li>The card details (codes, PINs) are valid and have not been fully or partially redeemed prior to submission.</li>
            </ul>
            <p className="mt-4">
              Exchange rates are set by PAYVORA at its sole discretion based on market conditions and are displayed in
              the app at the time of trade. Rates may change without notice. Once a gift card trade is submitted and
              verified, it is final and non-reversible. PAYVORA reserves the right to decline any gift card trade it
              deems fraudulent or in violation of this policy. Accounts found submitting stolen or fraudulent gift cards
              will be permanently suspended and reported to law enforcement.
            </p>
          </section>

          <section id="bill-payments">
            <h2 className="text-2xl font-bold text-white mb-4">7. Bill Payments and Airtime</h2>
            <p>
              Bill payments and airtime recharges are processed through our licensed payment infrastructure partners.
              You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You are responsible for ensuring the accuracy of the meter number, account number, phone number, or any other identifier entered for a payment.</li>
              <li>Once a payment is initiated and confirmed as successful, it cannot be reversed by PAYVORA. Errors in recipient details are the user's responsibility.</li>
              <li>Delivery of airtime, data, or utility credits is subject to the availability and systems of the respective utility provider or network operator. PAYVORA is not liable for delays caused by third-party systems.</li>
              <li>In the event of a confirmed transaction failure where funds were deducted, PAYVORA will initiate a reversal within 5 working days.</li>
            </ul>
          </section>

          <section id="fees">
            <h2 className="text-2xl font-bold text-white mb-4">8. Fees and Pricing</h2>
            <p>
              PAYVORA's current fee schedule is available on our{" "}
              <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">Pricing page</Link>.
              By using the Services, you agree to pay all applicable fees. Key terms:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Bill payments, airtime recharges, and peer-to-peer Naira transfers are provided at zero service fee for Free-tier users.</li>
              <li>Virtual card creation and maintenance fees, if any, are displayed in the app before you confirm.</li>
              <li>Gift card exchange rates include PAYVORA's margin; no additional fee is charged.</li>
              <li>Currency conversion rates for USD card funding and USDT-to-NGN conversions are calculated at the time of each transaction and displayed for your confirmation.</li>
              <li>PAYVORA reserves the right to introduce or modify fees with at least 14 days' advance notice to registered users.</li>
            </ul>
          </section>

          <section id="prohibited">
            <h2 className="text-2xl font-bold text-white mb-4">9. Prohibited Activities</h2>
            <p>You may not use the Services to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Engage in, facilitate, or conceal money laundering, terrorist financing, or other financial crimes.</li>
              <li>Process payments for illegal goods or services, including narcotics, firearms, or human trafficking.</li>
              <li>Submit stolen, fraudulent, or unauthorized payment instruments or gift cards.</li>
              <li>Circumvent transaction limits, KYC requirements, or security controls.</li>
              <li>Use automated scripts, bots, or scraping tools to access the Services without our prior written consent.</li>
              <li>Impersonate PAYVORA, our employees, or any other person or entity.</li>
              <li>Interfere with or attempt to disrupt the integrity, performance, or security of our systems.</li>
              <li>Use the Services in any manner that violates any applicable Nigerian or international law or regulation.</li>
            </ul>
            <p className="mt-4">
              Violation of this section may result in immediate account suspension, permanent termination, forfeiture of
              wallet balances (subject to legal requirements), and referral to Nigerian law enforcement authorities.
            </p>
          </section>

          <section id="intellectual-property">
            <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
            <p>
              All content, trademarks, logos, trade names, software, designs, and intellectual property associated with
              PAYVORA are owned by PAYVORA Technologies Ltd. or its licensors. Nothing in these Terms grants you any
              right to use the PAYVORA name, logo, or brand without our prior written consent.
            </p>
            <p className="mt-4">
              You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the
              Services for your personal, non-commercial purposes, subject to these Terms. This licence does not
              include the right to sublicence, sell, resell, copy, modify, create derivative works from, or reverse
              engineer any part of the Services.
            </p>
          </section>

          <section id="disclaimers">
            <h2 className="text-2xl font-bold text-white mb-4">11. Disclaimers and Warranties</h2>
            <p className="uppercase text-sm font-semibold text-white mb-3">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE"</p>
            <p>
              To the maximum extent permitted by applicable law, PAYVORA expressly disclaims all warranties, whether
              express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a
              particular purpose, and non-infringement. PAYVORA does not warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>The Services will be uninterrupted, error-free, or available at all times.</li>
              <li>Information provided through the Services is accurate, complete, or current.</li>
              <li>The Services will meet your specific requirements.</li>
              <li>Any defects or errors in the Services will be corrected.</li>
            </ul>
            <p className="mt-4">
              Exchange rates, transaction outcomes, and third-party network availability are outside PAYVORA's direct
              control and are not guaranteed.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-bold text-white mb-4">12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by the laws of Nigeria, PAYVORA, its directors, officers, employees,
              agents, and partners shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Loss of profits, data, business, goodwill, or revenue.</li>
              <li>Damages arising from unauthorized access to your account due to your failure to maintain credential security.</li>
              <li>Service interruptions caused by third-party networks, utility providers, or force majeure events.</li>
            </ul>
            <p className="mt-4">
              In any event, PAYVORA's total aggregate liability to you for all claims arising out of or relating to
              these Terms or the Services shall not exceed the greater of (a) the total fees paid by you to PAYVORA in
              the twelve (12) months preceding the claim, or (b) ₦50,000.
            </p>
          </section>

          <section id="indemnification">
            <h2 className="text-2xl font-bold text-white mb-4">13. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless PAYVORA Technologies Ltd. and its officers, directors,
              employees, contractors, and agents from and against any claims, liabilities, damages, losses, costs, and
              expenses (including reasonable legal fees) arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your breach of these Terms or any applicable law or regulation.</li>
              <li>Your use or misuse of the Services.</li>
              <li>Your submission of fraudulent, stolen, or inaccurate information.</li>
              <li>Your violation of any third party's rights, including intellectual property rights.</li>
            </ul>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-bold text-white mb-4">14. Termination and Suspension</h2>
            <p>
              <strong className="text-white">By You:</strong> You may close your account at any time by contacting our
              support team at{" "}
              <a href="mailto:hello@payvora.org" className="text-[var(--color-accent)] hover:underline">
                hello@payvora.org
              </a>
              . Upon closure, all pending transactions will be processed, and remaining wallet balances will be
              disbursed to your verified Nigerian bank account within 10 working days, subject to AML compliance checks.
            </p>
            <p className="mt-4">
              <strong className="text-white">By PAYVORA:</strong> We may suspend, restrict, or permanently terminate
              your account without prior notice if we determine, in our sole discretion, that you have:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Violated these Terms or any applicable law.</li>
              <li>Engaged in or are suspected of fraudulent or illegal activity.</li>
              <li>Provided false information during registration or KYC.</li>
              <li>Posed a risk to PAYVORA or other users.</li>
              <li>Failed to complete required KYC verification within a reasonable period.</li>
            </ul>
            <p className="mt-4">
              Upon termination, your licence to use the Services immediately ceases. We will retain your data as
              required by law (see Privacy Policy Section 9).
            </p>
          </section>

          <section id="dispute">
            <h2 className="text-2xl font-bold text-white mb-4">15. Dispute Resolution and Arbitration</h2>
            <p className="bg-[var(--color-surface)] border border-amber-500/30 rounded-xl p-4 text-sm mb-4">
              <strong className="text-amber-400">Please read this section carefully.</strong> It requires you to resolve
              most disputes through binding arbitration rather than in court, and waives your right to participate in
              class action litigation.
            </p>
            <p>
              <strong className="text-white">Informal Resolution:</strong> Before initiating any formal proceedings,
              you agree to contact PAYVORA at{" "}
              <a href="mailto:legal@payvora.org" className="text-[var(--color-accent)] hover:underline">
                legal@payvora.org
              </a>{" "}
              and attempt to resolve the dispute informally for a period of 30 days.
            </p>
            <p className="mt-4">
              <strong className="text-white">Binding Arbitration:</strong> If informal resolution fails, any dispute,
              claim, or controversy arising out of or relating to these Terms or the Services shall be resolved by
              binding arbitration conducted by a mutually agreed arbitrator in Lagos, Nigeria, under the Arbitration and
              Conciliation Act (Cap A18, Laws of the Federation of Nigeria 2004). The arbitration shall be conducted in
              the English language. The arbitrator's decision shall be final and binding and may be enforced in any
              court of competent jurisdiction.
            </p>
            <p className="mt-4">
              <strong className="text-white">Class Action Waiver:</strong> All proceedings shall be conducted on an
              individual basis. You waive any right to bring claims as a plaintiff or class member in any purported
              class or representative action.
            </p>
            <p className="mt-4">
              <strong className="text-white">Exceptions:</strong> Either party may seek emergency injunctive relief in
              a Nigerian court of competent jurisdiction to prevent irreparable harm pending the outcome of arbitration.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-bold text-white mb-4">16. Governing Law</h2>
            <p>
              These Terms and any dispute arising out of or in connection with them shall be governed by and construed
              in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law
              provisions. Subject to Section 15 (Arbitration), you irrevocably submit to the exclusive jurisdiction of
              the courts of Lagos State, Nigeria, for any matter not subject to arbitration.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-white mb-4">17. Changes to These Terms</h2>
            <p>
              PAYVORA may revise these Terms at any time. When we make material changes, we will notify registered users
              by email and through an in-app notice at least 14 days before the changes take effect. Your continued use
              of the Services after the effective date of any updated Terms constitutes your acceptance of those changes.
              The current version of these Terms is always available at{" "}
              <Link href="/terms" className="text-[var(--color-accent)] hover:underline">
                www.payvora.org/terms
              </Link>.
            </p>
            <p className="mt-4">
              If you do not agree to revised Terms, you must stop using the Services and close your account before the
              effective date.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold text-white mb-4">18. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact our legal team:
            </p>
            <address className="not-italic mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-2 text-sm">
              <p className="text-white font-semibold">Legal Team — PAYVORA Technologies Ltd.</p>
              <p>Email: <a href="mailto:legal@payvora.org" className="text-[var(--color-accent)] hover:underline">legal@payvora.org</a></p>
              <p>General Support: <a href="mailto:hello@payvora.org" className="text-[var(--color-accent)] hover:underline">hello@payvora.org</a></p>
              <p>Website: <a href="https://www.payvora.org" className="text-[var(--color-accent)] hover:underline">www.payvora.org</a></p>
            </address>
          </section>

          {/* Cross-link to Privacy Policy */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold mb-1">Related Legal Documents</p>
              <p className="text-sm text-[var(--color-muted)]">
                Review our other legal policies that govern your use of PAYVORA.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-white text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                Privacy Policy →
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

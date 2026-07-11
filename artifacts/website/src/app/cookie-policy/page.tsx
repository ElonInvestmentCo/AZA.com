import type { Metadata } from "next";
import { Container } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "Cookie Policy | PAYVORA",
  description: "How we use cookies on PAYVORA.",
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-bg)]">
      <Container className="max-w-4xl">
        <h1 className="h1 mb-4">Cookie Policy</h1>
        <p className="text-[var(--color-muted)] mb-12">Last updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-sec)]">
          <p>
            This Cookie Policy explains how PAYVORA Technologies Ltd. uses cookies and similar tracking technologies when you visit our website (www.payvora.org) and use our web-based services.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">1. What are cookies?</h2>
          <p>
            Cookies are small text files placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide statistical information to site owners.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">2. How we use cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
            <li><strong>Essential Cookies:</strong> Required for the website to function securely. These cannot be switched off. They include authentication cookies that keep you logged in.</li>
            <li><strong>Performance & Analytics Cookies:</strong> Allow us to count visits and traffic sources so we can measure and improve the performance of our site. We use tools like Google Analytics.</li>
            <li><strong>Functional Cookies:</strong> Enable the website to provide enhanced functionality and personalization, such as remembering your language preferences.</li>
          </ul>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">3. Managing your cookies</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas may be restricted.
          </p>

          <h2 className="text-white mt-12 mb-4 font-bold text-2xl">4. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at:
            <br />
            Email: privacy@payvora.org
          </p>
        </div>
      </Container>
    </div>
  );
}

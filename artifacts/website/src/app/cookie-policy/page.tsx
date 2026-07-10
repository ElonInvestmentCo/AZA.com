import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiePage() {
  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-4xl">
        <FadeIn>
          <div className="mb-12 border-b border-[var(--color-border)] pb-8">
            <h1 className="h1 mb-4">Cookie Policy</h1>
            <p className="text-[var(--color-text-sec)]">Last Updated: October 2024</p>
          </div>

          <div className="prose prose-invert max-w-none text-[var(--color-text-sec)]">
            <p className="text-lg mb-8">
              PAYVORA uses cookies and similar tracking technologies to improve your experience on our website.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">What are Cookies?</h3>
            <p className="mb-6">
              Cookies are small text files stored on your device when you visit our website. They help the site remember your preferences, keep your session secure, and provide us with analytics.
            </p>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 mb-6 space-y-4">
              <li>
                <strong>Strictly Necessary Cookies:</strong> Essential for the website to function (e.g., maintaining your login session, security tokens). These cannot be disabled.
              </li>
              <li>
                <strong>Analytical Cookies:</strong> Help us understand how visitors interact with our site by collecting anonymous information (e.g., Google Analytics).
              </li>
              <li>
                <strong>Functional Cookies:</strong> Allow the website to remember choices you make (like language or region preferences).
              </li>
            </ul>

            <h3 className="text-xl text-white font-bold mt-10 mb-4">Managing Cookies</h3>
            <p className="mb-6">
              You can control and manage cookies using your browser settings. Please note that removing or blocking strictly necessary cookies can impact your user experience and parts of the PAYVORA website may no longer be fully accessible.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}

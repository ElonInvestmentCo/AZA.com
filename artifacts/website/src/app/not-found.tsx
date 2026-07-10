import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { Button } from "@/components/ui/core";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-12">
      <Container className="text-center flex flex-col items-center max-w-2xl">
        <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-8 shadow-[0_0_50px_var(--color-accent-dim)]">
          <span className="text-4xl font-bold text-[var(--color-accent)]">404</span>
        </div>
        <h1 className="h2 mb-4">Page Not Found</h1>
        <p className="text-[var(--color-text-sec)] text-lg mb-8 max-w-md">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex gap-4">
          <Button href="/">Return Home</Button>
          <Button href="/contact" variant="outline">Contact Support</Button>
        </div>
      </Container>
    </div>
  );
}

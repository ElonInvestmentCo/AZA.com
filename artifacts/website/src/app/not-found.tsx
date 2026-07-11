import { Container, Button } from "@/components/ui/core";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Container className="text-center">
        <div className="w-24 h-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
          <Ghost className="w-12 h-12 text-[var(--color-accent)]" />
        </div>
        <h1 className="h1 mb-4">Page not found</h1>
        <p className="text-xl text-[var(--color-muted)] mb-10 max-w-md mx-auto">
          Looks like this page doesn't exist, or it has been moved to a new location.
        </p>
        <Button href="/">Back to Homepage</Button>
      </Container>
    </div>
  );
}

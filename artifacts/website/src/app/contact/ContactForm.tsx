"use client";
import { useState } from "react";
import { Button } from "@/components/ui/core";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-[var(--color-surface)] border border-[var(--color-border)] p-12 rounded-3xl text-center flex flex-col items-center"
      >
        <CheckCircle2 className="w-16 h-16 text-[var(--color-accent)] mb-6" />
        <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
        <p className="text-[var(--color-muted)] mb-8">We'll get back to you as soon as possible.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline">Send another message</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 md:p-10 rounded-3xl">
      <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-muted)]">Full Name</label>
            <input required type="text" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-muted)]">Email Address</label>
            <input required type="email" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors" placeholder="john@example.com" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-muted)]">Subject</label>
          <select className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none">
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership</option>
            <option value="press">Press</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-muted)]">Message</label>
          <textarea required rows={5} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none" placeholder="How can we help you?"></textarea>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}

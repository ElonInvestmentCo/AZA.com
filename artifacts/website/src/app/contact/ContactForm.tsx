"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-bold mb-2">Message sent.</h3>
        <p className="text-[var(--color-text-sec)]">
          Thanks for reaching out — our support team will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-sec)]">Full Name</label>
          <input
            type="text"
            id="name"
            required
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-sec)]">Email Address</label>
          <input
            type="email"
            id="email"
            required
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-[var(--color-text-sec)]">Subject</label>
        <select
          id="subject"
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none"
        >
          <option>Account Support</option>
          <option>Transaction Issue</option>
          <option>Partnership Inquiry</option>
          <option>Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-sec)]">Message</label>
        <textarea
          id="message"
          rows={5}
          required
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      <Button type="submit" className="w-full mt-4">Send Message</Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Mail, MessageCircle, Twitter, Instagram, Facebook, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-4">
            We respond fast
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-xl mx-auto">
            Have a question or need help? Our team is ready to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-5">
            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-[#00D9A0]" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Email Support</h3>
                <p className="text-[#8F8FA3] text-sm mb-2">For account issues, disputes, and general inquiries.</p>
                <a href="mailto:support@payvora.com" className="text-[#00D9A0] text-sm font-semibold hover:underline">
                  support@payvora.com
                </a>
              </div>
            </div>

            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
                <MessageCircle size={22} className="text-[#00D9A0]" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Live Chat</h3>
                <p className="text-[#8F8FA3] text-sm mb-2">Get instant help from our support team via the app.</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-[#00D9A0] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse" />
                  Available 24/7 in the PayVora app
                </span>
              </div>
            </div>

            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Follow us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: "Twitter", href: "#" },
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Facebook, label: "Facebook", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-[#1C1C2A] border border-[#2A2A3D] flex items-center justify-center text-[#8F8FA3] hover:text-[#00D9A0] hover:border-[#00D9A0] transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Business hours</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed">
                Our automated systems run 24/7. Human agents are available<br />
                <strong className="text-white">Monday–Sunday, 8 AM – 10 PM WAT.</strong>
              </p>
            </div>

            {/* Response time indicator */}
            <div className="bg-[rgba(0,217,160,0.06)] border border-[rgba(0,217,160,0.2)] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-[#00D9A0]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Average response time: 2 hours</p>
                <p className="text-[#8F8FA3] text-xs">During business hours — often within minutes</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[rgba(0,217,160,0.12)] flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-[#00D9A0]" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Message sent!</h3>
                <p className="text-[#8F8FA3] leading-relaxed max-w-xs">
                  Thanks {form.firstName}! We&apos;ll get back to you at{" "}
                  <span className="text-[#00D9A0]">{form.email}</span> within 2 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-sm text-[#00D9A0] font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white font-bold text-2xl mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#8F8FA3] text-sm mb-1.5 block">First name</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        className="w-full bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm placeholder-[#55556A] focus:outline-none focus:border-[#00D9A0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[#8F8FA3] text-sm mb-1.5 block">Last name</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        className="w-full bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm placeholder-[#55556A] focus:outline-none focus:border-[#00D9A0] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#8F8FA3] text-sm mb-1.5 block">Email address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm placeholder-[#55556A] focus:outline-none focus:border-[#00D9A0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[#8F8FA3] text-sm mb-1.5 block">Subject</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      className="w-full bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D9A0] transition-colors appearance-none"
                    >
                      <option value="">Select a topic</option>
                      <option>Account Issues</option>
                      <option>Gift Card Trade</option>
                      <option>Virtual Card</option>
                      <option>Bill Payment</option>
                      <option>Withdrawal</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#8F8FA3] text-sm mb-1.5 block">Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe your issue or question in detail..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="w-full bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm placeholder-[#55556A] focus:outline-none focus:border-[#00D9A0] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-xl hover:bg-[#00C490] transition-colors disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                  <p className="text-[#8F8FA3] text-xs text-center">
                    We typically respond within 2 hours during business hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

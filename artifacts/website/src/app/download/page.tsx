"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Gift, CreditCard, Zap, Shield, Star, Bell } from "lucide-react";

const features = [
  { icon: Gift, label: "Trade gift cards for instant cash" },
  { icon: Zap, label: "Pay all your bills in seconds" },
  { icon: CreditCard, label: "Get a free virtual USD card" },
  { icon: Zap, label: "Recharge airtime & data cheaply" },
  { icon: Shield, label: "Bank-grade security & encryption" },
  { icon: Star, label: "24/7 customer support" },
];

export default function DownloadPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="pt-32 pb-24 bg-[#0A0A0F] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.25)] text-[#F59E0B] text-sm font-medium mb-6">
            <Clock size={14} /> Publishing soon
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            PayVora is coming{" "}
            <span className="text-[#00D9A0]">to your phone.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto mb-12">
            We&apos;re putting the finishing touches on the PayVora app before we publish to the App Store and Google Play. Leave your email and we&apos;ll notify you the moment it&apos;s live.
          </p>

          {/* App store buttons — disabled */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <div className="flex items-center gap-3 px-6 py-4 bg-[#14141F] border border-[#2A2A3D] rounded-2xl opacity-60 cursor-not-allowed w-full sm:w-auto justify-center min-w-[200px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[#8F8FA3] text-xs">Coming Soon</p>
                <p className="text-white font-bold text-base">App Store</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-[#14141F] border border-[#2A2A3D] rounded-2xl opacity-60 cursor-not-allowed w-full sm:w-auto justify-center min-w-[200px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76a2 2 0 001.64-.2l12.04-6.96-2.84-2.84L3.18 23.76z" fill="#EA4335" />
                <path d="M20.82 10.45L17.96 8.8l-3.28 3.28 3.28 3.28 2.89-1.67a1.83 1.83 0 000-3.24z" fill="#FBBC05" />
                <path d="M3.18.24C2.72.5 2.4 1 2.4 1.64v20.72c0 .64.32 1.14.78 1.4l10.86-11.76L3.18.24z" fill="#4285F4" />
                <path d="M3.18.24l11.5 11L17.96 8.8 5.93.45A2 2 0 003.18.24z" fill="#34A853" />
              </svg>
              <div className="text-left">
                <p className="text-[#8F8FA3] text-xs">Coming Soon</p>
                <p className="text-white font-bold text-base">Google Play</p>
              </div>
            </div>
          </div>

          {/* Notify form */}
          <div className="max-w-md mx-auto mb-20">
            <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,217,160,0.12)] flex items-center justify-center mx-auto mb-3">
                    <Bell size={22} className="text-[#00D9A0]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">You&apos;re on the list!</h3>
                  <p className="text-[#8F8FA3] text-sm">
                    We&apos;ll email <span className="text-[#00D9A0]">{email}</span> the moment PayVora goes live.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-white font-bold text-xl mb-1">Get notified at launch</h2>
                  <p className="text-[#8F8FA3] text-sm mb-4">Be the first to download when we go live.</p>
                  <form onSubmit={handleNotify} className="flex gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl px-4 py-3 text-white text-sm placeholder-[#55556A] focus:outline-none focus:border-[#00D9A0] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-3 bg-[#00D9A0] text-[#0A0A0F] text-sm font-bold rounded-xl hover:bg-[#00C490] transition-colors whitespace-nowrap disabled:opacity-70"
                    >
                      {loading ? "..." : "Notify me"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* What you get */}
          <div>
            <h2 className="text-3xl font-black text-white mb-8">What you&apos;ll get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-[#14141F] border border-[#2A2A3D] rounded-xl p-4 hover:bg-[#1C1C2A] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#00D9A0]" />
                  </div>
                  <span className="text-[#8F8FA3] text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

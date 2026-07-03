import { Shield, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function DownloadCTA() {
  return (
    <section className="py-24 bg-[#14141F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="rounded-3xl p-12 sm:p-16 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #14141F 0%, #0D1F18 50%, #0A0A0F 100%)", border: "1px solid rgba(0,217,160,0.25)" }}
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,217,160,0.12)" }} />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,184,255,0.08)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Start today — it's free
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Ready to experience{" "}
              <span className="text-[#00D9A0]">PayVora?</span>
            </h2>
            <p className="text-[#8F8FA3] text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ Nigerians who manage their money smarter with PayVora. Download free today and get started in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/download" className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 w-full sm:w-auto justify-center min-w-[200px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-gray-500 text-xs">Download on the</p>
                  <p className="text-black font-bold text-base">App Store</p>
                </div>
              </Link>
              <Link to="/download" className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 w-full sm:w-auto justify-center min-w-[200px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3.18 23.76a2 2 0 001.64-.2l12.04-6.96-2.84-2.84L3.18 23.76z" fill="#EA4335" />
                  <path d="M20.82 10.45L17.96 8.8l-3.28 3.28 3.28 3.28 2.89-1.67a1.83 1.83 0 000-3.24z" fill="#FBBC05" />
                  <path d="M3.18.24C2.72.5 2.4 1 2.4 1.64v20.72c0 .64.32 1.14.78 1.4l10.86-11.76L3.18.24z" fill="#4285F4" />
                  <path d="M3.18.24l11.5 11L17.96 8.8 5.93.45A2 2 0 003.18.24z" fill="#34A853" />
                </svg>
                <div className="text-left">
                  <p className="text-gray-500 text-xs">Get it on</p>
                  <p className="text-black font-bold text-base">Google Play</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#8F8FA3]">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#00D9A0]" /> Bank-grade security</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#00D9A0]" /> Instant settlement</span>
              <span className="flex items-center gap-1.5"><Star size={14} className="text-[#F59E0B]" fill="currentColor" /> 4.9 / 5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

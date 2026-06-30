import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DownloadCTA() {
  return (
    <section className="py-24 bg-[#14141F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="rounded-3xl p-12 sm:p-16 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #14141F 0%, #0A0A0F 50%, rgba(0,217,160,0.08) 100%)",
            border: "1px solid rgba(0,217,160,0.2)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(0,217,160,0.15)" }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Start today — it&apos;s free
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Ready to experience{" "}
              <span className="text-[#00D9A0]">PayVora?</span>
            </h2>
            <p className="text-[#8F8FA3] text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ Nigerians who manage their money smarter with
              PayVora. Download free today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/download"
                className="flex items-center gap-2 px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] text-base font-bold rounded-2xl hover:bg-[#00C490] transition-all hover:scale-105"
              >
                Download the App <ArrowRight size={18} />
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 px-8 py-4 bg-[#1C1C2A] text-white text-base font-semibold rounded-2xl border border-[#2A2A3D] hover:border-[#00D9A0] transition-all"
              >
                Explore Features
              </Link>
            </div>

            <p className="text-[#8F8FA3] text-sm mt-6">
              Available on iOS and Android · 100% free to sign up
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

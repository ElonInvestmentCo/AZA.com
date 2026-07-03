import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DownloadCTA } from "../sections/DownloadCTA";

interface SubPageProps {
  title: string;
  description: string;
  accent?: string;
}

export function SubPage({ title, description, accent = "#00D9A0" }: SubPageProps) {
  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 bg-[#0A0A0F]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }} />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#8F8FA3] hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6" style={{ color: "white" }}>
            {title}
          </h1>
          <p className="text-xl text-[#8F8FA3] max-w-xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>
          <Link
            to="/download"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-2xl text-[#0A0A0F] transition-all hover:scale-105"
            style={{ background: accent }}
          >
            Download PayVora Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <DownloadCTA />
    </>
  );
}

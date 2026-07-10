import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn } from "@/components/ui/animations";
import { Download, Apple, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Download PAYVORA",
  description: "Get the PAYVORA app for iOS and Android.",
};

export default function DownloadPage() {
  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex items-center">
      <Container>
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-10 md:p-20 border border-[var(--color-border)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-dim)] to-transparent opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Download className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            
            <h1 className="h1 mb-6">Get the App</h1>
            <p className="text-xl text-[var(--color-text-sec)] mb-12 max-w-2xl mx-auto leading-relaxed">
              The full power of PAYVORA is currently available on our mobile applications. Download now to create your account and start transacting globally.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="#" className="flex items-center justify-center gap-4 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-medium">Download on the</div>
                  <div className="text-lg">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center justify-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-border)] transition-colors">
                <Play className="w-6 h-6" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-medium text-[var(--color-text-sec)]">GET IT ON</div>
                  <div className="text-lg">Google Play</div>
                </div>
              </a>
            </div>
            
            <div className="mt-12 text-[var(--color-muted)] text-sm">
              Requires iOS 14.0+ or Android 8.0+.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

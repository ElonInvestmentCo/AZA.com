import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Chidi Okonkwo",
    role: "Freelance Designer, Lagos",
    text: "PAYVORA changed how I handle my international payments. My virtual card works on every platform, and the gift card rates are unbeatable.",
    rating: 5,
    initials: "CO",
    accent: "#00D9A0",
  },
  {
    name: "Fatima Al-Hassan",
    role: "E-commerce Seller, Abuja",
    text: "I trade gift cards daily and PAYVORA always gives me the best rates. Settlement is instant. I've tried 4 other apps and none come close.",
    rating: 5,
    initials: "FA",
    accent: "#00b8ff",
  },
  {
    name: "Emeka Nwosu",
    role: "Student, Enugu",
    text: "Paying my school bills, recharging data, and managing my pocket money all in one app is amazing. The interface is clean and fast.",
    rating: 5,
    initials: "EN",
    accent: "#FF5B7A",
  },
  {
    name: "Blessing Olu",
    role: "Nurse, Port Harcourt",
    text: "Finally a fintech app that actually works. Customer support responded in under 2 minutes when I had a question. Highly recommended.",
    rating: 5,
    initials: "BO",
    accent: "#F59E0B",
  },
  {
    name: "Yusuf Aliyu",
    role: "Business Owner, Kano",
    text: "I use PAYVORA for all my business utility payments. Saves me hours every month. The bulk payment feature is a game changer.",
    rating: 5,
    initials: "YA",
    accent: "#00D9A0",
  },
  {
    name: "Adaora Eze",
    role: "Content Creator, Lagos",
    text: "Getting paid for my work through gift cards is no longer a problem. PAYVORA converts them instantly and I never miss a payment.",
    rating: 5,
    initials: "AE",
    accent: "#00b8ff",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#14141F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-4">
            <Star size={14} fill="currentColor" />
            Loved by users
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Real stories, real results.
          </h2>
          <p className="text-[#8F8FA3] text-lg max-w-xl mx-auto">
            Join thousands of Nigerians who trust PAYVORA every day.
          </p>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-[#F59E0B]" fill="currentColor" />
              ))}
            </div>
            <span className="text-white font-bold text-lg">4.9</span>
            <span className="text-[#8F8FA3] text-sm">from 2,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, text, rating, initials, accent }) => (
            <div
              key={name}
              className="group bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-6 hover:border-[#2A2A3D] transition-all duration-300 hover:bg-[#242430] relative overflow-hidden"
            >
              <Quote
                size={48}
                className="absolute top-4 right-4 opacity-5 text-white"
              />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-[#F59E0B]" fill="currentColor" />
                ))}
              </div>
              <p className="text-[#C0C0D0] text-sm leading-relaxed mb-6 relative z-10">
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A0A0F] font-black text-sm flex-shrink-0"
                  style={{ background: accent }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-[#8F8FA3] text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 pt-10 border-t border-[#2A2A3D] flex flex-wrap items-center justify-center gap-8">
          {[
            { value: "50,000+", label: "Active Users" },
            { value: "₦2 Billion+", label: "Processed" },
            { value: "99.9%", label: "Uptime" },
            { value: "< 60 sec", label: "Avg. Settlement" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-white text-2xl font-black">{value}</p>
              <p className="text-[#8F8FA3] text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

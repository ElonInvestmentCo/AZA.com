import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Chidi Okonkwo",
    role: "Freelance Designer, Lagos",
    text: "PayVora changed how I handle my international payments. My virtual card works on every platform, and the gift card rates are unbeatable.",
    rating: 5,
    initials: "CO",
  },
  {
    name: "Fatima Al-Hassan",
    role: "E-commerce Seller, Abuja",
    text: "I trade gift cards daily and PayVora always gives me the best rates. Settlement is instant. I&apos;ve tried 4 other apps and none come close.",
    rating: 5,
    initials: "FA",
  },
  {
    name: "Emeka Nwosu",
    role: "Student, Enugu",
    text: "Paying my school bills, recharging data, and managing my pocket money all in one app is amazing. The interface is clean and fast.",
    rating: 5,
    initials: "EN",
  },
  {
    name: "Blessing Olu",
    role: "Nurse, Port Harcourt",
    text: "Finally a fintech app that actually works. Customer support responded in under 2 minutes when I had a question. Highly recommended.",
    rating: 5,
    initials: "BO",
  },
  {
    name: "Yusuf Aliyu",
    role: "Business Owner, Kano",
    text: "I use PayVora for all my business utility payments. Saves me hours every month. The bulk payment feature is a game changer.",
    rating: 5,
    initials: "YA",
  },
  {
    name: "Adaora Eze",
    role: "Content Creator, Lagos",
    text: "Getting paid for my work through gift cards is no longer a problem. PayVora converts them instantly and I never miss a payment.",
    rating: 5,
    initials: "AE",
  },
];

const accentColors = [
  "#00D9A0",
  "#00b8ff",
  "#FF5B7A",
  "#F59E0B",
  "#00D9A0",
  "#00b8ff",
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#14141F]">
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
            Join thousands of Nigerians who trust PayVora every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, text, rating, initials }, i) => (
            <div
              key={name}
              className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-[#F59E0B]"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-[#8F8FA3] text-sm leading-relaxed mb-6">
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A0A0F] font-black text-sm flex-shrink-0"
                  style={{ background: accentColors[i] }}
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
      </div>
    </section>
  );
}

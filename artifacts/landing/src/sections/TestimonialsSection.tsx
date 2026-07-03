import { Star } from "lucide-react";

const testimonials = [
  { name: "Adaeze O.", role: "Business Owner, Lagos", text: "PayVora changed how I manage my business finances. The gift card trading is so fast and the rates are the best I've found anywhere.", stars: 5, initials: "AO", color: "#00D9A0" },
  { name: "Emeka C.", role: "Freelancer, Abuja", text: "I use the virtual dollar card for all my international subscriptions. No more declined payments — it works everywhere.", stars: 5, initials: "EC", color: "#00b8ff" },
  { name: "Fatima B.", role: "Student, Kano", text: "The airtime and data prices are unbeatable. I save so much money every month just by using PayVora instead of direct recharge.", stars: 5, initials: "FB", color: "#F59E0B" },
  { name: "Tunde A.", role: "Engineer, Port Harcourt", text: "Paying my electricity and cable bills is now a 30-second job. The app is so smooth and the customer support is great.", stars: 5, initials: "TA", color: "#FF5B7A" },
  { name: "Ngozi I.", role: "Trader, Enugu", text: "I've tried every gift card app out there. PayVora gives the highest rates and actually pays in under a minute. Nothing else comes close.", stars: 5, initials: "NI", color: "#00D9A0" },
  { name: "Bello M.", role: "Teacher, Kaduna", text: "Simple, fast, and trustworthy. I've been using PayVora for 8 months without a single problem. Highly recommended.", stars: 5, initials: "BM", color: "#00b8ff" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#14141F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Loved by Nigerians
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            What our users are saying
          </h2>
          <p className="text-[#8F8FA3] text-lg">
            Join 50,000+ happy PayVora users across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, text, stars, initials, color }) => (
            <div key={name} className="bg-[#0A0A0F] border border-[#2A2A3D] rounded-3xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" className="text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#D4D4E0] text-sm leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: color }}>
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

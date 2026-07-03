import { Users, TrendingUp, Clock, Star, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Users" },
  { icon: TrendingUp, value: "₦2 Billion+", label: "Processed" },
  { icon: Clock, value: "< 60 sec", label: "Avg. Settlement" },
  { icon: Star, value: "4.9 / 5", label: "App Rating" },
  { icon: Shield, value: "99.9%", label: "Uptime" },
];

export function StatsBanner() {
  return (
    <section className="py-10 bg-[#14141F] border-y border-[#2A2A3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,217,160,0.1)] flex items-center justify-center mb-1">
                <Icon size={18} className="text-[#00D9A0]" />
              </div>
              <p className="text-white text-xl font-black tracking-tight">{value}</p>
              <p className="text-[#8F8FA3] text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

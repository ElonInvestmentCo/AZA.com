"use client";
import { motion } from "framer-motion";

export function PressMarquee() {
  const logos = [
    "TechCrunch", "Forbes Africa", "The Guardian", "TechPoint", "CNBC Africa", "BusinessDay"
  ];
  
  return (
    <section className="py-12 border-y border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="flex flex-col items-center">
        <span className="text-[var(--color-muted)] font-medium text-xs tracking-widest uppercase mb-8">
          As seen on
        </span>
        <div className="w-full relative flex items-center">
          <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10" />
          <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10" />
          
          <motion.div
            className="flex gap-16 md:gap-32 min-w-max px-8"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-2xl font-bold text-[var(--color-muted)] opacity-50 whitespace-nowrap tracking-tighter">
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import { Container } from "./ui/core";
import { motion } from "framer-motion";

export function AudienceSwitcher() {
  const [active, setActive] = useState("individuals");

  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] pt-[104px] pb-4">
      <Container>
        <div className="flex justify-center">
          <div className="inline-flex bg-[var(--color-bg)] p-1 rounded-full border border-[var(--color-border)] relative">
            <button
              onClick={() => setActive("individuals")}
              className={`relative z-10 px-6 py-1.5 text-sm font-medium rounded-full transition-colors ${active === "individuals" ? "text-black" : "text-[var(--color-muted)] hover:text-white"}`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setActive("business")}
              className={`relative z-10 px-6 py-1.5 text-sm font-medium rounded-full transition-colors ${active === "business" ? "text-black" : "text-[var(--color-muted)] hover:text-white"}`}
            >
              For Business
            </button>
            <motion.div
              layoutId="audience-pill"
              className="absolute top-1 bottom-1 bg-[var(--color-accent)] rounded-full z-0"
              initial={false}
              animate={{
                left: active === "individuals" ? "4px" : "138px",
                width: active === "individuals" ? "130px" : "118px"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

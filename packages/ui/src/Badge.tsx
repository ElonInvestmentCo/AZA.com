import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "success" | "warning" | "error" | "muted";
  className?: string;
}

const variantStyles: Record<string, string> = {
  accent: "bg-[rgba(0,217,160,0.12)] text-[#00D9A0] border border-[rgba(0,217,160,0.2)]",
  success: "bg-[rgba(0,217,160,0.12)] text-[#00D9A0] border border-[rgba(0,217,160,0.2)]",
  warning: "bg-[rgba(255,184,48,0.12)] text-[#FFB830] border border-[rgba(255,184,48,0.2)]",
  error: "bg-[rgba(255,91,122,0.12)] text-[#FF5B7A] border border-[rgba(255,91,122,0.2)]",
  muted: "bg-[#2A2A3D] text-[#8F8FA3] border border-[#2A2A3D]",
};

export function Badge({ children, variant = "accent", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

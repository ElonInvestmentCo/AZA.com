import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={[
        "bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl",
        paddingStyles[padding],
        hover && "transition-all duration-300 hover:border-[#00D9A0]/30 hover:-translate-y-1",
        glow && "hover:shadow-[0_0_24px_rgba(0,217,160,0.12)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

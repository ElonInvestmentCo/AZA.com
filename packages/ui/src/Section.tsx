import React from "react";

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padded?: boolean;
}

const maxWidthStyles: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export function Section({
  children,
  className = "",
  id,
  maxWidth = "2xl",
  padded = true,
}: SectionProps) {
  return (
    <section id={id} className={["relative py-20 lg:py-32", className].join(" ")}>
      <div
        className={[
          "mx-auto",
          maxWidthStyles[maxWidth],
          padded && "px-4 sm:px-6 lg:px-8",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
}

export interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  highlight,
  description,
  center = true,
  className = "",
}: SectionHeaderProps) {
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className={[center && "text-center", "mb-16", className].filter(Boolean).join(" ")}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,217,160,0.08)] border border-[rgba(0,217,160,0.15)] text-[#00D9A0] text-sm font-medium mb-6">
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
        {highlight ? (
          <>
            {titleParts[0]}
            <span className="text-[#00D9A0]">{highlight}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p className="text-[#8F8FA3] text-lg leading-relaxed max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}

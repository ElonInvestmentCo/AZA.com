import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  icon,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  icon?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 active:scale-95";

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] hover:shadow-[0_0_20px_var(--color-accent-glow)]",
    secondary:
      "bg-white text-black hover:bg-gray-200",
    outline:
      "border border-[var(--color-border)] text-white hover:bg-[var(--color-surface)] hover:border-[var(--color-border-light)]",
    ghost:
      "text-[var(--color-text-sec)] hover:text-white hover:bg-[var(--color-surface)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="ml-2 w-4 h-4" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

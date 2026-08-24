type CtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  tone?: "onLight" | "onDark";
  className?: string;
  onClick?: () => void;
};

/**
 * Primary = solid small-radius button (ink on light canvases, reversed on dark).
 * Secondary = plain text link with an arrow — cyan stays a rare detail, not a fill.
 */
export function Cta({
  href,
  children,
  variant = "primary",
  tone = "onLight",
  className = "",
  onClick,
}: CtaProps) {
  if (variant === "secondary") {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
          tone === "onDark" ? "text-white/70 hover:text-accent" : "text-ink/60 hover:text-accent"
        } ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
        tone === "onDark"
          ? "bg-white text-ink hover:bg-accent"
          : "bg-ink text-white hover:bg-accent hover:text-ink"
      } ${className}`}
    >
      {children}
    </a>
  );
}

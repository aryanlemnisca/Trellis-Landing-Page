type CtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  tone?: "onLight" | "onDark";
  className?: string;
  onClick?: () => void;
};

/**
 * Primary = frosted small-radius button (ink glass on light canvases, white
 * glass reversed on dark) with a cyan glow + lift on hover.
 * Secondary = plain text link with an animated underline sweep — cyan stays
 * a rare detail, not a fill.
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
        className={`group relative inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
          tone === "onDark" ? "text-white/70 hover:text-accent" : "text-ink/60 hover:text-accent"
        } ${className}`}
      >
        <span className="relative">
          {children}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
        tone === "onDark"
          ? "border-white/30 bg-white/90 text-ink hover:border-accent/50 hover:bg-white hover:shadow-glow-sm"
          : "border-white/10 bg-ink/90 text-white hover:border-accent/40 hover:bg-ink hover:shadow-glow-sm"
      } ${className}`}
    >
      {children}
    </a>
  );
}

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

/** ALL-CAPS mono label used above every section headline. */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.2em] text-accent ${className}`}>
      {children}
    </p>
  );
}

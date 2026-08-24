/**
 * Two soft, slowly-drifting blurred orbs — gives glass panels something to
 * actually blur (a flat single-color section behind a glass card produces no
 * visible glass effect), while staying inside cyan/ink at low opacity.
 */
export function GlowOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="motion-safe:animate-orb-drift absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />
      <div className="motion-safe:animate-orb-drift-slow absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-ink/10 blur-[100px]" />
    </div>
  );
}

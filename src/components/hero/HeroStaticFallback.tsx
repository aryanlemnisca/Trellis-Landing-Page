/**
 * Static SVG rendering of the same visual language as the WebGL scene —
 * used as the dynamic-import loading state (so the hero never blocks first
 * paint) and as the fallback if WebGL is unavailable.
 */
export function HeroStaticFallback() {
  return (
    <svg
      viewBox="0 0 600 500"
      className="h-full w-full"
      role="img"
      aria-label="A design-space diagram: several visited local minima, and the global minimum marked with an expanding ring, on a partially resolved response surface."
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="#0a0a0a" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="600" height="500" fill="url(#grid)" />

      {/* global minimum — found, marked with an expanding ring */}
      <circle cx="320" cy="260" r="46" fill="none" stroke="#38afd8" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="320" cy="260" r="6" fill="#38afd8" />

      {/* visited local minima */}
      {[
        [110, 340],
        [460, 140],
        [150, 120],
        [470, 380],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#0a0a0a" />
      ))}
    </svg>
  );
}

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
      aria-label="A response-surface diagram: a few measured observations, a candidate robust operating region, and one flagged next experiment on a partially understood process surface."
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="#0a0a0a" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="600" height="500" fill="url(#grid)" />

      {/* candidate robust operating region */}
      <circle cx="380" cy="190" r="70" fill="#38afd8" fillOpacity="0.12" />
      <circle cx="380" cy="190" r="70" fill="none" stroke="#38afd8" strokeOpacity="0.5" strokeWidth="1" />

      {/* measured observations */}
      {[
        [120, 340],
        [180, 120],
        [90, 260],
        [260, 90],
        [340, 380],
        [420, 320],
        [360, 220],
        [200, 400],
        [400, 170],
        [300, 260],
        [370, 210],
        [350, 180],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4.5" fill="#0a0a0a" />
      ))}

      {/* next experiment — resolved into evidence in the static state */}
      <circle cx="230" cy="230" r="4.5" fill="#0a0a0a" />
    </svg>
  );
}

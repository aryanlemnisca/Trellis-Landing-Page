const LINKS = [
  { label: "Tune", href: "https://www.lemnisca.bio/tune" },
  { label: "Thrust", href: "https://www.lemnisca.bio/thrust" },
  { label: "Torch", href: "https://www.lemnisca.bio/torch" },
  { label: "Trellis", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-black py-16 md:py-20">
      <div className="container-page">
        <p className="font-sans text-4xl font-medium tracking-tight text-white md:text-6xl">
          TRELLIS <span className="text-white/40">by Lemnisca</span>
        </p>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-6">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/30">
            © {new Date().getFullYear()} Lemnisca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

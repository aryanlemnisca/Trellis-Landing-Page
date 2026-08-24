const LINKS = [
  { label: "Tune", href: "https://www.lemnisca.bio/tune" },
  { label: "Thrust", href: "https://www.lemnisca.bio/thrust" },
  { label: "Torch", href: "https://www.lemnisca.bio/torch" },
  { label: "Trellis", href: "#" },
  { label: "Request a conversation", href: "#request" },
  { label: "Lemnisca", href: "https://www.lemnisca.bio" },
];

export function Footer() {
  return (
    <footer className="bg-ink pb-10 pt-16 md:pb-12 md:pt-20">
      <div className="container-page">
        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative font-mono text-xs uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-accent"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-10 border-t border-white/10 pt-10 md:mt-14 md:pt-14">
        <p className="whitespace-nowrap px-6 font-sans font-medium leading-[0.9] tracking-tight text-white text-[clamp(3rem,17vw,220px)] md:px-10">
          TRELLIS
        </p>
        <div className="container-page mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">by Lemnisca</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">
            © {new Date().getFullYear()} Lemnisca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

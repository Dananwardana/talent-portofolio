import { Link } from "@tanstack/react-router";

export function TopNav({ showBack = false }: { showBack?: boolean }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-6">
      <div>
        {showBack ? (
          <Link to="/" className="pill-btn">
            &lt; Back
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 font-typewriter text-paper text-lg tracking-wider">
            <span
              className="inline-block h-9 w-9 rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 35%, oklch(0.55 0.22 25), oklch(0.25 0.15 22))",
                boxShadow: "0 4px 10px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(0,0,0,0.4)",
              }}
              aria-hidden
            />
            TALENZ
          </Link>
        )}
      </div>
      <nav className="flex items-center gap-3">
        <Link to="/register" className="pill-btn">REGISTER</Link>
        <Link to="/login" className="pill-btn">LOGIN</Link>
      </nav>
    </header>
  );
}

export function StatusStrip() {
  const items = ["Talents", "Roles", "Categories", "Profile Views"];
  return (
    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-6 sm:px-10 pb-10 pt-6">
      {items.map((label) => (
        <div
          key={label}
          className="relative paper-surface rounded-xl py-5 px-6 text-center font-typewriter text-ink tracking-wider shadow-[var(--shadow-paper)]"
        >
          <span className="red-pin absolute -top-2 left-1/2 -translate-x-1/2" aria-hidden />
          {label}
        </div>
      ))}
    </div>
  );
}

export function ProfessionalsBanner() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-maroon-deep/70 backdrop-blur px-5 py-2 font-typewriter text-paper text-sm border border-paper/10">
      <span className="h-1.5 w-1.5 rounded-full bg-pin animate-pulse" />
      50,000+ professionals across 35+ industries
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { TopNav } from "@/components/vintage/TopNav";
import { PaperFrame } from "@/components/vintage/PaperFrame";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

const candidates = [
  {
    id: "1",
    name: "ALDIFA ZAHROTUL AUFAR",
    role: "Frontend Developer",
    tags: ["open to work", "react"],
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    id: "2",
    name: "DANAN EMWE",
    role: "UI/UX Designer",
    tags: ["open to work", "figma"],
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    id: "3",
    name: "DODIK RIMA",
    role: "Backend Engineer",
    tags: ["open to work", "node.js"],
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
  },
  {
    id: "4",
    name: "ARIMANYU RZ",
    role: "Full Stack Dev",
    tags: ["open to work", "react"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    id: "5",
    name: "SARAH KIM",
    role: "Data Scientist",
    tags: ["fresh grad", "python"],
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
  {
    id: "6",
    name: "MARCO TANI",
    role: "Mobile Developer",
    tags: ["intern", "flutter"],
    img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200",
  },
];

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav />

      <main className="relative pt-28 pb-16 px-6 sm:px-10 max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="paper-surface rounded-xl p-4 shadow-[var(--shadow-paper)] flex flex-col md:flex-row gap-3 items-stretch">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg border border-maroon/30 bg-white/60">
            <Search className="h-5 w-5 text-maroon" />
            <input
              placeholder="Search by name, skill, or location..."
              className="flex-1 bg-transparent outline-none font-typewriter text-ink placeholder:text-ink/40 py-2"
            />
          </div>
          <button className="pill-btn !rounded-lg !px-6 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Investigate
          </button>
        </div>

        {/* Filter strip */}
        <div className="mt-4 bg-maroon/80 backdrop-blur rounded-xl px-5 py-3 flex flex-wrap gap-4 items-center text-paper font-typewriter text-sm">
          <span className="tracking-widest">FILTER BY:</span>
          <select className="bg-paper text-ink rounded-md px-3 py-1.5 border border-paper/40">
            <option>Relevance</option>
            <option>Newest</option>
            <option>Most Viewed</option>
          </select>
          <select className="bg-paper text-ink rounded-md px-3 py-1.5 border border-paper/40">
            <option>Experience</option>
            <option>0-2 yrs</option>
            <option>3-5 yrs</option>
            <option>5+ yrs</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-pin" /> Fresh Grad
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-pin" /> Intern
          </label>
        </div>

        {/* Grid */}
        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="ornate-frame p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex gap-4">
                <img
                  src={c.img}
                  alt={c.name}
                  className="h-24 w-24 rounded-md object-cover border-2 border-maroon/40"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-typewriter text-maroon font-bold truncate tracking-wide">
                    {c.name}
                  </h3>
                  <p className="font-typewriter text-ink/70 text-sm mt-1">{c.role}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs font-medium border border-maroon/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/candidate/$id" params={{ id: c.id }} className="pill-btn flex-1 !py-2">
                  View Profile
                </Link>
                <Link
                  to="/compare"
                  className="flex-1 inline-flex items-center justify-center px-5 py-2 rounded-full font-typewriter text-sm border-2 border-maroon text-maroon bg-paper hover:bg-maroon hover:text-paper transition"
                >
                  Compare
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

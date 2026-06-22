import { createFileRoute, Link } from "@tanstack/react-router";
import { X, Plus } from "lucide-react";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});

const ROWS = ["Skill", "Experience", "Education", "Project", "Certification", "Activity"];

function ComparePage() {
  return (
    <div className="relative min-h-screen">
      <div className="pt-6 px-6 sm:px-10 flex items-center justify-between">
        <Link to="/home" className="pill-btn">&lt; Back</Link>
      </div>

      <main className="px-6 sm:px-10 max-w-5xl mx-auto pb-16">
        <div className="mt-6 text-center">
          <div className="inline-block bg-maroon-deep/70 border border-paper/10 rounded-lg px-8 py-3">
            <h1 className="font-typewriter text-paper text-2xl tracking-widest">Compare Profiles</h1>
          </div>
          <p className="mt-3 font-typewriter text-paper/80 text-sm">compare two candidates side by side</p>
        </div>

        <div className="mt-6">
          <button className="pill-btn inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Candidate
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="ornate-frame p-5 relative">
              <button className="absolute top-3 right-3 h-7 w-7 rounded-full bg-maroon text-paper flex items-center justify-center hover:bg-maroon-deep">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-md bg-gradient-to-b from-sky-300 to-green-300 border-2 border-maroon/40" />
                <div className="flex-1">
                  <h3 className="font-typewriter text-maroon font-bold tracking-wide">NAME</h3>
                  <div className="mt-2 space-y-2">
                    <div className="h-6 rounded bg-paper-dark/60" />
                    <div className="h-6 rounded bg-paper-dark/60" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs border border-maroon/30">open to work</span>
                <span className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs border border-maroon/30">react</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-8 overflow-hidden rounded-xl border-2 border-maroon">
          <table className="w-full bg-paper">
            <thead>
              <tr className="bg-paper-dark">
                <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">Category</th>
                <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">Abimanyu</th>
                <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">Dodik</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, idx) => (
                <tr key={r} className={idx % 2 === 0 ? "bg-paper" : "bg-paper-dark/40"}>
                  <td className="px-6 py-5 font-typewriter text-maroon font-bold">{r}</td>
                  <td className="px-6 py-5 font-sans text-ink/70 text-sm">—</td>
                  <td className="px-6 py-5 font-sans text-ink/70 text-sm">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

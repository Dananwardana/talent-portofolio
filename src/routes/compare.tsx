import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { z } from "zod";
import { CANDIDATES, COMPARE_ROWS } from "@/data/candidates";

const searchSchema = z.object({
  ids: z.string().optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  component: ComparePage,
});

function ComparePage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedIds: string[] = useMemo(
    () => (ids ? ids.split(",").filter(Boolean) : []),
    [ids],
  );
  const selected = selectedIds
    .map((id: string) => CANDIDATES.find((c) => c.id === id))
    .filter((c): c is (typeof CANDIDATES)[number] => Boolean(c));

  const setIds = (next: string[]) => {
    navigate({
      search: () => (next.length ? { ids: next.join(",") } : {}),
      replace: true,
    });
  };

  const addCandidate = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 2) return;
    setIds([...selectedIds, id]);
    setPickerOpen(false);
  };
  const removeCandidate = (id: string) => setIds(selectedIds.filter((x) => x !== id));

  const canCompare = selected.length === 2;

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
          <p className="mt-3 font-typewriter text-paper/80 text-sm">
            {canCompare
              ? `Comparing ${selected[0].name} vs ${selected[1].name}`
              : `Select ${2 - selected.length} more candidate${2 - selected.length === 1 ? "" : "s"} to compare`}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setPickerOpen(true)}
            disabled={selected.length >= 2}
            className="pill-btn inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" /> Add Candidate
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => setIds([])}
              className="font-typewriter text-paper/70 hover:text-paper text-sm underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Slots */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          {[0, 1].map((slot) => {
            const c = selected[slot];
            if (!c) {
              return (
                <button
                  key={slot}
                  onClick={() => setPickerOpen(true)}
                  className="min-h-[180px] rounded-xl border-2 border-dashed border-paper/40 text-paper/60 font-typewriter hover:border-paper hover:text-paper transition flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="h-8 w-8" />
                  <span>Pick candidate {slot + 1}</span>
                </button>
              );
            }
            return (
              <div key={c.id} className="ornate-frame p-5 relative">
                <button
                  onClick={() => removeCandidate(c.id)}
                  className="absolute top-3 right-3 h-7 w-7 rounded-full bg-maroon text-paper flex items-center justify-center hover:bg-maroon-deep z-10"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="flex gap-4">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-20 w-20 rounded-md object-cover border-2 border-maroon/40"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-typewriter text-maroon font-bold tracking-wide">{c.name}</h3>
                    <p className="font-typewriter text-ink/70 text-sm">{c.role}</p>
                    <p className="font-typewriter text-ink/60 text-xs mt-1">{c.location}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs border border-maroon/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        {canCompare ? (
          <div className="mt-8 overflow-hidden rounded-xl border-2 border-maroon">
            <table className="w-full bg-paper">
              <thead>
                <tr className="bg-paper-dark">
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">Category</th>
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">{selected[0].name}</th>
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">{selected[1].name}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 0 ? "bg-paper" : "bg-paper-dark/40"}>
                    <td className="px-6 py-5 font-typewriter text-maroon font-bold align-top">{row.label}</td>
                    <td className="px-6 py-5 font-sans text-ink text-sm align-top">{selected[0][row.key]}</td>
                    <td className="px-6 py-5 font-sans text-ink text-sm align-top">{selected[1][row.key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 paper-surface rounded-xl p-10 text-center font-typewriter text-ink/70">
            The comparison table will appear once you pick two candidates.
          </div>
        )}
      </main>

      {/* Picker modal */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="ornate-frame max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-typewriter text-2xl text-maroon tracking-widest">Pick a Candidate</h2>
              <button onClick={() => setPickerOpen(false)} className="text-maroon hover:text-maroon-deep">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto -mx-2 px-2 space-y-2">
              {CANDIDATES.map((c) => {
                const already = selectedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    disabled={already}
                    onClick={() => addCandidate(c.id)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg border-2 border-maroon/30 hover:border-maroon hover:bg-maroon/5 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <img src={c.img} alt={c.name} className="h-12 w-12 rounded-md object-cover border border-maroon/30" />
                    <div className="flex-1 min-w-0">
                      <p className="font-typewriter text-maroon font-bold truncate">{c.name}</p>
                      <p className="font-sans text-ink/70 text-sm">{c.role} · {c.location}</p>
                    </div>
                    {already && <Check className="h-5 w-5 text-maroon" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

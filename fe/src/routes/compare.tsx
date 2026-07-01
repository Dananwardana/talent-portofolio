import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
<<<<<<< HEAD
import { useMemo, useState, useEffect } from "react";
import { X, Plus, Check, Search } from "lucide-react";
import { z } from "zod";
import { TopNav } from "@/components/vintage/TopNav";
=======
import { Check, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

// Baris komparasi ini sekarang membaca *key* dinamis hasil fetch database di bawah
const COMPARE_ROWS = [
  { label: "Role", key: "role" },
  { label: "Location", key: "location" },
  { label: "Total Skills", key: "skillsCount" },
  { label: "Top Experience", key: "experienceSummary" },
  { label: "Top Education", key: "educationSummary" },
  { label: "About", key: "about" },
];
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e

const searchSchema = z.object({
  ids: z.string().optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  component: ComparePage,
});

// Format baris perbandingan tabel
const COMPARE_ROWS = [
  { label: "Role", key: "role" },
  { label: "Location", key: "address" },
  { label: "About", key: "about" },
  { label: "Tech Skills", key: "tech_skills" },
  { label: "Soft Skills", key: "soft_skills" },
  { label: "Total Experience", key: "exp_count" },
  { label: "Total Projects", key: "proj_count" },
  { label: "Certifications", key: "cert_count" },
];

const API_URL = import.meta.env.PROD ? "/api/candidates" : "http://localhost:3001/api/candidates";

function ComparePage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });
  const [pickerOpen, setPickerOpen] = useState(false);
  
<<<<<<< HEAD
  // Tarik data asli dari Backend
=======
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e
  const [candidatesList, setCandidatesList] = useState<any[]>([]);

  // TARIK SELURUH DATA DARI DATABASE (Real-time!)
  useEffect(() => {
<<<<<<< HEAD
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCandidatesList(data))
      .catch(err => console.error("Gagal load data banding:", err));
=======
    fetch("http://localhost:3001/api/candidates")
      .then((res) => res.json())
      .then((data) => {
         const mappedData = data.map((c: any) => ({
            id: c.id,
            name: c.full_name || "Unknown Candidate",
            role: c.role || "-",
            location: c.address || "-",
            about: c.about || "-",
            img: c.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            tags: c.tech ? c.tech.slice(0, 3).map((t: any) => t.name || t) : [],
            // Format khusus untuk ditampilkan di tabel perbandingan:
            skillsCount: `${(c.tech?.length || 0) + (c.soft?.length || 0)} Skills`,
            experienceSummary: c.experience && c.experience.length > 0 ? c.experience[0].title : "No experience listed",
            educationSummary: c.education && c.education.length > 0 ? c.education[0].title : "No education listed"
         }));
         setCandidatesList(mappedData);
      })
      .catch(err => console.error("Error fetching compare data:", err));
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e
  }, []);

  const selectedIds: string[] = useMemo(() => (ids ? ids.split(",").filter(Boolean) : []), [ids]);
  
  const selected = selectedIds
    .map((id: string) => candidatesList.find((c) => c.id === id))
    .filter(Boolean);

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
  
  const removeCandidate = (id: string) => setIds(selectedIds.filter((x: string) => x !== id));

  const canCompare = selected.length === 2;

  // Fungsi helper untuk merender isi tabel dari struktur JSON Database
  const renderValue = (candidate: any, key: string) => {
    if (!candidate) return "-";
    
    switch(key) {
      case "tech_skills":
        return candidate.tech?.length > 0 ? candidate.tech.map((s:any) => s.name).join(", ") : "-";
      case "soft_skills":
        return candidate.soft?.length > 0 ? candidate.soft.map((s:any) => s.name || s).join(", ") : "-";
      case "exp_count":
        return candidate.experience?.length ? `${candidate.experience.length} Roles` : "None";
      case "proj_count":
        return candidate.project?.length ? `${candidate.project.length} Projects` : "None";
      case "cert_count":
        return candidate.certification?.length ? `${candidate.certification.length} Certifications` : "None";
      default:
        return candidate[key] || "-";
    }
  };

  return (
    <div className="relative min-h-screen">
      <TopNav />
      <div className="pt-28 px-6 sm:px-10 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/home" className="pill-btn !py-2">
          &lt; BACK TO DIRECTORY
        </Link>
      </div>

      <main className="px-6 sm:px-10 max-w-5xl mx-auto pb-16">
        <div className="mt-6 text-center">
          <div className="inline-block bg-slate-800 border-2 border-slate-900 rounded-lg px-8 py-3 shadow-lg">
            <h1 className="font-typewriter text-paper text-2xl tracking-widest font-bold">
              DOSSIER COMPARISON
            </h1>
          </div>
          <p className="mt-4 font-typewriter text-ink/80 text-sm">
            {canCompare
              ? `Comparing [ ${selected[0].full_name} ] vs [ ${selected[1].full_name} ]`
              : `Select ${2 - selected.length} more candidate${2 - selected.length === 1 ? "" : "s"} to run diagnostics`}
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setPickerOpen(true)}
            disabled={selected.length >= 2}
            className="pill-btn inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" /> ADD DOSSIER
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => setIds([])}
              className="font-typewriter text-red-700 font-bold hover:text-red-900 text-sm tracking-wider uppercase ml-4"
            >
              Clear Comparison
            </button>
          )}
        </div>

        {/* Kolom Profil yang Terpilih */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          {[0, 1].map((slot) => {
            const c = selected[slot];
            if (!c) {
              return (
                <button
                  key={slot}
                  onClick={() => setPickerOpen(true)}
                  className="min-h-[180px] rounded-xl border-2 border-dashed border-maroon/30 text-maroon/60 font-typewriter hover:border-maroon hover:text-maroon hover:bg-maroon/5 transition flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="h-8 w-8" />
                  <span className="tracking-widest uppercase text-sm font-bold">Pick Candidate {slot + 1}</span>
                </button>
              );
            }
            return (
              <div key={c.id} className="ornate-frame p-6 relative bg-white">
                <button
                  onClick={() => removeCandidate(c.id)}
                  className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-600 border-2 border-paper text-paper flex items-center justify-center hover:bg-red-700 shadow-md z-10 transition-transform hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex gap-5">
                  <img
                    src={c.avatar_url || "https://www.transparenttextures.com/patterns/aged-paper.png"}
                    alt={c.full_name}
                    className="h-24 w-24 rounded-md object-cover border-2 border-maroon/40 bg-maroon/10 shadow-inner"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-typewriter text-maroon font-bold tracking-wide text-lg truncate">
                      {c.full_name}
                    </h3>
<<<<<<< HEAD
                    <p className="font-sans font-medium text-slate-700 text-sm mt-1">{c.role || "No Role"}</p>
                    <p className="font-typewriter text-ink/50 text-xs mt-1">{c.address || "No Location"}</p>
                  </div>
                </div>
=======
                    <p className="font-typewriter text-ink/70 text-sm">{c.role}</p>
                    <p className="font-typewriter text-ink/60 text-xs mt-1">{c.location}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags.map((t: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs border border-maroon/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e
              </div>
            );
          })}
        </div>

        {/* Tabel Komparasi */}
        {canCompare ? (
          <div className="mt-10 overflow-hidden rounded-xl border-2 border-maroon shadow-xl">
            <table className="w-full bg-white">
              <thead>
<<<<<<< HEAD
                <tr className="bg-maroon text-paper border-b-2 border-maroon">
                  <th className="px-6 py-4 text-left font-typewriter tracking-widest text-sm w-1/4">CATEGORY</th>
                  <th className="px-6 py-4 text-left font-typewriter tracking-widest text-sm w-[37.5%] border-l border-maroon-deep/30">{selected[0].full_name}</th>
                  <th className="px-6 py-4 text-left font-typewriter tracking-widest text-sm w-[37.5%] border-l border-maroon-deep/30">{selected[1].full_name}</th>
=======
                <tr className="bg-paper-dark">
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest w-2/5">
                    {selected[0].name}
                  </th>
                  <th className="px-6 py-4 text-left font-typewriter text-maroon tracking-widest w-2/5">
                    {selected[1].name}
                  </th>
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, idx) => (
                  <tr key={row.key} className={`border-b border-maroon/10 ${idx % 2 === 0 ? "bg-slate-50" : "bg-white"} hover:bg-maroon/5 transition-colors`}>
                    <td className="px-6 py-5 font-typewriter text-maroon font-bold align-top text-sm uppercase tracking-wider">
                      {row.label}
                    </td>
                    <td className="px-6 py-5 font-sans text-slate-700 text-sm align-top leading-relaxed border-l border-maroon/10 whitespace-pre-wrap">
                      {renderValue(selected[0], row.key)}
                    </td>
                    <td className="px-6 py-5 font-sans text-slate-700 text-sm align-top leading-relaxed border-l border-maroon/10 whitespace-pre-wrap">
                      {renderValue(selected[1], row.key)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-10 paper-surface rounded-xl p-12 text-center border-2 border-dashed border-maroon/20">
            <Search className="w-12 h-12 text-maroon/30 mx-auto mb-4" />
            <p className="font-typewriter text-maroon/70 text-lg">The comparison matrix requires two valid dossiers to initialize.</p>
          </div>
        )}
      </main>

      {/* Modal / Popup Pilih Kandidat */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-paper border-2 border-maroon rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="bg-maroon px-6 py-4 flex justify-between items-center text-paper">
              <h2 className="font-typewriter text-lg tracking-widest font-bold">SELECT DOSSIER</h2>
              <button onClick={() => setPickerOpen(false)} className="hover:text-red-300 transition-colors"><X className="h-5 w-5" /></button>
            </div>
<<<<<<< HEAD
            
            <div className="p-6 overflow-y-auto space-y-3 bg-slate-50">
=======
            <div className="overflow-y-auto -mx-2 px-2 space-y-2">
              {candidatesList.length === 0 && (
                 <div className="text-center py-4 font-typewriter text-ink/60">No candidates available</div>
              )}
>>>>>>> d2b0c074266185d06684fbc2fb9c5f812a97289e
              {candidatesList.map((c) => {
                const already = selectedIds.includes(c.id);
                return (
                  <button
                    key={c.id} disabled={already} onClick={() => addCandidate(c.id)}
                    className="w-full flex items-center gap-5 p-4 bg-white rounded-lg border border-slate-200 hover:border-maroon hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed text-left group"
                  >
                    <img src={c.avatar_url || "https://www.transparenttextures.com/patterns/aged-paper.png"} alt={c.full_name} className="h-14 w-14 rounded-md object-cover border border-slate-200 group-hover:border-maroon/50" />
                    <div className="flex-1 min-w-0">
                      <p className="font-typewriter text-maroon font-bold text-lg truncate">{c.full_name}</p>
                      <p className="font-sans text-slate-500 text-sm truncate">{c.role || "No Role"}</p>
                    </div>
                    {already ? <span className="bg-maroon/10 text-maroon font-bold font-typewriter text-xs px-3 py-1 rounded-full border border-maroon/20">ADDED</span> : <Plus className="h-5 w-5 text-maroon/30 group-hover:text-maroon transition-colors" />}
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
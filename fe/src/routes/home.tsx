import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { TopNav } from "@/components/vintage/TopNav";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

// Auto-switch URL antara lokal dan Vercel
const API_URL = import.meta.env.PROD ? "/api/candidates" : "http://localhost:3001/api/candidates";

function HomePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk menyimpan ID kandidat yang akan dicompare
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal tarik data:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return candidates.filter((c: any) => {
      return c.full_name?.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, candidates]);

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fungsi toggle compare (Max 2 kandidat)
  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) {
        alert("You can only compare 2 candidates at a time!");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav />
      <main className="relative flex-1 pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        
        {/* Fitur Search (Opsional - kamu bisa tambahkan input UI-nya di sini nanti) */}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full text-center font-typewriter text-maroon py-10">Loading Database...</div>
          ) : (
            paginatedData.map((c: any) => (
              <div key={c.id} className={`ornate-frame p-6 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 ${compareIds.includes(c.id) ? 'border-maroon ring-2 ring-maroon/20' : ''}`}>
                <div className="flex gap-4 items-start">
                  <img 
                      src={c.avatar_url || "https://www.transparenttextures.com/patterns/aged-paper.png"} 
                      alt={c.full_name} 
                      className="h-20 w-20 rounded-md object-cover border-2 border-maroon/40 bg-maroon/5" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-typewriter text-maroon truncate">{c.full_name}</h3>
                    <p className="text-ink/70 text-sm mt-1 truncate">{c.role || "No role specified"}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tech?.slice(0, 3).map((t: any, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-[10px] font-bold border border-maroon/30 uppercase tracking-wider">
                          {t.name}
                        </span>
                      ))}
                      {(c.tech?.length > 3) && <span className="px-2 py-1 text-[10px] text-maroon font-bold">+{c.tech.length - 3}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 flex gap-2">
                  <Link to="/candidate/$id" params={{ id: c.id }} className="pill-btn flex-1 !py-2 text-center text-xs">VIEW DOSSIER</Link>
                  <button 
                    onClick={() => toggleCompare(c.id)} 
                    className={`pill-btn flex-1 !py-2 text-center text-xs transition-colors ${compareIds.includes(c.id) ? '!bg-maroon !text-paper !border-maroon' : '!bg-transparent !text-white'}`}
                  >
                    {compareIds.includes(c.id) ? "ADDED" : "COMPARE"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FLOATING COMPARE BAR */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-paper border-2 border-maroon shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10">
          <span className="font-typewriter text-maroon font-bold text-sm tracking-widest">
            {compareIds.length} / 2 SELECTED
          </span>
          <div className="flex items-center gap-3">
            <Link 
              to="/compare" 
              search={{ ids: compareIds.join(",") }} 
              className={`pill-btn !py-2 !px-6 text-sm ${compareIds.length !== 2 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              COMPARE NOW
            </Link>
            <button onClick={() => setCompareIds([])} className="text-maroon/60 hover:text-maroon text-xs font-bold font-typewriter uppercase tracking-wider">
              CLEAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
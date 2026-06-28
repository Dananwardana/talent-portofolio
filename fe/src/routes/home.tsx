import { TopNav } from "@/components/vintage/TopNav";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Tambahkan cache: 'no-store' agar selalu menarik data paling baru (real-time)
    fetch("http://localhost:3001/api/candidates", { cache: "no-store" })
      .then(async (res) => {
         if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
         return res.json();
      })
      .then((data) => {
        // PERBAIKAN 1: Dukung format array langsung ATAU format { data: [...] }
        const actualData = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : null);

        if (!actualData) {
            console.error("Format data aneh:", data);
            setErrorMsg("Format data dari server tidak dapat diproses.");
            setCandidates([]);
            setLoading(false);
            return;
        }

        // PERBAIKAN 2: Parsing Super Aman untuk kolom JSONB Supabase
        const formatted = actualData.map((c: any) => {
            let techArr = [];
            try {
                // Jika Supabase mengembalikannya sebagai teks String, kita ubah jadi Array
                techArr = typeof c.tech === 'string' ? JSON.parse(c.tech) : (c.tech || []);
            } catch (e) {
                console.error("Gagal parse tech untuk kandidat:", c.full_name);
            }

            return {
                ...c,
                tags: Array.isArray(techArr) ? techArr.slice(0, 3).map((t: any) => t.name || t) : []
            };
        });
        
        setCandidates(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal tarik data:", err);
        setErrorMsg("Gagal terhubung ke backend. Pastikan server (port 3001) menyala.");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return candidates.filter((c: any) => {
      // PERBAIKAN 3: Fallback text untuk mencegah crash akibat nama yang kosong (null)
      const name = c.full_name || "Unknown Candidate";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, candidates]);

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav />
      <main className="relative flex-1 pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        
        <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
                <input 
                    type="text" 
                    placeholder="Search talents by name..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-paper border-2 border-maroon/30 focus:border-maroon focus:outline-none font-typewriter text-ink shadow-sm"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-maroon/50" />
            </div>
        </div>

        {/* TAMPILAN ERROR JIKA TERJADI MASALAH */}
        {errorMsg && (
            <div className="mb-6 flex justify-center">
               <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg flex items-center gap-3 font-typewriter shadow-sm max-w-xl">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm">{errorMsg}</p>
               </div>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full text-center font-typewriter text-maroon py-10 flex flex-col items-center justify-center gap-3">
                 <span className="h-6 w-6 rounded-full border-2 border-maroon border-t-transparent animate-spin"></span>
                 Memuat Data Talenta...
             </div>
          ) : paginatedData.length === 0 && !errorMsg ? (
             <div className="col-span-full text-center font-typewriter text-ink/60 py-10 bg-paper/50 rounded-xl border-2 border-dashed border-maroon/20">
                 Belum ada profil kandidat yang terdaftar atau cocok dengan pencarian.
             </div>
          ) : (
            paginatedData.map((c: any) => (
              <div key={c.id} className="ornate-frame p-6 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                <div className="flex gap-4 items-start">
                  <img 
                      src={c.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"} 
                      alt={c.full_name || "Talent"} 
                      className="h-20 w-20 rounded-md object-cover border-2 border-maroon/40" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-typewriter text-maroon truncate">{c.full_name || "Unknown Candidate"}</h3>
                    <p className="text-ink/70 text-sm mt-1 truncate">{c.role || "No role specified"}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags?.map((t: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-[10px] uppercase font-bold tracking-wider border border-maroon/30">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 flex gap-2">
                  <Link to="/candidate/$id" params={{ id: c.id || 'me' }} className="pill-btn flex-1 !py-2 text-center text-xs">View Profile</Link>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > itemsPerPage && (
            <div className="mt-10 flex justify-center gap-4">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="pill-btn !px-4 !py-1 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="font-typewriter text-maroon font-bold py-1">Page {currentPage}</span>
                <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * itemsPerPage >= filtered.length}
                    className="pill-btn !px-4 !py-1 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        )}
      </main>
    </div>
  );
}
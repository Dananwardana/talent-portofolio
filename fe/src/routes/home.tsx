import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { TopNav } from "@/components/vintage/TopNav";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("http://localhost:3001/api/candidates")
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

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav />
      <main className="relative flex-1 pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full text-center font-typewriter text-maroon py-10">Loading...</div>
          ) : (
            paginatedData.map((c: any) => (
              <div key={c.id} className="ornate-frame p-6 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                <div className="flex gap-4 items-start">
                  <img 
                      src={c.avatar_url || "https://via.placeholder.com/200"} 
                      alt={c.full_name} 
                      className="h-20 w-20 rounded-md object-cover border-2 border-maroon/40" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-typewriter text-maroon">{c.full_name}</h3>
                    <p className="text-ink/70 text-sm mt-1">{c.role || "No role specified"}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags?.map((t: string) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-maroon/10 text-maroon text-xs font-medium border border-maroon/30">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 flex gap-2">
                  <Link to="/candidate/$id" params={{ id: c.id }} className="pill-btn flex-1 !py-2 text-center">View Profile</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
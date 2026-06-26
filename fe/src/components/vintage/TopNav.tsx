import { Link, useNavigate } from "@tanstack/react-router";
import { UserCircle, LogOut, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function TopNav({ showBack = false }: { showBack?: boolean }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<{fullName: string} | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Cek apakah ada profil yang baru saja diedit & disimpan di halaman Profile
      const localProfile = localStorage.getItem("talentz_profile_me");
      let displayFullName = null;

      if (localProfile) {
        try {
          const parsedProfile = JSON.parse(localProfile);
          if (parsedProfile.name) {
            displayFullName = parsedProfile.name; // Ambil nama dari editan profil
          }
        } catch (e) {
          console.error("Gagal membaca profil lokal", e);
        }
      }

      // 2. Ambil data sesi dari akun yang login
      const storedUser = localStorage.getItem("talentz_user");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const userId = parsedUser.id || (parsedUser.user && parsedUser.user.id);
          
          // Jika belum ada editan lokal, gunakan nama dari data login
          if (!displayFullName) {
            displayFullName = parsedUser.full_name || parsedUser.fullName || parsedUser.email?.split('@')[0] || "User";
          }
          
          setUser({ fullName: displayFullName });

          // 3. Tarik data dari backend API (Hanya jika profil belum pernah diedit secara lokal)
          if (userId && !localProfile) {
            const res = await fetch("http://localhost:3001/api/candidates");
            if (res.ok) {
              const candidates = await res.json();
              const currentUser = candidates.find((c: any) => c.id === userId);
              
              if (currentUser && currentUser.full_name) {
                setUser({ fullName: currentUser.full_name });
              }
            }
          }
        } catch (err) {
          console.error("Gagal sinkronisasi nama di TopNav:", err);
        }
      }
    };

    fetchUserData();

    // Listener ini berguna jika kamu berpindah tab dan data profil berubah
    const handleStorageChange = () => fetchUserData();
    window.addEventListener('storage', handleStorageChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("talentz_user");
    localStorage.removeItem("talentz_profile_me"); // Bersihkan juga cache profil saat logout
    supabase.auth.signOut().catch(() => {}); 
    setUser(null);
    setShowMenu(false);
    navigate({ to: "/login" });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-6">
      <div>
        {showBack ? (
          <Link to="/" className="pill-btn"> &lt; Back </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 font-typewriter text-paper text-lg tracking-wider">
            <span className="inline-block h-9 w-9 rounded-full bg-maroon shadow-lg" aria-hidden />
            TALENZ
          </Link>
        )}
      </div>
      
      <nav className="flex items-center gap-3">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className="pill-btn flex items-center gap-2 !px-4 !py-2">
              <UserCircle className="w-5 h-5" />
              <span className="hidden sm:inline-block">{user.fullName}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-paper border border-maroon rounded-md shadow-xl py-2 flex flex-col z-50">
                <Link to="/candidate/$id" params={{ id: "me" }} onClick={() => setShowMenu(false)} className="px-4 py-2 hover:bg-maroon/10 flex items-center gap-2 font-typewriter text-maroon text-sm">
                  <User className="w-4 h-4" /> View Profile
                </Link>
                <div className="h-[1px] w-full bg-maroon/20 my-1"></div>
                <button onClick={handleLogout} className="px-4 py-2 hover:bg-maroon/10 flex items-center gap-2 font-typewriter text-maroon text-sm text-left w-full">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/register" className="pill-btn">REGISTER</Link>
            <Link to="/login" className="pill-btn">LOGIN</Link>
          </>
        )}
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
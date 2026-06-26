import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PaperFrame, DoilyNote } from "@/components/vintage/PaperFrame";
import { TopNav, StatusStrip, ProfessionalsBanner } from "@/components/vintage/TopNav";
import { VintageField } from "@/components/vintage/VintageField";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
      // 1. Ambil data dari backend kamu saat login ditekan
      const res = await fetch("http://localhost:3001/api/candidates");
      if (res.ok) {
        const candidates = await res.json();
        
        // 2. Cari user atas nama Muhammad Abimanyu Riza
        const myUser = candidates.find((c: any) => c.full_name === "Muhammad Abimanyu Riza");

        if (myUser) {
          // 3. Simpan data LENGKAP dengan ID ke Local Storage
          localStorage.setItem("talentz_user", JSON.stringify({
            id: myUser.id, // INI YANG PALING PENTING AGAR BISA SAVE!
            fullName: myUser.full_name,
            initials: "MR"
          }));
          
          // Redirect ke profil
          navigate({ to: "/candidate/$id", params: { id: "me" } });
        } else {
          alert("User 'Muhammad Abimanyu Riza' tidak ditemukan di database!");
        }
      }
    } catch (err) {
      console.error("Gagal koneksi ke backend:", err);
      alert("Pastikan server backend (localhost:3001) sedang berjalan.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav showBack />
      <main className="relative flex-1 pt-28 pb-6 px-6 sm:px-10 flex flex-col justify-center">
        <div className="flex justify-center mb-8">
          <ProfessionalsBanner />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center max-w-5xl mx-auto w-full">
          <div className="red-string hidden lg:block absolute z-0"
            style={{
              top: "35%",
              left: "45%",
              width: "25%",
              transform: "rotate(18deg)",
            }}
          />
          
          <div className="relative w-full z-10">
            <PaperFrame withPin className="rotate-[-0.6deg]">
              <h1 className="font-typewriter text-4xl text-center text-maroon tracking-widest">
                LOGIN
              </h1>
              <p className="mt-2 mb-8 text-center font-typewriter text-pin text-sm">
                Join our community of professionals
              </p>

              <form onSubmit={handleLogin} className="space-y-5 max-w-md mx-auto">
                <VintageField label="Email" type="email" placeholder="Enter your email" />
                <VintageField label="Password" type="password" placeholder="Enter your password" />

                <div className="flex items-center justify-between font-typewriter text-sm text-ink">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-[var(--maroon)]" />
                    Remember me
                  </label>
                  <a href="#" className="text-pin">
                    Forgot Password?
                  </a>
                </div>

                <div className="pt-4 flex flex-col items-center gap-4">
                  <button type="submit" className="pill-btn !px-10 !py-3 w-full">
                    LOGIN
                  </button>
                  <p className="font-typewriter text-sm text-ink">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-pin underline">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </PaperFrame>
          </div>

          <div className="relative w-full z-10 flex justify-center">
            <DoilyNote className="rotate-[2deg] lg:mt-20 max-w-sm">
              <h3 className="font-typewriter text-maroon text-xl tracking-widest">SECURE ACCESS</h3>
              <p className="mt-4 font-typewriter text-ink text-sm leading-relaxed">
                Your data is safe with us. Login to continue your journey.
              </p>
            </DoilyNote>
          </div>
        </div>
      </main>
      
      <div className="mt-auto">
        <StatusStrip />
      </div>
    </div>
  );
}
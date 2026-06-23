import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperFrame, DoilyNote } from "@/components/vintage/PaperFrame";
import { TopNav, StatusStrip, ProfessionalsBanner } from "@/components/vintage/TopNav";
import { VintageField } from "@/components/vintage/VintageField";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav showBack />
      <main className="relative pt-28 pb-6 px-6 sm:px-10">
        <div className="flex justify-center mb-8">
          <ProfessionalsBanner />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start max-w-5xl mx-auto">
          <div className="red-string hidden lg:block"
            style={{
              top: "180px",
              left: "50%",
              width: "500px",
              transform: "rotate(18deg)",
            }}
          />
          <PaperFrame withPin className="rotate-[-0.6deg]">
            <h1 className="font-typewriter text-4xl text-center text-maroon tracking-widest">
              LOGIN
            </h1>
            <p className="mt-2 mb-8 text-center font-typewriter text-pin text-sm">
              Join our community of professionals
            </p>

            <form className="space-y-5 max-w-md mx-auto">
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
                <Link to="/home" className="pill-btn !px-10 !py-3">
                  LOGIN
                </Link>
                <p className="font-typewriter text-sm text-ink">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-pin underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </PaperFrame>

          <DoilyNote className="rotate-[2deg] lg:mt-20">
            <h3 className="font-typewriter text-maroon text-xl tracking-widest">SECURE ACCESS</h3>
            <p className="mt-4 font-typewriter text-ink text-sm leading-relaxed">
              Your data is safe with us. Login to continue your journey.
            </p>
          </DoilyNote>
        </div>
      </main>
      <StatusStrip />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperFrame, DoilyNote } from "@/components/vintage/PaperFrame";
import { TopNav, StatusStrip, ProfessionalsBanner } from "@/components/vintage/TopNav";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav />

      <main className="relative pt-28 pb-6 px-6 sm:px-10">
        <div className="flex justify-center mb-8">
          <ProfessionalsBanner />
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-center max-w-6xl mx-auto">
          <div className="red-string hidden lg:block"
            style={{
              top: "190px",
              left: "50%",
              width: "500px",
              transform: "rotate(18deg)",
            }}
          />
          <div className="relative">
            <PaperFrame withPin className="rotate-[-1.2deg]">
              <div className="py-14 text-center">
                <h1 className="font-typewriter text-6xl sm:text-8xl tracking-widest text-maroon">
                  TALENZ
                </h1>
                <p className="mt-6 font-typewriter text-ink/80 text-sm sm:text-base max-w-md mx-auto">
                  Platform Gen Z untuk update karir dan mencari peluang
                </p>
              </div>
            </PaperFrame>

            <div className="mt-10 flex justify-center">
              <Link to="/home" className="pill-btn !px-8 !py-4 !text-base shadow-2xl">
                Saya Ingin Mencari Kandidat →
              </Link>
            </div>
          </div>

          <div className="relative">
            <DoilyNote className="rotate-[2deg]">
              <div
                className="mx-auto mb-3 h-12 w-12 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, oklch(0.5 0.2 25), oklch(0.2 0.12 22))",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.3)",
                }}
              />
              <h3 className="font-typewriter text-maroon text-xl tracking-widest">
                RESOURCES PAGE
              </h3>
              <p className="mt-4 font-typewriter text-ink text-sm leading-relaxed">
                Explore professional portfolios from technology, business, engineering, finance,
                education, healthcare, creative industries, and more.
              </p>
            </DoilyNote>
          </div>
        </div>
      </main>

      <StatusStrip />
    </div>
  );
}

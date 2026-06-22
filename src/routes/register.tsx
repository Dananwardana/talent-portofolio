import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperFrame, DoilyNote } from "@/components/vintage/PaperFrame";
import { TopNav, StatusStrip, ProfessionalsBanner } from "@/components/vintage/TopNav";
import { VintageField } from "@/components/vintage/VintageField";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav />
      <main className="relative pt-28 pb-6 px-6 sm:px-10">
        <div className="flex justify-center mb-8">
          <ProfessionalsBanner />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start max-w-5xl mx-auto">
          <PaperFrame withPin className="rotate-[-0.6deg]">
            <h1 className="font-typewriter text-4xl text-center text-maroon tracking-widest">REGISTER</h1>
            <p className="mt-2 mb-8 text-center font-typewriter text-pin text-sm">Join our community of professionals</p>

            <form className="space-y-5 max-w-md mx-auto">
              <VintageField label="Full name" placeholder="Enter your full name" />
              <VintageField label="Email" type="email" placeholder="Enter your email" />
              <VintageField label="Password" type="password" placeholder="Enter your password" />
              <VintageField label="Confirm Password" type="password" placeholder="Confirm your password" />

              <div className="pt-4 flex flex-col items-center gap-4">
                <Link to="/complete-profile" className="pill-btn !px-10 !py-3">REGISTER</Link>
                <p className="font-typewriter text-sm text-ink">
                  Already have an account?{" "}
                  <Link to="/login" className="text-pin underline">login</Link>
                </p>
              </div>
            </form>
          </PaperFrame>

          <DoilyNote className="rotate-[2deg] lg:mt-20">
            <h3 className="font-typewriter text-maroon text-xl tracking-widest">WHY JOIN?</h3>
            <p className="mt-4 font-typewriter text-ink text-sm leading-relaxed">
              Showcase your work, connect with professionals, and unlock new opportunities
            </p>
          </DoilyNote>
        </div>
      </main>
      <StatusStrip />
    </div>
  );
}

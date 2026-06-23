import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/vintage/TopNav";
import { PinnedCard } from "@/components/vintage/PaperFrame";
import { Download, Share2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/candidate/$id")({
  component: CandidateDetail,
});

const TABS = ["Skills", "Experience", "Education", "Project", "Certification", "Activity"];

function CandidateDetail() {
  const [tab, setTab] = useState("Skills");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav />

      <main className="relative pt-28 pb-16 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
          {/* Left: profile paper */}
          <div className="ornate-frame p-8 ornate-corners rotate-[-1deg]">
            <Field label="Name" value="Aldifa Zahrotul Aufar" />
            <Field label="Role" value="Frontend Developer" />
            <Field label="Address" value="Surakarta, Indonesia" />
            <div className="mb-5">
              <span className="block font-typewriter text-sm text-maroon mb-1.5">About</span>
              <textarea
                rows={5}
                defaultValue="Detective of pixels and patterns. Frontend craftsperson with a love for clean design, elegant interactions, and well-typeset text."
                className="w-full px-4 py-3 rounded-md bg-transparent border-2 border-maroon/70 font-typewriter text-ink outline-none focus:border-maroon resize-none"
              />
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button className="pill-btn !rounded-md !px-5 inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> ATS CV
              </button>
              <button className="pill-btn !rounded-md !px-5 inline-flex items-center gap-2">
                <Share2 className="h-4 w-4" /> SHARE
              </button>
            </div>
          </div>

          {/* Right: corkboard */}
          <div
            className="relative rounded-xl p-6 min-h-[500px] overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, oklch(0.35 0.01 60), oklch(0.22 0.01 60))",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), var(--shadow-paper)",
            }}
          >
            {/* polaroid */}
            <div className="absolute top-4 right-6 bg-paper p-2 pb-6 rotate-6 shadow-xl w-44">
              <div className="h-28 bg-gradient-to-b from-sky-300 to-green-300 rounded-sm" />
              <span className="absolute -top-2 right-4 red-pin" />
            </div>
            {/* question mark badge */}
            <div className="absolute top-4 left-4 bg-paper rounded-md p-3 -rotate-12 shadow-xl">
              <HelpCircle className="h-6 w-6 text-maroon" />
            </div>

            {/* string + pinned notes */}
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 600"
                preserveAspectRatio="none"
              >
                <path
                  d="M 80 80 L 320 180 L 100 280 L 320 380 L 100 480"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </div>

            <div className="relative pt-24 grid gap-6">
              <PinnedCard className="w-56 ml-auto -rotate-3">
                <p className="font-typewriter text-maroon text-sm font-bold">Years Exp.</p>
                <p className="font-typewriter text-ink text-2xl">3+ years</p>
              </PinnedCard>
              <PinnedCard className="w-56 mr-auto rotate-2">
                <p className="font-typewriter text-maroon text-sm font-bold">Projects</p>
                <p className="font-typewriter text-ink text-2xl">24</p>
              </PinnedCard>
              <PinnedCard className="w-56 ml-auto -rotate-2">
                <p className="font-typewriter text-maroon text-sm font-bold">Certifications</p>
                <p className="font-typewriter text-ink text-2xl">7</p>
              </PinnedCard>
              <PinnedCard className="w-56 mr-auto rotate-3">
                <p className="font-typewriter text-maroon text-sm font-bold">Skills</p>
                <p className="font-typewriter text-ink text-2xl">18</p>
              </PinnedCard>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative font-typewriter text-sm tracking-widest px-6 py-3 rounded-t-lg border-2 border-b-0 transition ${
                  tab === t
                    ? "bg-paper text-maroon border-maroon z-10"
                    : "bg-maroon/40 text-paper border-paper/20 hover:bg-maroon/60"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="bg-paper border-2 border-maroon rounded-b-xl rounded-tr-xl p-8">
            {tab === "Skills" && <SkillsContent />}
            {tab !== "Skills" && (
              <div className="text-ink/70 font-typewriter text-center py-12">
                {tab} details coming soon.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/home" className="pill-btn">
            ← Back to discovery
          </Link>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <span className="block font-typewriter text-sm text-maroon mb-1.5">{label}</span>
      <input
        defaultValue={value}
        className="w-full px-4 py-3 rounded-md bg-transparent border-2 border-maroon/70 font-typewriter text-ink outline-none focus:border-maroon"
      />
    </div>
  );
}

function SkillsContent() {
  const tech = [
    { name: "Figma", level: 95, badge: "Expert · 2y" },
    { name: "Framer", level: 80, badge: "Advanced · 3y" },
    { name: "Webflow", level: 60, badge: "Intermediate · 4y" },
    { name: "Protopie", level: 75, badge: "Advanced · 2y" },
    { name: "Adobe XD", level: 90, badge: "Expert · 5y" },
  ];
  const soft = [
    "Empathy · Advanced",
    "Collaboration · Advanced",
    "Storytelling · Advanced",
    "Critical Thinking · Intermediate",
  ];
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-typewriter text-center text-maroon tracking-widest mb-6">TECHNICAL</h3>
        <div className="space-y-4 font-sans">
          {tech.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span className="font-medium">{s.name}</span>
                <span className="text-slate-500 text-xs">{s.badge}</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-typewriter text-center text-maroon tracking-widest mb-6">
          SOFT SKILLS
        </h3>
        <div className="flex flex-wrap gap-2 font-sans">
          {soft.map((s) => (
            <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

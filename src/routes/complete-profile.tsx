import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PaperFrame } from "@/components/vintage/PaperFrame";
import { VintageField } from "@/components/vintage/VintageField";
import { Pencil, Trash2, Calendar, MapPin, X, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/complete-profile")({
  component: CompleteProfile,
});

const STEPS = ["Account", "Skill", "Experience", "Education", "Project", "Certification", "Activity"];

function CompleteProfile() {
  const [step, setStep] = useState(1); // 0-indexed visually; start on Skill like screenshot
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Back & Title */}
      <div className="pt-6 px-6 sm:px-10 flex items-center justify-between">
        <Link to="/register" className="pill-btn">&lt; Back</Link>
      </div>

      <div className="px-6 sm:px-10 mt-6">
        <div className="inline-block bg-maroon-deep/70 border border-paper/10 rounded-lg px-6 py-3">
          <h1 className="font-typewriter text-paper text-2xl tracking-widest">COMPLETE YOUR PROFILE</h1>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center justify-between max-w-4xl mx-auto">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={label}
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className={`h-12 w-12 rounded-full flex items-center justify-center font-typewriter font-bold border-2 transition ${
                    active
                      ? "bg-paper text-maroon border-paper scale-110 shadow-lg"
                      : done
                      ? "bg-paper/30 text-paper border-paper/40"
                      : "bg-transparent text-paper border-paper/40"
                  }`}
                >
                  {done ? <ChevronDown className="h-4 w-4" /> : i + 1}
                </span>
                <span className="font-typewriter text-xs text-paper/80">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="mt-10 max-w-4xl mx-auto pb-16">
          <PaperFrame>
            {step === 0 && <AccountStep />}
            {step === 1 && <SkillStep />}
            {step === 2 && <ExperienceStep />}
            {step === 3 && <EducationStep />}
            {step >= 4 && <PlaceholderStep title={STEPS[step]} />}
          </PaperFrame>

          <div className="mt-6 flex justify-between">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="pill-btn disabled:opacity-40"
            >
              Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} className="pill-btn">Next</button>
            ) : (
              <Link to="/home" className="pill-btn">Finish</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountStep() {
  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <h2 className="font-typewriter text-2xl text-maroon tracking-widest">ACCOUNT</h2>
      <p className="font-typewriter text-pin text-sm">Tell us a bit about yourself</p>
      <VintageField label="Display Name" placeholder="John Doe" />
      <VintageField label="Phone Number" placeholder="+62..." />
      <VintageField label="Location" placeholder="Jakarta, Indonesia" />
    </div>
  );
}

function SkillStep() {
  const [skills, setSkills] = useState(["javascript", "react", "Node.js", "Node.js", "Node.js", "Node.js"]);
  const [val, setVal] = useState("");
  return (
    <div>
      <h2 className="font-typewriter text-2xl text-maroon tracking-widest">SKILLS</h2>
      <p className="font-typewriter text-pin text-sm mt-1">Add the Skills and technologies you are proficient in</p>

      <div className="mt-6">
        <label className="block font-typewriter text-sm text-maroon mb-1.5">Add Skills</label>
        <div className="flex gap-3">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter skill (e.g., javascript, react, python)"
            className="flex-1 px-4 py-3 rounded-md bg-transparent border-2 border-maroon/70 font-typewriter text-ink outline-none focus:border-maroon"
          />
          <button
            onClick={() => { if (val.trim()) { setSkills([...skills, val.trim()]); setVal(""); } }}
            className="pill-btn !rounded-md !px-6"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-typewriter text-sm text-maroon mb-2">Your Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border-2 border-maroon/60 font-typewriter text-ink text-sm">
              {s}
              <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="text-pin hover:text-maroon">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceStep() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-typewriter text-2xl text-maroon tracking-widest">EXPERIENCE</h2>
          <p className="font-typewriter text-pin text-sm mt-1">Add your experience and professional background</p>
        </div>
        <button className="pill-btn !rounded-md !px-6">Add</button>
      </div>
      <div className="mt-6 border-2 border-maroon/60 rounded-md p-5 font-typewriter text-ink">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-maroon">FRONT-END DEVELOPER</h3>
            <p className="text-sm">datasea solutions</p>
          </div>
          <div className="flex gap-2 text-maroon">
            <Pencil className="h-4 w-4 cursor-pointer" /><Trash2 className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
        <div className="mt-3 flex gap-6 text-sm">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Jan 2025 – present</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Tanjung, Jakarta</span>
        </div>
        <ul className="mt-3 list-disc list-inside text-sm space-y-1">
          <li>Developed and maintained responsive web applications using React</li>
          <li>Collaborated with cross-functional teams on UI design</li>
          <li>Optimized performance and accessibility</li>
        </ul>
      </div>
    </div>
  );
}

function EducationStep() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-typewriter text-2xl text-maroon tracking-widest">EDUCATION</h2>
          <p className="font-typewriter text-pin text-sm mt-1">Add your educational background</p>
        </div>
        <button className="pill-btn !rounded-md !px-6">Add</button>
      </div>
      <div className="mt-6 border-2 border-maroon/60 rounded-md p-5 font-typewriter text-ink">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-maroon">Bachelor of Computer Science</h3>
            <p className="text-sm">Sebelas Maret University</p>
          </div>
          <div className="flex gap-2 text-maroon">
            <Pencil className="h-4 w-4 cursor-pointer" /><Trash2 className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
        <div className="mt-3 flex gap-6 text-sm">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Jan 2022 – present</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Jebres, Surakarta</span>
        </div>
        <p className="mt-2 text-sm">GPA: 3.98 / 4</p>
      </div>
    </div>
  );
}

function PlaceholderStep({ title }: { title: string }) {
  return (
    <div className="text-center py-12">
      <h2 className="font-typewriter text-2xl text-maroon tracking-widest">{title.toUpperCase()}</h2>
      <p className="font-typewriter text-pin text-sm mt-2">Add your {title.toLowerCase()} details</p>
      <button className="mt-6 pill-btn !rounded-md !px-6">+ Add {title}</button>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TopNav } from "@/components/vintage/TopNav";
import { PinnedCard } from "@/components/vintage/PaperFrame";
import { Download, Share2, HelpCircle, Edit3, Compass, Plus, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/candidate/$id")({
  component: CandidateDetail,
});

const TABS = ["Skills", "Experience", "Education", "Project", "Certification", "Activity"];

function CandidateDetail() {
  const { id } = Route.useParams();
  const isMe = id === "me";

  const [tab, setTab] = useState("Skills");
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    id: "",
    name: "Loading...",
    role: "...",
    address: "...",
    about: "...",
    avatar_url: "",
    tech: [],
    soft: [],
    experience: [],
    education: [],
    project: [],
    certification: [],
    activity: []
  });

  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, type: string, index: number | null, data: any}>({
    isOpen: false, type: "", index: null, data: {}
  });

  const [deleteConfig, setDeleteConfig] = useState<{isOpen: boolean, type: keyof typeof profile | "", index: number | null}>({
    isOpen: false, type: "", index: null
  });

  // 1. FETCH DATA & SISTEM PENCARI ID OTOMATIS
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        let targetId = id === "me" ? "" : id; // Pastikan 'me' tidak terbaca sebagai ID
        let targetName = "";
        
        if (isMe) {
           // A. Coba cari ID dari hasil Login (Local Storage)
           const storedUser = localStorage.getItem("talentz_user");
           if (storedUser) {
             const parsedUser = JSON.parse(storedUser);
             targetId = parsedUser.id || (parsedUser.user && parsedUser.user.id) || "";
             targetName = parsedUser.full_name || parsedUser.fullName || "";
           }

           // B. Jika ID masih kosong, paksa ambil dari sesi Supabase Auth
           if (!targetId) {
             const { data: authData } = await supabase.auth.getUser();
             if (authData && authData.user) targetId = authData.user.id;
           }
        }

        // Ambil daftar kandidat dari API yang sudah jalan
        const res = await fetch(`http://localhost:3001/api/candidates`);
        if (res.ok) {
          const candidates = await res.json();
          let data = null;

          // Cari user berdasarkan ID
          if (targetId) {
             data = candidates.find((c: any) => c.id === targetId);
          }
          
          // C. SISTEM PENYELAMAT: Jika ID tetap tidak ketemu, cari berdasarkan Nama Lengkap!
          if (!data && targetName) {
             data = candidates.find((c: any) => c.full_name === targetName);
             if (data) targetId = data.id; // Sukses menemukan ID dari nama!
          }
          
          if (data) {
            setProfile({
              id: data.id || targetId,
              name: data.full_name || "Unknown Candidate",
              role: data.role || "",
              address: data.address || "",
              about: data.about || "",
              avatar_url: data.avatar_url || "",
              tech: data.tech || [],
              soft: data.soft || [],
              experience: data.experience || [],
              education: data.education || [],
              project: data.project || [],
              certification: data.certification || [],
              activity: data.activity || []
            });
          } else if (isMe) {
            setProfile(prev => ({...prev, id: targetId, name: targetName || "New User"}));
          }
        }
      } catch (err) {
        console.error("Error fetching detail candidate:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, [id, isMe]);

  // 2. SIMPAN PERUBAHAN KE SUPABASE
  const handleSaveProfile = async () => {
    try {
      if (!profile.id || profile.id === "me") {
        alert("ID User tidak ditemukan, pastikan Anda login dengan benar lalu refresh halaman ini.");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          role: profile.role,
          address: profile.address,
          about: profile.about,
          tech: profile.tech,
          soft: profile.soft,
          experience: profile.experience,
          education: profile.education,
          project: profile.project,
          certification: profile.certification,
          activity: profile.activity
        })
        .eq('id', profile.id);

      if (error) {
        console.error("Gagal save Supabase:", error);
        alert("Gagal menyimpan: " + error.message);
      } else {
        localStorage.setItem("talentz_profile_me", JSON.stringify(profile));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Terjadi kesalahan sistem saat menyimpan data.");
    }
  };

  const updateLocalProfile = (newProfile: any) => setProfile(newProfile);

  const openModal = (type: string, index: number | null = null, currentData: any = {}) => {
    setModalConfig({ isOpen: true, type, index, data: currentData });
  };
  
  const closeModal = () => setModalConfig({ isOpen: false, type: "", index: null, data: {} });

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { type, index, data } = modalConfig;
    let newProfile = { ...profile };

    if (type === "tech" || type === "soft") {
      const arr = [...(newProfile[type as keyof typeof newProfile] as any[])];
      if (index !== null) arr[index] = data; else arr.push(data);
      (newProfile as any)[type] = arr;
    } else {
      const tabKey = type as keyof typeof profile;
      if (newProfile[tabKey] !== undefined) {
          const arr = [...(newProfile[tabKey] as any[])];
          if (index !== null) arr[index] = data; else arr.push(data);
          (newProfile as any)[tabKey] = arr;
      }
    }
    updateLocalProfile(newProfile);
    closeModal();
  };

  const handleDeleteClick = (type: keyof typeof profile, index: number) => {
    setDeleteConfig({ isOpen: true, type, index });
  };

  const confirmDelete = () => {
    if (deleteConfig.index === null || !deleteConfig.type) return;
    const newProfile = { ...profile };
    (newProfile[deleteConfig.type] as any[]) = (newProfile[deleteConfig.type] as any[]).filter((_, i) => i !== deleteConfig.index);
    updateLocalProfile(newProfile);
    setDeleteConfig({ isOpen: false, type: "", index: null });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-typewriter text-maroon text-xl">Loading dossier...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav />

      <main className="relative flex-1 pt-28 pb-16 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
          
          <div className="ornate-frame p-8 ornate-corners rotate-[-1deg] relative transition-all duration-300">
            {isMe && (
               <div className="absolute top-4 right-4 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-md border border-green-200 font-typewriter z-10 flex items-center gap-1.5 shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 EDIT MODE
               </div>
            )}

            <Field label="Name" value={profile.name} readOnly={!isMe} onChange={(val) => setProfile({...profile, name: val})} />
            <Field label="Role" value={profile.role} readOnly={!isMe} onChange={(val) => setProfile({...profile, role: val})} />
            <Field label="Address" value={profile.address} readOnly={!isMe} onChange={(val) => setProfile({...profile, address: val})} />
            
            <div className="mb-5">
              <span className="block font-typewriter text-sm text-maroon mb-1.5">About</span>
              <textarea
                rows={5}
                value={profile.about}
                onChange={(e) => setProfile({...profile, about: e.target.value})}
                readOnly={!isMe}
                className={`w-full px-4 py-3 rounded-md bg-transparent font-typewriter text-ink outline-none resize-none transition-all duration-200 ${
                  !isMe ? "border-2 border-transparent p-0" : "border-2 border-maroon/30 border-dashed focus:border-solid focus:border-maroon focus:bg-maroon/5 hover:bg-black/5"
                }`}
              />
            </div>
            
            <div className="flex gap-3 justify-center mt-8">
              {isMe ? (
                <>
                  <button onClick={handleSaveProfile} className={`pill-btn !rounded-md !px-6 inline-flex items-center gap-2 transition-all ${isSaved ? '!bg-green-700 !border-green-800' : ''}`}>
                    {isSaved ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />} 
                    {isSaved ? "Saved!" : "Save Profile"}
                  </button>
                  <Link to="/home" className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2 !bg-paper !text-milk">
                    <Compass className="h-4 w-4" /> Discovery
                  </Link>
                </>
              ) : (
                <>
                  <button className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2">
                    <Download className="h-4 w-4" /> ATS CV
                  </button>
                  <button className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2 !bg-paper !text-white">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            className="relative rounded-xl p-6 min-h-[500px] overflow-hidden"
            style={{
              background: "url('https://www.transparenttextures.com/patterns/cork-board.png'), #a07855",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), var(--shadow-paper)",
            }}
          >
            <div className="absolute top-4 right-6 bg-paper p-2 pb-6 rotate-6 shadow-xl w-44 z-20 group transition-transform hover:rotate-0">
              <div className="h-28 bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm flex items-center justify-center relative overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/40 font-typewriter text-xs">Photo</span>
                )}
                {isMe && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-bold font-typewriter">Update</span>
                  </div>
                )}
              </div>
              <span className="absolute -top-2 right-4 red-pin" />
            </div>
            
            <div className="absolute top-4 left-4 bg-paper rounded-md p-3 -rotate-12 shadow-xl z-20">
              <HelpCircle className="h-6 w-6 text-maroon" />
            </div>

            <div className="relative pt-24 grid grid-cols-2 gap-4 z-10">
              <PinnedCard className="w-full rotate-[-3deg] transition-transform hover:rotate-0">
                <p className="font-typewriter text-maroon text-sm font-bold">Total Exp.</p>
                <p className="font-typewriter text-ink text-2xl">{profile.experience?.length || 0} roles</p>
              </PinnedCard>
              <PinnedCard className="w-full rotate-2 transition-transform hover:rotate-0">
                <p className="font-typewriter text-maroon text-sm font-bold">Projects</p>
                <p className="font-typewriter text-ink text-2xl">{profile.project?.length || 0}</p>
              </PinnedCard>
              <PinnedCard className="w-full rotate-[-2deg] transition-transform hover:rotate-0">
                <p className="font-typewriter text-maroon text-sm font-bold">Certifications</p>
                <p className="font-typewriter text-ink text-2xl">{profile.certification?.length || 0}</p>
              </PinnedCard>
              <PinnedCard className="w-full rotate-3 transition-transform hover:rotate-0">
                <p className="font-typewriter text-maroon text-sm font-bold">Total Skills</p>
                <p className="font-typewriter text-ink text-2xl">{(profile.tech?.length || 0) + (profile.soft?.length || 0)}</p>
              </PinnedCard>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
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
            {tab === "Skills" ? (
              <SkillsContent profile={profile} isMe={isMe} openModal={openModal} onDelete={handleDeleteClick} />
            ) : (
              <GenericTabContent tabName={tab} profile={profile} isMe={isMe} openModal={openModal} onDelete={handleDeleteClick} />
            )}
          </div>
        </div>

        {!isMe && (
          <div className="mt-8 flex justify-center">
            <Link to="/home" className="pill-btn">
              ← Back to discovery
            </Link>
          </div>
        )}
      </main>

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-paper border-2 border-maroon rounded-xl w-full max-w-md shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-maroon px-6 py-4 flex justify-between items-center text-paper">
              <h2 className="font-typewriter text-lg font-bold tracking-widest uppercase">
                {modalConfig.index !== null ? "EDIT" : "ADD"} {modalConfig.type}
              </h2>
              <button onClick={closeModal} className="hover:text-red-300 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto space-y-4">
              {modalConfig.type === "tech" && (
                <>
                  <ModalField label="Skill Name (e.g. React)" value={modalConfig.data.name} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, name: v}})} />
                  <ModalField label="Badge (e.g. Expert · 2y)" value={modalConfig.data.badge} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, badge: v}})} />
                  <div className="space-y-1">
                    <label className="font-typewriter text-sm font-bold text-maroon">Level: {modalConfig.data.level || 50}%</label>
                    <input type="range" min="10" max="100" value={modalConfig.data.level || 50} onChange={(e) => setModalConfig({...modalConfig, data: {...modalConfig.data, level: parseInt(e.target.value)}})} className="w-full accent-maroon" />
                  </div>
                </>
              )}

              {modalConfig.type === "soft" && (
                <ModalField label="Soft Skill (e.g. Empathy · Advanced)" value={modalConfig.data.name} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, name: v}})} />
              )}

              {["Experience", "Education", "Project", "Certification", "Activity"].map(t => t.toLowerCase()).includes(modalConfig.type) && (
                <>
                  <ModalField label="Title / Heading" value={modalConfig.data.title} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, title: v}})} />
                  <ModalField label="Subtitle / Organization" value={modalConfig.data.subtitle} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, subtitle: v}})} />
                  <ModalField label="Date / Duration" value={modalConfig.data.date} onChange={(v) => setModalConfig({...modalConfig, data: {...modalConfig.data, date: v}})} />
                  <div className="space-y-1">
                    <label className="font-typewriter text-sm font-bold text-maroon">Description</label>
                    <textarea rows={3} value={modalConfig.data.desc || ""} onChange={(e) => setModalConfig({...modalConfig, data: {...modalConfig.data, desc: e.target.value}})} className="w-full px-3 py-2 border-2 border-maroon/30 rounded-md focus:outline-none focus:border-maroon bg-transparent font-typewriter text-ink resize-none" />
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-5 py-2 font-typewriter font-bold text-ink hover:bg-black/5 rounded-md transition">CANCEL</button>
                <button type="submit" className="pill-btn !px-8 !py-2.5">APPLY DATA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfig.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-paper border-2 border-maroon rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-700 px-5 py-4 text-paper flex items-center gap-2">
              <AlertTriangle size={20} />
              <h2 className="font-typewriter text-base font-bold tracking-widest uppercase">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="font-typewriter text-ink mb-6 text-sm leading-relaxed">
                Are you sure you want to permanently delete this record? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfig({isOpen: false, type: "", index: null})} className="px-4 py-2 font-typewriter text-sm font-bold text-ink hover:bg-black/5 rounded-md transition-colors">
                  CANCEL
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-typewriter font-bold rounded-md shadow-md hover:bg-red-700 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, readOnly = false, onChange }: { label: string; value: string, readOnly?: boolean, onChange?: (val: string) => void }) {
  return (
    <div className="mb-4">
      <span className="block font-typewriter text-sm text-maroon mb-1.5">{label}</span>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full px-4 py-2.5 rounded-md bg-transparent font-typewriter text-ink outline-none transition-all duration-200 ${
            readOnly 
              ? "border-2 border-transparent px-0 py-1" 
              : "border-2 border-maroon/30 border-dashed focus:border-solid focus:border-maroon focus:bg-maroon/5 hover:bg-black/5"
          }`}
        />
        {!readOnly && <Edit3 className="absolute right-3 top-3 h-4 w-4 text-maroon/30 pointer-events-none" />}
      </div>
    </div>
  );
}

function ModalField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="font-typewriter text-sm font-bold text-maroon">{label}</label>
      <input 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-3 py-2 border-2 border-maroon/30 rounded-md focus:outline-none focus:border-maroon bg-transparent font-typewriter text-ink"
        required
      />
    </div>
  );
}

function SkillsContent({ profile, isMe, openModal, onDelete }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-3">
          <h3 className="font-typewriter text-maroon tracking-widest font-bold">TECHNICAL</h3>
          {isMe && (
            <button onClick={() => openModal("tech", null, { level: 50 })} className="text-maroon bg-maroon/5 hover:bg-maroon/10 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-bold font-typewriter">
              <Plus className="w-4 h-4" /> ADD
            </button>
          )}
        </div>
        
        <div className="space-y-4 font-sans">
          {profile.tech?.length === 0 ? <p className="text-sm text-slate-400 italic font-typewriter">No skills added.</p> : profile.tech?.map((s: any, index: number) => (
            <div key={index} className="relative group">
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span className="font-medium">{s.name}</span>
                <span className="text-slate-500 text-xs">{s.badge}</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${s.level}%` }} />
              </div>
              
              {isMe && (
                <div className="absolute right-0 -top-4 opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-paper shadow-md border border-maroon/10 rounded-full p-1 z-10">
                  <button onClick={() => openModal("tech", index, s)} className="text-maroon hover:bg-maroon/10 p-1.5 rounded-full transition-colors" title="Edit"><Edit3 size={14}/></button>
                  <button onClick={() => onDelete("tech", index)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors" title="Delete"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-3">
          <h3 className="font-typewriter text-maroon tracking-widest font-bold">SOFT SKILLS</h3>
          {isMe && (
            <button onClick={() => openModal("soft", null, { name: "" })} className="text-maroon bg-maroon/5 hover:bg-maroon/10 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-bold font-typewriter">
              <Plus className="w-4 h-4" /> ADD
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-3 font-sans mt-2">
          {profile.soft?.length === 0 ? <p className="text-sm text-slate-400 italic font-typewriter">No skills added.</p> : profile.soft?.map((s: any, index: number) => (
            <div key={index} className="relative group inline-block">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm inline-block border border-blue-100 transition-colors">
                {s.name || s}
              </span>
              
              {isMe && (
                <div className="absolute right-0 -top-4 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-paper shadow-md border border-maroon/10 rounded-full p-1 z-10">
                  <button onClick={() => openModal("soft", index, { name: s.name || s })} className="text-maroon hover:bg-maroon/10 p-1 rounded-full transition-colors" title="Edit"><Edit3 size={12}/></button>
                  <button onClick={() => onDelete("soft", index)} className="text-red-600 hover:bg-red-50 p-1 rounded-full transition-colors" title="Delete"><Trash2 size={12}/></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenericTabContent({ tabName, profile, isMe, openModal, onDelete }: any) {
  const dataKey = tabName.toLowerCase();
  const dataArray = profile[dataKey] || [];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-maroon/10 pb-4">
        <h3 className="font-typewriter text-maroon font-bold tracking-widest uppercase">{tabName}</h3>
        {isMe && (
          <button onClick={() => openModal(dataKey)} className="flex items-center gap-2 text-sm font-typewriter font-bold text-maroon bg-maroon/5 hover:bg-maroon/10 px-3 py-1.5 rounded-md transition-colors">
            <Plus size={16} /> ADD ENTRY
          </button>
        )}
      </div>

      {dataArray.length === 0 ? (
        <div className="text-ink/50 font-typewriter text-center py-12">
          No records found. Click add to create a new entry.
        </div>
      ) : (
        dataArray.map((item: any, i: number) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-black/5 relative group transition-all hover:shadow-md">
            <h4 className="font-bold text-slate-800 text-lg pr-16">{item.title}</h4>
            <p className="text-sm text-maroon font-medium mt-1">{item.subtitle} <span className="text-slate-400 font-normal">| {item.date}</span></p>
            {item.desc && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>}
            
            {isMe && (
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-200 translate-x-2 group-hover:translate-x-0 bg-paper shadow-sm border border-maroon/10 rounded-full p-1">
                  <button onClick={() => openModal(dataKey, i, item)} className="p-1.5 text-maroon hover:bg-maroon/10 rounded-full transition-colors" title="Edit Entry"><Edit3 size={16}/></button>
                  <button onClick={() => onDelete(dataKey, i)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete Entry"><Trash2 size={16}/></button>
               </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
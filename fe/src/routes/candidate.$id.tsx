import { PinnedCard } from "@/components/vintage/PaperFrame";
import { TopNav } from "@/components/vintage/TopNav";
import { supabase } from "@/lib/supabase";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Compass, Download, Edit3, HelpCircle, Plus, Share2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/candidate/$id")({
  component: CandidateDetail,
});

const TABS = ["Skills", "Experience", "Education", "Project", "Certification", "Activity"];

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  if (s > e) return "Invalid Date Range";
  
  const m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (m < 0) return "Invalid Date Range";
  if (m === 0) return "1 Month";
  if (m < 12) return `${m} Months`;
  
  const y = Math.floor(m / 12);
  const rem = m % 12;
  return `${y} Year${y > 1 ? 's' : ''} ${rem > 0 ? `${rem} Month${rem > 1 ? 's' : ''}` : ''}`;
};

function CandidateDetail() {
  const { id } = Route.useParams();
  const isMe = id === "me";

  const [tab, setTab] = useState("Skills");
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    id: "", name: "Loading...", role: "...", address: "...", about: "...", avatar_url: "",
    tech: [], soft: [], experience: [], education: [], project: [], certification: [], activity: []
  });

  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, type: string, index: number | null, data: any}>({
    isOpen: false, type: "", index: null, data: {}
  });

  const [deleteConfig, setDeleteConfig] = useState<{isOpen: boolean, type: keyof typeof profile | "", index: number | null}>({
    isOpen: false, type: "", index: null
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        let targetId = id === "me" ? "" : id;
        let targetName = "";
        
        if (isMe) {
           const storedUser = localStorage.getItem("talentz_user");
           if (storedUser) {
             const parsedUser = JSON.parse(storedUser);
             targetId = parsedUser.id || (parsedUser.user && parsedUser.user.id) || "";
             targetName = parsedUser.full_name || parsedUser.fullName || "";
           }
           if (!targetId) {
             const { data: authData } = await supabase.auth.getUser();
             if (authData && authData.user) targetId = authData.user.id;
           }
        }

        const res = await fetch(`http://localhost:3001/api/candidates`);
        if (res.ok) {
          const candidates = await res.json();
          let data = null;
          if (targetId) data = candidates.find((c: any) => c.id === targetId);
          if (!data && targetName) {
             data = candidates.find((c: any) => c.full_name === targetName);
             if (data) targetId = data.id;
          }
          
          if (data) {
            setProfile({
              id: data.id || targetId, name: data.full_name || "Unknown Candidate", role: data.role || "",
              address: data.address || "", about: data.about || "", avatar_url: data.avatar_url || "",
              tech: data.tech || [], soft: data.soft || [], experience: data.experience || [],
              education: data.education || [], project: data.project || [], certification: data.certification || [], activity: data.activity || []
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

  const autoSaveToDatabase = async (updatedProfile: any, sectionKey: string) => {
    if (!updatedProfile.id || updatedProfile.id === "me") return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [sectionKey]: updatedProfile[sectionKey as keyof typeof updatedProfile] })
        .eq('id', updatedProfile.id);

      if (error) console.error("Auto-save error:", error);
      else localStorage.setItem("talentz_profile_me", JSON.stringify(updatedProfile));
    } catch (err) {
      console.error("Gagal auto-save:", err);
    }
  };

  const saveBasicField = async (dbColumn: string, value: string) => {
    if (!profile.id || profile.id === "me") return;
    try {
      const { error } = await supabase.from('profiles').update({ [dbColumn]: value }).eq('id', profile.id);
      if (error) {
        console.error("Auto-save basic info error:", error);
      } else {
        localStorage.setItem("talentz_profile_me", JSON.stringify(profile));
      }
    } catch (err) {
      console.error("Gagal auto-save basic info:", err);
    }
  };

  const handleDownloadCV = () => {
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return alert("Pop-up diblokir! Izinkan pop-up di browser Anda untuk mengunduh CV.");

    const safeArr = (arr: any) => Array.isArray(arr) ? arr : [];

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV_${profile.name.replace(/\s+/g, '_')}</title>
          <style>
            @page { size: A4; margin: 0.75in; }
            body { font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.4; padding: 0; margin: 0; }
            h1 { font-size: 24px; text-align: center; text-transform: uppercase; margin-bottom: 2px; }
            .contact { text-align: center; font-size: 13px; margin-bottom: 15px; }
            h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-top: 15px; margin-bottom: 8px; }
            .item { margin-bottom: 10px; }
            .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; }
            .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 13px; margin-bottom: 4px; }
            .desc { font-size: 12px; margin-top: 4px; white-space: pre-wrap; }
            .skills-block { font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${profile.name}</h1>
          <div class="contact">${profile.address} | ${profile.role}</div>

          ${profile.about ? `<h2>Professional Summary</h2><div class="desc">${profile.about}</div>` : ''}

          ${safeArr(profile.experience).length > 0 ? `
            <h2>Experience</h2>
            ${safeArr(profile.experience).map(exp => `
              <div class="item">
                <div class="item-header"><span>${exp.title}</span><span>${exp.date}</span></div>
                <div class="item-sub"><span>${exp.subtitle}</span></div>
                <div class="desc">${exp.desc || ''}</div>
              </div>
            `).join('')}
          ` : ''}

          ${safeArr(profile.education).length > 0 ? `
            <h2>Education</h2>
            ${safeArr(profile.education).map(ed => `
              <div class="item">
                <div class="item-header"><span>${ed.title}</span><span>${ed.date}</span></div>
                <div class="item-sub"><span>${ed.subtitle}</span></div>
                <div class="desc">${ed.desc || ''}</div>
              </div>
            `).join('')}
          ` : ''}

          ${safeArr(profile.project).length > 0 ? `
            <h2>Projects</h2>
            ${safeArr(profile.project).map(pr => `
              <div class="item">
                <div class="item-header"><span>${pr.title}</span><span>${pr.date}</span></div>
                <div class="item-sub"><span>${pr.subtitle}</span></div>
                <div class="desc">${pr.desc || ''}</div>
              </div>
            `).join('')}
          ` : ''}

          ${safeArr(profile.certification).length > 0 ? `
            <h2>Certifications</h2>
            ${safeArr(profile.certification).map(cert => `
              <div class="item">
                <div class="item-header"><span>${cert.title}</span><span>${cert.date}</span></div>
                <div class="item-sub"><span>${cert.subtitle} ${cert.level ? `- ${cert.level}` : ''}</span></div>
                <div class="desc">${cert.desc || ''}</div>
              </div>
            `).join('')}
          ` : ''}

          ${safeArr(profile.tech).length > 0 || safeArr(profile.soft).length > 0 ? `
            <h2>Skills</h2>
            <div class="skills-block">
              ${safeArr(profile.tech).length > 0 ? `<strong>Technical Skills:</strong> ${safeArr(profile.tech).map(s => s.name).join(', ')}<br/>` : ''}
              ${safeArr(profile.soft).length > 0 ? `<strong>Soft Skills:</strong> ${safeArr(profile.soft).map(s => s.name || s).join(', ')}` : ''}
            </div>
          ` : ''}
          
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlTemplate);
    printWindow.document.close();
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${profile.name} - Professional Profile`,
      text: `Check out ${profile.name}'s profile on Talentz!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link profil berhasil disalin ke Clipboard!");
    }
  };

  const updateLocalProfile = (newProfile: any) => setProfile(newProfile);

  const openModal = (type: string, index: number | null = null, currentData: any = {}) => {
    let data = { ...currentData };
    if (Object.keys(data).length === 0) {
      if (type === "tech") data = { level: "Beginner", experience: "1 - 12 Months" };
      if (type === "experience") data = { date: "1 - 6 Months" };
      if (type === "certification") data = { level: "Beginner" };
      if (type === "activity") data = { subtitle: "Organization" };
    }
    setModalConfig({ isOpen: true, type, index, data });
  };
  
  const closeModal = () => setModalConfig({ isOpen: false, type: "", index: null, data: {} });

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { type, index, data } = modalConfig;
    let newProfile = { ...profile };
    let updatedKey = type;

    if (type === "tech" || type === "soft") {
      const arr = [...(newProfile[type as keyof typeof newProfile] as any[])];
      if (index !== null) arr[index] = data; else arr.push(data);
      (newProfile as any)[type] = arr;
    } else {
      updatedKey = type as keyof typeof profile;
      if (newProfile[updatedKey] !== undefined) {
          const arr = [...(newProfile[updatedKey] as any[])];
          if (index !== null) arr[index] = data; else arr.push(data);
          (newProfile as any)[updatedKey] = arr;
      }
    }
    
    updateLocalProfile(newProfile);
    closeModal();
    await autoSaveToDatabase(newProfile, updatedKey);
  };

  const handleDeleteClick = (type: keyof typeof profile, index: number) => setDeleteConfig({ isOpen: true, type, index });

  const confirmDelete = async () => {
    if (deleteConfig.index === null || !deleteConfig.type) return;
    const keyToUpdate = deleteConfig.type;
    const newProfile = { ...profile };
    (newProfile[keyToUpdate] as any[]) = (newProfile[keyToUpdate] as any[]).filter((_, i) => i !== deleteConfig.index);
    
    updateLocalProfile(newProfile);
    setDeleteConfig({ isOpen: false, type: "", index: null });
    await autoSaveToDatabase(newProfile, keyToUpdate);
  };

  const updateModalData = (key: string, val: string) => {
    setModalConfig(prev => ({ ...prev, data: { ...prev.data, [key]: val } }));
  };
  
  const updateModalDateAndCalc = (key: 'startDate'|'endDate', val: string) => {
    setModalConfig(prev => {
        const newData = { ...prev.data, [key]: val };
        if (newData.startDate && newData.endDate) newData.date = calculateDuration(newData.startDate, newData.endDate);
        return { ...prev, data: newData };
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-typewriter text-maroon text-xl">Loading dossier...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <TopNav />

      <main className="relative flex-1 pt-28 pb-16 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
          
          <div className="ornate-frame p-8 ornate-corners rotate-[-1deg] relative transition-all duration-300">
            {isMe && (
               <div className="absolute top-4 right-4 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-md border border-green-200 font-typewriter z-10 flex items-center gap-1.5 shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> AUTO-SAVE ON
               </div>
            )}
            
            <Field label="Name" value={profile.name} readOnly={!isMe} 
                   onChange={(val) => setProfile({...profile, name: val})} 
                   onBlur={() => saveBasicField('full_name', profile.name)} />
            
            <Field label="Role" value={profile.role} readOnly={!isMe} 
                   onChange={(val) => setProfile({...profile, role: val})} 
                   onBlur={() => saveBasicField('role', profile.role)} />
            
            <Field label="Address" value={profile.address} readOnly={!isMe} 
                   onChange={(val) => setProfile({...profile, address: val})} 
                   onBlur={() => saveBasicField('address', profile.address)} />
            
            <div className="mb-5">
              <span className="block font-typewriter text-sm text-maroon mb-1.5">About</span>
              <textarea
                rows={5} value={profile.about} 
                onChange={(e) => setProfile({...profile, about: e.target.value})} 
                onBlur={() => saveBasicField('about', profile.about)}
                readOnly={!isMe}
                className={`w-full px-4 py-3 rounded-md bg-transparent font-typewriter text-ink outline-none resize-none transition-all duration-200 border-2 border-dashed ${
                  !isMe ? "border-maroon/30 cursor-default" : "border-maroon/30 focus:border-solid focus:border-maroon focus:bg-maroon/5 hover:bg-black/5"
                }`}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <button onClick={handleDownloadCV} className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2 !bg-slate-800 !border-slate-900 !text-white hover:!bg-slate-700 hover:!text-white">
                <Download className="h-4 w-4" /> ATS CV
              </button>
              
              <button onClick={handleShareProfile} className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2 !bg-blue-800 !border-blue-900 !text-white hover:!bg-blue-700 hover:!text-white">
                <Share2 className="h-4 w-4" /> Share
              </button>

              {isMe && (
                  <Link to="/home" className="pill-btn !rounded-md !px-6 inline-flex items-center gap-2 !bg-paper !text-milk">
                    <Compass className="h-4 w-4" /> Discovery
                  </Link>
              )}
            </div>
          </div>

          <div className="relative rounded-xl p-6 min-h-[500px] overflow-hidden" style={{ background: "url('https://www.transparenttextures.com/patterns/cork-board.png'), #a07855", boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), var(--shadow-paper)" }}>
            <div className="absolute top-4 right-6 bg-paper p-2 pb-6 rotate-6 shadow-xl w-44 z-20 group transition-transform hover:rotate-0">
              <div className="h-28 bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm flex items-center justify-center relative overflow-hidden">
                {profile.avatar_url ? ( <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> ) : ( <span className="text-white/40 font-typewriter text-xs">Photo</span> )}
              </div>
              <span className="absolute -top-2 right-4 red-pin" />
            </div>
            
            <div className="absolute top-4 left-4 bg-paper rounded-md p-3 -rotate-12 shadow-xl z-20"><HelpCircle className="h-6 w-6 text-maroon" /></div>

            {/* DIPERBAIKI: Jarak pt-44 agar tidak tertabrak foto profil */}
            <div className="relative pt-44 grid grid-cols-2 gap-5 z-10">
              <PinnedCard className="w-full rotate-[-3deg] transition-transform hover:rotate-0">
                <p className="font-typewriter text-maroon text-sm font-bold">Total Exp.</p>
                {/* DIPERBAIKI: Penulisan grammar role tunggal vs jamak */}
                <p className="font-typewriter text-ink text-2xl">
                  {profile.experience?.length || 0} {(profile.experience?.length || 0) === 1 ? 'role' : 'roles'}
                </p>
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
              <button key={t} onClick={() => setTab(t)} className={`relative font-typewriter text-sm tracking-widest px-6 py-3 rounded-t-lg border-2 border-b-0 transition ${tab === t ? "bg-paper text-maroon border-maroon z-10" : "bg-maroon/40 text-paper border-paper/20 hover:bg-maroon/60"}`}>
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
            <Link to="/home" className="pill-btn !px-8 !py-3">
              &lt; Back to discovery
            </Link>
          </div>
        )}
      </main>

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-paper border-2 border-maroon rounded-xl w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-maroon px-6 py-4 flex justify-between items-center text-paper">
              <h2 className="font-typewriter text-lg font-bold tracking-widest uppercase">
                {modalConfig.index !== null ? "EDIT" : "ADD"} {modalConfig.type}
              </h2>
              <button onClick={closeModal} className="hover:text-red-300 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto space-y-4">
              
              {modalConfig.type === "tech" && (
                <>
                  <ModalField label="Skill Name (e.g. React.js)" value={modalConfig.data.name} onChange={(v) => updateModalData('name', v)} required />
                  <SelectField label="Experience" value={modalConfig.data.experience} options={['1 - 12 Months', '1 - 4 Years', '5+ Years']} onChange={(v) => updateModalData('experience', v)} required />
                  <SelectField label="Proficiency Level" value={modalConfig.data.level} options={['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert', 'Master']} onChange={(v) => updateModalData('level', v)} required />
                </>
              )}

              {modalConfig.type === "soft" && (
                <ModalField label="Soft Skill (e.g. Leadership)" value={modalConfig.data.name} onChange={(v) => updateModalData('name', v)} required />
              )}

              {modalConfig.type === "experience" && (
                <>
                  <ModalField label="Title / Role" value={modalConfig.data.title} onChange={(v) => updateModalData('title', v)} required />
                  <ModalField label="Organization / Company" value={modalConfig.data.subtitle} onChange={(v) => updateModalData('subtitle', v)} required />
                  <SelectField label="Duration" value={modalConfig.data.date} options={['1 - 6 Months', '7 - 12 Months', '1 - 2 Years', '3 - 4 Years', '5+ Years']} onChange={(v) => updateModalData('date', v)} required />
                  <TextAreaField label="Description" value={modalConfig.data.desc} onChange={(v) => updateModalData('desc', v)} required />
                </>
              )}

              {modalConfig.type === "education" && (
                <>
                  <ModalField label="School / University" value={modalConfig.data.title} onChange={(v) => updateModalData('title', v)} required />
                  <ModalField label="Degree / Field of Study" value={modalConfig.data.subtitle} onChange={(v) => updateModalData('subtitle', v)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <ModalField type="month" label="Start Date" value={modalConfig.data.startDate} onChange={(v) => updateModalDateAndCalc('startDate', v)} required />
                    <ModalField type="month" label="End Date" value={modalConfig.data.endDate} onChange={(v) => updateModalDateAndCalc('endDate', v)} required />
                  </div>
                  <ModalField label="Duration (Auto-calculated)" value={modalConfig.data.date} readOnly />
                  <TextAreaField label="Description" value={modalConfig.data.desc} onChange={(v) => updateModalData('desc', v)} required />
                </>
              )}

              {modalConfig.type === "project" && (
                <>
                  <ModalField label="Project Name" value={modalConfig.data.title} onChange={(v) => updateModalData('title', v)} required />
                  <ModalField label="Organization / Client" value={modalConfig.data.subtitle} onChange={(v) => updateModalData('subtitle', v)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <ModalField type="month" label="Start Date" value={modalConfig.data.startDate} onChange={(v) => updateModalDateAndCalc('startDate', v)} required />
                    <ModalField type="month" label="End Date" value={modalConfig.data.endDate} onChange={(v) => updateModalDateAndCalc('endDate', v)} required />
                  </div>
                  <ModalField label="Duration (Auto-calculated)" value={modalConfig.data.date} readOnly />
                  <TextAreaField label="Description" value={modalConfig.data.desc} onChange={(v) => updateModalData('desc', v)} required />
                </>
              )}

              {modalConfig.type === "certification" && (
                <>
                  <ModalField label="Certification Name" value={modalConfig.data.title} onChange={(v) => updateModalData('title', v)} required />
                  <ModalField label="Issuing Organization" value={modalConfig.data.subtitle} onChange={(v) => updateModalData('subtitle', v)} required />
                  <SelectField label="Level" value={modalConfig.data.level} options={['Beginner', 'Intermediate', 'Professional', 'Expert', 'Master']} onChange={(v) => updateModalData('level', v)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <ModalField type="month" label="Issue Date" value={modalConfig.data.startDate} onChange={(v) => updateModalDateAndCalc('startDate', v)} required />
                    <ModalField type="month" label="Expiration Date" value={modalConfig.data.endDate} onChange={(v) => updateModalDateAndCalc('endDate', v)} required />
                  </div>
                  <ModalField label="Validity Duration" value={modalConfig.data.date} readOnly />
                  <TextAreaField label="Description" value={modalConfig.data.desc} onChange={(v) => updateModalData('desc', v)} required />
                </>
              )}

              {modalConfig.type === "activity" && (
                <>
                  <ModalField label="Activity Name" value={modalConfig.data.title} onChange={(v) => updateModalData('title', v)} required />
                  <SelectField label="Activity Type" value={modalConfig.data.subtitle} options={['Organization', 'Self Activity', 'Volunteer']} onChange={(v) => updateModalData('subtitle', v)} required />
                  {modalConfig.data.subtitle === 'Organization' && (
                    <ModalField label="Organization Name" value={modalConfig.data.organization} onChange={(v) => updateModalData('organization', v)} required />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <ModalField type="month" label="Start Date" value={modalConfig.data.startDate} onChange={(v) => updateModalDateAndCalc('startDate', v)} required />
                    <ModalField type="month" label="End Date" value={modalConfig.data.endDate} onChange={(v) => updateModalDateAndCalc('endDate', v)} required />
                  </div>
                  <ModalField label="Duration (Auto-calculated)" value={modalConfig.data.date} readOnly />
                  <TextAreaField label="Description" value={modalConfig.data.desc} onChange={(v) => updateModalData('desc', v)} required />
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
              <AlertTriangle size={20} /> <h2 className="font-typewriter text-base font-bold tracking-widest uppercase">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="font-typewriter text-ink mb-6 text-sm leading-relaxed">Are you sure you want to permanently delete this record? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfig({isOpen: false, type: "", index: null})} className="px-4 py-2 font-typewriter text-sm font-bold text-ink hover:bg-black/5 rounded-md transition-colors">CANCEL</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-typewriter font-bold rounded-md shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> DELETE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// COMPONENTS HELPER
// ----------------------------------------------------

// DIPERBAIKI: Border dashed dipertahankan di readOnly mode
function Field({ label, value, readOnly = false, onChange, onBlur }: { label: string; value: string, readOnly?: boolean, onChange?: (val: string) => void, onBlur?: () => void }) {
  return (
    <div className="mb-4">
      <span className="block font-typewriter text-sm text-maroon mb-1.5">{label}</span>
      <div className="relative">
        <input value={value} 
          onChange={(e) => onChange && onChange(e.target.value)} 
          onBlur={onBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          readOnly={readOnly}
          className={`w-full px-4 py-2.5 rounded-md bg-transparent font-typewriter text-ink outline-none transition-all duration-200 border-2 border-dashed ${
            readOnly ? "border-maroon/30 cursor-default" : "border-maroon/30 focus:border-solid focus:border-maroon focus:bg-maroon/5 hover:bg-black/5"
          }`}
        />
        {!readOnly && <Edit3 className="absolute right-3 top-3 h-4 w-4 text-maroon/30 pointer-events-none" />}
      </div>
    </div>
  );
}

function ModalField({ label, type = "text", value, readOnly = false, required = false, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="font-typewriter text-sm font-bold text-maroon">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} readOnly={readOnly}
        className={`w-full px-3 py-2 border-2 border-maroon/30 rounded-md focus:outline-none focus:border-maroon bg-transparent font-typewriter text-ink ${readOnly ? 'bg-black/5 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange, required = false }: any) {
  return (
    <div className="space-y-1">
      <label className="font-typewriter text-sm font-bold text-maroon">{label} {required && <span className="text-red-500">*</span>}</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} className="w-full px-3 py-2 border-2 border-maroon/30 rounded-md focus:outline-none focus:border-maroon bg-transparent font-typewriter text-ink">
        <option value="" disabled>Select an option...</option>
        {options.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );
}

function TextAreaField({ label, value, onChange, required = false }: any) {
  return (
    <div className="space-y-1">
      <label className="font-typewriter text-sm font-bold text-maroon">{label} {required && <span className="text-red-500">*</span>}</label>
      <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} className="w-full px-3 py-2 border-2 border-maroon/30 rounded-md focus:outline-none focus:border-maroon bg-transparent font-typewriter text-ink resize-none" />
    </div>
  );
}

function SkillsContent({ profile, isMe, openModal, onDelete }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-3">
          <h3 className="font-typewriter text-maroon tracking-widest font-bold">TECHNICAL</h3>
          {isMe && ( <button onClick={() => openModal("tech")} className="text-maroon bg-maroon/5 hover:bg-maroon/10 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-bold font-typewriter"><Plus className="w-4 h-4" /> ADD</button> )}
        </div>
        
        <div className="space-y-3 font-sans">
          {profile.tech?.length === 0 ? <p className="text-sm text-slate-400 italic font-typewriter">No skills added.</p> : profile.tech?.map((s: any, index: number) => (
            <div key={index} className="relative group bg-slate-50 border border-slate-100 p-3 rounded-lg hover:shadow-sm transition-all">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{s.name}</span>
                <div className="text-right">
                    <span className="block text-xs font-bold text-maroon uppercase tracking-wide">{s.level || "Beginner"}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{s.experience || "-"}</span>
                </div>
              </div>
              {isMe && (
                <div className="absolute right-2 -top-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-200 bg-paper shadow-md border border-maroon/10 rounded-full p-1 z-10">
                  <button onClick={() => openModal("tech", index, s)} className="text-maroon hover:bg-maroon/10 p-1 rounded-full"><Edit3 size={14}/></button>
                  <button onClick={() => onDelete("tech", index)} className="text-red-600 hover:bg-red-50 p-1 rounded-full"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-3">
          <h3 className="font-typewriter text-maroon tracking-widest font-bold">SOFT SKILLS</h3>
          {isMe && ( <button onClick={() => openModal("soft")} className="text-maroon bg-maroon/5 hover:bg-maroon/10 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-bold font-typewriter"><Plus className="w-4 h-4" /> ADD</button> )}
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-3 font-sans mt-2">
          {profile.soft?.length === 0 ? <p className="text-sm text-slate-400 italic font-typewriter">No skills added.</p> : profile.soft?.map((s: any, index: number) => (
            <div key={index} className="relative group inline-block">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm inline-block border border-blue-100">{s.name || s}</span>
              {isMe && (
                <div className="absolute right-0 -top-4 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-paper shadow-md border border-maroon/10 rounded-full p-1 z-10">
                  <button onClick={() => openModal("soft", index, { name: s.name || s })} className="text-maroon hover:bg-maroon/10 p-1 rounded-full"><Edit3 size={12}/></button>
                  <button onClick={() => onDelete("soft", index)} className="text-red-600 hover:bg-red-50 p-1 rounded-full"><Trash2 size={12}/></button>
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
        {isMe && ( <button onClick={() => openModal(dataKey)} className="flex items-center gap-2 text-sm font-typewriter font-bold text-maroon bg-maroon/5 hover:bg-maroon/10 px-3 py-1.5 rounded-md transition-colors"><Plus size={16} /> ADD ENTRY</button> )}
      </div>

      {dataArray.length === 0 ? (
        <div className="text-ink/50 font-typewriter text-center py-12">No records found. Click add to create a new entry.</div>
      ) : (
        dataArray.map((item: any, i: number) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-black/5 relative group transition-all hover:shadow-md">
            <h4 className="font-bold text-slate-800 text-lg pr-16">
               {item.title} 
               {item.level && <span className="inline-block align-middle ml-3 px-2.5 py-0.5 rounded-full bg-maroon text-white text-[10px] uppercase font-bold tracking-wider">{item.level}</span>}
            </h4>
            
            <p className="text-sm text-maroon font-medium mt-1">
              {item.subtitle} {item.organization ? `· ${item.organization}` : ''} <span className="text-slate-400 font-normal">| {item.date}</span>
            </p>
            
            {item.desc && <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.desc}</p>}
            
            {isMe && (
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-200 translate-x-2 group-hover:translate-x-0 bg-paper shadow-sm border border-maroon/10 rounded-full p-1">
                  <button onClick={() => openModal(dataKey, i, item)} className="p-1.5 text-maroon hover:bg-maroon/10 rounded-full"><Edit3 size={16}/></button>
                  <button onClick={() => onDelete(dataKey, i)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={16}/></button>
               </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
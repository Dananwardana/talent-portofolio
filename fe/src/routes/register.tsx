import { PaperFrame } from "@/components/vintage/PaperFrame";
import { TopNav } from "@/components/vintage/TopNav";
import { VintageField } from "@/components/vintage/VintageField";
import { VintageUploadField } from "@/components/vintage/VintageUploadField";
import { supabase } from "@/lib/supabase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // STATE UNTUK CAPTCHA
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: "" });

  // Generate angka CAPTCHA acak saat halaman dimuat
  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
      answer: ""
    });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    // 1. Validasi Password
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    // 2. Validasi CAPTCHA
    if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) {
      setMessage({ type: "error", text: "Security Check failed. Incorrect math answer." });
      generateCaptcha(); // Reset captcha jika salah
      return;
    }

    setIsLoading(true);

    try {
      // 3. Upload Gambar (jika ada)
      let avatarUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const userIdentifier = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${userIdentifier}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
        if (uploadError) throw new Error("Gagal upload gambar: " + uploadError.message);
        
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = urlData.publicUrl;
      }

      // 4. Kirim ke Backend
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName: formData.fullName, 
          email: formData.email, 
          password: formData.password,
          avatarUrl 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Tampilkan pesan verifikasi email!
        setMessage({ 
          type: "success", 
          text: "Dossier created! We have sent a verification link to your email. Please verify your email before logging in." 
        });
        
        // Redirect ke login setelah 5 detik agar user sempat membaca pesan
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 5000);
      } else {
        throw new Error(result.error || "Gagal registrasi ke server");
      }
      
    } catch (err: any) {
      console.error("Registrasi Error:", err);
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan yang tidak diketahui" });
      generateCaptcha(); // Reset captcha jika registrasi gagal
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-16">
      <TopNav />
      <PaperFrame className="max-w-md mx-auto relative overflow-hidden">
        
        <h1 className="font-typewriter text-3xl text-center text-maroon mb-2">REGISTER</h1>
        <p className="font-typewriter text-sm text-center text-ink/60 mb-6 border-b border-maroon/20 pb-4">
          Create your professional dossier.
        </p>

        {/* Notifikasi Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md font-typewriter text-sm flex gap-3 items-start border-2 ${
            message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'
          }`}>
            {message.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <VintageField label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          <VintageField label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <VintageField label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <VintageField label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          
          <div className="pt-2">
            <VintageUploadField label="Profile Picture (Optional)" onFileSelect={(file) => setFile(file)} />
          </div>

          {/* VINTAGE MATH CAPTCHA */}
          <div className="bg-maroon/5 p-4 rounded-lg border-2 border-dashed border-maroon/30 mt-4 relative">
            <span className="block font-typewriter text-sm font-bold text-maroon mb-2 uppercase tracking-widest">
              Security Check
            </span>
            <div className="flex items-center gap-3">
              <span className="font-typewriter text-lg text-ink font-bold bg-white px-3 py-1.5 rounded border border-maroon/20">
                {captcha.num1} + {captcha.num2} = 
              </span>
              <input 
                type="number" 
                required
                value={captcha.answer}
                onChange={(e) => setCaptcha({...captcha, answer: e.target.value})}
                placeholder="?"
                className="w-20 px-3 py-2 bg-transparent border-b-2 border-maroon focus:outline-none focus:border-maroon-deep font-typewriter text-lg text-center"
              />
              <button 
                type="button" 
                onClick={generateCaptcha}
                className="ml-auto p-2 text-maroon/60 hover:text-maroon transition-colors"
                title="Refresh CAPTCHA"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="pill-btn w-full !py-3 mt-6 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading ? (
               <>
                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                 PROCESSING...
               </>
            ) : "CREATE DOSSIER"}
          </button>
        </form>
      </PaperFrame>
    </div>
  );
}
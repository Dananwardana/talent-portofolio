import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PaperFrame } from "@/components/vintage/PaperFrame";
import { TopNav } from "@/components/vintage/TopNav";
import { VintageField } from "@/components/vintage/VintageField";
import { VintageUploadField } from "@/components/vintage/VintageUploadField";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [file, setFile] = useState<File | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validasi Password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // 2. Upload Gambar (jika ada)
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

      // 3. Kirim ke Backend
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

      // 4. Tangkap pesan error dari backend
      const result = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil!");
        navigate({ to: "/login" });
      } else {
        // Ini akan menampilkan pesan error asli (misal: "User already exists")
        throw new Error(result.error || "Gagal registrasi ke server");
      }
      
    } catch (err: any) {
      console.error("Registrasi Error:", err);
      alert(err.message || "Terjadi kesalahan yang tidak diketahui");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6">
      <TopNav />
      <PaperFrame className="max-w-md mx-auto">
        <h1 className="font-typewriter text-3xl text-center text-maroon mb-6">REGISTER</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <VintageField label="Full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          <VintageField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <VintageField label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <VintageField label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          
          <VintageUploadField label="Profile Picture" onFileSelect={(file) => setFile(file)} />
          
          <button type="submit" className="pill-btn w-full !py-3 mt-4">REGISTER</button>
        </form>
      </PaperFrame>
    </div>
  );
}
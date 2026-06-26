import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

export function VintageUploadField({ label, onFileSelect }: { label: string, onFileSelect: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null); // Reset error setiap kali pilih file baru

    if (file) {
      // Validasi format file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError("Only JPG, JPEG, and PNG files are allowed.");
        onFileSelect(null);
        return;
      }

      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block font-typewriter text-sm text-maroon mb-1">{label}</label>
      
      {/* Area Dropzone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer flex flex-col items-center justify-center gap-2
          ${error ? "border-red-500 bg-red-50" : preview ? "border-maroon/50 bg-maroon/5" : "border-maroon/30 hover:border-maroon hover:bg-maroon/5"}`}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
        
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-maroon/30" />
            <button 
              onClick={(e) => { e.stopPropagation(); setPreview(null); onFileSelect(null); }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-sm"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <>
            <Upload className={error ? "text-red-500" : "text-maroon/50"} size={24} />
            <span className="font-typewriter text-xs text-maroon/70 text-center">
              {error ? <span className="text-red-600 font-bold">{error}</span> : "Click to upload JPG/PNG"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
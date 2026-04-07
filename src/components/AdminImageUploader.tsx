"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminImageUploader({
  value,
  onChange,
  className = "",
  label = "Subir Imagen (.png, se convierte a .webp)",
}: {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_SIZE_MB = 2;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const convertPngToWebp = async (file: File): Promise<Blob> => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("No se pudo procesar la imagen seleccionada."));
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(imageUrl);
      throw new Error("No se pudo inicializar el procesador de imágenes.");
    }

    ctx.drawImage(img, 0, 0);

    const qualitySteps = [0.92, 0.85, 0.78, 0.7, 0.62, 0.55, 0.5];
    let lastBlob: Blob | null = null;

    for (const quality of qualitySteps) {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/webp", quality);
      });

      if (!blob) {
        URL.revokeObjectURL(imageUrl);
        throw new Error("Tu navegador no pudo convertir la imagen a WebP.");
      }

      lastBlob = blob;
      if (blob.size <= MAX_SIZE_BYTES) {
        URL.revokeObjectURL(imageUrl);
        return blob;
      }
    }

    URL.revokeObjectURL(imageUrl);
    if (!lastBlob) throw new Error("No se pudo convertir la imagen.");
    return lastBlob;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // VALIDACIONES DEL ARCHIVO SEGUN REQUERIMIENTOS
    setError("");
    
    // 1. Validar extensión PNG
    if (file.type !== "image/png") {
      setError("Solo se permiten archivos en formato .png");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Opcional: Validar dimensiones (cargando la imagen en un objeto Image temporal)
    // const img = new Image();
    // img.src = URL.createObjectURL(file);
    // await new Promise((resolve) => {
    //   img.onload = () => {
    //     if (img.width > 2000 || img.height > 2000) { ... }
    //     resolve(true); 
    //   };
    // });

    setUploading(true);

    try {
      // Convertimos PNG -> WebP y validamos tamaño final
      const webpBlob = await convertPngToWebp(file);
      if (webpBlob.size > MAX_SIZE_BYTES) {
        setError(`La imagen sigue pesando demasiado incluso optimizada. El límite es de ${MAX_SIZE_MB}MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const webpFile = new File(
        [webpBlob],
        `${file.name.replace(/\.[^.]+$/, "")}.webp`,
        { type: "image/webp" }
      );

      // Usar fecha/tiempo para crear un nombre único y evitar sobrescribir (caché)
      const fileExt = "webp";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, webpFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública de forma permanente
      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      const url = publicUrlData.publicUrl;
      onChange(url);

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al subir la imagen";
      setError(message);
    } finally {
      setUploading(false);
      // Reset input para permitir subir la misma imagen en caso de error
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative group rounded-xl border border-gray-200 overflow-hidden bg-gray-50 aspect-video flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onChange("")}
              type="button"
              className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm shadow hover:bg-red-50 hover:text-red-700"
            >
              Borrar Imagen
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`
            border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${uploading ? "border-gray-300 bg-gray-50" : "border-[#5c29c2]/30 hover:border-[#5c29c2] bg-white hover:bg-[#5c29c2]/5"}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-[#f5f0ff] text-[#5c29c2] flex items-center justify-center mb-3">
            {uploading ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {uploading ? "Subiendo..." : label}
          </span>
          <span className="text-xs text-gray-500 mt-1">Máximo 2MB.</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 mt-2 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// RUTA: src/components/FloatingDonateButton.tsx
"use client";
import Link from "next/link";

export default function FloatingDonateButton() {
  return (
    <Link
      href="/dona"
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-[#29f0b4] text-[#5c29c2] px-6 py-4 rounded-full font-extrabold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group opacity-100 translate-y-0"
    >
      <span className="text-xl group-hover:animate-bounce">❤️</span>
      <span className="text-sm tracking-tight">Doná</span>
    </Link>
  );
}


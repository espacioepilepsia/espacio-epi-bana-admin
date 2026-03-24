// RUTA: src/components/FadeIn.tsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  // Para evitar secciones en blanco si el IntersectionObserver tarda,
  // asumimos que después de 1 segundo forzamos la visibilidad.
  useEffect(() => {
    const fallback = setTimeout(() => setInView(true), 1000);

    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Solo animar la primera vez
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(ref.current);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

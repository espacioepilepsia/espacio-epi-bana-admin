// RUTA: src/components/TestimonialsSection.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FadeIn from "./FadeIn";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_emoji: string;
};

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, role, content, avatar_emoji")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  // Auto-advance carousel every 6s
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-40 w-full bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const t = items[active];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
            Voces de nuestra{" "}
            <span
              style={{ color: "#5c29c2" }}
              className="relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-1 after:bg-[#29f0b4] after:rounded-full"
            >
              comunidad
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Personas con epilepsia, familiares y voluntarios que forman parte de Espacio Epilepsia.
          </p>
        </FadeIn>

        {/* Card */}
        <FadeIn>
          <div
            key={t.id}
            className="relative bg-[#f5f0ff] rounded-3xl p-8 md:p-12 text-center shadow-sm border border-[#5c29c2]/10 transition-all duration-500"
          >
            {/* Quote mark */}
            <div
              className="absolute top-6 left-8 text-7xl font-extrabold select-none leading-none"
              style={{ color: "#5c29c2", opacity: 0.08 }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <div className="text-5xl mb-4">{t.avatar_emoji}</div>

            <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 max-w-2xl mx-auto italic relative z-10">
              &ldquo;{t.content}&rdquo;
            </blockquote>

            <div>
              <p className="font-extrabold text-gray-900">{t.name}</p>
              <p className="text-sm text-[#5c29c2] font-semibold mt-1">{t.role}</p>
            </div>
          </div>
        </FadeIn>

        {/* Dots navigation */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonio ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === active
                    ? "bg-[#5c29c2] w-6"
                    : "bg-gray-300 w-2.5 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

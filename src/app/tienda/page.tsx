"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  mercadopago_url: string | null;
  category: string;
  display_order: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-100" />
      <div className="p-5">
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = [
    { key: "todos", label: "Todos" },
    { key: "remera", label: "Remeras" },
    { key: "taza", label: "Tazas" },
  ];

  const filtered = filter === "todos" ? products : products.filter((p) => p.category === filter);

  return (
    <main>
      {/* NAVBAR */}
      <Navbar />
         

      {/* HERO */}
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider">
            🛍️ Tienda oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Tienda Espacio Epilepsia
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Productos con diseño exclusivo. Cada compra apoya nuestra misión de informar y contener.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="bg-white border-b border-gray-100 sticky top-[70px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-sm text-gray-400 mr-2">Filtrar:</span>
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                filter === key
                  ? "bg-[#5c29c2] text-white border-[#5c29c2]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#5c29c2] hover:text-[#5c29c2]"
              }`}
            >
              {label}
              {key !== "todos" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({products.filter((p) => p.category === key).length})
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* PRODUCTOS */}
      <section className="py-16 px-6 bg-[#f5f0ff] min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              No hay productos en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all group"
                >
                  {/* Imagen */}
                  <div className="w-full h-56 bg-[#f5f0ff] flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#5c29c2]/30">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9l4-4 4 4 4-4 4 4" /><path d="M3 15l4 4 4-4 4 4 4-4" /></svg>
                        <span className="text-xs font-medium">Imagen próximamente</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-xs font-bold text-[#5c29c2] uppercase tracking-wide">
                      {product.category === "remera" ? "Remera" : product.category === "taza" ? "Taza" : "Producto"}
                    </span>
                    <h3 className="font-bold text-base mt-1 mb-2 leading-snug">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-400 mb-3 leading-relaxed">{product.description}</p>
                    )}
                    <p className="text-2xl font-extrabold text-[#5c29c2] mb-4 tracking-tight">
                      {formatPrice(product.price)}
                    </p>

                    {product.mercadopago_url ? (
                      <a
                        href={product.mercadopago_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all text-sm"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                        Comprar en Mercado Pago
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-3 rounded-xl text-sm cursor-not-allowed"
                      >
                        Próximamente
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ background: "#5c29c2" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">¿Querés apoyar de otra forma?</h2>
          <p className="text-white/70 mb-6">Podés hacer una donación directa o sumarte como voluntario a nuestra comunidad.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/dona" className="bg-white text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all">
              Doná ahora
            </Link>
            <Link href="/sumate" className="bg-transparent text-white font-bold px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
              Sumate
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="bg-[#0f0a1e] text-white/40 py-6 px-6 text-center text-xs">
        <span>© 2025 Espacio Epilepsia · <span className="text-[#a78bfa]">#SinEstigmas</span></span>
      </footer>
    </main>
  );
}
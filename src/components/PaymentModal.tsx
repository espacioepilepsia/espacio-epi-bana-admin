"use client";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-[#5c29c2]/20">
        <div className="bg-[#5c29c2] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Opciones de pago</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <a href="https://link.mercadopago.com.ar/espacioepilepsia" target="_blank" rel="noopener noreferrer" className="bg-[#009EE3]/10 hover:bg-[#009EE3]/20 border border-[#009EE3]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all group">
               <span className="font-bold text-[#009EE3] text-sm group-hover:scale-105 transition-transform">Mercado Pago</span>
            </a>
            <a href="https://cafecito.app/espacioepilepsia" target="_blank" rel="noopener noreferrer" className="bg-[#00d075]/10 hover:bg-[#00d075]/20 border border-[#00d075]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all group">
               <span className="font-bold text-[#00d075] text-sm group-hover:scale-105 transition-transform">Cafecito</span>
            </a>
          </div>

          <div className="relative flex py-2 items-center">
             <div className="flex-grow border-t border-gray-200"></div>
             <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">O Transferencia</span>
             <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Transferencia Banco Macro */}
          <div className={`border rounded-2xl overflow-hidden transition-all ${openAccordion === 'macro' ? "border-[#5c29c2]" : "border-gray-100 hover:border-[#5c29c2]/30"}`}>
            <button onClick={() => toggleAccordion('macro')} className="w-full flex items-center justify-between p-4 bg-[#fcfaff]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏦</span>
                <span className="font-bold text-gray-900 text-sm">Transferencia — Banco Macro</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openAccordion === 'macro' ? "rotate-180 text-[#5c29c2]" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openAccordion === 'macro' && (
              <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                {[
                  { label: "Titular", value: "FUND ESPACIO EPILEPSIA", id: "titular-macro" },
                  { label: "CUIT", value: "30717208882", id: "cuit-macro" },
                  { label: "CBU", value: "2850381140095383389068", id: "cbu-macro" },
                  { label: "Alias", value: "ESPACIO.EPILEPSIA", id: "alias-macro" }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl">
                    <div>
                      <span className="text-xs text-gray-500 block">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                    <button onClick={() => handleCopy(item.value, item.id)} className="text-[#5c29c2] bg-[#5c29c2]/10 hover:bg-[#5c29c2]/20 p-2 rounded-lg transition-colors" title="Copiar">
                      {copiedField === item.id ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transferencia Mercado Pago */}
          <div className={`border rounded-2xl overflow-hidden transition-all ${openAccordion === 'mp' ? "border-[#5c29c2]" : "border-gray-100 hover:border-[#5c29c2]/30"}`}>
            <button onClick={() => toggleAccordion('mp')} className="w-full flex items-center justify-between p-4 bg-[#fcfaff]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤝</span>
                <span className="font-bold text-gray-900 text-sm">Transferencia — Mercado Pago</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openAccordion === 'mp' ? "rotate-180 text-[#5c29c2]" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openAccordion === 'mp' && (
              <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                {[
                  { label: "Titular", value: "Fundación Espacio Epilepsia", id: "titular-mp" },
                  { label: "CUIT", value: "30717208882", id: "cuit-mp" },
                  { label: "CVU", value: "0000003100062319228807", id: "cvu-mp" },
                  { label: "Alias", value: "espacio.epilepsia.mp", id: "alias-mp" }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl">
                    <div>
                      <span className="text-xs text-gray-500 block">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                    <button onClick={() => handleCopy(item.value, item.id)} className="text-[#5c29c2] bg-[#5c29c2]/10 hover:bg-[#5c29c2]/20 p-2 rounded-lg transition-colors" title="Copiar">
                      {copiedField === item.id ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

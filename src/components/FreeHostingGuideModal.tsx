import React from 'react';
import { Globe, X, Check, Copy, ExternalLink, Zap, Terminal, ShieldCheck } from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export const FreeHostingGuideModal: React.FC<Props> = ({ aberto, onFechar }) => {
  const [copiado, setCopiado] = React.useState<string | null>(null);

  if (!aberto) return null;

  const copiarTexto = (texto: string, chave: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(chave);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-xl rounded-3xl p-5 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Globe className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Hospedagem & Domínio Gratuito
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  100% Free
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Publique seu app em 1 minuto e obtenha link HTTPS instalável no celular
              </p>
            </div>
          </div>

          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          {/* Opção 1: Vercel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-black text-white font-black flex items-center justify-center border border-white/20">
                  ▲
                </span>
                <h4 className="font-bold text-sm text-white">Opção 1: Vercel (Recomendada - Instantânea)</h4>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                Domínio .vercel.app
              </span>
            </div>
            <p className="text-slate-400">
              Gera automaticamente um link público HTTPS com certificado SSL gratuito e PWA ativo.
            </p>
            <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-emerald-400">
              <span>npx vercel --prod</span>
              <button
                onClick={() => copiarTexto('npx vercel --prod', 'vercel')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                title="Copiar comando"
              >
                {copiado === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Opção 2: Firebase Hosting */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
                  🔥
                </span>
                <h4 className="font-bold text-sm text-white">Opção 2: Firebase Hosting</h4>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                Domínio .web.app
              </span>
            </div>
            <p className="text-slate-400">
              Infraestrutura Google Cloud com CDN global para carregar os GIFs em loop instantaneamente.
            </p>
            <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-amber-400">
              <span>npm run build && firebase deploy</span>
              <button
                onClick={() => copiarTexto('npm run build && firebase deploy', 'firebase')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                title="Copiar comando"
              >
                {copiado === 'firebase' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Requisitos PWA Atendidos */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Infraestrutura de Instalação Já Pronta no Projeto:
            </h5>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span><strong>manifest.json</strong> configurado com standalone, portrait e cor #0b0f19.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span><strong>Ícones 192x192 e 512x512</strong> prontos em /public para ícone na tela do celular.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span><strong>Service Worker (sw.js)</strong> com cache offline ativado e auto-registro.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span><strong>LocalStorage</strong> reativo para treinos, hidratação e refeições.</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onFechar}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer shadow-md"
        >
          Fechar Guia
        </button>
      </div>
    </div>
  );
};

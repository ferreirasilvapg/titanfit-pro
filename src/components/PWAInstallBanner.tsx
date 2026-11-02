import React, { useState, useEffect } from 'react';
import {
  assinarStatusInstalacao,
  dispararInstalacaoPWA,
  obterStatusInstalacao,
} from '../core/titanCore.js';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [status, setStatus] = useState(obterStatusInstalacao());
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [foiFechado, setFoiFechado] = useState(false);

  useEffect(() => {
    const cancelar = assinarStatusInstalacao(setStatus);
    return () => {
      cancelar();
    };
  }, []);

  // Se já está instalado em modo standalone nativo, oculta o banner
  if (status.estaInstalado || foiFechado) {
    return null;
  }

  const handleInstalar = async () => {
    if (status.podeInstalar) {
      await dispararInstalacaoPWA();
    } else if (status.ehIOS) {
      setShowIOSModal(true);
    } else {
      // Instrução padrão para navegadores de desktop ou outros
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-b border-emerald-500/30 px-4 py-2.5 shadow-lg backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 flex-shrink-0 shadow-md">
              <img
                src="/icon.svg"
                alt="TitanFit Ícone"
                className="w-full h-full rounded-[10px] object-cover bg-[#0b0f19]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide">
                  Instalar TitanFit no Celular
                </span>
                <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  PWA 100% Grátis
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Acesse offline com ícone na tela inicial sem precisar de loja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstalar}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
            <button
              onClick={() => setFoiFechado(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
              title="Dispensar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Guia de Instalação para iOS / Navegadores sem prompt direto */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl relative text-left">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 flex-shrink-0 shadow-lg">
                <img
                  src="/icon.svg"
                  alt="TitanFit Ícone"
                  className="w-full h-full rounded-[14px] bg-[#0b0f19] object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instalar TitanFit</h3>
                <p className="text-xs text-slate-400">Direto na sua tela inicial</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-sm text-slate-200">
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-xs text-white">Toque no botão Compartilhar</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    No Safari (iOS), clique no ícone <Share2 className="w-3.5 h-3.5 text-cyan-400 inline" /> na barra inferior.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-xs text-white">Adicionar à Tela de Início</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    Role a lista e selecione <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> "Adicionar à Tela de Início".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-xs text-white">Pronto para Usar</p>
                  <p className="text-xs text-slate-400">
                    O ícone aparecerá como um app da loja, com suporte offline e sem barras de navegação!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition text-sm cursor-pointer"
            >
              Entendi, Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import {
  obterDadosDiarios,
  adicionarAgua,
  resetarAgua,
  subscreverEstado,
} from '../core/titanCore.js';
import { Droplets, Plus, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const HydrationTracker: React.FC = () => {
  const [dados, setDados] = useState(obterDadosDiarios());

  useEffect(() => {
    const atualizar = () => setDados(obterDadosDiarios());
    atualizar();
    const cancelar = subscreverEstado(atualizar);
    return () => {
      cancelar();
    };
  }, []);

  const metaMl = dados.metaAguaMl || 3000;
  const atualMl = dados.aguaMl || 0;
  const porcentagem = Math.min(100, Math.round((atualMl / metaMl) * 100));
  const faltaMl = Math.max(0, metaMl - atualMl);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-inner">
              <Droplets className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Rastreador de Hidratação
                {porcentagem >= 100 && (
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Meta Batida!
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Meta diária fixa: <strong className="text-cyan-400">{metaMl} ml</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => resetarAgua()}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
            title="Resetar contador do dia"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Resetar</span>
          </button>
        </div>

        {/* Barra de Progresso e Estatísticas de Água */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 mb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-3xl font-black text-cyan-400">{atualMl}</span>
              <span className="text-xs font-semibold text-slate-400 ml-1">/ {metaMl} ml</span>
            </div>
            <span className="text-sm font-black text-cyan-300">{porcentagem}%</span>
          </div>

          {/* Barra Animada com Gradiente Fluido */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              style={{ width: `${porcentagem}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>
              {faltaMl > 0 ? `Faltam ${faltaMl} ml para atingir 3L` : 'Hidratação ideal concluída!'}
            </span>
            <span className="text-slate-400">
              {dados.copos?.length || 0} registros hoje
            </span>
          </div>
        </div>

        {/* Botões Rápidos de Hidratação */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => adicionarAgua(250)}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-b from-slate-800 to-slate-850 hover:from-cyan-950 hover:to-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white font-bold py-2.5 px-2 rounded-xl text-xs transition active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+250 ml (Copo)</span>
          </button>

          <button
            onClick={() => adicionarAgua(500)}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-b from-slate-800 to-slate-850 hover:from-cyan-950 hover:to-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white font-bold py-2.5 px-2 rounded-xl text-xs transition active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+500 ml (Garrafa)</span>
          </button>

          <button
            onClick={() => adicionarAgua(1000)}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-b from-slate-800 to-slate-850 hover:from-cyan-950 hover:to-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white font-bold py-2.5 px-2 rounded-xl text-xs transition active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+1000 ml (1 Litro)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

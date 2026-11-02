import React, { useState } from 'react';
import {
  PlanoTreinoPersonalizado,
  SessaoTreinoPersonalizado,
  ExercicioAdaptado,
} from '../core/titanWorkoutAdapter';
import { BiomechanicalExerciseCard } from './BiomechanicalExerciseCard';
import {
  Activity,
  ShieldCheck,
  Sparkles,
  Flame,
  RotateCcw,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  plano: PlanoTreinoPersonalizado | null;
  onAbrirQuestionario: () => void;
}

export const PersonalizedWorkoutView: React.FC<Props> = ({
  plano,
  onAbrirQuestionario,
}) => {
  const [sessaoIndex, setSessaoIndex] = useState(0);

  if (!plano || !plano.sessoes || plano.sessoes.length === 0) {
    return (
      <div className="bg-[#111827] border border-purple-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-emerald-500 p-0.5 shadow-xl shadow-purple-500/20">
          <div className="w-full h-full bg-[#0b0f19] rounded-[22px] flex items-center justify-center">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full">
            Recurso Premium VIP
          </span>
          <h3 className="text-xl font-black text-white">
            Avaliação Articular & Treino 100% Personalizado
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Responda nosso questionário biomecânico rápido. Se você tem dores nos joelhos, hérnia lombar, desconforto nos ombros ou punhos, o TitanFit substitui automaticamente exercícios contraindicados por movimentos seguros.
          </p>
        </div>

        <button
          onClick={onAbrirQuestionario}
          className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Fazer Avaliação Articular Agora</span>
        </button>
      </div>
    );
  }

  const sessaoAtual: SessaoTreinoPersonalizado = plano.sessoes[sessaoIndex] || plano.sessoes[0];

  return (
    <div className="space-y-5">
      {/* Banner Resumo da Prescrição Clínica */}
      <div className="bg-gradient-to-r from-[#161226] via-[#111827] to-[#0b1f1c] border border-purple-500/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">
                  Treino Personalizado Anti-Lesão Ativo
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded font-bold">
                  100% ADAPTADO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Prescrito em {plano.geradoEm} • {plano.sessoes.length} divisões de treino
              </p>
            </div>
          </div>

          <button
            onClick={onAbrirQuestionario}
            className="self-start sm:self-auto text-xs font-bold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Refazer Avaliação</span>
          </button>
        </div>

        {/* Parecer das Adaptações Biomecânicas */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-xs">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Diagnóstico e Salvaguardas em Vigor:
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {plano.resumoPrescricao}
          </p>
        </div>
      </div>

      {/* Seletor de Sessões de Treino (Treino A, Treino B, Treino C) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {plano.sessoes.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setSessaoIndex(idx)}
            className={`flex-1 min-w-[150px] p-3 rounded-2xl border text-left transition cursor-pointer ${
              sessaoIndex === idx
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-black truncate">{s.titulo}</div>
            <div
              className={`text-[10px] truncate ${
                sessaoIndex === idx ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.exercicios.length} exercícios adaptados
            </div>
          </button>
        ))}
      </div>

      {/* Detalhes da Sessão Selecionada */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-black text-white">{sessaoAtual.titulo}</h4>
          <p className="text-xs text-slate-400">{sessaoAtual.subtitulo}</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {sessaoAtual.exercicios.length} Movimentos Seguros
        </span>
      </div>

      {/* Lista de Exercícios com GIF e Card de Adaptação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sessaoAtual.exercicios.map((ex) => (
          <div key={ex.id} className="space-y-2">
            {/* Tag de Alerta Ortopédico Específico */}
            <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-xs flex items-center justify-between gap-2">
              <span className="font-bold text-purple-300 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {ex.protecaoTag}
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                {ex.nivel}
              </span>
            </div>

            {/* Card Biomecânico */}
            <BiomechanicalExerciseCard exercicio={ex as any} />

            {/* Explicação da Adaptação Ortopédica */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400">
              <strong className="text-emerald-400 font-semibold">Por que este exercício foi escolhido: </strong>
              {ex.motivoAdaptacao}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

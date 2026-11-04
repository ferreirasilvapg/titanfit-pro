import React, { useState, useEffect } from 'react';
import {
  obterDadosDiarios,
  calcularTotaisMacros,
  removerConsumoMacro,
  subscreverEstado,
} from '../core/titanCore.js';
import {
  Flame,
  Dna,
  Wheat,
  Droplet,
  Droplets,
  Salad,
  Trash2,
  PieChart,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  onAbrirCameraIA: () => void;
  onAbrirBuscaManual: (categoriaPadrao?: string) => void;
}

export const MacroConsumptionChart: React.FC<Props> = ({
  onAbrirCameraIA,
  onAbrirBuscaManual,
}) => {
  const [dados, setDados] = useState(obterDadosDiarios());
  const [totais, setTotais] = useState(calcularTotaisMacros());

  const atualizar = () => {
    setDados(obterDadosDiarios());
    setTotais(calcularTotaisMacros());
  };

  useEffect(() => {
    atualizar();
    const cancelar = subscreverEstado(atualizar);
    return () => {
      cancelar();
    };
  }, []);

  const metas = dados.metas || {
    calorias: 2300,
    proteinas: 160,
    carboidratos: 250,
    gorduras: 65,
    fibras: 35,
  };

  const pctCal = Math.min(100, Math.round((totais.calorias / metas.calorias) * 100));
  const calRestantes = Math.max(0, metas.calorias - totais.calorias);

  const macros = [
    {
      nome: 'Proteínas',
      atual: totais.proteinas,
      meta: metas.proteinas,
      unidade: 'g',
      corTexto: 'text-emerald-400',
      corBg: 'bg-emerald-500',
      icone: Dna,
    },
    {
      nome: 'Carboidratos',
      atual: totais.carboidratos,
      meta: metas.carboidratos,
      unidade: 'g',
      corTexto: 'text-cyan-400',
      corBg: 'bg-cyan-500',
      icone: Wheat,
    },
    {
      nome: 'Gorduras',
      atual: totais.gorduras,
      meta: metas.gorduras,
      unidade: 'g',
      corTexto: 'text-rose-400',
      corBg: 'bg-rose-500',
      icone: Droplet,
    },
    {
      nome: 'Fibras',
      atual: totais.fibras,
      meta: metas.fibras,
      unidade: 'g',
      corTexto: 'text-purple-400',
      corBg: 'bg-purple-500',
      icone: Salad,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Card do Painel de Macros & Gráfico de Calorias */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Consumo Diário de Macros</h3>
              <p className="text-xs text-slate-400">Balanço calórico e distribuição energética</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAbrirCameraIA}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Câmera IA</span>
            </button>
            <button
              onClick={() => onAbrirBuscaManual('bebida')}
              className="bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-blue-500/40 transition cursor-pointer flex items-center gap-1 shadow-sm"
              title="Registrar água, sucos, leite, café, refrigerante, cerveja, whey ou azeite"
            >
              <Droplets className="w-3.5 h-3.5 text-blue-300" />
              <span>+ Bebida / Líquido</span>
            </button>
            <button
              onClick={() => onAbrirBuscaManual('todos')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1"
            >
              <span>+ Alimento</span>
            </button>
          </div>
        </div>

        {/* Gráfico Radial & Números de Calorias */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-5">
            {/* Medidor Circular de Calorias */}
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#calorieGradient)"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * pctCal) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white">{totais.calorias}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">kcal</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Meta Estabelecida</div>
              <div className="text-lg font-black text-white">{metas.calorias} kcal</div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                {calRestantes > 0 ? `${calRestantes} kcal restantes` : 'Meta de energia atingida!'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{pctCal}% do total do dia</div>
            </div>
          </div>

          {/* Barras Horizontais dos 4 Macronutrientes */}
          <div className="w-full md:w-3/5 space-y-2.5">
            {macros.map((m) => {
              const Icone = m.icone;
              const pct = Math.min(100, Math.round((m.atual / m.meta) * 100));

              return (
                <div key={m.nome} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <Icone className={`w-3.5 h-3.5 ${m.corTexto}`} />
                      {m.nome}
                    </span>
                    <span className="font-bold text-white">
                      <span className={m.corTexto}>{m.atual}</span>
                      <span className="text-slate-400 font-normal"> / {m.meta} {m.unidade}</span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${m.corBg} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diário das Refeições do Dia */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Refeições Registradas Hoje ({dados.refeicoes?.length || 0})</span>
            <span>Macros</span>
          </div>

          {dados.refeicoes && dados.refeicoes.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {dados.refeicoes.map((ref: any) => (
                <div
                  key={ref.id}
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{ref.nome}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ref.horario}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                      <span className="text-amber-400 font-bold">{ref.calorias} kcal</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">P: {ref.proteinas}g</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-semibold">C: {ref.carboidratos}g</span>
                      <span>•</span>
                      <span className="text-rose-400 font-semibold">G: {ref.gorduras}g</span>
                      <span>•</span>
                      <span className="text-purple-400 font-semibold">Fib: {ref.fibras || 0}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removerConsumoMacro(ref.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
                    title="Excluir refeição"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4 bg-slate-900/40 rounded-xl">
              Nenhuma refeição registrada hoje. Use a Câmera IA ou a Base Global.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

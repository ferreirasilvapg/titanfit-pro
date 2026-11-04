import React, { useState, useEffect } from 'react';
import {
  X,
  Dumbbell,
  Sparkles,
  Calendar,
  Check,
  Layers,
  Flame,
} from 'lucide-react';
import { TreinoParticular } from '../core/titanCustomWorkouts';

interface Props {
  treinoParaEditar?: TreinoParticular | null;
  onSalvar: (dados: {
    id?: string;
    titulo: string;
    foco: string;
    descricao?: string;
    diasSemana?: string[];
  }) => void;
  onFechar: () => void;
}

const PRESETS_RAPIDOS = [
  { titulo: 'Treino A • Peito, Ombros & Tríceps (Push)', foco: 'Hipertrofia Superior (Empurrar)' },
  { titulo: 'Treino B • Costas, Bíceps & Posterior (Pull)', foco: 'Dorsais & Força de Tração' },
  { titulo: 'Treino C • Pernas Completas & Glúteos (Legs)', foco: 'Membros Inferiores & Força' },
  { titulo: 'Treino D • Ombros & Braços Foco Isolado', foco: 'Deltoides, Bíceps e Tríceps' },
  { titulo: 'Treino E • Glúteos & Posterior Ênfase', foco: 'Cadeia Posterior e Estabilidade' },
  { titulo: 'Treino Full Body • Corpo Inteiro Metabólico', foco: 'Gasto Calórico e Condicionamento' },
];

const DIAS_DISPONIVEIS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const CreateEditWorkoutModal: React.FC<Props> = ({
  treinoParaEditar,
  onSalvar,
  onFechar,
}) => {
  const [titulo, setTitulo] = useState(treinoParaEditar?.titulo || '');
  const [foco, setFoco] = useState(treinoParaEditar?.foco || 'Hipertrofia e Cargas Progressivas');
  const [descricao, setDescricao] = useState(treinoParaEditar?.descricao || '');
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>(
    treinoParaEditar?.diasSemana || ['Seg', 'Qua', 'Sex']
  );

  useEffect(() => {
    if (treinoParaEditar) {
      setTitulo(treinoParaEditar.titulo);
      setFoco(treinoParaEditar.foco);
      setDescricao(treinoParaEditar.descricao || '');
      setDiasSelecionados(treinoParaEditar.diasSemana || ['Seg', 'Qua', 'Sex']);
    }
  }, [treinoParaEditar]);

  const toggleDia = (dia: string) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter((d) => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  const aplicarPreset = (preset: { titulo: string; foco: string }) => {
    setTitulo(preset.titulo);
    setFoco(preset.foco);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onSalvar({
      id: treinoParaEditar?.id,
      titulo: titulo.trim(),
      foco: foco.trim() || 'Hipertrofia Geral',
      descricao: descricao.trim(),
      diasSemana: diasSelecionados,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Topo do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/30 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {treinoParaEditar ? 'Editar Treino Particular' : 'Criar Meu Treino Particular'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure sua rotina personalizada com GIFs em loop
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <form onSubmit={handleSalvar} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Presets Rápidos */}
          {!treinoParaEditar && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Sugestões Rápidas de Divisão:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {PRESETS_RAPIDOS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => aplicarPreset(p)}
                    className="text-left p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition cursor-pointer group"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-emerald-300 text-xs truncate">
                      {p.titulo}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{p.foco}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nome do Treino */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Nome do Treino <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Treino A • Peito e Tríceps Pesado"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Foco Principal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Foco Muscular ou Objetivo
            </label>
            <input
              type="text"
              placeholder="Ex: Hipertrofia Peitoral e Deltoides"
              value={foco}
              onChange={(e) => setFoco(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Dias da Semana Recomendados */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Dias da Semana Sugeridos:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIAS_DISPONIVEIS.map((dia) => {
                const selecionado = diasSelecionados.includes(dia);
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selecionado
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descrição ou Observações */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Observações ou Instruções (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Descanso de 90 segundos entre séries. Aumentar 2kg se completar 12 reps."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs resize-none font-medium"
            />
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!titulo.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{treinoParaEditar ? 'Salvar Alterações' : 'Salvar Treino Particular'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

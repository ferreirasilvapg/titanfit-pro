import React, { useState, useEffect } from 'react';
import {
  buscarExerciciosDaAPI,
  EXERCICIOS_CACHE_LOCAL,
} from '../core/titanCore.js';
import { BiomechanicalExerciseCard } from './BiomechanicalExerciseCard';
import {
  Filter,
  Search,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Layers,
} from 'lucide-react';

export const ExerciseCatalog: React.FC = () => {
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(6);
  const [grupoMuscular, setGrupoMuscular] = useState('todos');
  const [equipamento, setEquipamento] = useState('todos');
  const [termo, setTermo] = useState('');
  const [dadosResposta, setDadosResposta] = useState<any>({
    itens: EXERCICIOS_CACHE_LOCAL,
    total: EXERCICIOS_CACHE_LOCAL.length,
    temMais: false,
  });
  const [carregando, setCarregando] = useState(false);

  const carregarExercicios = async () => {
    setCarregando(true);
    try {
      const res = await buscarExerciciosDaAPI(pagina, limite, grupoMuscular, equipamento);
      setDadosResposta(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarExercicios();
  }, [pagina, grupoMuscular, equipamento]);

  const grupos = [
    { id: 'todos', label: 'Todos os Grupos' },
    { id: 'peito', label: 'Peito' },
    { id: 'costas', label: 'Costas' },
    { id: 'quadríceps', label: 'Quadríceps' },
    { id: 'isquiotibiais', label: 'Isquiotibiais' },
    { id: 'glúteos', label: 'Glúteos' },
    { id: 'ombros', label: 'Ombros' },
    { id: 'braços', label: 'Braços' },
    { id: 'panturrilhas', label: 'Panturrilhas' },
    { id: 'abdômen', label: 'Abdômen' },
  ];

  const equipamentos = [
    { id: 'todos', label: 'Qualquer Equipamento' },
    { id: 'halteres', label: 'Halteres' },
    { id: 'barra', label: 'Barra' },
    { id: 'polia', label: 'Polia' },
    { id: 'máquina', label: 'Máquinas' },
    { id: 'máquina smith', label: 'Máquina Smith' },
    { id: 'peso corporal', label: 'Peso Corporal' },
  ];

  // Filtro de texto opcional
  const itensFiltrados = termo
    ? (dadosResposta.itens || []).filter((ex: any) =>
        ex.name.toLowerCase().includes(termo.toLowerCase()) ||
        ex.bodyPart.toLowerCase().includes(termo.toLowerCase()) ||
        ex.target.toLowerCase().includes(termo.toLowerCase())
      )
    : dadosResposta.itens || [];

  return (
    <div className="space-y-5">
      {/* Cabeçalho da Seção */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" /> Acervo Infinito
              </span>
              <span className="text-xs text-slate-400">2.000+ Exercícios</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Biomecânica em GIF Loop & Registro de Treino
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Navegue pelos movimentos, aprenda a técnica correta e registre cargas (kg) por série
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar por nome ou músculo..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Filtros por Grupo Muscular */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grupo Muscular:</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {grupos.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setGrupoMuscular(g.id);
                  setPagina(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  grupoMuscular === g.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros por Equipamento */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80 mt-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Equipamento:</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {equipamentos.map((eq) => (
              <button
                key={eq.id}
                onClick={() => {
                  setEquipamento(eq.id);
                  setPagina(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  equipamento === eq.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                {eq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destaque Obrigatório: Os 5 Modelos de Biomecânica CDN com Prescrição */}
      {pagina === 1 && grupoMuscular === 'todos' && equipamento === 'todos' && !termo && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 rounded-3xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                5 Exercícios Modelo com Biomecânica Real em Loop (CDN ExerciseGymGifsDB)
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Prescrição Ativa
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Movimentos em loop contínuo de alta performance com prescrição de <strong>2 séries × 8-12 repetições</strong> (ou <strong>12-15 reps</strong> na Flexora). Toque no botão de zoom para visualização full-screen ou registre suas cargas abaixo de cada exercício.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grade de Exercícios */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-72 animate-shimmer">
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
              <div className="h-40 bg-slate-800 rounded-xl mb-3"></div>
              <div className="h-8 bg-slate-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : itensFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itensFiltrados.map((exercicio: any) => {
            const ehObrigatorio = [
              'smith-squat-001',
              'inc-db-press-002',
              'lat-pulldown-003',
              'hip-thrust-004',
              'leg-curl-005',
            ].includes(exercicio.id);

            return (
              <BiomechanicalExerciseCard
                key={exercicio.id}
                exercicio={exercicio}
                ehModeloObrigatorio={ehObrigatorio}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">Nenhum exercício encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tente alterar os filtros de grupo muscular ou equipamento selecionados.
          </p>
        </div>
      )}

      {/* Paginação da API Paginada */}
      <div className="flex items-center justify-between bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3">
        <span className="text-xs text-slate-400">
          Página <strong className="text-white">{pagina}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={!dadosResposta.temMais && itensFiltrados.length < limite}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
          >
            <span>Próxima</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

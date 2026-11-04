import React, { useState, useEffect } from 'react';
import {
  obterTreinosParticulares,
  salvarTreinoParticular,
  excluirTreinoParticular,
  duplicarTreinoParticular,
  adicionarExercicioAoTreinoParticular,
  removerExercicioDoTreinoParticular,
  moverExercicioNoTreinoParticular,
  atualizarExercicioNoTreinoParticular,
  subscreverTreinosParticulares,
  TreinoParticular,
  ExercicioTreinoParticular,
} from '../core/titanCustomWorkouts';
import { BiomechanicalExerciseCard } from './BiomechanicalExerciseCard';
import { CreateEditWorkoutModal } from './CreateEditWorkoutModal';
import { AddExerciseToCustomWorkoutModal } from './AddExerciseToCustomWorkoutModal';
import {
  Dumbbell,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Calendar,
  Flame,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Clock,
  Play,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const CustomWorkoutManager: React.FC = () => {
  const [treinos, setTreinos] = useState<TreinoParticular[]>(obterTreinosParticulares());
  const [treinoAtivoId, setTreinoAtivoId] = useState<string>(
    treinos.length > 0 ? treinos[0].id : ''
  );

  // Modo de visualização: 'treinar' (cartões com GIFs grandes e registro de cargas) ou 'organizar' (reordenar e excluir rápido)
  const [modoVisualizacao, setModoVisualizacao] = useState<'treinar' | 'organizar'>('treinar');

  // Modais
  const [modalCriarEditarAberto, setModalCriarEditarAberto] = useState(false);
  const [treinoParaEditar, setTreinoParaEditar] = useState<TreinoParticular | null>(null);
  const [modalAdicionarExercicioAberto, setModalAdicionarExercicioAberto] = useState(false);

  // Subscrição reativa aos treinos particulares
  useEffect(() => {
    const cancelar = subscreverTreinosParticulares((novosTreinos) => {
      setTreinos(novosTreinos);
      // Se o treino ativo foi removido ou não existe, seleciona o primeiro
      if (novosTreinos.length > 0) {
        if (!novosTreinos.some((t) => t.id === treinoAtivoId)) {
          setTreinoAtivoId(novosTreinos[0].id);
        }
      } else {
        setTreinoAtivoId('');
      }
    });

    return () => cancelar();
  }, [treinoAtivoId]);

  const treinoAtual = treinos.find((t) => t.id === treinoAtivoId) || treinos[0];

  const handleAbrirCriar = () => {
    setTreinoParaEditar(null);
    setModalCriarEditarAberto(true);
  };

  const handleAbrirEditar = (treino: TreinoParticular) => {
    setTreinoParaEditar(treino);
    setModalCriarEditarAberto(true);
  };

  const handleSalvarTreino = (dados: {
    id?: string;
    titulo: string;
    foco: string;
    descricao?: string;
    diasSemana?: string[];
  }) => {
    const salvo = salvarTreinoParticular(dados);
    setTreinoAtivoId(salvo.id);
    setModalCriarEditarAberto(false);
  };

  const handleExcluirTreino = (id: string, titulo: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o treino "${titulo}"?`)) {
      excluirTreinoParticular(id);
    }
  };

  const handleDuplicarTreino = (id: string) => {
    const novo = duplicarTreinoParticular(id);
    if (novo) {
      setTreinoAtivoId(novo.id);
    }
  };

  const handleAdicionarExercicio = (exercicio: Omit<ExercicioTreinoParticular, 'id' | 'ordem'>) => {
    if (!treinoAtual) return;
    adicionarExercicioAoTreinoParticular(treinoAtual.id, exercicio);
  };

  const handleRemoverExercicio = (exercicioId: string) => {
    if (!treinoAtual) return;
    removerExercicioDoTreinoParticular(treinoAtual.id, exercicioId);
  };

  const handleMoverExercicio = (exercicioId: string, direcao: 'cima' | 'baixo') => {
    if (!treinoAtual) return;
    moverExercicioNoTreinoParticular(treinoAtual.id, exercicioId, direcao);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Notificação e Introdução */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" /> Seus Treinos Personalizados
              </span>
              <span className="text-xs text-slate-400">
                {treinos.length} {treinos.length === 1 ? 'Rotina' : 'Rotinas Criadas'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Meus Treinos Particulares com GIFs Biomecânicos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monte sua própria ficha (Treino A, B, C...), escolha exercícios do acervo ou crie os seus com GIFs animados em loop e registro de carga.
            </p>
          </div>

          <button
            onClick={handleAbrirCriar}
            className="self-start sm:self-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Criar Novo Treino</span>
          </button>
        </div>
      </div>

      {/* Seletor de Treinos Particulares (Scroll Horizontal em Telas Pequenas) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {treinos.map((treino) => {
          const ativo = treino.id === treinoAtual?.id;
          return (
            <button
              key={treino.id}
              onClick={() => setTreinoAtivoId(treino.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer border whitespace-nowrap flex-shrink-0 ${
                ativo
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg font-black'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Dumbbell className={`w-3.5 h-3.5 ${ativo ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>{treino.titulo}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  ativo ? 'bg-slate-950/40 text-emerald-200' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {treino.exercicios.length} mov
              </span>
            </button>
          );
        })}

        <button
          onClick={handleAbrirCriar}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500/60 transition cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Novo Treino</span>
        </button>
      </div>

      {/* Bloco do Treino Selecionado */}
      {treinoAtual ? (
        <div className="space-y-4">
          {/* Cabeçalho do Treino Selecionado */}
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {treinoAtual.foco}
                  </span>
                  {treinoAtual.diasSemana && treinoAtual.diasSemana.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>{treinoAtual.diasSemana.join(' • ')}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{Math.max(25, treinoAtual.exercicios.length * 10)} min</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {treinoAtual.titulo}
                </h3>
                {treinoAtual.descricao && (
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    {treinoAtual.descricao}
                  </p>
                )}
              </div>

              {/* Botões de Ação do Treino */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setModalAdicionarExercicioAberto(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Adicionar Exercício com GIF</span>
                </button>

                <button
                  onClick={() => handleAbrirEditar(treinoAtual)}
                  title="Editar Título e Foco"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDuplicarTreino(treinoAtual.id)}
                  title="Duplicar este treino"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {treinos.length > 1 && (
                  <button
                    onClick={() => handleExcluirTreino(treinoAtual.id, treinoAtual.titulo)}
                    title="Excluir este treino"
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Alternador de Modo: Treinar com GIFs vs Organizar Ordem */}
            {treinoAtual.exercicios.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400">Modo de Exibição:</span>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setModoVisualizacao('treinar')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        modoVisualizacao === 'treinar'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Modo Treino (GIFs em Loop)</span>
                    </button>
                    <button
                      onClick={() => setModoVisualizacao('organizar')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        modoVisualizacao === 'organizar'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Organizar & Ajustar</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">{treinoAtual.exercicios.length}</span> movimentos configurados
                </div>
              </div>
            )}
          </div>

          {/* Lista de Exercícios do Treino */}
          {treinoAtual.exercicios.length === 0 ? (
            <div className="bg-[#111827] border border-dashed border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Dumbbell className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base sm:text-lg font-black text-white">
                  Seu treino ainda não possui exercícios
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Adicione movimentos do nosso acervo com GIFs biomecânicos em loop contínuo para começar a treinar e registrar cargas.
                </p>
              </div>
              <button
                onClick={() => setModalAdicionarExercicioAberto(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl transition cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Adicionar Primeiro Exercício com GIF</span>
              </button>
            </div>
          ) : modoVisualizacao === 'treinar' ? (
            /* Modo 1: Renderização com BiomechanicalExerciseCard (GIF em loop, histórico de peso e RPE) */
            <div className="space-y-4">
              {treinoAtual.exercicios.map((ex, idx) => (
                <div key={ex.id} className="relative group">
                  {/* Tag Superior com Ordem e Ações Rápidas */}
                  <div className="flex items-center justify-between mb-1.5 px-2">
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      Exercício {idx + 1} de {treinoAtual.exercicios.length}
                    </span>

                    <div className="flex items-center gap-1">
                      {ex.anotacoesPessoais && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full truncate max-w-[180px] sm:max-w-xs">
                          📝 {ex.anotacoesPessoais}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoverExercicio(ex.id)}
                        title="Remover deste treino"
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Componente Biomecânico de Alta Fidelidade com GIF */}
                  <BiomechanicalExerciseCard
                    exercicio={{
                      id: ex.exerciseId || ex.id,
                      name: ex.name,
                      bodyPart: ex.bodyPart,
                      target: ex.target,
                      equipment: ex.equipment,
                      gifUrl: ex.gifUrl,
                      remoteUrl: ex.remoteUrl || ex.gifUrl,
                      backupUrl: ex.backupUrl || ex.gifUrl,
                      series: ex.series,
                      reps: ex.reps,
                      seriesReps: ex.seriesReps,
                      dicas: ex.dicas,
                      nivel: ex.nivel || 'Particular',
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Modo 2: Organização rápida (Mover para Cima / Baixo, Ajustar Séries/Reps) */
            <div className="space-y-2.5">
              {treinoAtual.exercicios.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="bg-[#111827] border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md"
                >
                  {/* Ordem e Botões de Subir / Descer */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoverExercicio(ex.id, 'cima')}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center justify-center cursor-pointer transition"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === treinoAtual.exercicios.length - 1}
                        onClick={() => handleMoverExercicio(ex.id, 'baixo')}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center justify-center cursor-pointer transition"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* GIF Miniatura */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex-shrink-0">
                      <img
                        src={ex.gifUrl || ex.remoteUrl || ex.backupUrl}
                        alt={ex.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Título e Músculo */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase">
                          {ex.bodyPart}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                          {ex.equipment}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {idx + 1}. {ex.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {ex.seriesReps} {ex.cargaInicialKg ? `• Carga inicial: ${ex.cargaInicialKg}kg` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Ação de Excluir da Rotina */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRemoverExercicio(ex.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-10 text-center space-y-4">
          <p className="text-sm text-slate-400">Nenhum treino particular encontrado.</p>
          <button
            onClick={handleAbrirCriar}
            className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Criar Treino Particular
          </button>
        </div>
      )}

      {/* Modal para Criar ou Editar Treino */}
      {modalCriarEditarAberto && (
        <CreateEditWorkoutModal
          treinoParaEditar={treinoParaEditar}
          onSalvar={handleSalvarTreino}
          onFechar={() => setModalCriarEditarAberto(false)}
        />
      )}

      {/* Modal para Adicionar Exercício com GIF ao Treino Atual */}
      {modalAdicionarExercicioAberto && treinoAtual && (
        <AddExerciseToCustomWorkoutModal
          treinoTitulo={treinoAtual.titulo}
          onAdicionar={handleAdicionarExercicio}
          onFechar={() => setModalAdicionarExercicioAberto(false)}
        />
      )}
    </div>
  );
};

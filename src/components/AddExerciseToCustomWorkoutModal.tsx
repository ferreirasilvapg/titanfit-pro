import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  Plus,
  Check,
  Dumbbell,
  Sparkles,
  Flame,
  Info,
  Maximize2,
  Repeat,
  PlusCircle,
} from 'lucide-react';
import {
  BANCO_EXERCICIOS_COMPLETO,
  ExercicioTreinoParticular,
} from '../core/titanCustomWorkouts';

interface Props {
  treinoTitulo: string;
  onAdicionar: (exercicio: Omit<ExercicioTreinoParticular, 'id' | 'ordem'>) => void;
  onFechar: () => void;
}

const GRUPOS_FILTRO = [
  { id: 'todos', label: 'Todos' },
  { id: 'peito', label: 'Peito' },
  { id: 'costas', label: 'Costas' },
  { id: 'quadríceps', label: 'Quadríceps' },
  { id: 'isquiotibiais', label: 'Posterior' },
  { id: 'glúteos', label: 'Glúteos' },
  { id: 'ombros', label: 'Ombros' },
  { id: 'braços', label: 'Braços' },
  { id: 'abdômen', label: 'Abdômen' },
  { id: 'panturrilhas', label: 'Panturrilhas' },
];

export const AddExerciseToCustomWorkoutModal: React.FC<Props> = ({
  treinoTitulo,
  onAdicionar,
  onFechar,
}) => {
  const [busca, setBusca] = useState('');
  const [grupoAtivo, setGrupoAtivo] = useState('todos');
  const [abaManual, setAbaManual] = useState<'acervo' | 'personalizado'>('acervo');

  // Estado para exercício selecionado para inserção rápida
  const [exercicioAjustando, setExercicioAjustando] = useState<any | null>(null);
  const [seriesConfig, setSeriesConfig] = useState<number>(3);
  const [repsConfig, setRepsConfig] = useState<string>('8-12');
  const [cargaConfig, setCargaConfig] = useState<string>('20');
  const [anotacaoConfig, setAnotacaoConfig] = useState<string>('');
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);

  // Estados para cadastro manual de novo movimento
  const [manualNome, setManualNome] = useState('');
  const [manualGrupo, setManualGrupo] = useState('peito');
  const [manualEquipamento, setManualEquipamento] = useState('halteres');
  const [manualGifUrl, setManualGifUrl] = useState('/exercises/incline-press.gif');

  // Filtragem dos exercícios
  const exerciciosFiltrados = BANCO_EXERCICIOS_COMPLETO.filter((ex) => {
    const matchGrupo =
      grupoAtivo === 'todos' ||
      ex.bodyPart.toLowerCase().includes(grupoAtivo.toLowerCase()) ||
      ex.target.toLowerCase().includes(grupoAtivo.toLowerCase());

    const matchBusca =
      !busca ||
      ex.name.toLowerCase().includes(busca.toLowerCase()) ||
      ex.bodyPart.toLowerCase().includes(busca.toLowerCase()) ||
      ex.target.toLowerCase().includes(busca.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(busca.toLowerCase());

    return matchGrupo && matchBusca;
  });

  const abrirAjusteExercicio = (ex: any) => {
    setExercicioAjustando(ex);
    setSeriesConfig(ex.series || 3);
    setRepsConfig(ex.reps || '8-12');
    setCargaConfig('20');
    setAnotacaoConfig('');
  };

  const confirmarAdicao = (ex: any) => {
    onAdicionar({
      exerciseId: ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart,
      target: ex.target,
      equipment: ex.equipment,
      gifUrl: ex.gifUrl,
      remoteUrl: ex.remoteUrl || ex.gifUrl,
      backupUrl: ex.backupUrl || ex.gifUrl,
      series: seriesConfig,
      reps: repsConfig,
      seriesReps: `${seriesConfig} séries × ${repsConfig} reps`,
      cargaInicialKg: parseFloat(cargaConfig) || 0,
      dicas: ex.dicas || 'Mantenha boa postura e controle excêntrico.',
      anotacoesPessoais: anotacaoConfig.trim(),
      nivel: ex.nivel || 'Todos',
    });

    setAdicionadoId(ex.id);
    setTimeout(() => {
      setAdicionadoId(null);
      setExercicioAjustando(null);
    }, 900);
  };

  const handleCadastrarManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNome.trim()) return;

    onAdicionar({
      exerciseId: `custom-mov-${Date.now()}`,
      name: manualNome.trim(),
      bodyPart: manualGrupo,
      target: `${manualGrupo} hipertrofia`,
      equipment: manualEquipamento,
      gifUrl: manualGifUrl,
      remoteUrl: manualGifUrl,
      backupUrl: manualGifUrl,
      series: seriesConfig,
      reps: repsConfig,
      seriesReps: `${seriesConfig} séries × ${repsConfig} reps`,
      cargaInicialKg: parseFloat(cargaConfig) || 0,
      dicas: 'Movimento personalizado adicionado pelo atleta.',
      anotacoesPessoais: anotacaoConfig.trim(),
      nivel: 'Personalizado',
    });

    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Cabeçalho */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  GIFs Biomecânicos em Loop
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white truncate max-w-[260px] sm:max-w-md">
                Adicionar Exercício a: <span className="text-emerald-300">{treinoTitulo}</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas Superiores: Do Acervo vs Manual */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => setAbaManual('acervo')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              abaManual === 'acervo'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Escolher do Acervo com GIFs ({BANCO_EXERCICIOS_COMPLETO.length})</span>
          </button>
          <button
            onClick={() => setAbaManual('personalizado')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              abaManual === 'personalizado'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Criar Nome Próprio</span>
          </button>
        </div>

        {abaManual === 'acervo' ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Barra de Busca & Filtros de Grupo */}
            <div className="p-3 border-b border-slate-800/80 space-y-2.5 bg-slate-900/60">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, músculo ou aparelho (ex: Supino, Puxada, Búlgaro...)"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                />
                {busca && (
                  <button
                    onClick={() => setBusca('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Chips de Grupos Musculares com scroll horizontal */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {GRUPOS_FILTRO.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGrupoAtivo(g.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer text-[11px] border ${
                      grupoAtivo === g.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista com Miniaturas de GIFs */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {exerciciosFiltrados.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Nenhum exercício encontrado com "{busca}". Tente outro termo ou limpe os filtros.
                </div>
              ) : (
                exerciciosFiltrados.map((ex) => {
                  const estaAjustando = exercicioAjustando?.id === ex.id;
                  const acabouDeAdicionar = adicionadoId === ex.id;

                  return (
                    <div
                      key={ex.id}
                      className={`border rounded-2xl p-2.5 sm:p-3 transition ${
                        estaAjustando
                          ? 'bg-slate-900 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Miniatura com GIF em Loop */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 flex-shrink-0 group">
                          <img
                            src={ex.gifUrl || ex.remoteUrl || ex.backupUrl}
                            alt={ex.name}
                            loading="lazy"
                            onError={(e) => {
                              // Se der falha na URL local, tenta a remota de backup
                              const img = e.currentTarget;
                              if (ex.remoteUrl && img.src !== ex.remoteUrl) {
                                img.src = ex.remoteUrl;
                              } else if (ex.backupUrl && img.src !== ex.backupUrl) {
                                img.src = ex.backupUrl;
                              }
                            }}
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs px-1 py-0.2 rounded text-[9px] font-bold text-emerald-400">
                            GIF
                          </div>
                        </div>

                        {/* Dados do Exercício */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              {ex.bodyPart}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                              {ex.equipment}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                            {ex.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Alvo: <span className="text-slate-300">{ex.target}</span>
                          </p>
                        </div>

                        {/* Botão de Adição Rápida ou Ajuste */}
                        <div className="flex-shrink-0">
                          {acabouDeAdicionar ? (
                            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> Adicionado!
                            </span>
                          ) : (
                            <button
                              onClick={() => abrirAjusteExercicio(ex)}
                              className={`text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                                estaAjustando
                                  ? 'bg-slate-800 text-white border border-slate-600'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="hidden sm:inline">Configurar & Add</span>
                              <span className="sm:hidden">Add</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Painel Expansível de Ajuste Rápido de Séries / Reps / Carga */}
                      {estaAjustando && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 bg-slate-950/40 p-2.5 rounded-xl animate-in fade-in duration-150">
                          <div className="grid grid-cols-3 gap-2">
                            {/* Séries */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                Séries:
                              </label>
                              <div className="flex items-center gap-1">
                                {[2, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSeriesConfig(s)}
                                    className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                                      seriesConfig === s
                                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                        : 'bg-slate-900 text-slate-300 border-slate-700'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Repetições */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                Repetições:
                              </label>
                              <select
                                value={repsConfig}
                                onChange={(e) => setRepsConfig(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              >
                                <option value="6-8">6 - 8 (Força)</option>
                                <option value="8-10">8 - 10 (Hipertrofia)</option>
                                <option value="8-12">8 - 12 (Padrão Ouro)</option>
                                <option value="10-12">10 - 12</option>
                                <option value="12-15">12 - 15 (Resistência/Pump)</option>
                                <option value="15-20">15 - 20 (Resistência)</option>
                                <option value="Até a Falha">Até a Falha</option>
                              </select>
                            </div>

                            {/* Carga Inicial */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                Carga Inicial (kg):
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="500"
                                value={cargaConfig}
                                onChange={(e) => setCargaConfig(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                              />
                            </div>
                          </div>

                          {/* Anotação Pessoal */}
                          <div>
                            <input
                              type="text"
                              placeholder="Anotação pessoal (ex: banco no 3º furo, descanso de 60s...)"
                              value={anotacaoConfig}
                              onChange={(e) => setAnotacaoConfig(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Botão de Confirmação */}
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setExercicioAjustando(null)}
                              className="text-xs text-slate-400 hover:text-white px-2 py-1"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmarAdicao(ex)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Confirmar e Adicionar ao Treino</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Aba: Cadastrar Movimento Próprio / Nome Livre */
          <form onSubmit={handleCadastrarManual} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300">
                Você pode cadastrar um exercício com seu próprio nome e associar a animação biomecânica correspondente para exibir em loop na tela do seu treino!
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Nome do Exercício <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Supino Declinado com Halteres, Crossover Invertido..."
                value={manualNome}
                onChange={(e) => setManualNome(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Grupo Muscular</label>
                <select
                  value={manualGrupo}
                  onChange={(e) => setManualGrupo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-medium"
                >
                  <option value="peito">Peitoral</option>
                  <option value="costas">Costas / Dorsais</option>
                  <option value="quadríceps">Quadríceps</option>
                  <option value="isquiotibiais">Posterior de Coxa</option>
                  <option value="glúteos">Glúteos</option>
                  <option value="ombros">Ombros / Deltoides</option>
                  <option value="braços">Braços (Bíceps/Tríceps)</option>
                  <option value="abdômen">Abdômen / Core</option>
                  <option value="panturrilhas">Panturrilhas</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Equipamento</label>
                <select
                  value={manualEquipamento}
                  onChange={(e) => setManualEquipamento(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-medium"
                >
                  <option value="halteres">Halteres</option>
                  <option value="barra">Barra</option>
                  <option value="polia">Polia / Cabo</option>
                  <option value="máquina">Máquina</option>
                  <option value="máquina smith">Máquina Smith</option>
                  <option value="peso corporal">Peso Corporal</option>
                </select>
              </div>
            </div>

            {/* Escolha do GIF correspondente */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Selecione a Animação em GIF Biomecânico:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[
                  { label: 'Supino Inc', url: '/exercises/incline-press.gif' },
                  { label: 'Supino Reto', url: '/exercises/bench-press.gif' },
                  { label: 'Puxada', url: '/exercises/lat-pulldown.gif' },
                  { label: 'Remada', url: '/exercises/incline-row.gif' },
                  { label: 'Agachamento', url: '/exercises/smith-squat.gif' },
                  { label: 'Leg Press', url: '/exercises/leg-press.gif' },
                  { label: 'Hip Thrust', url: '/exercises/hip-thrust.gif' },
                  { label: 'Flexora', url: '/exercises/leg-curl.gif' },
                  { label: 'Elev Lateral', url: '/exercises/lateral-raise.gif' },
                  { label: 'Bíceps', url: '/exercises/biceps-curl.gif' },
                  { label: 'Tríceps', url: '/exercises/triceps-press.gif' },
                ].map((item) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => setManualGifUrl(item.url)}
                    className={`relative rounded-xl overflow-hidden border p-1 flex flex-col items-center cursor-pointer transition ${
                      manualGifUrl === item.url
                        ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-500'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-12 h-12 object-cover rounded-lg" />
                    <span className="text-[9px] font-bold text-slate-300 truncate w-full text-center mt-1">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Séries</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={seriesConfig}
                  onChange={(e) => setSeriesConfig(parseInt(e.target.value) || 3)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Reps</label>
                <input
                  type="text"
                  value={repsConfig}
                  onChange={(e) => setRepsConfig(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Carga (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={cargaConfig}
                  onChange={(e) => setCargaConfig(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onFechar}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvar Exercício Particular</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

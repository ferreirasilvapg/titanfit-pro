import React, { useState, useEffect } from 'react';
import {
  salvarHistoricoCarga,
  obterHistoricoCargas,
  removerHistoricoCarga,
  subscreverEstado,
} from '../core/titanCore.js';
import {
  Dumbbell,
  Plus,
  Trash2,
  Trophy,
  Flame,
  Info,
  Check,
  Maximize2,
  X,
  Repeat,
  RotateCcw,
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  backupUrl?: string;
  remoteUrl?: string;
  seriesReps?: string;
  series?: number;
  reps?: string;
  dicas?: string;
  nivel?: string;
}

interface Props {
  exercicio: Exercise;
  ehModeloObrigatorio?: boolean;
}

export const BiomechanicalExerciseCard: React.FC<Props> = ({
  exercicio,
  ehModeloObrigatorio = false,
}) => {
  const [historico, setHistorico] = useState<any[]>([]);
  const [mostrarLog, setMostrarLog] = useState(false);
  const [modalZoomAberto, setModalZoomAberto] = useState(false);

  // URL ativa com cadeia de fallbacks garantida
  const [urlAtiva, setUrlAtiva] = useState<string>(
    exercicio.gifUrl || exercicio.remoteUrl || exercicio.backupUrl || ''
  );
  const [tentativaFallback, setTentativaFallback] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroFatal, setErroFatal] = useState<boolean>(false);

  // Valores padrão de carga e repetições baseados na prescrição do exercício
  const [pesoKg, setPesoKg] = useState<string>('30');
  const [reps, setReps] = useState<string>(
    exercicio.reps ? exercicio.reps.split('-')[0] : '10'
  );
  const [rpe, setRpe] = useState<number>(8);
  const [salvoSucesso, setSalvoSucesso] = useState(false);

  // Lista ordenada de fontes disponíveis para este exercício
  const obterFontesDisponiveis = () => {
    const lista = [
      exercicio.gifUrl,
      exercicio.remoteUrl,
      exercicio.backupUrl,
    ].filter(Boolean) as string[];
    return Array.from(new Set(lista));
  };

  useEffect(() => {
    const fontes = obterFontesDisponiveis();
    setUrlAtiva(fontes[0] || '');
    setTentativaFallback(0);
    setCarregando(true);
    setErroFatal(false);

    // Timer de segurança: desativa qualquer indicador após 1.5s para nunca travar a interface
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [exercicio.gifUrl, exercicio.id]);

  const carregarHistorico = () => {
    const dados = obterHistoricoCargas(exercicio.id);
    setHistorico(dados);
  };

  useEffect(() => {
    carregarHistorico();
    const cancelar = subscreverEstado(() => {
      carregarHistorico();
    });
    return () => {
      cancelar();
    };
  }, [exercicio.id]);

  const handleSalvarSerie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesoKg || !reps) return;

    salvarHistoricoCarga(exercicio.id, {
      pesoKg: parseFloat(pesoKg),
      repeticoes: parseInt(reps, 10),
      rpe,
    });

    setSalvoSucesso(true);
    setTimeout(() => setSalvoSucesso(false), 1500);
  };

  const handleExcluirSerie = (index: number) => {
    removerHistoricoCarga(exercicio.id, index);
  };

  // Trata erro de carregamento alternando com segurança para as fontes secundárias
  const handleTratarErroImagem = () => {
    const fontes = obterFontesDisponiveis();
    const proxima = tentativaFallback + 1;

    if (proxima < fontes.length) {
      console.warn(`[GIF] Tentando fallback ${proxima + 1}/${fontes.length} para ${exercicio.name}: ${fontes[proxima]}`);
      setTentativaFallback(proxima);
      setUrlAtiva(fontes[proxima]);
      // Libera imediatamente a visualização do novo elemento
      setCarregando(false);
    } else {
      console.warn(`[GIF] Todas as fontes esgotadas para ${exercicio.name}`);
      setCarregando(false);
      setErroFatal(true);
    }
  };

  // Calcular recorde pessoal (PR - maior carga)
  const cargaMaxima =
    historico.length > 0
      ? Math.max(...historico.map((h) => Number(h.pesoKg) || 0))
      : 0;

  return (
    <>
      <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between group">
        <div>
          {/* Cabeçalho do Card */}
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {exercicio.bodyPart}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {exercicio.equipment}
                </span>
                {ehModeloObrigatorio && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-amber-400 inline" /> Modelo Ativo
                  </span>
                )}
              </div>

              {cargaMaxima > 0 && (
                <div
                  className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg flex-shrink-0"
                  title="Recorde Pessoal (PR)"
                >
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] font-black text-amber-300">{cargaMaxima} kg</span>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition leading-snug">
              {exercicio.name}
            </h3>

            {/* Prescrição de Séries e Repetições */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm">
                <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{exercicio.seriesReps || '2 séries × 8-12 repetições'}</span>
              </div>
              <span className="text-xs text-slate-400">
                Alvo: <strong className="text-slate-200">{exercicio.target}</strong>
              </span>
            </div>
          </div>

          {/* VISUALIZADOR DO GIF DE BIOMECÂNICA REAL EM LOOP CONTÍNUO */}
          <div className="relative aspect-video bg-[#ffffff] border-y border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Imagem do GIF Biomecânico */}
            {!erroFatal ? (
              <img
                key={urlAtiva}
                src={urlAtiva}
                alt={`Exercício em loop biomecânico: ${exercicio.name}`}
                className="w-full h-full object-contain p-1.5 transition-opacity duration-300"
                loading="eager"
                decoding="async"
                ref={(img) => {
                  if (img && img.complete && img.naturalWidth > 0) {
                    setCarregando(false);
                  }
                }}
                onLoad={() => setCarregando(false)}
                onError={handleTratarErroImagem}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-slate-200">
                <p className="text-xs font-bold text-slate-300 mb-1">Conexão lenta detectada no dispositivo</p>
                <p className="text-[11px] text-slate-400 mb-3 max-w-xs">
                  Alvo: {exercicio.target} ({exercicio.seriesReps || '2 séries × 8-12 reps'})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setErroFatal(false);
                      setCarregando(true);
                      setTentativaFallback(0);
                      const fontes = obterFontesDisponiveis();
                      setUrlAtiva(fontes[0] || exercicio.remoteUrl || exercicio.gifUrl || '');
                    }}
                    className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-400 shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recarregar GIF</span>
                  </button>
                  {exercicio.remoteUrl && (
                    <button
                      onClick={() => {
                        setErroFatal(false);
                        setUrlAtiva(exercicio.remoteUrl || '');
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
                    >
                      Fonte CDN
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Badges Flutuantes Não-Bloqueantes */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold border border-emerald-500/30 shadow-md pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Loop 60fps Ativo</span>
            </div>

            {/* Indicador suave não-bloqueante no canto inferior direito */}
            {carregando && !erroFatal && (
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold border border-emerald-500/30 shadow-md pointer-events-none">
                <div className="w-2 h-2 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando GIF...</span>
              </div>
            )}

            <button
              onClick={() => setModalZoomAberto(true)}
              className="absolute top-2.5 right-2.5 bg-black/75 hover:bg-black text-white p-1.5 rounded-xl backdrop-blur-md transition border border-white/20 cursor-pointer shadow-md"
              title="Expandir GIF Biomecânico"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
            </button>
          </div>

          {/* Dicas Técnicas de Execução */}
          {exercicio.dicas && (
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{exercicio.dicas}</span>
            </div>
          )}
        </div>

        {/* Seção de Séries, Repetições e Cargas */}
        <div className="p-4 bg-slate-900/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              Histórico ({historico.length} séries registradas)
            </span>

            <button
              onClick={() => setMostrarLog(!mostrarLog)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              {mostrarLog ? 'Fechar' : '+ Registrar Série'}
            </button>
          </div>

          {/* Formulário Rápido de Inserção de Carga */}
          {mostrarLog && (
            <form
              onSubmit={handleSalvarSerie}
              className="bg-slate-900 p-3 rounded-2xl border border-slate-800 mb-3 space-y-2 shadow-inner"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Carga (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="500"
                    value={pesoKg}
                    onChange={(e) => setPesoKg(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    placeholder="Ex: 40"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Repetições
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    placeholder="Ex: 10"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    RPE (Esforço)
                  </label>
                  <select
                    value={rpe}
                    onChange={(e) => setRpe(Number(e.target.value))}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={7}>RPE 7 (Fácil)</option>
                    <option value={8}>RPE 8 (2 reserva)</option>
                    <option value={9}>RPE 9 (1 reserva)</option>
                    <option value={10}>RPE 10 (Falha)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  salvoSucesso
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                }`}
              >
                {salvoSucesso ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Salvo no Celular!
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Salvar Série no Diário
                  </>
                )}
              </button>
            </form>
          )}

          {/* Lista de Séries Feitas */}
          {historico.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {historico.map((serie, index) => (
                <div
                  key={serie.id || index}
                  className="flex items-center justify-between text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-400 w-4">#{index + 1}</span>
                    <span className="font-black text-emerald-400">{serie.pesoKg} kg</span>
                    <span className="text-slate-400">×</span>
                    <span className="font-bold text-white">{serie.repeticoes} reps</span>
                    {serie.rpe && (
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/50 font-semibold">
                        RPE {serie.rpe}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {new Date(serie.dataHora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => handleExcluirSerie(index)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                      title="Excluir série"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 text-center py-1">
              Nenhuma série salva hoje. Toque em "+ Registrar Série".
            </p>
          )}
        </div>
      </div>

      {/* Modal Zoom Biomecânico Full-Screen */}
      {modalZoomAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-xl rounded-3xl p-5 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h4 className="text-base font-bold text-white">{exercicio.name}</h4>
                <p className="text-xs text-emerald-400 font-semibold">
                  {exercicio.seriesReps || '2 séries × 8-12 repetições'} • {exercicio.target}
                </p>
              </div>
              <button
                onClick={() => setModalZoomAberto(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
              <img
                src={urlAtiva}
                alt={exercicio.name}
                className="w-full h-full object-contain p-2"
              />
            </div>

            {exercicio.dicas && (
              <p className="text-xs text-slate-300 mt-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong className="text-cyan-400">Instrução Técnica:</strong> {exercicio.dicas}
              </p>
            )}

            <button
              onClick={() => setModalZoomAberto(false)}
              className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition text-xs cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </>
  );
};

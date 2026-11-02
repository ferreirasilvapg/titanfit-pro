import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Activity,
  HeartPulse,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import {
  RespostasQuestionarioArticular,
  salvarAnamneseArticular,
  gerarTreinoAdaptadoLocal,
  PlanoTreinoPersonalizado,
} from '../core/titanWorkoutAdapter';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onTreinoGerado: (plano: PlanoTreinoPersonalizado) => void;
  anamneseAtual?: RespostasQuestionarioArticular | null;
}

export const JointAssessmentModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onTreinoGerado,
  anamneseAtual,
}) => {
  const [passo, setPasso] = useState<1 | 2 | 3>(1);
  const [carregando, setCarregando] = useState(false);

  // Estados das respostas
  const [articulacoes, setArticulacoes] = useState<string[]>(
    anamneseAtual?.articulacoesAfetadas || []
  );
  const [diagnosticos, setDiagnosticos] = useState<string[]>(
    anamneseAtual?.diagnosticos || []
  );
  const [nivelImpacto, setNivelImpacto] = useState<'baixo' | 'moderado' | 'livre'>(
    anamneseAtual?.nivelImpacto || 'moderado'
  );
  const [objetivo, setObjetivo] = useState<
    'hipertrofia_protegida' | 'emagrecimento_seguro' | 'reabilitacao_fortalecimento' | 'condicionamento'
  >(anamneseAtual?.objetivoPrincipal || 'hipertrofia_protegida');
  const [frequencia, setFrequencia] = useState<number>(
    anamneseAtual?.frequenciaSemanal || 4
  );

  if (!aberto) return null;

  const toggleArticulacao = (id: string) => {
    if (id === 'nenhuma') {
      setArticulacoes(['nenhuma']);
      return;
    }
    const semNenhuma = articulacoes.filter((a) => a !== 'nenhuma');
    if (semNenhuma.includes(id)) {
      setArticulacoes(semNenhuma.filter((a) => a !== id));
    } else {
      setArticulacoes([...semNenhuma, id]);
    }
  };

  const toggleDiagnostico = (id: string) => {
    if (id === 'nenhum') {
      setDiagnosticos(['nenhum']);
      return;
    }
    const semNenhum = diagnosticos.filter((d) => d !== 'nenhum');
    if (semNenhum.includes(id)) {
      setDiagnosticos(semNenhum.filter((d) => d !== id));
    } else {
      setDiagnosticos([...semNenhum, id]);
    }
  };

  const listaArticulacoes = [
    {
      id: 'joelhos',
      titulo: 'Joelhos & Patela',
      descricao: 'Dor ao dobrar, agachar profundo ou impacto repetitivo',
      alerta: 'Substituição automática de agachamentos profundos e extensora',
    },
    {
      id: 'lombar',
      titulo: 'Coluna Lombar',
      descricao: 'Desconforto na base das costas ou dor ao flexionar o tronco',
      alerta: 'Zero carga axial na coluna; apoio constante em bancos e polias',
    },
    {
      id: 'ombros',
      titulo: 'Ombros & Manguito',
      descricao: 'Pinçamento ao erguer os braços ou supinar pesado',
      alerta: 'Pegadas neutras anatômicas e plano escapular a 30°',
    },
    {
      id: 'punhos',
      titulo: 'Punhos & Antebraços',
      descricao: 'Dor ao usar barra reta ou carga em hiperextensão',
      alerta: 'Pegadas tipo neutro/martelo e cabos anatômicos',
    },
    {
      id: 'cervical',
      titulo: 'Coluna Cervical / Trapézio',
      descricao: 'Tensão crônica na nuca ou dores reflexas',
      alerta: 'Eliminação de puxadas atrás do pescoço e tração neutra',
    },
    {
      id: 'quadril',
      titulo: 'Quadril & Virilha',
      descricao: 'Impacto fêmoro-acetabular ou rigidez nos adutores',
      alerta: 'Ajuste de amplitude e foco em glúteos estabilizadores',
    },
    {
      id: 'nenhuma',
      titulo: 'Sem Dores / Articulações Saudáveis',
      descricao: 'Não sinto desconforto articular relevante durante o exercício',
      alerta: 'Treino focado em progressão máxima de carga e hipertrofia',
    },
  ];

  const listaDiagnosticos = [
    { id: 'condromalacia', titulo: 'Condromalácia Patelar / Tendinite no Joelho' },
    { id: 'hernia_disco', titulo: 'Hérnia de Disco / Protusão Lombar' },
    { id: 'bursite_manguito', titulo: 'Bursite / Tendinite do Manguito Rotador' },
    { id: 'tendinite_punho', titulo: 'Tendinite no Punho / Síndrome do Túnel do Carpo' },
    { id: 'desvio_postural', titulo: 'Escoliose ou Hiperlordose Acentuada' },
    { id: 'nenhum', titulo: 'Nenhum Diagnóstico Clínico Específico' },
  ];

  const handleConcluirAvaliacao = () => {
    setCarregando(true);
    const respostas: RespostasQuestionarioArticular = {
      articulacoesAfetadas: articulacoes.length > 0 ? articulacoes : ['nenhuma'],
      diagnosticos: diagnosticos.length > 0 ? diagnosticos : ['nenhum'],
      nivelImpacto,
      objetivoPrincipal: objetivo,
      frequenciaSemanal: frequencia,
    };

    salvarAnamneseArticular(respostas);
    const novoPlano = gerarTreinoAdaptadoLocal(respostas);

    setTimeout(() => {
      setCarregando(false);
      onTreinoGerado(novoPlano);
      onFechar();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#111827] border border-purple-500/40 w-full max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto space-y-5">
        {/* Botão Fechar */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo do Modal com Badge VIP */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Prescrição Exclusiva VIP
            </span>
            <span className="text-xs text-slate-400">Passo {passo} de 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Anamnese Articular & Treino Anti-Lesão
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identifique suas articulações sensíveis para que o algoritmo construa um treino personalizado com substituição biomecânica imediata.
          </p>
        </div>

        {/* Barra de Progresso dos Passos */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              passo >= 1 ? 'bg-emerald-400' : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              passo >= 2 ? 'bg-emerald-400' : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              passo >= 3 ? 'bg-emerald-400' : 'bg-slate-800'
            }`}
          />
        </div>

        {/* ========================================================================= */}
        {/* PASSO 1: ARTICULAÇÕES COM DOR OU LIMITAÇÃO */}
        {/* ========================================================================= */}
        {passo === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-purple-400" />
                Quais articulações apresentam dor, incômodo ou rigidez?
              </h3>
              <span className="text-[11px] text-slate-400">Múltipla escolha</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {listaArticulacoes.map((item) => {
                const selecionado = articulacoes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleArticulacao(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      selecionado
                        ? 'bg-purple-950/40 border-purple-500/80 shadow-md shadow-purple-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center flex-shrink-0 transition ${
                        selecionado
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {selecionado && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.titulo}</span>
                        {selecionado && (
                          <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.2 rounded-full">
                            Protegido
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.descricao}</p>
                      {selecionado && item.id !== 'nenhuma' && (
                        <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {item.alerta}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPasso(2)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <span>Avançar para Diagnósticos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 2: DIAGNÓSTICOS ORTOPÉDICOS PRÉVIOS */}
        {/* ========================================================================= */}
        {passo === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Possui algum diagnóstico ortopédico específico?
              </h3>
              <span className="text-[11px] text-slate-400">Opcional</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {listaDiagnosticos.map((diag) => {
                const selecionado = diagnosticos.includes(diag.id);
                return (
                  <button
                    key={diag.id}
                    type="button"
                    onClick={() => toggleDiagnostico(diag.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selecionado
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition ${
                        selecionado
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {selecionado && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <span className="text-xs font-semibold text-slate-200">{diag.titulo}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPasso(1)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => setPasso(3)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <span>Avançar para Objetivos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 3: OBJETIVO, IMPACTO E FREQUÊNCIA SEMANAL */}
        {/* ========================================================================= */}
        {passo === 3 && (
          <div className="space-y-4">
            {/* Tolerância de Impacto Articular */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Nível de Impacto Articular Preferido:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'baixo', label: 'Baixo Impacto', sub: 'Proteção máxima' },
                  { id: 'moderado', label: 'Moderado', sub: 'Guiado & apoiado' },
                  { id: 'livre', label: 'Livre / Alto', sub: 'Cargas intensas' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNivelImpacto(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      nivelImpacto === item.id
                        ? 'bg-purple-900/40 border-purple-400 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo Principal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Objetivo Principal:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'hipertrofia_protegida', label: 'Hipertrofia com Proteção' },
                  { id: 'emagrecimento_seguro', label: 'Emagrecimento Sem Dor' },
                  { id: 'reabilitacao_fortalecimento', label: 'Fortalecimento & Postura' },
                  { id: 'condicionamento', label: 'Condicionamento Físico' },
                ].map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setObjetivo(obj.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      objetivo === obj.id
                        ? 'bg-emerald-950/50 border-emerald-400 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequência Semanal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Dias de Treino por Semana:
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((dias) => (
                  <button
                    key={dias}
                    type="button"
                    onClick={() => setFrequencia(dias)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      frequencia === dias
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {dias}x
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo Dinâmico das Adaptações */}
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-emerald-950/40 p-3 rounded-2xl border border-purple-500/30 text-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider">
                Resumo da Prescrição Clínica
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {articulacoes.length === 0 || articulacoes.includes('nenhuma')
                  ? 'Nenhuma limitação articular selecionada. Seu treino terá foco em ganho de força e hipertrofia com biomecânica avançada.'
                  : `Salvaguardas ativas para: ${articulacoes.join(', ')}. Movimentos de risco serão substituídos automaticamente por exercícios equivalentes sem impacto.`}
              </p>
            </div>

            {/* Botões Finais */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPasso(2)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleConcluirAvaliacao}
                disabled={carregando}
                className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
              >
                {carregando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Construindo Treino Adaptado...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>Gerar Meu Treino Personalizado</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

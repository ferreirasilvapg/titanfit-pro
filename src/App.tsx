/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  inicializarPWA,
  obterDadosDiarios,
  subscreverEstado,
} from './core/titanCore.js';
import {
  obterUsuarioAtual,
  assinarEstadoComercial,
  verificarPermissaoRecurso,
  sincronizarDadosNuvem,
  salvarSessaoUsuario,
  encerrarSessao,
  isDono,
  EMAIL_DONO_MESTRE,
} from './core/titanCommercial.js';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ExerciseCatalog } from './components/ExerciseCatalog';
import { MacroConsumptionChart } from './components/MacroConsumptionChart';
import { HydrationTracker } from './components/HydrationTracker';
import { NutritionCameraModal } from './components/NutritionCameraModal';
import { ManualFoodSearchModal } from './components/ManualFoodSearchModal';
import { FreeHostingGuideModal } from './components/FreeHostingGuideModal';
import { CinematicLandingPage } from './components/CinematicLandingPage';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { UpgradePremiumModal } from './components/UpgradePremiumModal';
import { JointAssessmentModal } from './components/JointAssessmentModal';
import { PersonalizedWorkoutView } from './components/PersonalizedWorkoutView';
import { CustomWorkoutManager } from './components/CustomWorkoutManager';
import { OwnerModal } from './components/OwnerModal';
import {
  obterAnamneseArticular,
  obterPlanoTreinoPersonalizado,
  PlanoTreinoPersonalizado,
  RespostasQuestionarioArticular,
} from './core/titanWorkoutAdapter';
import {
  Dumbbell,
  UtensilsCrossed,
  Droplets,
  Calendar,
  Sparkles,
  Globe,
  Share2,
  Flame,
  CheckCircle2,
  Trophy,
  Cloud,
  Crown,
  Lock,
  User,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Controle de Visualização: 'app' (Dashboard Operacional) ou 'landing' (Página de Vendas Cyberpunk)
  const [visualizacao, setVisualizacao] = useState<'app' | 'landing'>('app');
  const [abaAtiva, setAbaAtiva] = useState<'treinos' | 'nutricao' | 'hidratacao' | 'resumo'>('treinos');
  const [subAbaTreinos, setSubAbaTreinos] = useState<'particulares' | 'personalizado' | 'todos'>('particulares');

  // Modais Funcionais
  const [modalCameraAberto, setModalCameraAberto] = useState(false);
  const [modalBuscaManualAberto, setModalBuscaManualAberto] = useState(false);
  const [categoriaBuscaManual, setCategoriaBuscaManual] = useState<string>('todos');
  const [modalHospedagemAberto, setModalHospedagemAberto] = useState(false);
  const [modalQuestionarioAberto, setModalQuestionarioAberto] = useState(false);

  const handleAbrirBuscaManual = (cat: string = 'todos') => {
    setCategoriaBuscaManual(cat);
    setModalBuscaManualAberto(true);
  };

  // Modais Comerciais, Nuvem & Painel do Dono
  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);
  const [modalAuthAberto, setModalAuthAberto] = useState(false);
  const [modalUpgradeAberto, setModalUpgradeAberto] = useState(false);
  const [modalDonoAberto, setModalDonoAberto] = useState(false);
  const [planoCheckout, setPlanoCheckout] = useState<'basico' | 'premium'>('premium');

  // Estados Reativos
  const [dados, setDados] = useState(obterDadosDiarios());
  const [usuario, setUsuario] = useState(obterUsuarioAtual());
  const [sincronizandoNuvem, setSincronizandoNuvem] = useState(false);
  const [avisoSucessoNuvem, setAvisoSucessoNuvem] = useState(false);

  // Estados de Treino Adaptado & Anamnese Articular
  const [planoPersonalizado, setPlanoPersonalizado] = useState<PlanoTreinoPersonalizado | null>(
    obterPlanoTreinoPersonalizado()
  );
  const [anamneseArticular, setAnamneseArticular] = useState<RespostasQuestionarioArticular | null>(
    obterAnamneseArticular()
  );

  useEffect(() => {
    // Inicializa PWA
    inicializarPWA();

    const atualizarDados = () => setDados(obterDadosDiarios());
    const cancelarDados = subscreverEstado(atualizarDados);

    const cancelarComercial = assinarEstadoComercial((u: any) => setUsuario(u));

    // Se o usuário não tiver plano definido ainda ou estiver com conta temporária, inicializa com o Acesso Dono Master
    const usuarioAtual = obterUsuarioAtual();
    if (!usuarioAtual.autenticado || usuarioAtual.plano === 'nenhum' || usuarioAtual.email === 'atleta@titanfit.app') {
      salvarSessaoUsuario({
        id: 'owner_master',
        email: EMAIL_DONO_MESTRE,
        plano: 'premium',
        nome: 'Dono Master (TitanFit)',
        papel: 'dono',
        dono: true
      });
    }

    return () => {
      cancelarDados();
      cancelarComercial();
    };
  }, []);

  /**
   * Verificação de Segurança de Acesso à Câmera IA de Alimentos
   * Se o usuário tiver plano 'Básico', abre o modal de Upgrade por R$ 2,10
   */
  const handleAbrirCameraIA = () => {
    const permissao = verificarPermissaoRecurso('camera_ia');

    if (!permissao.permitido) {
      setModalUpgradeAberto(true);
      return;
    }

    setModalCameraAberto(true);
  };

  /**
   * Verificação de Segurança para o Questionário Articular e Treino Adaptado (VIP)
   * Se o usuário tiver plano Básico, convida para upgrade de R$ 2,10
   */
  const handleAbrirQuestionarioArticular = () => {
    const permissao = verificarPermissaoRecurso('questionario_articular');

    if (!permissao.permitido) {
      setModalUpgradeAberto(true);
      return;
    }

    setModalQuestionarioAberto(true);
  };

  const handleSincronizarNuvem = async () => {
    setSincronizandoNuvem(true);
    await sincronizarDadosNuvem();
    setSincronizandoNuvem(false);
    setAvisoSucessoNuvem(true);
    setTimeout(() => setAvisoSucessoNuvem(false), 2500);
  };

  const handleSelecionarPlanoLanding = (plano: 'basico' | 'premium') => {
    setPlanoCheckout(plano);
    setModalCheckoutAberto(true);
  };

  const handleCheckoutSucesso = (resultado: any) => {
    setModalCheckoutAberto(false);
    setVisualizacao('app');
  };

  // RENDERIZAÇÃO DA PÁGINA DE VENDAS CINEMATOGRÁFICA
  if (visualizacao === 'landing') {
    return (
      <>
        <PWAInstallBanner />
        <CinematicLandingPage
          onSelecionarPlano={handleSelecionarPlanoLanding}
          onAbrirAppDemo={() => setVisualizacao('app')}
          onAbrirLogin={() => setModalAuthAberto(true)}
        />
        <CheckoutModal
          aberto={modalCheckoutAberto}
          planoInicial={planoCheckout}
          onFechar={() => setModalCheckoutAberto(false)}
          onSucesso={handleCheckoutSucesso}
        />
        <AuthModal
          aberto={modalAuthAberto}
          onFechar={() => setModalAuthAberto(false)}
          onAutenticado={() => { setModalAuthAberto(false); setVisualizacao('app'); }}
        />
      </>
    );
  }

  // RENDERIZAÇÃO DO APLICATIVO OPERACIONAL
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans pb-24 md:pb-8 w-full max-w-full overflow-x-hidden">
      {/* 1. Infraestrutura PWA - Banner Superior de Instalação no Celular */}
      <PWAInstallBanner />

      {/* Indicador de Resiliência Offline */}
      <OfflineIndicator />

      {/* Barra de Navegação Superior / Header */}
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 py-2.5 sm:py-3 w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/10 flex-shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1">
                  Titan<span className="text-emerald-400">Fit</span>
                </h1>

                {/* Badge do Plano Ativo do Usuário / Dono Master */}
                {isDono(usuario) ? (
                  <button
                    onClick={() => setModalDonoAberto(true)}
                    className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer hover:scale-105 transition flex-shrink-0"
                    title="Acesso Dono Master Ativo (Clique para abrir Painel)"
                  >
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950 fill-slate-950" /> DONO MASTER
                  </button>
                ) : usuario.plano === 'premium' ? (
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 flex items-center gap-1 shadow-sm flex-shrink-0">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> VIP
                  </span>
                ) : (
                  <button
                    onClick={() => setModalUpgradeAberto(true)}
                    className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500 hover:text-purple-300 transition cursor-pointer flex items-center gap-1 flex-shrink-0"
                    title="Clique para fazer upgrade para Premium VIP"
                  >
                    <span>BÁSICO</span>
                    <span className="text-purple-400 font-bold hidden sm:inline">+ Upgrade</span>
                  </button>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 hidden xs:block truncate">Fitness, Biomecânica & Nutrição IA</p>
            </div>
          </div>

          {/* Ações Rápidas do Topo */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Botão Painel do Dono */}
            <button
              onClick={() => setModalDonoAberto(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              title="Acesso e Credenciais do Dono"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="hidden md:inline">Acesso Dono</span>
            </button>

            {/* Botão para alternar e demonstrar a Landing Page de Vendas */}
            <button
              onClick={() => setVisualizacao('landing')}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-900/60 to-slate-900 hover:from-purple-800 text-purple-300 border border-purple-500/30 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              title="Abrir Página de Vendas Cinematográfica"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="hidden md:inline">Vendas</span>
            </button>

            {/* Sincronização em Nuvem */}
            <button
              onClick={handleSincronizarNuvem}
              disabled={sincronizandoNuvem}
              className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                avisoSucessoNuvem
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Sincronizar dados com a Nuvem"
            >
              <Cloud className={`w-3.5 h-3.5 flex-shrink-0 ${sincronizandoNuvem ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
              <span className="hidden md:inline">
                {avisoSucessoNuvem ? 'Nuvem OK!' : sincronizandoNuvem ? 'Sincronizando...' : 'Nuvem'}
              </span>
            </button>

            {/* Ação Principal: Câmera IA com Verificação de Plano */}
            <button
              onClick={handleAbrirCameraIA}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95"
              title="Escanear Prato por IA"
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Escanear Prato</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal com Abas de Navegação */}
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-5 flex-1">
        {/* Navegação Desktop por Abas (Exibida apenas em telas grandes) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#111827] p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => setAbaAtiva('treinos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              abaAtiva === 'treinos'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>2.000+ Exercícios (GIFs em Loop)</span>
          </button>

          <button
            onClick={() => setAbaAtiva('nutricao')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              abaAtiva === 'nutricao'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Nutrição & Câmera IA</span>
          </button>

          <button
            onClick={() => setAbaAtiva('hidratacao')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              abaAtiva === 'hidratacao'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Hidratação (3.000ml)</span>
          </button>

          <button
            onClick={() => setAbaAtiva('resumo')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              abaAtiva === 'resumo'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Painel do Dia</span>
          </button>
        </div>

        {/* Banner de Status da Conta / Alternar para Plano Básico ou Premium para teste */}
        <div className="mb-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-300 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <span className="truncate">
              Conectado como: <strong className="text-white">{usuario.nome || usuario.email}</strong>
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
              {usuario.plano}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => salvarSessaoUsuario({ ...usuario, plano: usuario.plano === 'premium' ? 'basico' : 'premium' })}
              className="text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              Testar como {usuario.plano === 'premium' ? 'Plano Básico' : 'Plano Premium VIP'}
            </button>
            <button
              onClick={() => setModalAuthAberto(true)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            >
              Trocar Conta
            </button>
          </div>
        </div>

        {/* Visualização da Aba Selecionada */}
        {abaAtiva === 'treinos' && (
          <div className="space-y-4">
            {/* Seletor de Sub-Abas de Treino com Suporte a Mobile Scroll */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#111827] p-1 sm:p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSubAbaTreinos('particulares')}
                className={`flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  subAbaTreinos === 'particulares'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Dumbbell className={`w-3.5 h-3.5 flex-shrink-0 ${subAbaTreinos === 'particulares' ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span className="truncate">Meus Treinos Particulares</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-black flex-shrink-0 ${
                  subAbaTreinos === 'particulares' ? 'bg-slate-950/40 text-emerald-200' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  MEU
                </span>
              </button>

              <button
                onClick={() => setSubAbaTreinos('personalizado')}
                className={`flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  subAbaTreinos === 'personalizado'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Treino VIP Anti-Lesão</span>
                <span className="text-[9px] sm:text-[10px] bg-slate-950/60 text-purple-300 px-1 py-0.2 rounded font-black flex-shrink-0">
                  VIP
                </span>
              </button>

              <button
                onClick={() => setSubAbaTreinos('todos')}
                className={`flex-1 min-w-[110px] sm:min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  subAbaTreinos === 'todos'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                <span className="truncate">2.000+ Exercícios</span>
              </button>
            </div>

            {/* Conteúdo da Sub-Aba Ativa */}
            {subAbaTreinos === 'particulares' ? (
              <CustomWorkoutManager />
            ) : subAbaTreinos === 'personalizado' ? (
              <PersonalizedWorkoutView
                plano={planoPersonalizado}
                onAbrirQuestionario={handleAbrirQuestionarioArticular}
              />
            ) : (
              <div className="space-y-4">
                {/* Banner de Chamada para a Avaliação Articular */}
                <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-pink-950/60 border border-purple-500/40 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">
                        Sente dores nos joelhos, lombar, ombros ou punhos?
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Faça a avaliação articular para receber um treino 100% personalizado com substituição de exercícios de risco.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAbrirQuestionarioArticular}
                    className="self-start sm:self-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-md whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Fazer Avaliação VIP</span>
                  </button>
                </div>

                <ExerciseCatalog />
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'nutricao' && (
          <MacroConsumptionChart
            onAbrirCameraIA={handleAbrirCameraIA}
            onAbrirBuscaManual={handleAbrirBuscaManual}
          />
        )}

        {abaAtiva === 'hidratacao' && <HydrationTracker />}

        {abaAtiva === 'resumo' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MacroConsumptionChart
                onAbrirCameraIA={handleAbrirCameraIA}
                onAbrirBuscaManual={handleAbrirBuscaManual}
              />
              <HydrationTracker />
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Destaques e Metas do Dia
              </h3>
              <p className="text-xs text-slate-400">
                Seus dados são sincronizados com a Nuvem e com o armazenamento interno seguro do aparelho (LocalStorage), permitindo treino completo mesmo em modo avião ou sem sinal de internet na academia.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Barra de Navegação Inferior para Celular / PWA (Estilo Nativo App Store) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setAbaAtiva('treinos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            abaAtiva === 'treinos' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px]">Treinos</span>
        </button>

        <button
          onClick={() => setAbaAtiva('nutricao')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            abaAtiva === 'nutricao' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px]">Nutrição</span>
        </button>

        {/* Botão Central de Câmera Rápida com Verificação de Plano */}
        <button
          onClick={handleAbrirCameraIA}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer"
          title="Fotografar Refeição"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
        </button>

        <button
          onClick={() => setAbaAtiva('hidratacao')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            abaAtiva === 'hidratacao' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-5 h-5" />
          <span className="text-[10px]">Água (3L)</span>
        </button>

        <button
          onClick={() => setAbaAtiva('resumo')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            abaAtiva === 'resumo' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Painel</span>
        </button>
      </nav>

      {/* Modais Funcionais */}
      <NutritionCameraModal
        aberto={modalCameraAberto}
        onFechar={() => setModalCameraAberto(false)}
      />

      <ManualFoodSearchModal
        aberto={modalBuscaManualAberto}
        onFechar={() => setModalBuscaManualAberto(false)}
        categoriaInicial={categoriaBuscaManual}
      />

      <FreeHostingGuideModal
        aberto={modalHospedagemAberto}
        onFechar={() => setModalHospedagemAberto(false)}
      />

      <JointAssessmentModal
        aberto={modalQuestionarioAberto}
        onFechar={() => setModalQuestionarioAberto(false)}
        anamneseAtual={anamneseArticular}
        onTreinoGerado={(novoPlano) => {
          setPlanoPersonalizado(novoPlano);
          setAnamneseArticular(obterAnamneseArticular());
          setSubAbaTreinos('personalizado');
        }}
      />

      {/* Modais Comerciais & Nuvem */}
      <CheckoutModal
        aberto={modalCheckoutAberto}
        planoInicial={planoCheckout}
        onFechar={() => setModalCheckoutAberto(false)}
        onSucesso={handleCheckoutSucesso}
      />

      <AuthModal
        aberto={modalAuthAberto}
        onFechar={() => setModalAuthAberto(false)}
        onAutenticado={() => setModalAuthAberto(false)}
      />

      <UpgradePremiumModal
        aberto={modalUpgradeAberto}
        onFechar={() => setModalUpgradeAberto(false)}
        onUpgradeSucesso={() => {
          salvarSessaoUsuario({ ...usuario, plano: 'premium' });
          setModalCameraAberto(true);
        }}
      />

      {/* Painel de Credenciais e Controle do Dono Master */}
      <OwnerModal
        aberto={modalDonoAberto}
        onFechar={() => setModalDonoAberto(false)}
        usuarioAtual={usuario}
        onAtualizarSessao={(u) => setUsuario(u)}
      />
    </div>
  );
}

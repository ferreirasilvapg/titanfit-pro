import React, { useState } from 'react';
import { PAYMENT_CONFIG } from '../core/titanCommercial.js';
import {
  Sparkles,
  Zap,
  Dumbbell,
  Camera,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Flame,
  ArrowRight,
  Trophy,
  Activity,
  Star,
  Users,
  Smartphone,
  ChevronDown,
  Layers,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  onSelecionarPlano: (plano: 'basico' | 'premium') => void;
  onAbrirAppDemo: () => void;
  onAbrirLogin: () => void;
}

export const CinematicLandingPage: React.FC<Props> = ({
  onSelecionarPlano,
  onAbrirAppDemo,
  onAbrirLogin,
}) => {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Luzes Cyberpunk de Fundo (Backlight Glows) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none -z-10"></div>

      {/* Topo / Header da Landing Page */}
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-xl sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-purple-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white flex items-center gap-1">
                Titan<span className="text-emerald-400">Fit</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                  CYBER PRO
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAbrirLogin}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              Já sou Aluno
            </button>

            <button
              onClick={() => onSelecionarPlano('premium')}
              className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assinar Agora</span>
              <span className="sm:hidden">Assinar</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION CINEMATOGRÁFICA */}
      <section className="relative px-4 pt-10 pb-16 md:pt-16 md:pb-24 max-w-5xl mx-auto text-center space-y-6">
        {/* Badge Futurista */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Tecnologia PWA • Funciona Offline • Instalação sem App Store</span>
        </div>

        {/* Título de Alto Impacto */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          O Ecossistema Definitivo para sua <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
            Evolução Corporal e Nutricional
          </span>
        </h1>

        {/* Subtítulo com Gatilhos Mentais */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Treinos com <strong>GIFs reais em loop contínuo 60fps</strong>, leitura instantânea de pratos com <strong>Inteligência Artificial por Câmera</strong> e hidratação inteligente no seu celular.
        </p>

        {/* Botão de Ação CTA Pulsante Principal */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => onSelecionarPlano('premium')}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95 cursor-pointer animate-pulse flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Quero Acesso Instantâneo</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onAbrirAppDemo}
            className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs px-5 py-4 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Experimentar App Demo</span>
          </button>
        </div>

        {/* Prova Social / Selos de Confiança */}
        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Liberação Imediata via PIX</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Garantia Incondicional de 7 Dias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Instala no Android & iPhone</span>
          </div>
        </div>

        {/* MOCKUP VISUAL INTERATIVO DO PRODUTO (SHOWCASE) */}
        <div className="relative pt-6 max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-2 sm:p-4 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              {/* Preview 1: Exercício em Loop Real */}
              <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Biomecânica
                    </span>
                    <span className="text-[10px] text-slate-400">60fps Loop</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2">Agachamento Completo</h4>
                </div>
                <div className="aspect-video bg-white rounded-xl overflow-hidden flex items-center justify-center my-1">
                  <img
                    src="/exercises/smith-squat.gif"
                    alt="Agachamento loop"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Prescrição: 2 séries × 8-12 reps
                </span>
              </div>

              {/* Preview 2: Scanner de Alimentos por Câmera IA */}
              <div className="bg-[#0b0f19] border border-purple-500/40 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-purple-500/10">
                <div className="absolute top-0 right-0 bg-purple-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-bl uppercase">
                  IA Visão
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-purple-400">
                    <Camera className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Scanner IA</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Leitura de Refeição</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 my-1 text-center space-y-1">
                  <span className="text-lg font-black text-amber-400">485 kcal</span>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                    <span className="text-emerald-400 bg-slate-800/80 rounded py-0.5">P: 48g</span>
                    <span className="text-cyan-400 bg-slate-800/80 rounded py-0.5">C: 44g</span>
                    <span className="text-rose-400 bg-slate-800/80 rounded py-0.5">G: 9g</span>
                  </div>
                </div>
                <span className="text-[10px] text-purple-300 font-semibold mt-2 block">
                  Identifica pratos em 2 segundos
                </span>
              </div>

              {/* Preview 3: Hidratação 3000ml */}
              <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-cyan-400">
                    <Droplets className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Hidratação</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Meta 3.000ml Diária</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 my-1 text-center">
                  <div className="text-lg font-black text-cyan-400">2.250 / 3000 ml</div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div className="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Incremento com 1 toque no celular
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILARES FUNDAMENTAIS COM GATILHOS MENTAIS */}
      <section className="px-4 py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Tríade do Crescimento Muscular
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Tudo o que Você Precisa em um Único App
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sem planilhas complexas, sem anotações em papel e sem perder seu progresso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pilar 1 */}
            <div className="bg-[#111827] border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Acervo 2.000+ Exercícios GIF
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Biomecânica real em repetição contínua 60fps. Aprenda a trajetória correta sem precisar pausar para abrir vídeos externos.
              </p>
            </div>

            {/* Pilar 2: NOVO - ANAMNESE ARTICULAR & TREINO ADAPTADO */}
            <div className="bg-[#111827] border border-slate-800 hover:border-pink-500/50 p-6 rounded-3xl transition duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white">
                  Treino Adaptado Anti-Lesão
                </h3>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">
                  VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Questionário articular para joelhos, hérnia lombar, ombros e punhos. Substituição automática de movimentos contraindicados.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-[#111827] border border-slate-800 hover:border-purple-500/50 p-6 rounded-3xl transition duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Scanner Nutricional IA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aponte a câmera pro prato. Visão computacional com base TACO & USDA para cálculo exato de Proteínas, Carbos, Gorduras e Fibras.
              </p>
            </div>

            {/* Pilar 4 */}
            <div className="bg-[#111827] border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl transition duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Hidratação & Nuvem
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acompanhe a meta de 3000ml. Seus dados e cargas são sincronizados na nuvem e nunca são perdidos ao trocar de aparelho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TABELA DE PREÇOS DINÂMICA DE ALTA CONVERSÃO */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto space-y-12" id="precos">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Acesso Imediato
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Planos Transparentes e Acessíveis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Escolha o plano ideal para transformar seus resultados físicos e nutricionais.
          </p>
        </div>

        {/* Grade de Preços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* PLANO BÁSICO */}
          <div className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Plano Básico</h3>
                  <p className="text-xs text-slate-400">Focado em Treinos e Cargas</p>
                </div>
                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                  Essencial
                </span>
              </div>

              {/* Preço */}
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">R$ 9,90</span>
                  <span className="text-xs font-semibold text-slate-400">/mês</span>
                </div>
                <span className="text-[11px] text-slate-500">Cobrança mensal simples</span>
              </div>

              {/* Lista de Recursos */}
              <ul className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Acervo Completo de Exercícios com GIFs em Loop</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Histórico de Cargas (kg) e Séries por Exercício</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Rastreador de Hidratação Diária (Meta 3.000ml)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instalação PWA Direta no Celular (Modo Offline)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">✕</span>
                  <span>Questionário Articular & Treino Adaptado (VIP)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">✕</span>
                  <span>Scanner por Câmera IA (Exclusivo Premium)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelecionarPlano('basico')}
              className="w-full mt-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs transition cursor-pointer border border-slate-700"
            >
              Assinar Plano Básico (R$ 9,90)
            </button>
          </div>

          {/* PLANO PREMIUM VIP (MAIS ESCOLHIDO) */}
          <div className="bg-gradient-to-b from-[#161226] via-[#111827] to-[#0b0f19] border-2 border-purple-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition relative shadow-2xl shadow-purple-500/20">
            {/* Badge de Destaque */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
              ★ MAIS ESCOLHIDO / RECOMENDADO ★
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Plano Premium VIP
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">Treino Adaptado + Scanner IA Ilimitado</p>
                </div>
                <span className="text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-full">
                  Completo
                </span>
              </div>

              {/* Preço */}
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-purple-400">R$ 12,00</span>
                  <span className="text-xs font-semibold text-slate-400">/mês</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Apenas R$ 2,10 a mais que o plano básico!
                </span>
              </div>

              {/* Lista de Recursos */}
              <ul className="space-y-2.5 pt-2 text-xs text-slate-200 border-t border-slate-800">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Tudo do Plano Básico</strong> incluído</span>
                </li>
                <li className="flex items-center gap-2 font-medium bg-purple-950/40 p-1.5 rounded-xl border border-purple-500/30">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span className="text-white"><strong>Questionário Articular & Treino 100% Adaptado</strong> (Anti-Lesão para joelhos, coluna, ombros e punhos)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span><strong>Scanner de Alimentos por Câmera IA</strong> (Reconhecimento de Pratos)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Base Global de Alimentos (Tabela TACO Brasil & USDA)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Cálculo Automático de Calorias, Proteínas, Carbos e Gorduras</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span><strong>Sincronização Contínua em Nuvem</strong> Multi-Dispositivos</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelecionarPlano('premium')}
              className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
            >
              <Zap className="w-4 h-4" />
              <span>Quero Acesso Instantâneo (R$ 12,00)</span>
            </button>
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES (FAQ) */}
      <section className="px-4 py-16 max-w-3xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-center text-white">Perguntas Frequentes</h3>
        <div className="space-y-2.5">
          {[
            {
              p: 'Como funciona a liberação imediata por PIX?',
              r: 'Assim que o pagamento do Pix é realizado no seu banco, o sistema reconhece a aprovação automaticamente via Webhook e libera seu acesso ao app em menos de 5 segundos, sem intervenção humana.'
            },
            {
              p: 'Preciso baixar o aplicativo na Play Store ou App Store?',
              r: 'Não! O TitanFit utiliza a arquitetura PWA (Progressive Web App). Você pode adicioná-lo à tela inicial do seu celular com 1 toque através do link fornecido, funcionando com ícone próprio e suporte offline.'
            },
            {
              p: 'Meus dados ficam salvos se eu trocar de celular?',
              r: 'Sim! Com a persistência em Nuvem, todos os seus treinos, cargas registradas e metas de água ficam seguros na sua conta por e-mail.'
            },
            {
              p: 'Como funciona a garantia incondicional de 7 dias?',
              r: 'Você tem 7 dias de garantia total. Se por qualquer motivo você não amar a experiência do TitanFit, basta nos enviar um e-mail para receber 100% do seu dinheiro de volta.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white transition hover:text-emerald-400 cursor-pointer"
              >
                <span>{item.p}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    faqAberto === idx ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {faqAberto === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                  {item.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 TitanFit - Todos os direitos reservados. CNPJ e infraestrutura Cloud ativa.</p>
        <p className="text-[11px]">Desenvolvido com padrão PWA de alta conversão para Vercel & Google AI Studio.</p>
      </footer>
    </div>
  );
};

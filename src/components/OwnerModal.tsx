import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  Key,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Dumbbell,
  HeartPulse,
  CreditCard,
  Cloud,
  Smartphone,
  X,
  Lock,
  Zap,
  Building,
  QrCode,
  DollarSign,
  HelpCircle,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { salvarSessaoUsuario, EMAIL_DONO_MESTRE } from '../core/titanCommercial.js';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  usuarioAtual: any;
  onAtualizarSessao: (usuario: any) => void;
}

export const OwnerModal: React.FC<Props> = ({
  aberto,
  onFechar,
  usuarioAtual,
  onAtualizarSessao
}) => {
  const [aba, setAba] = useState<'credenciais' | 'kiwify' | 'recursos'>('kiwify');
  const [copiado, setCopiado] = useState(false);
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [copiadoWebhook, setCopiadoWebhook] = useState(false);

  // Estados de Configuração Bancária & Kiwify
  const [chavePix, setChavePix] = useState(EMAIL_DONO_MESTRE);
  const [kiwifyBasicoUrl, setKiwifyBasicoUrl] = useState('');
  const [kiwifyPremiumUrl, setKiwifyPremiumUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [avisoSalvo, setAvisoSalvo] = useState(false);

  const urlAtual = typeof window !== 'undefined' ? window.location.origin : 'https://titanfit.app';
  const urlWebhook = `${urlAtual}/api/webhook/kiwify`;

  useEffect(() => {
    // Carrega configurações bancárias ativas do servidor
    if (aberto) {
      fetch('/api/payment/config')
        .then((r) => r.json())
        .then((d) => {
          if (d.sucesso && d.config) {
            if (d.config.chavePix) setChavePix(d.config.chavePix);
            if (d.config.kiwifyBasicoUrl) setKiwifyBasicoUrl(d.config.kiwifyBasicoUrl);
            if (d.config.kiwifyPremiumUrl) setKiwifyPremiumUrl(d.config.kiwifyPremiumUrl);
          }
        })
        .catch((e) => console.warn('Erro ao carregar config bancaria:', e));
    }
  }, [aberto]);

  if (!aberto) return null;

  const handleCopiarEmail = () => {
    navigator.clipboard?.writeText(EMAIL_DONO_MESTRE);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCopiarLink = () => {
    navigator.clipboard?.writeText(urlAtual);
    setCopiadoLink(true);
    setTimeout(() => setCopiadoLink(false), 2000);
  };

  const handleCopiarWebhook = () => {
    navigator.clipboard?.writeText(urlWebhook);
    setCopiadoWebhook(true);
    setTimeout(() => setCopiadoWebhook(false), 2000);
  };

  const handleSalvarConfigBancaria = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch('/api/payment/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chavePix,
          kiwifyBasicoUrl,
          kiwifyPremiumUrl
        })
      });
      if (res.ok) {
        setAvisoSalvo(true);
        setTimeout(() => setAvisoSalvo(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleGarantirAcessoDono = () => {
    const usuarioDono = salvarSessaoUsuario({
      id: 'owner_master',
      email: EMAIL_DONO_MESTRE,
      nome: 'Dono Master (TitanFit)',
      plano: 'premium',
      papel: 'dono',
      dono: true
    });
    onAtualizarSessao(usuarioDono);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-amber-500/40 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col">
        {/* Botão Fechar */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho de Dono Master */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Crown className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Painel do Dono & Recebimentos</h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Controle financeiro, Kiwify, Pix bancário e permissões</p>
          </div>
        </div>

        {/* Abas do Painel */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setAba('kiwify')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'kiwify' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Kiwify & Pix</span>
          </button>
          <button
            type="button"
            onClick={() => setAba('credenciais')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'credenciais' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Meu Acesso</span>
          </button>
          <button
            type="button"
            onClick={() => setAba('recursos')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'recursos' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recursos VIP</span>
          </button>
        </div>

        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* ================================================================= */}
          {/* ABA 1: CONFIGURAÇÃO BANCÁRIA, KIWIFY & PIX                        */}
          {/* ================================================================= */}
          {aba === 'kiwify' && (
            <div className="space-y-4">
              {/* Tutorial Prático Kiwify */}
              <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider">
                    Como Vender pela Kiwify (Passo a Passo)
                  </h4>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong className="text-white">Conta Bancária na Kiwify:</strong> Acesse seu painel na Kiwify em <span className="text-amber-400 font-semibold">Financeiro &gt; Dados Bancários</span> e cadastre sua conta corrente ou Pix para onde o dinheiro das vendas será transferido.
                  </li>
                  <li>
                    <strong className="text-white">Criar os 2 Produtos na Kiwify:</strong>
                    <ul className="list-disc list-inside pl-4 text-slate-400 mt-1 space-y-0.5">
                      <li>Produto 1: <span className="text-emerald-400 font-bold">TitanFit Plano Básico</span> — Preço: <strong className="text-white">R$ 9,90</strong></li>
                      <li>Produto 2: <span className="text-purple-400 font-bold">TitanFit Plano Premium VIP</span> — Preço: <strong className="text-white">R$ 12,00</strong></li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Ativar a Liberação Automática (Webhook):</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">Na Kiwify, vá em <span className="text-cyan-400 font-semibold">Apps &gt; Webhooks &gt; Adicionar</span>, cole a URL abaixo e marque o evento <em>"Pedido aprovado"</em>:</p>
                    <div className="flex items-center gap-1.5 mt-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-cyan-400 flex-1 truncate">{urlWebhook}</span>
                      <button
                        type="button"
                        onClick={handleCopiarWebhook}
                        className="px-2 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiadoWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar Webhook</span>
                      </button>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Formulário de Configurações Bancárias */}
              <form onSubmit={handleSalvarConfigBancaria} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Chave Pix Direta (Para Receber sem Taxas)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Cai Direto na Sua Conta</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Sua Chave Pix (E-mail, CPF, CNPJ ou Telefone):
                  </label>
                  <input
                    type="text"
                    value={chavePix}
                    onChange={(e) => setChavePix(e.target.value)}
                    placeholder="destaquenewspg@gmail.com"
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Essa chave é usada na geração automática do QR Code Pix e Copia e Cola no checkout do app.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Link de Checkout Kiwify - Plano Básico (R$ 9,90):
                  </label>
                  <input
                    type="url"
                    value={kiwifyBasicoUrl}
                    onChange={(e) => setKiwifyBasicoUrl(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/SEU_LINK_BASICO"
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Link de Checkout Kiwify - Plano Premium VIP (R$ 12,00):
                  </label>
                  <input
                    type="url"
                    value={kiwifyPremiumUrl}
                    onChange={(e) => setKiwifyPremiumUrl(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/SEU_LINK_PREMIUM"
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                {avisoSalvo && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Configurações bancárias salvas com sucesso!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{salvando ? 'Salvando...' : 'Salvar Chave Pix & Links Kiwify'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 2: CREDENCIAIS & MEU ACESSO                                    */}
          {/* ================================================================= */}
          {aba === 'credenciais' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">E-mail do Proprietário:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-300 font-mono">{EMAIL_DONO_MESTRE}</span>
                    <button
                      onClick={handleCopiarEmail}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copiar e-mail"
                    >
                      {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Nível de Acesso:</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Vitalício Ilimitado (VIP Master)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Autenticação:</span>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">
                    Reconhecimento Master Imediato
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-400">Link Atual do App:</span>
                  </div>
                  <button
                    onClick={handleCopiarLink}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-lg cursor-pointer"
                  >
                    {copiadoLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar Link</span>
                  </button>
                </div>
              </div>

              {/* Status Atual da Sessão */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-emerald-300">
                      Sessão Ativa: {usuarioAtual?.email === EMAIL_DONO_MESTRE ? 'Dono Master Reconhecido' : usuarioAtual?.email || 'Visitante'}
                    </p>
                    <p className="text-[10px] text-emerald-400/80">Plano Ativo: {usuarioAtual?.plano?.toUpperCase() || 'PREMIUM'}</p>
                  </div>
                </div>

                <button
                  onClick={handleGarantirAcessoDono}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Reativar Dono</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 3: RECURSOS VIP DESBLOQUEADOS                                  */}
          {/* ================================================================= */}
          {aba === 'recursos' && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                Recursos 100% Desbloqueados na sua Conta:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">Scanner Nutricional por Câmera IA</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">Questionário Articular & Treino Adaptado</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">2.000+ Exercícios com GIFs em Loop</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">Gateway Pix / Cartão (R$9,90 e R$12)</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">Sincronização em Nuvem Global</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200 text-[11px]">Instalação PWA Direta no Celular</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onFechar}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
        >
          Fechar Painel
        </button>
      </div>
    </div>
  );
};

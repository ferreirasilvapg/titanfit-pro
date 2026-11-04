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
  AlertCircle,
  Users,
  Share2,
  Trash2,
  UserCheck,
  MessageCircle,
} from 'lucide-react';
import {
  salvarSessaoUsuario,
  EMAIL_DONO_MESTRE,
  obterEmailsFamiliaAutorizados,
  autorizarEmailFamilia,
  removerEmailFamilia,
  gerarLinkConviteFamilia
} from '../core/titanCommercial.js';

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
  const [aba, setAba] = useState<'kiwify' | 'familia' | 'credenciais' | 'recursos'>('familia');
  const [copiado, setCopiado] = useState(false);
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [copiadoLinkFamilia, setCopiadoLinkFamilia] = useState(false);
  const [copiadoWebhook, setCopiadoWebhook] = useState(false);

  // Estados de Configuração Bancária & Kiwify
  const [chavePix, setChavePix] = useState(EMAIL_DONO_MESTRE);
  const [kiwifyBasicoUrl, setKiwifyBasicoUrl] = useState('');
  const [kiwifyPremiumUrl, setKiwifyPremiumUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [avisoSalvo, setAvisoSalvo] = useState(false);

  // Estados de Gestão de Família & VIPs
  const [emailsFamilia, setEmailsFamilia] = useState<any[]>([]);
  const [novoEmailFamilia, setNovoEmailFamilia] = useState('');
  const [novoNomeFamilia, setNovoNomeFamilia] = useState('');

  const urlAtual = typeof window !== 'undefined' ? window.location.origin : 'https://titanfit.app';
  const urlWebhook = `${urlAtual}/api/webhook/kiwify`;
  const urlConviteFamilia = `${urlAtual}?vip=familia`;

  useEffect(() => {
    if (aberto) {
      setEmailsFamilia(obterEmailsFamiliaAutorizados());
    }
  }, [aberto]);

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

  const handleCopiarLinkFamilia = () => {
    navigator.clipboard?.writeText(urlConviteFamilia);
    setCopiadoLinkFamilia(true);
    setTimeout(() => setCopiadoLinkFamilia(false), 2000);
  };

  const handleAdicionarEmailFamilia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoEmailFamilia.trim()) return;
    autorizarEmailFamilia(novoEmailFamilia.trim(), novoNomeFamilia.trim() || 'Membro da Família');
    setEmailsFamilia(obterEmailsFamiliaAutorizados());
    setNovoEmailFamilia('');
    setNovoNomeFamilia('');
  };

  const handleRemoverEmailFamilia = (email: string) => {
    removerEmailFamilia(email);
    setEmailsFamilia(obterEmailsFamiliaAutorizados());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-amber-500/40 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
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
              <h3 className="text-base font-extrabold text-white">Painel do Dono & Família</h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Autorização familiar, vendas Kiwify, Pix e permissões</p>
          </div>
        </div>

        {/* Abas do Painel em 4 Colunas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setAba('familia')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'familia' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Família & VIPs</span>
          </button>
          <button
            type="button"
            onClick={() => setAba('kiwify')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'kiwify' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Kiwify & Pix</span>
          </button>
          <button
            type="button"
            onClick={() => setAba('credenciais')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'credenciais' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Meu Acesso</span>
          </button>
          <button
            type="button"
            onClick={() => setAba('recursos')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              aba === 'recursos' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recursos VIP</span>
          </button>
        </div>

        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* ================================================================= */}
          {/* ABA 0: COMPARTILHAR COM A FAMÍLIA & AUTORIZAÇÃO VIP               */}
          {/* ================================================================= */}
          {aba === 'familia' && (
            <div className="space-y-4">
              {/* Card Explicativo com Informações Claras */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      Como Funciona o Acesso da sua Família
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Sim! Você pode compartilhar o link e liberar acesso gratuito para todos os membros da sua família.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 mt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Dados 100% Isolados:</strong> O diário alimentar, o peso registrado, a hidratação e os treinos de cada familiar ficam salvos no celular de cada um. Ninguém vê ou mistura dados dos outros.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Recursos VIP Liberados:</strong> Câmera com IA para escanear pratos, treinos particulares com GIFs, avaliação anti-lesão e macros em gramas/ml.</span>
                  </div>
                </div>
              </div>

              {/* Opção 1: Link VIP com 1 Toque (WhatsApp) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Opção 1: Link de Convite VIP Automático (Mais Fácil)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ao clicar nesse link no WhatsApp, o celular do seu familiar já abre com o TitanFit liberado no modo <strong className="text-amber-400">PREMIUM VIP</strong> sem precisar pagar nada:
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={urlConviteFamilia}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono truncate"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopiarLinkFamilia}
                      className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                    >
                      {copiadoLinkFamilia ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Link VIP</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Oi! Te liberei acesso VIP vitalício gratuito no TitanFit Pro (Treinos com GIFs 60fps, Biomecânica, Dieta e Câmera com IA). Só abrir este link no seu celular para entrar direto como VIP:\n${urlConviteFamilia}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Opção 2: Autorizar E-mails da Família */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Opção 2: Cadastrar E-mails da Família
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Adicione o e-mail do seu familiar abaixo. Sempre que ele entrar com esse e-mail no aplicativo, o acesso Premium VIP estará liberado:
                </p>

                <form onSubmit={handleAdicionarEmailFamilia} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Identificação (ex: Esposa, Filho, Irmão...)"
                      value={novoNomeFamilia}
                      onChange={(e) => setNovoNomeFamilia(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="e-mail do familiar (ex: esposa@gmail.com)"
                      value={novoEmailFamilia}
                      onChange={(e) => setNovoEmailFamilia(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>+ Autorizar Acesso VIP Grátis</span>
                  </button>
                </form>

                {/* Lista de Familiares Autorizados */}
                {emailsFamilia.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Membros Autorizados ({emailsFamilia.length}):
                    </label>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {emailsFamilia.map((item, idx) => {
                        const email = typeof item === 'string' ? item : item.email;
                        const nome = typeof item === 'string' ? 'Familiar VIP' : item.nome || 'Familiar VIP';
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-slate-200 block truncate">{nome}</span>
                              <span className="text-[10px] text-amber-400/90 truncate block">{email}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoverEmailFamilia(email)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Opção 3: Cupom de Ativação VIP */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cupom Especial Familiar</span>
                  <span className="text-amber-400 font-black tracking-widest text-sm">FAMILIAVIP</span>
                </div>
                <span className="text-[10px] text-slate-400 text-right max-w-[190px]">
                  Basta digitar este código se abrir a tela de login para liberar na hora.
                </span>
              </div>
            </div>
          )}

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

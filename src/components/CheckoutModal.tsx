import React, { useState, useEffect } from 'react';
import {
  PAYMENT_CONFIG,
  processarPagamentoGateway,
  escutarConfirmacaoPagamento,
} from '../core/titanCommercial.js';
import {
  QrCode,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  Clock,
  ArrowRight,
  Flame,
  ExternalLink,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  planoInicial?: 'basico' | 'premium' | 'upgrade';
  onFechar: () => void;
  onSucesso: (dados: any) => void;
}

export const CheckoutModal: React.FC<Props> = ({
  aberto,
  planoInicial = 'premium',
  onFechar,
  onSucesso,
}) => {
  const [plano, setPlano] = useState<'basico' | 'premium' | 'upgrade'>(planoInicial);
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dadosPagamento, setDadosPagamento] = useState<any | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [statusAprovacao, setStatusAprovacao] = useState<'pendente' | 'aprovando' | 'aprovado'>('pendente');

  // Dados do formulário de cartão
  const [cartaoNumero, setCartaoNumero] = useState('');
  const [cartaoNome, setCartaoNome] = useState('');
  const [cartaoValidade, setCartaoValidade] = useState('');
  const [cartaoCvv, setCartaoCvv] = useState('');

  useEffect(() => {
    setPlano(planoInicial);
  }, [planoInicial]);

  useEffect(() => {
    if (!aberto) {
      setDadosPagamento(null);
      setStatusAprovacao('pendente');
    }
  }, [aberto]);

  if (!aberto) return null;

  const infoPlano = PAYMENT_CONFIG.PLANOS[plano] || PAYMENT_CONFIG.PLANOS.premium;

  const handleGerarPagamento = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCarregando(true);
    setStatusAprovacao('pendente');

    try {
      const resposta = await processarPagamentoGateway(plano, metodo, {
        numero: cartaoNumero,
        nome: cartaoNome,
        validade: cartaoValidade,
        cvv: cartaoCvv,
      });

      setDadosPagamento(resposta);
      setCarregando(false);

      if (metodo === 'cartao') {
        setStatusAprovacao('aprovado');
        setTimeout(() => {
          onSucesso({ plano, metodo: 'cartao', email });
        }, 1200);
      } else {
        // Inicia escuta do webhook/simulador de aprovação do Pix
        escutarConfirmacaoPagamento(
          resposta.pagamentoId,
          plano,
          email || 'atleta@titanfit.app',
          (resultadoAprovado: any) => {
            setStatusAprovacao('aprovado');
            setTimeout(() => {
              onSucesso(resultadoAprovado);
            }, 1200);
          }
        );
      }
    } catch (err) {
      console.error(err);
      setCarregando(false);
    }
  };

  const handleCopiarPix = () => {
    if (dadosPagamento?.pixCopiaECola) {
      navigator.clipboard.writeText(dadosPagamento.pixCopiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const simularAprovacaoImediata = () => {
    setStatusAprovacao('aprovando');
    setTimeout(() => {
      setStatusAprovacao('aprovado');
      setTimeout(() => {
        onSucesso({ plano, metodo, email: email || 'cliente@titanfit.app' });
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-lg rounded-3xl p-5 md:p-6 shadow-2xl relative my-auto">
        {/* Botão Fechar */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Zap className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Checkout Seguro TitanFit</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Liberação Imediata
              </span>
            </div>
            <p className="text-xs text-slate-400">Ativação automática via Webhook sem espera</p>
          </div>
        </div>

        {/* Seletor de Plano se não estiver em checkout */}
        {!dadosPagamento && (
          <div className="space-y-4">
            {/* Escolha do Plano */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlano('basico')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  plano === 'basico'
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Essencial
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">Plano Básico</span>
                <span className="text-base font-black text-emerald-400">R$ 9,90</span>
                <span className="text-[10px] text-slate-400">/mês</span>
              </button>

              <button
                type="button"
                onClick={() => setPlano('premium')}
                className={`p-3 rounded-2xl border text-left relative transition cursor-pointer ${
                  plano === 'premium'
                    ? 'bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-black text-[9px] px-2 py-0.2 rounded-full uppercase tracking-wider shadow">
                  VIP IA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-purple-400">
                  Mais Escolhido
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">Plano Premium</span>
                <span className="text-base font-black text-purple-400">R$ 12,00</span>
                <span className="text-[10px] text-slate-400">/mês</span>
              </button>
            </div>

            {/* Abas do Método de Pagamento */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Escolha o Método de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMetodo('pix')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    metodo === 'pix'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodo('cartao')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    metodo === 'cartao'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* Campo de E-mail para Envio de Acesso */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Seu Melhor E-mail (Para liberação da conta na Nuvem)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seuemail@gmail.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            {/* Formulário de Cartão se Cartão for Selecionado */}
            {metodo === 'cartao' && (
              <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Número do Cartão</label>
                  <input
                    type="text"
                    value={cartaoNumero}
                    onChange={(e) => setCartaoNumero(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={cartaoValidade}
                      onChange={(e) => setCartaoValidade(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">CVV</label>
                    <input
                      type="password"
                      value={cartaoCvv}
                      onChange={(e) => setCartaoCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Ação CTA Pulsante */}
            <button
              onClick={handleGerarPagamento}
              disabled={carregando}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-slate-950 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 animate-pulse"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Conectando ao Gateway...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Quero Acesso Instantâneo ({infoPlano.valorFormatado})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Exibição do QR Code / Código Pix após geração */}
        {dadosPagamento && metodo === 'pix' && (
          <div className="space-y-4 pt-1 text-center">
            {statusAprovacao === 'aprovado' ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-3xl space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-lg font-black text-white">Pagamento Aprovado com Sucesso!</h4>
                <p className="text-xs text-emerald-300">
                  Sua conta no {infoPlano.nome} foi liberada automaticamente na Nuvem. Redirecionando...
                </p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Plano: <strong className="text-white">{infoPlano.nome}</strong></span>
                    <span className="text-emerald-400 font-black text-sm">{infoPlano.valorFormatado}</span>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-3 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-500/50">
                    <img
                      src={dadosPagamento.qrCodeUrl}
                      alt="QR Code Pix"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-xs text-slate-300">
                    Abra o app do seu banco e escaneie o QR Code ou copie o código Pix abaixo:
                  </p>

                  {/* Pix Copia e Cola */}
                  <div className="bg-[#0b0f19] border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-2 text-left">
                    <span className="text-[11px] font-mono text-slate-400 truncate flex-1 select-all">
                      {dadosPagamento.pixCopiaECola}
                    </span>
                    <button
                      onClick={handleCopiarPix}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer flex-shrink-0"
                    >
                      {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Status do Webhook em Tempo Real */}
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Aguardando confirmação do banco via Webhook...</span>
                  </div>

                  {/* Botão de Checkout Kiwify Oficial se configurado */}
                  {dadosPagamento.kiwifyUrl && (
                    <a
                      href={dadosPagamento.kiwifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Pagar no Checkout Kiwify (Cartão / Pix / Parcelado)</span>
                    </a>
                  )}
                </div>

                {/* Botão de Demonstração / Teste Rápido de Aprovação */}
                <button
                  type="button"
                  onClick={simularAprovacaoImediata}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simular Aprovação Imediata do Pix (Demonstração)</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Garantia de Segurança */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Pagamento 100% Criptografado
          </span>
          <span>Garantia de 7 dias ou seu dinheiro de volta</span>
        </div>
      </div>
    </div>
  );
};

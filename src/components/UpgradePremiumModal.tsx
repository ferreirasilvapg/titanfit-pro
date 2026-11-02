import React, { useState } from 'react';
import {
  processarPagamentoGateway,
  escutarConfirmacaoPagamento,
  obterUsuarioAtual,
} from '../core/titanCommercial.js';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  QrCode,
  CreditCard,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onUpgradeSucesso: () => void;
}

export const UpgradePremiumModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onUpgradeSucesso,
}) => {
  const [etapa, setEtapa] = useState<'oferta' | 'pagamento' | 'aprovado'>('oferta');
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [dadosPagamento, setDadosPagamento] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  if (!aberto) return null;

  const usuario = obterUsuarioAtual();

  const handleIniciarUpgrade = async () => {
    setCarregando(true);
    try {
      const res = await processarPagamentoGateway('upgrade', metodo);
      setDadosPagamento(res);
      setEtapa('pagamento');
      setCarregando(false);

      if (metodo === 'cartao') {
        setEtapa('aprovado');
        setTimeout(() => {
          onUpgradeSucesso();
          onFechar();
        }, 1500);
      } else {
        escutarConfirmacaoPagamento(
          res.pagamentoId,
          'upgrade',
          usuario.email || 'atleta@titanfit.app',
          () => {
            setEtapa('aprovado');
            setTimeout(() => {
              onUpgradeSucesso();
              onFechar();
            }, 1500);
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

  const simularAprovacaoRapida = () => {
    setEtapa('aprovado');
    setTimeout(() => {
      onUpgradeSucesso();
      onFechar();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-purple-500/50 w-full max-w-md rounded-3xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {etapa === 'oferta' && (
          <div className="space-y-4 text-center pt-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Recursos Exclusivos VIP
              </span>
              <h3 className="text-xl font-black text-white">
                Treino Adaptado & Scanner IA
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Você está no <strong>Plano Básico</strong>. Faça o upgrade VIP para liberar a <strong>Anamnese Articular (Anti-Lesão)</strong> e o <strong>Scanner de Alimentos por Câmera IA</strong>!
              </p>
            </div>

            {/* Destaque do Preço da Diferença */}
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 p-4 rounded-2xl border border-purple-500/30 space-y-1">
              <span className="text-xs text-slate-400">Pague apenas a diferença:</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-black text-emerald-400">R$ 2,10</span>
                <span className="text-xs text-slate-400 font-semibold">/mês a mais</span>
              </div>
              <p className="text-[11px] text-purple-300 font-medium">
                De R$ 9,90 para R$ 12,00 • Treino Adaptado + IA Multimodal
              </p>
            </div>

            {/* Método de Pagamento */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMetodo('pix')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  metodo === 'pix'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodo('cartao')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  metodo === 'cartao'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cartão</span>
              </button>
            </div>

            {/* Botão de Upgrade CTA */}
            <button
              onClick={handleIniciarUpgrade}
              disabled={carregando}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
            >
              <span>Fazer Upgrade Agora (R$ 2,10)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {etapa === 'pagamento' && dadosPagamento && (
          <div className="space-y-4 text-center">
            <h4 className="text-base font-bold text-white">Upgrade via Pix - R$ 2,10</h4>
            <div className="bg-white p-3 rounded-2xl w-44 h-44 mx-auto border-2 border-purple-500">
              <img
                src={dadosPagamento.qrCodeUrl}
                alt="QR Code Upgrade"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-[#0b0f19] border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-400 truncate flex-1 select-all">
                {dadosPagamento.pixCopiaECola}
              </span>
              <button
                onClick={handleCopiarPix}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2 py-1 rounded text-xs transition cursor-pointer"
              >
                {copiado ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <button
              onClick={simularAprovacaoRapida}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Simular Liberação Imediata</span>
            </button>
          </div>
        )}

        {etapa === 'aprovado' && (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h4 className="text-lg font-black text-white">Upgrade Concluído com Sucesso!</h4>
            <p className="text-xs text-emerald-300">
              Câmera Nutricional com Inteligência Artificial liberada imediatamente!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

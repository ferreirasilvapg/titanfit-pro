import React, { useState, useRef } from 'react';
import {
  escanearRefeicaoComIA,
  adicionarConsumoMacro,
} from '../core/titanCore.js';
import {
  Camera,
  Upload,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Flame,
  Dna,
  Wheat,
  Droplet,
  Salad,
  RotateCcw,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onRefeicaoAdicionada?: () => void;
}

export const NutritionCameraModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onRefeicaoAdicionada,
}) => {
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [carregandoSkeleton, setCarregandoSkeleton] = useState(false);
  const [resultado, setResultado] = useState<any | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [refeicaoTipo, setRefeicaoTipo] = useState('Almoço');

  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const inputCameraRef = useRef<HTMLInputElement>(null);

  if (!aberto) return null;

  const handleProcessarArquivo = async (arquivo: File) => {
    try {
      setErro(null);
      setResultado(null);

      // Gera preview imediato
      const previewUrl = URL.createObjectURL(arquivo);
      setImagemPreview(previewUrl);

      // Chama a função assíncrona do core com flag de skeleton screen
      const resposta = await escanearRefeicaoComIA(arquivo, setCarregandoSkeleton);
      setResultado(resposta);
    } catch (err: any) {
      setErro('Não foi possível identificar a refeição. Tente uma foto mais clara com boa iluminação.');
      console.error(err);
    }
  };

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessarArquivo(e.target.files[0]);
    }
  };

  const handleSalvarRefeicao = () => {
    if (!resultado) return;

    adicionarConsumoMacro({
      nome: `${refeicaoTipo}: ${resultado.nomePrato}`,
      calorias: resultado.calorias,
      proteinas: resultado.proteinas,
      carboidratos: resultado.carboidratos,
      gorduras: resultado.gorduras,
      fibras: resultado.fibras,
      itens: resultado.alimentosDetectados,
    });

    if (onRefeicaoAdicionada) onRefeicaoAdicionada();
    onFechar();
  };

  const handleResetar = () => {
    setImagemPreview(null);
    setResultado(null);
    setErro(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative my-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Camera className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Nutrição por Câmera IA
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 inline" /> Visão Multimodal
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Aponte a câmera para o prato e calcule macros instantaneamente
              </p>
            </div>
          </div>

          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Ocultos para Câmera e Galeria */}
        <input
          type="file"
          ref={inputCameraRef}
          accept="image/*"
          capture="environment"
          onChange={handleSelecionarArquivo}
          className="hidden"
        />
        <input
          type="file"
          ref={inputArquivoRef}
          accept="image/*"
          onChange={handleSelecionarArquivo}
          className="hidden"
        />

        {/* Área Principal */}
        {!imagemPreview && (
          <div className="space-y-4 py-2">
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition bg-slate-900/40">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                Fotografe seu Prato ou Lanche
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                Nosso motor de visão computacional identifica os alimentos, pesos estimados e desmembra os 5 macronutrientes.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => inputCameraRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-3 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Abrir Câmera</span>
                </button>

                <button
                  onClick={() => inputArquivoRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Galeria</span>
                </button>
              </div>
            </div>

            {/* Demonstração rápida */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Dica Pro:</strong> Enquadre bem as proteínas e carboidratos. O sistema suporta fotos tiradas direto no smartphone ou carregadas da galeria.
              </span>
            </div>
          </div>
        )}

        {/* Preview da Imagem Selecionada */}
        {imagemPreview && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-700 max-h-56 mx-auto">
              <img
                src={imagemPreview}
                alt="Foto da refeição"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleResetar}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg backdrop-blur-md transition flex items-center gap-1 text-xs cursor-pointer"
                title="Tirar outra foto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nova Foto</span>
              </button>
            </div>

            {/* SKELETON SCREEN LOGIC (Conforme Requisito 3) */}
            {carregandoSkeleton && (
              <div className="space-y-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 animate-shimmer">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processando Visão Computacional e Calculando Macros...</span>
                </div>

                <div className="h-6 bg-slate-800 rounded-lg w-3/4"></div>
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 bg-slate-800 rounded-xl"></div>
                  ))}
                </div>
                <div className="h-10 bg-slate-800 rounded-lg w-full mt-2"></div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>{erro}</div>
              </div>
            )}

            {/* Resultado da IA Multimodal */}
            {resultado && !carregandoSkeleton && (
              <div className="space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Confiança: {Math.round(resultado.confianca * 100)}%
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {resultado.nomePrato}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">
                      {resultado.calorias}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">KCAL</span>
                  </div>
                </div>

                {/* Grade dos 5 Macronutrientes (Calorias, Proteínas, Carboidratos, Gorduras Totais, Fibras) */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-slate-800/90 border border-emerald-500/30 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center justify-center gap-1">
                      <Dna className="w-3 h-3" /> Proteínas
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {resultado.proteinas}g
                    </div>
                  </div>

                  <div className="bg-slate-800/90 border border-cyan-500/30 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase flex items-center justify-center gap-1">
                      <Wheat className="w-3 h-3" /> Carboidratos
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {resultado.carboidratos}g
                    </div>
                  </div>

                  <div className="bg-slate-800/90 border border-rose-500/30 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-rose-400 uppercase flex items-center justify-center gap-1">
                      <Droplet className="w-3 h-3" /> Gorduras
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {resultado.gorduras}g
                    </div>
                  </div>

                  <div className="bg-slate-800/90 border border-purple-500/30 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-purple-400 uppercase flex items-center justify-center gap-1">
                      <Salad className="w-3 h-3" /> Fibras
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {resultado.fibras}g
                    </div>
                  </div>
                </div>

                {/* Itens Detectados */}
                {resultado.alimentosDetectados && (
                  <div className="text-xs text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Itens identificados:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {resultado.alimentosDetectados.map((item: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-slate-700/60 text-slate-200 px-2 py-0.5 rounded text-[11px]"
                        >
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seleção do Momento da Refeição */}
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Registrar em qual refeição?
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'].map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setRefeicaoTipo(tipo)}
                        className={`py-1.5 px-2 rounded-lg font-semibold transition cursor-pointer ${
                          refeicaoTipo === tipo
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botão de Adição ao Consumo Diário */}
                <button
                  onClick={handleSalvarRefeicao}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Adicionar aos Macros do Dia</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

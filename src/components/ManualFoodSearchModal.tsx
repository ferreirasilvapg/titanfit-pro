import React, { useState, useEffect } from 'react';
import {
  buscarAlimentoManual,
  adicionarConsumoMacro,
  UNIDADES_MEDIDA,
  interpretarTextoAlimentoEQuantidade,
} from '../core/titanCore.js';
import {
  Search,
  Plus,
  Check,
  X,
  UtensilsCrossed,
  Sparkles,
  Dna,
  Wheat,
  Droplet,
  Droplets,
  Salad,
  Flame,
  Apple,
  Cookie,
  Carrot,
  Beef,
  Scale,
  Coffee,
  GlassWater,
  Milk,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onAdicionado?: () => void;
  categoriaInicial?: string;
}

export const ManualFoodSearchModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onAdicionado,
  categoriaInicial = 'todos',
}) => {
  const [termo, setTermo] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(categoriaInicial || 'todos');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Estados de Unidade e Quantidade Volumétrica / Sólida
  const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState<string>(
    categoriaInicial === 'bebida' ? 'copo_americano' : 'g'
  );
  const [valorQuantidade, setValorQuantidade] = useState<number>(
    categoriaInicial === 'bebida' ? 1 : 100
  );
  const [refeicaoTipo, setRefeicaoTipo] = useState('Almoço');
  const [sucessoItem, setSucessoItem] = useState<string | null>(null);
  const [interpretacaoDetectada, setInterpretacaoDetectada] = useState<any | null>(null);

  useEffect(() => {
    if (aberto) {
      if (categoriaInicial) {
        setCategoriaAtiva(categoriaInicial);
        if (categoriaInicial === 'bebida') {
          setUnidadeSelecionadaId('copo_americano');
          setValorQuantidade(1);
        } else {
          setUnidadeSelecionadaId('g');
          setValorQuantidade(100);
        }
      }
    }
  }, [aberto, categoriaInicial]);

  const categorias = [
    { id: 'todos', rotulo: 'Todos', icone: UtensilsCrossed },
    { id: 'bebida', rotulo: 'Bebidas & Líquidos', icone: GlassWater },
    { id: 'fruta', rotulo: 'Frutas', icone: Apple },
    { id: 'verdura', rotulo: 'Verduras & Legumes', icone: Carrot },
    { id: 'doce', rotulo: 'Doces & Sobremesas', icone: Cookie },
    { id: 'proteina', rotulo: 'Proteínas', icone: Beef },
    { id: 'carboidrato', rotulo: 'Carboidratos', icone: Wheat },
  ];

  // Identifica unidade ativa
  const unidadeAtual =
    UNIDADES_MEDIDA.find((u) => u.id === unidadeSelecionadaId) || UNIDADES_MEDIDA[1];

  // Cálculo do total em gramas ou mililitros
  let gramasOuMlEquivalente = 100;
  if (unidadeSelecionadaId === 'g' || unidadeSelecionadaId === 'ml') {
    gramasOuMlEquivalente = Math.max(1, valorQuantidade);
  } else {
    gramasOuMlEquivalente = Math.max(1, Math.round(valorQuantidade * unidadeAtual.fatorGramasOuMl));
  }

  const fator = gramasOuMlEquivalente / 100;

  useEffect(() => {
    if (!aberto) return;

    // Verifica se o usuário digitou linguagem natural com volume (ex: "1 copo de leite", "200ml suco")
    const detectado = interpretarTextoAlimentoEQuantidade(termo);
    if (detectado) {
      setInterpretacaoDetectada(detectado);
      setUnidadeSelecionadaId(detectado.unidadeId);
      setValorQuantidade(detectado.quantidade);
    } else {
      setInterpretacaoDetectada(null);
    }

    let cancelado = false;
    const buscar = async () => {
      setCarregando(true);
      try {
        const res = await buscarAlimentoManual(termo, categoriaAtiva);
        if (!cancelado) {
          setResultados(res);
        }
      } catch (err) {
        console.error('Erro ao buscar alimentos:', err);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    const debounce = setTimeout(buscar, 120);
    return () => {
      cancelado = true;
      clearTimeout(debounce);
    };
  }, [termo, categoriaAtiva, aberto]);

  if (!aberto) return null;

  const aplicarUnidadePredefinida = (unidadeId: string, qtd: number = 1) => {
    setUnidadeSelecionadaId(unidadeId);
    setValorQuantidade(qtd);
  };

  const handleSalvar = (item: any) => {
    // Cálculo rigoroso de Atwater com fator de escala por gramas ou ml
    const prot = Number((Number(item.proteinas) * fator).toFixed(1));
    const carb = Number((Number(item.carboidratos) * fator).toFixed(1));
    const gord = Number((Number(item.gorduras) * fator).toFixed(1));
    const fib = Number((Number(item.fibras || 0) * fator).toFixed(1));
    const cal = Math.round(Number(item.calorias) * fator);

    // Formatação amigável da porção consumida
    let descricaoPorcao = '';
    if (unidadeSelecionadaId === 'g') {
      descricaoPorcao = `${valorQuantidade}g`;
    } else if (unidadeSelecionadaId === 'ml') {
      descricaoPorcao = `${valorQuantidade}ml`;
    } else {
      descricaoPorcao = `${valorQuantidade} ${unidadeAtual.sigla} (~${gramasOuMlEquivalente}${item.ehLiquido ? 'ml' : 'g'})`;
    }

    adicionarConsumoMacro({
      nome: `${refeicaoTipo}: ${item.nome} (${descricaoPorcao})`,
      calorias: cal,
      proteinas: prot,
      carboidratos: carb,
      gorduras: gord,
      fibras: fib,
      itens: [
        `${item.nome} (${descricaoPorcao}) - P:${prot}g C:${carb}g G:${gord}g Fib:${fib}g`,
      ],
    });

    setSucessoItem(item.id);
    setTimeout(() => {
      setSucessoItem(null);
      if (onAdicionado) onAdicionado();
      onFechar();
    }, 600);
  };

  const getBadgeCategoria = (cat: string) => {
    switch (cat) {
      case 'bebida':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'doce':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'fruta':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'verdura':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'proteina':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'carboidrato':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-xl rounded-3xl p-4 sm:p-5 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">Acervo Global de Alimentos & Bebidas</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300 inline" /> Sólidos & Líquidos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Suporte para gramas (g), mililitros (ml), copos, xícaras, latas e colheres
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

        {/* Campo de Busca Inteligente com Reconhecimento de Medidas Caseiras */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Digite qualquer alimento ou líquido: leite, suco de laranja, pão francês, 1 copo de whey..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium shadow-inner"
            autoFocus
          />
          {termo && (
            <button
              onClick={() => {
                setTermo('');
                setInterpretacaoDetectada(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Notificação de Inteligência Natural quando detecta medida */}
        {interpretacaoDetectada && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs text-cyan-300 animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Medida detectada: <strong>{interpretacaoDetectada.quantidade} {unidadeAtual.rotulo}</strong> (~{interpretacaoDetectada.mlOuGramasTotal}ml/g)
              </span>
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
              Automático
            </span>
          </div>
        )}

        {/* Filtros por Categorias Rápidas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {categorias.map((cat) => {
            const Icone = cat.icone;
            const ativa = categoriaAtiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  ativa
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icone className={`w-3.5 h-3.5 ${ativa ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{cat.rotulo}</span>
              </button>
            );
          })}
        </div>

        {/* Painel Avançado de Medidas: Líquidos, Copos, Xícaras, Colheres ou Gramas */}
        <div className="mb-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-2">
          {/* Seletor de Tipo de Medida */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Scale className="w-3 h-3 text-cyan-400" /> Como deseja medir a porção?
            </label>

            {/* Presets Rápidos com 1 clique */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => aplicarUnidadePredefinida('copo_americano', 1)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition cursor-pointer ${
                  unidadeSelecionadaId === 'copo_americano'
                    ? 'bg-blue-500 text-slate-950 border-blue-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🥛 1 Copo (200ml)
              </button>
              <button
                type="button"
                onClick={() => aplicarUnidadePredefinida('xicara_cha', 1)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition cursor-pointer ${
                  unidadeSelecionadaId === 'xicara_cha'
                    ? 'bg-blue-500 text-slate-950 border-blue-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                ☕ 1 Xícara (240ml)
              </button>
              <button
                type="button"
                onClick={() => aplicarUnidadePredefinida('colher_sopa', 1)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition cursor-pointer ${
                  unidadeSelecionadaId === 'colher_sopa'
                    ? 'bg-blue-500 text-slate-950 border-blue-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🥄 1 Colher Sopa (15ml)
              </button>
              <button
                type="button"
                onClick={() => aplicarUnidadePredefinida('lata', 1)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition cursor-pointer ${
                  unidadeSelecionadaId === 'lata'
                    ? 'bg-blue-500 text-slate-950 border-blue-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🥫 1 Lata (350ml)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Escolha da Unidade de Medida */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Unidade de Medida
              </label>
              <select
                value={unidadeSelecionadaId}
                onChange={(e) => {
                  const novaUnidade = e.target.value;
                  setUnidadeSelecionadaId(novaUnidade);
                  if (novaUnidade === 'g' || novaUnidade === 'ml') {
                    setValorQuantidade(100);
                  } else {
                    setValorQuantidade(1);
                  }
                }}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                <optgroup label="Líquidos e Bebidas (Volume)">
                  <option value="ml">Mililitros exatos (ml)</option>
                  <option value="copo_americano">Copo Americano (200ml)</option>
                  <option value="copo_requeijao">Copo Requeijão (250ml)</option>
                  <option value="copo_300">Copo Grande (300ml)</option>
                  <option value="xicara_cha">Xícara de Chá (240ml)</option>
                  <option value="xicara_cafe">Xícara de Café / Cafézinha (50ml)</option>
                  <option value="lata">Lata Padrão (350ml)</option>
                  <option value="garrafa_500">Garrafinha (500ml)</option>
                </optgroup>
                <optgroup label="Colheres & Condimentos">
                  <option value="colher_sopa">Colher de Sopa (~15ml / 15g)</option>
                  <option value="colher_cha">Colher de Chá (~5ml / 5g)</option>
                </optgroup>
                <optgroup label="Sólidos & Gramas">
                  <option value="g">Gramas (g)</option>
                  <option value="unidade">Porção Unitária Média</option>
                </optgroup>
              </select>
            </div>

            {/* Quantidade na Unidade Escolhida */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Quantidade
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  max="5000"
                  step={unidadeSelecionadaId === 'g' || unidadeSelecionadaId === 'ml' ? '5' : '0.5'}
                  value={valorQuantidade}
                  onChange={(e) => setValorQuantidade(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                  {unidadeAtual.sigla}
                </span>
              </div>
            </div>

            {/* Momento da Refeição */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Momento / Refeição
              </label>
              <select
                value={refeicaoTipo}
                onChange={(e) => setRefeicaoTipo(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
              >
                <option value="Café da Manhã">Café da Manhã</option>
                <option value="Almoço">Almoço</option>
                <option value="Lanche da Tarde">Lanche da Tarde</option>
                <option value="Jantar">Jantar</option>
                <option value="Ceia">Ceia / Sobremesa</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>
              Total calculado: <strong className="text-cyan-400">{gramasOuMlEquivalente} ml/g</strong> ({fator.toFixed(2)}x porção base)
            </span>
            <span className="text-[10px] text-slate-500">
              Macros calculados via Equação de Atwater
            </span>
          </div>
        </div>

        {/* Lista de Alimentos com os 5 Macronutrientes 100% Exatos */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-[220px]">
          {carregando ? (
            <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
              <Sparkles className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
              <span className="font-semibold text-slate-200">
                Calculando composição precisa TACO/USDA com IA...
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Extraindo proteínas, carboidratos, gorduras e fibras
              </span>
            </div>
          ) : resultados.length > 0 ? (
            resultados.map((item) => {
              const cal = Math.round(Number(item.calorias) * fator);
              const prot = Number((Number(item.proteinas) * fator).toFixed(1));
              const carb = Number((Number(item.carboidratos) * fator).toFixed(1));
              const gord = Number((Number(item.gorduras) * fator).toFixed(1));
              const fib = Number((Number(item.fibras || 0) * fator).toFixed(1));

              const salvo = sucessoItem === item.id;
              const ehLiquido = item.ehLiquido || item.categoria === 'bebida' || item.porcao?.includes('ml');

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-3.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getBadgeCategoria(
                            item.categoria
                          )}`}
                        >
                          {ehLiquido ? '💧 Bebida / Líquido' : item.categoria}
                        </span>
                        {item.porcaoUnitaria && (
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                            {item.porcaoUnitaria}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        {item.nome}
                      </h4>
                      {item.dica && (
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.dica}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{cal} kcal</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {gramasOuMlEquivalente} {ehLiquido ? 'ml' : 'g'}
                      </div>
                    </div>
                  </div>

                  {/* Barra com os 4 Macros Principais */}
                  <div className="grid grid-cols-4 gap-1.5 bg-[#0b0f19] p-2 rounded-xl mb-2.5 text-center text-[10px] sm:text-xs">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Dna className="w-2.5 h-2.5 text-red-400" /> Prot
                      </span>
                      <span className="font-extrabold text-red-300">{prot}g</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Wheat className="w-2.5 h-2.5 text-cyan-400" /> Carb
                      </span>
                      <span className="font-extrabold text-cyan-300">{carb}g</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Droplet className="w-2.5 h-2.5 text-amber-400" /> Gord
                      </span>
                      <span className="font-extrabold text-amber-300">{gord}g</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Salad className="w-2.5 h-2.5 text-emerald-400" /> Fibra
                      </span>
                      <span className="font-extrabold text-emerald-300">{fib}g</span>
                    </div>
                  </div>

                  {/* Botão de Adição com a Porção Escolhida */}
                  <button
                    onClick={() => handleSalvar(item)}
                    disabled={salvo}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      salvo
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black active:scale-[0.98]'
                    }`}
                  >
                    {salvo ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>
                          Adicionar {valorQuantidade} {unidadeAtual.sigla} ({gramasOuMlEquivalente}
                          {ehLiquido ? 'ml' : 'g'})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">
                Nenhum alimento cadastrado para "{termo}".
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Nosso motor inteligente analisa qualquer fruta, líquido, sobremesa ou refeição regional e calcula os macros com 100% de rigor.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Sólidos & Líquidos Ativos
          </span>
          <span>TACO (Unicamp) & USDA • 100% Exato</span>
        </div>
      </div>
    </div>
  );
};

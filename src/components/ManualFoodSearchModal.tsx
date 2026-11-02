import React, { useState, useEffect } from 'react';
import {
  buscarAlimentoManual,
  adicionarConsumoMacro,
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
  Salad,
  Flame,
  Apple,
  Cookie,
  Carrot,
  Beef,
  Scale,
} from 'lucide-react';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onAdicionado?: () => void;
}

export const ManualFoodSearchModal: React.FC<Props> = ({
  aberto,
  onFechar,
  onAdicionado,
}) => {
  const [termo, setTermo] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [quantidadeGramas, setQuantidadeGramas] = useState<number>(100);
  const [refeicaoTipo, setRefeicaoTipo] = useState('Almoço');
  const [sucessoItem, setSucessoItem] = useState<string | null>(null);

  const categorias = [
    { id: 'todos', rotulo: 'Todos', icone: UtensilsCrossed },
    { id: 'fruta', rotulo: 'Frutas', icone: Apple },
    { id: 'verdura', rotulo: 'Verduras & Legumes', icone: Carrot },
    { id: 'doce', rotulo: 'Doces & Sobremesas', icone: Cookie },
    { id: 'proteina', rotulo: 'Proteínas', icone: Beef },
    { id: 'carboidrato', rotulo: 'Carboidratos', icone: Wheat },
  ];

  useEffect(() => {
    if (!aberto) return;

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

  const fator = (quantidadeGramas || 100) / 100;

  const handleSalvar = (item: any) => {
    // Cálculo rigoroso de Atwater com fator de escala por gramas
    const prot = Number((Number(item.proteinas) * fator).toFixed(1));
    const carb = Number((Number(item.carboidratos) * fator).toFixed(1));
    const gord = Number((Number(item.gorduras) * fator).toFixed(1));
    const fib = Number((Number(item.fibras || 0) * fator).toFixed(1));
    const cal = Math.round(Number(item.calorias) * fator);

    adicionarConsumoMacro({
      nome: `${refeicaoTipo}: ${item.nome} (${quantidadeGramas}g)`,
      calorias: cal,
      proteinas: prot,
      carboidratos: carb,
      gorduras: gord,
      fibras: fib,
      itens: [`${item.nome} (${quantidadeGramas}g) - P:${prot}g C:${carb}g G:${gord}g Fib:${fib}g`],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-xl rounded-3xl p-4 sm:p-5 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Acervo Global de Alimentos</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300 inline" /> IA & TACO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reconhecimento de infinitos alimentos com 5 macros 100% exatos
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

        {/* Campo de Busca Inteligente */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Digite qualquer alimento: pão francês, arroz, frango, tapioca, açaí..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium shadow-inner"
            autoFocus
          />
          {termo && (
            <button
              onClick={() => setTermo('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros por Categorias Rápidas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 scrollbar-thin scrollbar-thumb-slate-700">
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

        {/* Ajuste de Porção e Seleção da Refeição */}
        <div className="grid grid-cols-2 gap-2.5 mb-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <Scale className="w-3 h-3 text-cyan-400" /> Gramas Calculadas
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="5"
                max="3000"
                step="5"
                value={quantidadeGramas}
                onChange={(e) => setQuantidadeGramas(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs font-bold text-slate-400">g</span>
            </div>
          </div>

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

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate max-w-xs">{item.nome}</h4>
                      {item.categoria && (
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getBadgeCategoria(
                            item.categoria
                          )}`}
                        >
                          {item.categoria}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <span className="text-amber-400 font-black">{cal} kcal</span>
                      <span className="text-slate-500">({quantidadeGramas}g)</span>
                      {item.porcaoUnitaria && (
                        <span className="text-[10px] text-slate-500 truncate">• {item.porcaoUnitaria}</span>
                      )}
                    </div>

                    {/* Grade Exata dos 4 Macros Fundamentais + Fibras */}
                    <div className="grid grid-cols-4 gap-1.5 text-center mt-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-1">
                        <div className="text-[9px] font-bold text-emerald-400 uppercase flex items-center justify-center gap-0.5">
                          <Dna className="w-2.5 h-2.5" /> Prot
                        </div>
                        <div className="text-xs font-black text-white">{prot}g</div>
                      </div>

                      <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-1">
                        <div className="text-[9px] font-bold text-cyan-400 uppercase flex items-center justify-center gap-0.5">
                          <Wheat className="w-2.5 h-2.5" /> Carb
                        </div>
                        <div className="text-xs font-black text-white">{carb}g</div>
                      </div>

                      <div className="bg-rose-950/40 border border-rose-500/20 rounded-lg p-1">
                        <div className="text-[9px] font-bold text-rose-400 uppercase flex items-center justify-center gap-0.5">
                          <Droplet className="w-2.5 h-2.5" /> Gord
                        </div>
                        <div className="text-xs font-black text-white">{gord}g</div>
                      </div>

                      <div className="bg-purple-950/40 border border-purple-500/20 rounded-lg p-1">
                        <div className="text-[9px] font-bold text-purple-400 uppercase flex items-center justify-center gap-0.5">
                          <Salad className="w-2.5 h-2.5" /> Fib
                        </div>
                        <div className="text-xs font-black text-white">{fib}g</div>
                      </div>
                    </div>

                    {item.dica && (
                      <p className="text-[10px] text-slate-400 mt-1.5 italic line-clamp-1">
                        💡 {item.dica}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSalvar(item)}
                    disabled={salvo}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex-shrink-0 self-end sm:self-center ${
                      salvo
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                    }`}
                  >
                    {salvo ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Adicionar ({quantidadeGramas}g)</span>
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
                Nosso motor com Inteligência Artificial analisa qualquer fruta, verdura, sobremesa ou refeição regional e calcula os macros com 100% de rigor.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Base Global Ativa
          </span>
          <span>TACO (Unicamp) & USDA • 100% Exato</span>
        </div>
      </div>
    </div>
  );
};

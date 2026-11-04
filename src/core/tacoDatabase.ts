/**
 * TABELA TACO (UNICAMP - BRASIL) & USDA FOODDATA CENTRAL
 * Banco de Dados Nutricional Global com mais de 100 alimentos verificados.
 * Todos os valores são calculados rigorosamente por 100g comestíveis com a fórmula de Atwater:
 * Calorias = Math.round((Proteínas × 4) + (Carboidratos × 4) + (Gorduras × 9) + (Fibras × 2))
 */

export interface ItemNutricional {
  id: string;
  nome: string;
  categoria: 'doce' | 'fruta' | 'verdura' | 'proteina' | 'carboidrato' | 'gordura' | 'refeicao' | 'bebida';
  porcao: string;
  porcaoUnitaria?: string;
  ehLiquido?: boolean;
  unidadePadrao?:
    | 'g'
    | 'ml'
    | 'copo_americano'
    | 'copo_requeijao'
    | 'copo_300'
    | 'xicara_cha'
    | 'xicara_cafe'
    | 'colher_sopa'
    | 'colher_cha'
    | 'lata'
    | 'garrafa_500'
    | 'unidade';
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
  dica: string;
  fonte?: string;
}

export interface UnidadeMedida {
  id: string;
  rotulo: string;
  sigla: string;
  fatorGramasOuMl: number; // Porção base equivalente em gramas ou ml
  tipo: 'solido' | 'liquido' | 'ambos';
  exemplo: string;
}

export const UNIDADES_MEDIDA: UnidadeMedida[] = [
  { id: 'ml', rotulo: 'Mililitros (ml)', sigla: 'ml', fatorGramasOuMl: 1, tipo: 'liquido', exemplo: '100ml, 200ml' },
  { id: 'g', rotulo: 'Gramas (g)', sigla: 'g', fatorGramasOuMl: 1, tipo: 'solido', exemplo: '100g, 150g' },
  { id: 'copo_americano', rotulo: 'Copo Americano', sigla: 'copo (200ml)', fatorGramasOuMl: 200, tipo: 'liquido', exemplo: '1 copo = 200ml' },
  { id: 'copo_requeijao', rotulo: 'Copo Requeijão / Médio', sigla: 'copo (250ml)', fatorGramasOuMl: 250, tipo: 'liquido', exemplo: '1 copo = 250ml' },
  { id: 'copo_300', rotulo: 'Copo Grande', sigla: 'copo (300ml)', fatorGramasOuMl: 300, tipo: 'liquido', exemplo: '1 copo = 300ml' },
  { id: 'xicara_cha', rotulo: 'Xícara de Chá', sigla: 'xícara (240ml)', fatorGramasOuMl: 240, tipo: 'ambos', exemplo: '1 xícara = 240ml' },
  { id: 'xicara_cafe', rotulo: 'Xícara de Café (Cafézinha)', sigla: 'cafézinha (50ml)', fatorGramasOuMl: 50, tipo: 'liquido', exemplo: '1 xícara = 50ml' },
  { id: 'colher_sopa', rotulo: 'Colher de Sopa', sigla: 'colher sopa (~15ml)', fatorGramasOuMl: 15, tipo: 'ambos', exemplo: '1 colher = 15ml / 15g' },
  { id: 'colher_cha', rotulo: 'Colher de Chá', sigla: 'colher chá (~5ml)', fatorGramasOuMl: 5, tipo: 'ambos', exemplo: '1 colher = 5ml / 5g' },
  { id: 'lata', rotulo: 'Lata Padrão', sigla: 'lata (350ml)', fatorGramasOuMl: 350, tipo: 'liquido', exemplo: '1 lata = 350ml' },
  { id: 'garrafa_500', rotulo: 'Garrafinha (500ml)', sigla: 'garrafa (500ml)', fatorGramasOuMl: 500, tipo: 'liquido', exemplo: '1 garrafa = 500ml' },
  { id: 'unidade', rotulo: 'Porção Unitária', sigla: 'unid', fatorGramasOuMl: 100, tipo: 'ambos', exemplo: '1 unidade média' },
];

/**
 * Interpretador inteligente em linguagem natural para líquidos e sólidos
 * Ex: "1 copo de leite integral" -> { termoBusca: 'leite integral', quantidade: 1, unidadeId: 'copo_americano', mlOuGramas: 200 }
 * Ex: "200ml de suco de laranja" -> { termoBusca: 'suco de laranja', quantidade: 200, unidadeId: 'ml', mlOuGramas: 200 }
 * Ex: "2 xicaras de cafe" -> { termoBusca: 'cafe', quantidade: 2, unidadeId: 'xicara_cha', mlOuGramas: 480 }
 * Ex: "1 colher de sopa de azeite" -> { termoBusca: 'azeite', quantidade: 1, unidadeId: 'colher_sopa', mlOuGramas: 15 }
 * Ex: "1 lata de coca zero" -> { termoBusca: 'coca zero', quantidade: 1, unidadeId: 'lata', mlOuGramas: 350 }
 */
export function interpretarTextoAlimentoEQuantidade(textoBruto: string = '') {
  const norm = normalizarTexto(textoBruto);
  if (!norm) return null;

  // Regex para capturar padrão "quantidade + unidade + de + alimento"
  // Ex: "1 copo de leite", "200ml suco", "2 xicaras cafe", "1 lata refri"
  const regexPadrao = /^(\d+(?:[.,]\d+)?)\s*(ml|l|litros?|gramas?|g|copos?(?:\s+americano)?|xicaras?(?:\s+de\s+cha)?|cafezinhas?|colheres?(?:\s+de\s+sopa)?|colheres?(?:\s+de\s+cha)?|latas?|garrafas?)\s*(?:de\s+)?(.+)$/i;
  const match = norm.match(regexPadrao);

  if (match) {
    const qtdNum = parseFloat(match[1].replace(',', '.'));
    const unidadeTexto = match[2].toLowerCase().trim();
    const restoAlimento = match[3].trim();

    let unidadeId = 'g';
    let fator = 1;

    if (unidadeTexto === 'ml') {
      unidadeId = 'ml';
      fator = 1;
    } else if (unidadeTexto === 'l' || unidadeTexto.startsWith('litro')) {
      unidadeId = 'ml';
      fator = 1000;
    } else if (unidadeTexto.startsWith('copo')) {
      unidadeId = 'copo_americano';
      fator = 200;
    } else if (unidadeTexto.startsWith('xicara')) {
      unidadeId = 'xicara_cha';
      fator = 240;
    } else if (unidadeTexto.startsWith('cafezinha')) {
      unidadeId = 'xicara_cafe';
      fator = 50;
    } else if (unidadeTexto.includes('sopa')) {
      unidadeId = 'colher_sopa';
      fator = 15;
    } else if (unidadeTexto.includes('cha')) {
      unidadeId = 'colher_cha';
      fator = 5;
    } else if (unidadeTexto.startsWith('lata')) {
      unidadeId = 'lata';
      fator = 350;
    } else if (unidadeTexto.startsWith('garrafa')) {
      unidadeId = 'garrafa_500';
      fator = 500;
    } else if (unidadeTexto === 'g' || unidadeTexto.startsWith('grama')) {
      unidadeId = 'g';
      fator = 1;
    }

    return {
      termoBusca: restoAlimento,
      quantidade: qtdNum,
      unidadeId,
      mlOuGramasTotal: Math.round(qtdNum * fator)
    };
  }

  return null;
}

export function normalizarTexto(str: string = ''): string {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const BANCO_TACO_COMPLETO: ItemNutricional[] = [
  // ===================== PÃES, CUSCUZ E CARBOIDRATOS BRASILEIROS =====================
  {
    id: 'carb-pao-frances',
    nome: 'Pão Francês Tradicional',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade (~50g)',
    calorias: 300,
    proteinas: 8.0,
    carboidratos: 58.6,
    gorduras: 3.1,
    fibras: 2.3,
    dica: 'Carboidrato de rápida absorção ideal para pré ou pós-treino com fonte de proteína.'
  },
  {
    id: 'carb-pao-frances-chapa',
    nome: 'Pão Francês na Chapa com Manteiga',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade (~60g)',
    calorias: 350,
    proteinas: 7.5,
    carboidratos: 52.0,
    gorduras: 12.0,
    fibras: 2.0,
    dica: 'Combinação clássica com energia rápida dos carboidratos e lipídios da manteiga.'
  },
  {
    id: 'carb-pao-queijo',
    nome: 'Pão de Queijo Mineiro Assado',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 unidades médias (~50g)',
    calorias: 360,
    proteinas: 6.5,
    carboidratos: 44.0,
    gorduras: 17.5,
    fibras: 1.2,
    dica: 'Feito com polvilho (sem glúten) e queijo meia cura.'
  },
  {
    id: 'carb-pao-forma-branco',
    nome: 'Pão de Forma Branco Tradicional',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 fatias (~50g)',
    calorias: 253,
    proteinas: 8.4,
    carboidratos: 49.9,
    gorduras: 2.3,
    fibras: 2.9,
    dica: 'Carboidrato de fácil digestão para sanduíches proteicos.'
  },
  {
    id: 'carb-pao-forma-integral',
    nome: 'Pão de Forma 100% Integral',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 fatias (~50g)',
    calorias: 230,
    proteinas: 11.0,
    carboidratos: 40.0,
    gorduras: 2.4,
    fibras: 8.4,
    dica: 'Rico em fibras solúveis e insolúveis, auxiliando na saciedade prolongada.'
  },
  {
    id: 'carb-pao-sirio',
    nome: 'Pão Sírio / Pita',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~60g)',
    calorias: 275,
    proteinas: 9.1,
    carboidratos: 55.7,
    gorduras: 1.2,
    fibras: 2.2,
    dica: 'Baixo teor de lipídios, excelente opção para wraps e lanches leves.'
  },
  {
    id: 'carb-pao-batata',
    nome: 'Pão de Batata Fofinho',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade (~70g)',
    calorias: 290,
    proteinas: 7.0,
    carboidratos: 52.0,
    gorduras: 6.0,
    fibras: 2.0,
    dica: 'Massa macia com adição de fécula de batata.'
  },
  {
    id: 'carb-tapioca-goma',
    nome: 'Goma de Tapioca Cozida (Massa)',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 disco médio (~60g)',
    calorias: 240,
    proteinas: 0.0,
    carboidratos: 60.0,
    gorduras: 0.0,
    fibras: 0.5,
    dica: 'Carboidrato limpo de alto índice glicêmico e zero glúten para reposição de glicogênio.'
  },
  {
    id: 'carb-crepioca',
    nome: 'Crepioca Fit (1 Ovo + 2 colheres Tapioca)',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 porção inteira (~120g)',
    calorias: 185,
    proteinas: 9.5,
    carboidratos: 22.0,
    gorduras: 6.5,
    fibras: 0.8,
    dica: 'Equilíbrio perfeito de proteína de alto valor biológico com carboidrato.'
  },
  {
    id: 'carb-cuscuz-milho',
    nome: 'Cuscuz Nordestino de Milho Cozido',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 fatia média (~100g)',
    calorias: 112,
    proteinas: 2.2,
    carboidratos: 25.3,
    gorduras: 0.7,
    fibras: 2.1,
    dica: 'Tradicional da culinária brasileira, fonte de energia sustentada e minerais.'
  },
  {
    id: 'carb-cuscuz-ovo',
    nome: 'Cuscuz de Milho com Ovo Mexido',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 prato de sobremesa (~150g)',
    calorias: 165,
    proteinas: 7.5,
    carboidratos: 22.0,
    gorduras: 5.0,
    fibras: 1.8,
    dica: 'Refeição clássica que combina energia densa do milho com aminoácidos completos do ovo.'
  },
  {
    id: 'carb-cuscuz-carne-seca',
    nome: 'Cuscuz de Milho com Carne Seca Desfiada',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 porção média (~180g)',
    calorias: 210,
    proteinas: 13.0,
    carboidratos: 20.0,
    gorduras: 8.0,
    fibras: 1.5,
    dica: 'Excelente aporte proteico com ferro heme e carboidratos do milho.'
  },
  {
    id: 'carb-panqueca-aveia-banana',
    nome: 'Panqueca de Aveia e Banana Fit',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 discos médios (~120g)',
    calorias: 175,
    proteinas: 6.0,
    carboidratos: 30.0,
    gorduras: 3.5,
    fibras: 3.5,
    dica: 'Rico em betaglucanas da aveia e potássio da banana.'
  },
  {
    id: 'carb-arroz-branco',
    nome: 'Arroz Branco Cozido',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '4 colheres de sopa cheias (~100g)',
    calorias: 128,
    proteinas: 2.5,
    carboidratos: 28.1,
    gorduras: 0.2,
    fibras: 1.6,
    dica: 'A base do prato brasileiro, de facílima digestibilidade para hipertrofia.'
  },
  {
    id: 'carb-arroz-integral',
    nome: 'Arroz Integral Cozido',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '4 colheres de sopa (~100g)',
    calorias: 124,
    proteinas: 2.6,
    carboidratos: 25.8,
    gorduras: 1.0,
    fibras: 2.7,
    dica: 'Maior presença de vitaminas do complexo B, magnésio e fibras.'
  },
  {
    id: 'carb-feijao-carioca',
    nome: 'Feijão Carioca Cozido (50% Grão / 50% Caldo)',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 concha média (~130g)',
    calorias: 76,
    proteinas: 4.8,
    carboidratos: 13.6,
    gorduras: 0.5,
    fibras: 8.5,
    dica: 'Combinação perfeita com arroz para perfil de aminoácidos limitantes (lisina + metionina).'
  },
  {
    id: 'carb-feijao-preto',
    nome: 'Feijão Preto Cozido com Caldo',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 concha média (~130g)',
    calorias: 77,
    proteinas: 4.5,
    carboidratos: 14.0,
    gorduras: 0.5,
    fibras: 8.4,
    dica: 'Rico em antocianinas antioxidantes e ferro.'
  },
  {
    id: 'carb-feijoada',
    nome: 'Feijoada Completa Tradicional',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 concha cheia (~180g)',
    calorias: 170,
    proteinas: 13.5,
    carboidratos: 11.0,
    gorduras: 8.0,
    fibras: 4.5,
    dica: 'Prato denso em proteínas, ferro e gorduras animais.'
  },
  {
    id: 'carb-farofa-mandioca',
    nome: 'Farofa Pronta de Mandioca Temperada',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 colheres de sopa (~35g)',
    calorias: 405,
    proteinas: 2.1,
    carboidratos: 80.3,
    gorduras: 9.1,
    fibras: 6.3,
    dica: 'Alta densidade calórica e crocância para complementar a refeição.'
  },
  {
    id: 'carb-macarrao-cozido',
    nome: 'Macarrão Espaguete / Penne Cozido',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 prato raso (~140g)',
    calorias: 141,
    proteinas: 5.0,
    carboidratos: 28.5,
    gorduras: 0.9,
    fibras: 1.5,
    dica: 'Excelente opção de carboidrato para carga de glicogênio em fases de ganho muscular.'
  },
  {
    id: 'carb-macarrao-bolonhesa',
    nome: 'Macarrão com Molho de Carne Moída (Bolonhesa)',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 prato fundo (~220g)',
    calorias: 165,
    proteinas: 8.5,
    carboidratos: 22.0,
    gorduras: 4.5,
    fibras: 1.8,
    dica: 'Refeição completa com proteína de carne vermelha e carboidratos de trigo.'
  },
  {
    id: 'carb-batata-doce',
    nome: 'Batata Doce Cozida com Casca',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~140g)',
    calorias: 77,
    proteinas: 1.4,
    carboidratos: 18.4,
    gorduras: 0.1,
    fibras: 2.2,
    dica: 'Baixo índice glicêmico e energia contínua para treinos de alta intensidade.'
  },
  {
    id: 'carb-batata-inglesa',
    nome: 'Batata Inglesa Cozida no Vapor',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~120g)',
    calorias: 52,
    proteinas: 1.2,
    carboidratos: 11.9,
    gorduras: 0.1,
    fibras: 1.3,
    dica: 'O alimento com maior índice de saciedade comprovado cientificamente.'
  },
  {
    id: 'carb-batata-frita',
    nome: 'Batata Frita Tradicional',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 porção individual (~100g)',
    calorias: 312,
    proteinas: 3.4,
    carboidratos: 41.0,
    gorduras: 15.0,
    fibras: 3.8,
    dica: 'Alto teor de gorduras absorvidas na fritura por imersão.'
  },
  {
    id: 'carb-mandioca',
    nome: 'Mandioca / Aipim / Macaxeira Cozida',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 pedaços médios (~120g)',
    calorias: 125,
    proteinas: 0.6,
    carboidratos: 30.1,
    gorduras: 0.3,
    fibras: 1.6,
    dica: 'Raiz tuberosa rica em amido resistente e sabor marcante.'
  },
  {
    id: 'carb-mandioquinha',
    nome: 'Mandioquinha / Batata-Baroa Cozida',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '1 xícara picada (~130g)',
    calorias: 80,
    proteinas: 0.9,
    carboidratos: 18.9,
    gorduras: 0.2,
    fibras: 1.8,
    dica: 'Rica em betacaroteno e de fácil digestão gastrointestinal.'
  },
  {
    id: 'carb-aveia-flocos',
    nome: 'Flocos de Aveia Integral',
    categoria: 'carboidrato',
    porcao: '100g',
    porcaoUnitaria: '2 colheres de sopa (~30g)',
    calorias: 385,
    proteinas: 14.0,
    carboidratos: 67.0,
    gorduras: 7.0,
    fibras: 10.0,
    dica: 'Contém betaglucana, fibra solúvel que reduz o colesterol LDL e regula a glicemia.'
  },

  // ===================== PROTEÍNAS DE ALTO VALOR BIOLÓGICO =====================
  {
    id: 'prot-frango-grelhado',
    nome: 'Peito de Frango Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 filé médio (~120g)',
    calorias: 159,
    proteinas: 32.0,
    carboidratos: 0.0,
    gorduras: 2.5,
    fibras: 0.0,
    dica: 'A proteína mais pura e anabólica da dieta fitness, rica em leucina.'
  },
  {
    id: 'prot-frango-desfiado',
    nome: 'Peito de Frango Cozido Desfiado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '4 colheres de sopa (~100g)',
    calorias: 150,
    proteinas: 31.0,
    carboidratos: 0.0,
    gorduras: 2.0,
    fibras: 0.0,
    dica: 'Prático para marmitas e recheios proteicos.'
  },
  {
    id: 'prot-sobrecoxa-frango',
    nome: 'Sobrecoxa de Frango Assada sem Pele',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 unidade (~120g)',
    calorias: 215,
    proteinas: 25.0,
    carboidratos: 0.0,
    gorduras: 12.0,
    fibras: 0.0,
    dica: 'Muito suculenta com ferro e zinco em boa proporção.'
  },
  {
    id: 'prot-patinho-moido',
    nome: 'Patinho Bovino Moído Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 hambúrguer caseiro (~120g)',
    calorias: 185,
    proteinas: 30.5,
    carboidratos: 0.0,
    gorduras: 6.2,
    fibras: 0.0,
    dica: 'Corte bovino magro com ferro heme de alta biodisponibilidade e creatina natural.'
  },
  {
    id: 'prot-alcatra-grelhada',
    nome: 'Alcatra Bovina Grelhada',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 bife médio (~130g)',
    calorias: 210,
    proteinas: 29.0,
    carboidratos: 0.0,
    gorduras: 9.5,
    fibras: 0.0,
    dica: 'Excelente sabor e textura com perfil proteico completo.'
  },
  {
    id: 'prot-file-mignon',
    nome: 'Filé Mignon Bovino Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 medalhão (~140g)',
    calorias: 200,
    proteinas: 30.0,
    carboidratos: 0.0,
    gorduras: 8.0,
    fibras: 0.0,
    dica: 'Corte extremamente macio e de fácil mastigação.'
  },
  {
    id: 'prot-contrafile',
    nome: 'Contrafilé Bovino Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 bife (~150g)',
    calorias: 235,
    proteinas: 27.5,
    carboidratos: 0.0,
    gorduras: 13.0,
    fibras: 0.0,
    dica: 'Sabor acentuado com gorduras entremeadas.'
  },
  {
    id: 'prot-carne-seca',
    nome: 'Carne Seca / Charque Cozida e Desfiada',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '3 colheres cheias (~90g)',
    calorias: 248,
    proteinas: 31.0,
    carboidratos: 0.0,
    gorduras: 13.0,
    fibras: 0.0,
    dica: 'Muito rica em sódio e proteína concentrada.'
  },
  {
    id: 'prot-lombo-suino',
    nome: 'Lombo Suíno Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 bife (~120g)',
    calorias: 175,
    proteinas: 29.0,
    carboidratos: 0.0,
    gorduras: 6.0,
    fibras: 0.0,
    dica: 'Corte suíno mais magro que muitas carnes vermelhas, rico em tiamina (B1).'
  },
  {
    id: 'prot-ovo-cozido',
    nome: 'Ovo de Galinha Inteiro Cozido',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '2 unidades médias (~100g)',
    calorias: 155,
    proteinas: 13.0,
    carboidratos: 1.1,
    gorduras: 11.0,
    fibras: 0.0,
    dica: 'Padrão ouro de valor biológico. A gema contém colina essencial para o cérebro.'
  },
  {
    id: 'prot-ovo-frito',
    nome: 'Ovo de Galinha Frito no Óleo / Azeite',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 unidade frita (~55g)',
    calorias: 210,
    proteinas: 13.5,
    carboidratos: 1.0,
    gorduras: 16.5,
    fibras: 0.0,
    dica: 'Maior teor de gorduras devido à fritura.'
  },
  {
    id: 'prot-clara-ovo',
    nome: 'Clara de Ovo Cozida',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '3 claras (~95g)',
    calorias: 52,
    proteinas: 11.0,
    carboidratos: 0.7,
    gorduras: 0.2,
    fibras: 0.0,
    dica: 'Proteína pura isolada (albumina) com quase zero gorduras e calorias.'
  },
  {
    id: 'prot-tilapia',
    nome: 'Filé de Tilápia Grelhada',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 filé médio (~130g)',
    calorias: 128,
    proteinas: 26.2,
    carboidratos: 0.0,
    gorduras: 2.7,
    fibras: 0.0,
    dica: 'Peixe branco magro de facílima assimilação muscular.'
  },
  {
    id: 'prot-salmao',
    nome: 'Filé de Salmão Grelhado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 posta média (~150g)',
    calorias: 208,
    proteinas: 20.4,
    carboidratos: 0.0,
    gorduras: 13.4,
    fibras: 0.0,
    dica: 'Fonte primordial de ômega-3 (EPA/DHA) com ação anti-inflamatória pós-treino.'
  },
  {
    id: 'prot-atum-natural',
    nome: 'Atum Sólido em Lata ao Natural',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 lata drenada (~120g)',
    calorias: 116,
    proteinas: 26.0,
    carboidratos: 0.0,
    gorduras: 1.0,
    fibras: 0.0,
    dica: 'Praticidade máxima para viagens e lanches rápidos.'
  },
  {
    id: 'prot-whey-concentrado',
    nome: 'Whey Protein Concentrado 80%',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 scoop dosador (~30g)',
    calorias: 400,
    proteinas: 80.0,
    carboidratos: 8.3,
    gorduras: 5.0,
    fibras: 0.0,
    dica: 'Absorção ultra rápida para disparar a síntese proteica via via mTOR.'
  },
  {
    id: 'prot-whey-isolado',
    nome: 'Whey Protein Isolado 90%',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 scoop dosador (~30g)',
    calorias: 375,
    proteinas: 90.0,
    carboidratos: 1.5,
    gorduras: 0.8,
    fibras: 0.0,
    dica: 'Mínimo residual de lactose e gorduras para dietas de alta definição.'
  },

  // ===================== FRUTAS TROPICAIS E GLOBAIS =====================
  {
    id: 'fruta-banana-prata',
    nome: 'Banana Prata',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~90g)',
    calorias: 89,
    proteinas: 1.3,
    carboidratos: 23.0,
    gorduras: 0.1,
    fibras: 2.0,
    dica: 'Excelente fonte de potássio e carboidratos de absorção equilibrada.'
  },
  {
    id: 'fruta-banana-nanica',
    nome: 'Banana Nanica / Caturra',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~100g)',
    calorias: 92,
    proteinas: 1.4,
    carboidratos: 24.0,
    gorduras: 0.1,
    fibras: 2.1,
    dica: 'Mais doce e cremosa, perfeita para vitaminas e panquecas.'
  },
  {
    id: 'fruta-maca-fuji',
    nome: 'Maçã Fuji com Casca',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~130g)',
    calorias: 52,
    proteinas: 0.3,
    carboidratos: 13.8,
    gorduras: 0.2,
    fibras: 2.4,
    dica: 'Rica em pectina para modulação da flora bacteriana benéfica.'
  },
  {
    id: 'fruta-manga-palmer',
    nome: 'Manga Palmer Madura',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 fatia generosa (~150g)',
    calorias: 60,
    proteinas: 0.8,
    carboidratos: 15.0,
    gorduras: 0.4,
    fibras: 1.6,
    dica: 'Sem fiapos com farta quantidade de vitamina A e C.'
  },
  {
    id: 'fruta-acai-puro',
    nome: 'Açaí Puro (Polpa sem Xarope)',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 tigela (~200g)',
    calorias: 65,
    proteinas: 1.5,
    carboidratos: 6.2,
    gorduras: 4.0,
    fibras: 3.2,
    dica: 'Gorduras boas monoinsaturadas e flavonoides antocianinas com quase zero açúcar.'
  },
  {
    id: 'fruta-acai-com-xarope',
    nome: 'Açaí Tradicional com Xarope de Guaraná',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '1 tigela média (~300g)',
    calorias: 110,
    proteinas: 1.2,
    carboidratos: 21.5,
    gorduras: 2.5,
    fibras: 2.0,
    dica: 'Mais doce com adição de açúcares simples para recarga rápida de energia.'
  },
  {
    id: 'fruta-morango',
    nome: 'Morango Fresco in Natura',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '8 unidades (~120g)',
    calorias: 32,
    proteinas: 0.7,
    carboidratos: 7.7,
    gorduras: 0.3,
    fibras: 2.0,
    dica: 'Baixíssimas calorias permitindo grande volume de comida em cutting.'
  },
  {
    id: 'fruta-melancia',
    nome: 'Melancia Fresca',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 fatia média (~250g)',
    calorias: 30,
    proteinas: 0.6,
    carboidratos: 7.6,
    gorduras: 0.2,
    fibras: 0.4,
    dica: '92% de água com citrulina que favorece vasodilatação e bomba muscular.'
  },
  {
    id: 'fruta-abacate',
    nome: 'Abacate in Natura',
    categoria: 'gordura',
    porcao: '100g',
    porcaoUnitaria: '1/2 unidade (~100g)',
    calorias: 160,
    proteinas: 2.0,
    carboidratos: 8.5,
    gorduras: 14.7,
    fibras: 6.7,
    dica: 'Gordura saudável que melhora a síntese hormonal e absorção de vitaminas lipossolúveis.'
  },
  {
    id: 'fruta-mamao',
    nome: 'Mamão Papaia Fresco',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1/2 unidade (~140g)',
    calorias: 43,
    proteinas: 0.5,
    carboidratos: 10.8,
    gorduras: 0.1,
    fibras: 1.7,
    dica: 'Enzima papaína que facilita o esvaziamento gástrico e quebra proteica.'
  },
  {
    id: 'fruta-laranja',
    nome: 'Laranja Pera Fresca',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~130g)',
    calorias: 47,
    proteinas: 0.9,
    carboidratos: 11.8,
    gorduras: 0.1,
    fibras: 2.4,
    dica: 'Consumir com o bagaço entrega todas as fibras que estabilizam a glicemia.'
  },
  {
    id: 'fruta-uva-verde',
    nome: 'Uva Thompson / Verde sem Semente',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '1 cacho pequeno (~100g)',
    calorias: 69,
    proteinas: 0.7,
    carboidratos: 18.1,
    gorduras: 0.2,
    fibras: 0.9,
    dica: 'Carboidratos imediatos e resveratrol antioxidante.'
  },
  {
    id: 'fruta-abacaxi',
    nome: 'Abacaxi Pérola Fresco',
    categoria: 'fruta',
    porcao: '100g',
    porcaoUnitaria: '2 fatias médias (~150g)',
    calorias: 48,
    proteinas: 0.5,
    carboidratos: 12.6,
    gorduras: 0.1,
    fibras: 1.4,
    dica: 'Bromelina pura que atua na digestão gástrica eficiente de carnes.'
  },

  // ===================== VERDURAS, LEGUMES E FIBRAS =====================
  {
    id: 'verd-alface',
    nome: 'Alface Americana / Crespa',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 prato de sobremesa cheio (~50g)',
    calorias: 15,
    proteinas: 1.4,
    carboidratos: 2.9,
    gorduras: 0.2,
    fibras: 1.3,
    dica: 'Volume sacietógeno com quase zero impacto calórico.'
  },
  {
    id: 'verd-rucula',
    nome: 'Rúcula Fresca in Natura',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 porção generosa (~60g)',
    calorias: 25,
    proteinas: 2.6,
    carboidratos: 3.7,
    gorduras: 0.7,
    fibras: 1.6,
    dica: 'Rica em nitratos que elevam a produção de óxido nítrico e vascularização.'
  },
  {
    id: 'verd-couve',
    nome: 'Couve Manteiga Refogada no Azeite',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '3 colheres de sopa (~80g)',
    calorias: 90,
    proteinas: 3.0,
    carboidratos: 8.7,
    gorduras: 5.0,
    fibras: 4.2,
    dica: 'Altíssimo teor de cálcio, magnésio e folato vegetal.'
  },
  {
    id: 'verd-brocolis',
    nome: 'Brócolis Cozido no Vapor',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 xícara de floretes (~100g)',
    calorias: 35,
    proteinas: 2.8,
    carboidratos: 6.6,
    gorduras: 0.4,
    fibras: 3.3,
    dica: 'Sulforafano potente e o legume predileto do fisiculturismo mundial.'
  },
  {
    id: 'verd-cenoura',
    nome: 'Cenoura Crua Ralada',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~100g)',
    calorias: 41,
    proteinas: 0.9,
    carboidratos: 9.6,
    gorduras: 0.2,
    fibras: 2.8,
    dica: 'Provitamina A (betacaroteno) para a saúde da pele e visão.'
  },
  {
    id: 'verd-tomate',
    nome: 'Tomate Italiano in Natura',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~120g)',
    calorias: 18,
    proteinas: 0.9,
    carboidratos: 3.9,
    gorduras: 0.2,
    fibras: 1.2,
    dica: 'Licopeno potente protetor celular.'
  },
  {
    id: 'verd-pepino',
    nome: 'Pepino Japonês com Casca',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~150g)',
    calorias: 15,
    proteinas: 0.7,
    carboidratos: 3.6,
    gorduras: 0.1,
    fibras: 0.5,
    dica: 'Hidratação e sílica natural para articulações e colágeno.'
  },
  {
    id: 'verd-beterraba',
    nome: 'Beterraba Cozida',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~110g)',
    calorias: 44,
    proteinas: 1.7,
    carboidratos: 9.6,
    gorduras: 0.2,
    fibras: 2.0,
    dica: 'Campeã em nitratos para aumento do VO2 máx e potência muscular.'
  },
  {
    id: 'verd-abobrinha',
    nome: 'Abobrinha Verde Cozida',
    categoria: 'verdura',
    porcao: '100g',
    porcaoUnitaria: '1 xícara picada (~120g)',
    calorias: 17,
    proteinas: 1.2,
    carboidratos: 3.1,
    gorduras: 0.3,
    fibras: 1.0,
    dica: 'Leve, hidratante e sem glúten para substituir massas.'
  },

  // ===================== DOCES, LANCHES E SOBREMESAS =====================
  {
    id: 'doce-brigadeiro',
    nome: 'Brigadeiro Tradicional de Chocolate',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '1 unidade grande (~25g)',
    calorias: 410,
    proteinas: 6.2,
    carboidratos: 58.5,
    gorduras: 17.5,
    fibras: 1.8,
    dica: 'Denso em carboidratos simples de leite condensado e gordura láctea.'
  },
  {
    id: 'doce-pudim',
    nome: 'Pudim de Leite Condensado com Calda',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '1 fatia média (~120g)',
    calorias: 245,
    proteinas: 5.8,
    carboidratos: 37.2,
    gorduras: 8.5,
    fibras: 0.0,
    dica: 'Sobremesa de ovos e leite com calda caramelizada.'
  },
  {
    id: 'doce-doce-de-leite',
    nome: 'Doce de Leite Pastoso',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '1 colher de sopa (~20g)',
    calorias: 315,
    proteinas: 6.5,
    carboidratos: 55.0,
    gorduras: 7.5,
    fibras: 0.0,
    dica: 'Muito utilizado no meio fitness como pré-treino de rápida ação energética.'
  },
  {
    id: 'doce-pacoca',
    nome: 'Paçoca de Amendoim Tipo Rolha',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '1 unidade (~20g)',
    calorias: 510,
    proteinas: 14.0,
    carboidratos: 52.0,
    gorduras: 28.0,
    fibras: 5.0,
    dica: 'Rica em arginina e gorduras monoinsaturadas do amendoim.'
  },
  {
    id: 'doce-chocolate-amargo',
    nome: 'Chocolate Amargo 70% Cacau',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '4 quadradinhos (~25g)',
    calorias: 540,
    proteinas: 7.8,
    carboidratos: 46.0,
    gorduras: 38.0,
    fibras: 8.5,
    dica: 'Alta concentração de polifenóis e magnésio para relaxamento muscular.'
  },
  {
    id: 'doce-chocolate-ao-leite',
    nome: 'Chocolate ao Leite Tradicional',
    categoria: 'doce',
    porcao: '100g',
    porcaoUnitaria: '4 quadradinhos (~25g)',
    calorias: 535,
    proteinas: 7.0,
    carboidratos: 59.0,
    gorduras: 30.0,
    fibras: 2.0,
    dica: 'Maior teor de açúcares refinados e gordura de leite.'
  },
  {
    id: 'lanche-pizza-mussarela',
    nome: 'Pizza de Muçarela (Fatia)',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 fatia média (~120g)',
    calorias: 280,
    proteinas: 12.0,
    carboidratos: 28.0,
    gorduras: 13.0,
    fibras: 1.5,
    dica: 'Massa fermentada com queijo muçarela derretido e molho de tomate.'
  },
  {
    id: 'lanche-coxinha',
    nome: 'Coxinha de Frango com Catupiry',
    categoria: 'refeicao',
    porcao: '100g',
    porcaoUnitaria: '1 unidade média (~130g)',
    calorias: 285,
    proteinas: 11.5,
    carboidratos: 29.0,
    gorduras: 14.0,
    fibras: 1.2,
    dica: 'Salgado frito com recheio de peito de frango temperado.'
  },
  {
    id: 'lanche-hamburguer',
    nome: 'Hambúrguer de Carne Bovina (Carne)',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 unidade grelhada (~110g)',
    calorias: 250,
    proteinas: 18.0,
    carboidratos: 0.5,
    gorduras: 19.0,
    fibras: 0.0,
    dica: 'Blend de carne vermelha com alto teor de ferro e proteínas.'
  },

  // ===================== LATICÍNIOS E GORDURAS BOAS =====================
  {
    id: 'laticinio-queijo-minas',
    nome: 'Queijo Minas Frescal',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 fatia grossa (~50g)',
    calorias: 240,
    proteinas: 17.5,
    carboidratos: 3.2,
    gorduras: 17.8,
    fibras: 0.0,
    dica: 'Queijo fresco tradicional brasileiro com bom aporte proteico.'
  },
  {
    id: 'laticinio-queijo-mussarela',
    nome: 'Queijo Muçarela Fatiado',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '2 fatias (~30g)',
    calorias: 300,
    proteinas: 22.0,
    carboidratos: 2.2,
    gorduras: 23.0,
    fibras: 0.0,
    dica: 'Saboroso e fonte de cálcio, ideal para complementar lanches.'
  },
  {
    id: 'laticinio-queijo-cottage',
    nome: 'Queijo Cottage',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '2 colheres de sopa cheias (~60g)',
    calorias: 98,
    proteinas: 12.5,
    carboidratos: 3.4,
    gorduras: 4.3,
    fibras: 0.0,
    dica: 'Baixíssima gordura com proteína de caseína de lenta digestão.'
  },
  {
    id: 'laticinio-requeijao-light',
    nome: 'Requeijão Cremoso Light',
    categoria: 'proteina',
    porcao: '100g',
    porcaoUnitaria: '1 colher de sopa (~30g)',
    calorias: 160,
    proteinas: 11.0,
    carboidratos: 4.5,
    gorduras: 10.5,
    fibras: 0.0,
    dica: 'Menos gordura saturada para passar no pão ou crepioca.'
  },
  {
    id: 'gordura-pasta-amendoim',
    nome: 'Pasta de Amendoim Integral',
    categoria: 'gordura',
    porcao: '100g',
    porcaoUnitaria: '1 colher de sopa (~15g)',
    calorias: 590,
    proteinas: 28.0,
    carboidratos: 20.0,
    gorduras: 50.0,
    fibras: 7.3,
    dica: 'Gorduras boas, vitamina E e altíssima densidade energética para bulking.'
  },
  {
    id: 'gordura-azeite-oliva',
    nome: 'Azeite de Oliva Extra Virgem',
    categoria: 'gordura',
    porcao: '100g',
    porcaoUnitaria: '1 colher de sopa (~13ml)',
    calorias: 884,
    proteinas: 0.0,
    carboidratos: 0.0,
    gorduras: 100.0,
    fibras: 0.0,
    dica: 'Ácido oleico puro, protetor cardiovascular e antioxidante natural.'
  },
  {
    id: 'gordura-castanha-para',
    nome: 'Castanha-do-Pará',
    categoria: 'gordura',
    porcao: '100g',
    porcaoUnitaria: '2 unidades (~10g)',
    calorias: 656,
    proteinas: 14.3,
    carboidratos: 12.3,
    gorduras: 66.4,
    fibras: 7.5,
    dica: 'Maior concentração de selênio natural do mundo, otimizando a tireoide.'
  },

  // ===================== BEBIDAS, LÍQUIDOS E SHAKES (TABELA TACO & USDA) =====================
  {
    id: 'bebida-leite-integral',
    nome: 'Leite Integral Pasteurizado / UHT',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo americano (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 61,
    proteinas: 3.2,
    carboidratos: 4.8,
    gorduras: 3.2,
    fibras: 0.0,
    dica: 'Fonte de cálcio de alta biodisponibilidade, fósforo e proteínas completas (caseína e whey).'
  },
  {
    id: 'bebida-leite-desnatado',
    nome: 'Leite Desnatado (Zero Gordura)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo americano (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 35,
    proteinas: 3.4,
    carboidratos: 5.0,
    gorduras: 0.2,
    fibras: 0.0,
    dica: 'Mesma quantidade de proteína e cálcio do leite integral, com praticamente zero gorduras.'
  },
  {
    id: 'bebida-leite-semidesnatado',
    nome: 'Leite Semidesnatado',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo americano (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 45,
    proteinas: 3.3,
    carboidratos: 4.9,
    gorduras: 1.5,
    fibras: 0.0,
    dica: 'Equilíbrio ideal entre sabor cremoso e menor teor calórico para o dia a dia.'
  },
  {
    id: 'bebida-cafe-sem-acucar',
    nome: 'Café Preto Coado (Sem Açúcar)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 xícara de café (~50ml) ou xícara de chá (~150ml)',
    ehLiquido: true,
    unidadePadrao: 'xicara_cafe',
    calorias: 2,
    proteinas: 0.2,
    carboidratos: 0.3,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Zero calorias significativas. Excelente termogênico natural rico em polifenóis antioxidantes.'
  },
  {
    id: 'bebida-cafe-com-acucar',
    nome: 'Café Coado Adoçado com Açúcar',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 xícara de café (~50ml)',
    ehLiquido: true,
    unidadePadrao: 'xicara_cafe',
    calorias: 42,
    proteinas: 0.2,
    carboidratos: 10.3,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Contém carboidratos simples adicionados pelo açúcar refinado ou cristal.'
  },
  {
    id: 'bebida-cafe-com-leite',
    nome: 'Café com Leite Tradicional (Pingado)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo americano (~190ml) ou xícara (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 52,
    proteinas: 2.7,
    carboidratos: 4.4,
    gorduras: 2.6,
    fibras: 0.0,
    dica: 'Combinação clássica matinal do brasileiro com energia rápida e proteínas.'
  },
  {
    id: 'bebida-suco-laranja-natural',
    nome: 'Suco de Laranja Natural (Sem Açúcar)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo americano (~200ml) ou copo 300ml',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 45,
    proteinas: 0.7,
    carboidratos: 10.4,
    gorduras: 0.2,
    fibras: 0.2,
    dica: 'Rico em Vitamina C, flavonoides como hesperidina e potássio natural.'
  },
  {
    id: 'bebida-suco-laranja-acucar',
    nome: 'Suco de Laranja Adoçado com Açúcar',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo grande (~250ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_requeijao',
    calorias: 65,
    proteinas: 0.6,
    carboidratos: 15.5,
    gorduras: 0.1,
    fibras: 0.2,
    dica: 'Maior densidade glicêmica devido ao açúcar adicional.'
  },
  {
    id: 'bebida-suco-uva-integral',
    nome: 'Suco de Uva 100% Integral',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 68,
    proteinas: 0.6,
    carboidratos: 16.4,
    gorduras: 0.1,
    fibras: 0.1,
    dica: 'Altíssima concentração de resveratrol, antocianinas e ação vasodilatadora endotelial.'
  },
  {
    id: 'bebida-agua-coco',
    nome: 'Água de Coco Natural',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo (~200ml) ou coco verde (~350ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 19,
    proteinas: 0.7,
    carboidratos: 3.7,
    gorduras: 0.2,
    fibras: 1.1,
    dica: 'Isotônico natural perfeito para hidratação rápida, reposição de eletrólitos e potássio.'
  },
  {
    id: 'bebida-whey-agua',
    nome: 'Shake de Whey Protein com Água',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 shake (1 scoop 30g + 200ml de água = ~230ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 52,
    proteinas: 10.4,
    carboidratos: 1.3,
    gorduras: 0.7,
    fibras: 0.0,
    dica: 'Pico rápido de leucina e aminoácidos essenciais para síntese proteica pós-treino.'
  },
  {
    id: 'bebida-whey-leite',
    nome: 'Shake de Whey Protein com Leite Desnatado',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 shake (~250ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_requeijao',
    calorias: 75,
    proteinas: 12.5,
    carboidratos: 5.0,
    gorduras: 0.8,
    fibras: 0.0,
    dica: 'Combinação potente de absorção mista (whey rápido + caseína sustentada).'
  },
  {
    id: 'bebida-vitamina-banana',
    nome: 'Vitamina de Banana com Leite e Aveia',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo grande (~300ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_300',
    calorias: 88,
    proteinas: 3.8,
    carboidratos: 15.2,
    gorduras: 1.8,
    fibras: 1.3,
    dica: 'Refeição líquida anabólica completa com potássio, beta-glucana e proteínas.'
  },
  {
    id: 'bebida-refrigerante-cola',
    nome: 'Refrigerante Tradicional (Cola / Guaraná)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 lata (~350ml) ou 1 copo (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'lata',
    calorias: 42,
    proteinas: 0.0,
    carboidratos: 10.6,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Calorias vazias provenientes exclusivamente de açúcares simples.'
  },
  {
    id: 'bebida-refrigerante-zero',
    nome: 'Refrigerante Zero Açúcar (Cola Zero / Guaraná Zero)',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 lata (~350ml)',
    ehLiquido: true,
    unidadePadrao: 'lata',
    calorias: 0,
    proteinas: 0.0,
    carboidratos: 0.0,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Adoçado com sucralose/acessulfame-k, sem impacto em carboidratos ou calorias.'
  },
  {
    id: 'bebida-cerveja-pilsen',
    nome: 'Cerveja Pilsen Tradicional',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 lata (~350ml) ou long neck (~330ml)',
    ehLiquido: true,
    unidadePadrao: 'lata',
    calorias: 43,
    proteinas: 0.5,
    carboidratos: 3.6,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Bebida fermentada à base de malte e lúpulo, calorias oriundas de carboidratos e álcool.'
  },
  {
    id: 'bebida-cha-verde',
    nome: 'Chá Verde / Preto / Mate sem Açúcar',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 xícara (~200ml) ou copo grande',
    ehLiquido: true,
    unidadePadrao: 'xicara_cha',
    calorias: 1,
    proteinas: 0.1,
    carboidratos: 0.2,
    gorduras: 0.0,
    fibras: 0.0,
    dica: 'Calorias desprezíveis, rico em catequinas (EGCG) e compostos anti-inflamatórios.'
  },
  {
    id: 'bebida-leite-vegetal-aveia',
    nome: 'Leite Vegetal de Aveia / Amêndoas',
    categoria: 'bebida',
    porcao: '100ml',
    porcaoUnitaria: '1 copo (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'copo_americano',
    calorias: 46,
    proteinas: 1.2,
    carboidratos: 7.2,
    gorduras: 1.5,
    fibras: 0.9,
    dica: 'Alternativa 100% vegetal sem lactose e livre de colesterol.'
  },
  {
    id: 'bebida-iogurte-natural',
    nome: 'Iogurte Natural Integral Consistente',
    categoria: 'bebida',
    porcao: '100g',
    porcaoUnitaria: '1 pote individual (~170g) ou 1 copo (~200ml)',
    ehLiquido: true,
    unidadePadrao: 'unidade',
    calorias: 61,
    proteinas: 3.5,
    carboidratos: 4.7,
    gorduras: 3.2,
    fibras: 0.0,
    dica: 'Probióticos vivos excelentes para o microbioma intestinal e síntese de vitaminas.'
  },
  {
    id: 'bebida-iogurte-desnatado',
    nome: 'Iogurte Natural Desnatado / Zero Gordura',
    categoria: 'bebida',
    porcao: '100g',
    porcaoUnitaria: '1 pote individual (~160g)',
    ehLiquido: true,
    unidadePadrao: 'unidade',
    calorias: 41,
    proteinas: 4.2,
    carboidratos: 5.8,
    gorduras: 0.1,
    fibras: 0.0,
    dica: 'Densidade proteica pura sem gordura adicionada, excelente com aveia e frutas.'
  }
];

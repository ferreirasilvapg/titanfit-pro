/**
 * ============================================================================
 * TITANFIT JOINT & BIOMECHANICAL WORKOUT ENGINE (MOTOR DE ADAPTAÇÃO ARTICULAR)
 * ============================================================================
 * Mapeamento e prescrição de treinos personalizados anti-lesão com base na
 * anamnese de problemas articulares, dores e limitações de movimento.
 * ============================================================================
 */

export interface RespostasQuestionarioArticular {
  articulacoesAfetadas: string[]; // 'joelhos', 'lombar', 'ombros', 'cervical', 'punhos', 'quadril', 'tornozelos', 'nenhuma'
  diagnosticos: string[]; // 'hernia_disco', 'condromalacia', 'bursite_manguito', 'tendinite_punho', 'nenhum'
  nivelImpacto: 'baixo' | 'moderado' | 'livre';
  objetivoPrincipal: 'hipertrofia_protegida' | 'emagrecimento_seguro' | 'reabilitacao_fortalecimento' | 'condicionamento';
  frequenciaSemanal: number; // 2, 3, 4, 5
  observacoes?: string;
  dataPreenchimento?: string;
}

export interface ExercicioAdaptado {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  remoteUrl: string;
  backupUrl: string;
  series: number;
  reps: string;
  seriesReps: string;
  dicas: string;
  protecaoTag: string; // Ex: '🛡️ Proteção Patelar', '🛡️ Zero Carga Axial Lombar'
  motivoAdaptacao: string;
  nivel: string;
}

export interface SessaoTreinoPersonalizado {
  id: string;
  titulo: string;
  foco: string;
  subtitulo: string;
  exercicios: ExercicioAdaptado[];
}

export interface PlanoTreinoPersonalizado {
  id: string;
  geradoEm: string;
  perfil: RespostasQuestionarioArticular;
  resumoPrescricao: string;
  sessoes: SessaoTreinoPersonalizado[];
}

const CHAVE_STORAGE_ANAMNESE = 'titanfit_anamnese_articular';
const CHAVE_STORAGE_TREINO_PERSONALIZADO = 'titanfit_treino_personalizado_ativo';

/**
 * Obtém as respostas salvas da anamnese articular
 */
export function obterAnamneseArticular(): RespostasQuestionarioArticular | null {
  if (typeof window === 'undefined') return null;
  const salvo = localStorage.getItem(CHAVE_STORAGE_ANAMNESE);
  if (!salvo) return null;
  try {
    return JSON.parse(salvo);
  } catch {
    return null;
  }
}

/**
 * Obtém o plano de treino personalizado ativo
 */
export function obterPlanoTreinoPersonalizado(): PlanoTreinoPersonalizado | null {
  if (typeof window === 'undefined') return null;
  const salvo = localStorage.getItem(CHAVE_STORAGE_TREINO_PERSONALIZADO);
  if (!salvo) return null;
  try {
    return JSON.parse(salvo);
  } catch {
    return null;
  }
}

/**
 * Salva a anamnese e persiste no armazenamento local
 */
export function salvarAnamneseArticular(respostas: RespostasQuestionarioArticular) {
  if (typeof window === 'undefined') return;
  const dados = {
    ...respostas,
    dataPreenchimento: new Date().toISOString()
  };
  localStorage.setItem(CHAVE_STORAGE_ANAMNESE, JSON.stringify(dados));
  return dados;
}

/**
 * Salva o treino personalizado gerado
 */
export function salvarPlanoTreinoPersonalizado(plano: PlanoTreinoPersonalizado) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAVE_STORAGE_TREINO_PERSONALIZADO, JSON.stringify(plano));
}

/**
 * Motor determinístico de substituição biomecânica anti-lesão
 * Constrói treinos seguros mesmo quando offline ou sem API externa.
 */
export function gerarTreinoAdaptadoLocal(respostas: RespostasQuestionarioArticular): PlanoTreinoPersonalizado {
  const temKnee = respostas.articulacoesAfetadas.includes('joelhos') || respostas.diagnosticos.includes('condromalacia');
  const temLombar = respostas.articulacoesAfetadas.includes('lombar') || respostas.diagnosticos.includes('hernia_disco');
  const temOmbro = respostas.articulacoesAfetadas.includes('ombros') || respostas.diagnosticos.includes('bursite_manguito');
  const temPunho = respostas.articulacoesAfetadas.includes('punhos') || respostas.diagnosticos.includes('tendinite_punho');
  const temCervical = respostas.articulacoesAfetadas.includes('cervical');

  // Gerador de resumos clínicos
  const protecoes: string[] = [];
  if (temKnee) protecoes.push('Alívio da pressão patelofemoral nos joelhos (substituição por exercícios de cadeia posterior e ângulo protegido)');
  if (temLombar) protecoes.push('Zero compressão axial na coluna lombar (apoio torácico e banco inclinado)');
  if (temOmbro) protecoes.push('Preservação do manguito rotador (pegadas neutras e plano escapular a 30°)');
  if (temPunho) protecoes.push('Alinhamento neutro para os punhos com halteres e apoios móveis');
  if (temCervical) protecoes.push('Estabilização cervical e eliminação de puxadas atrás do pescoço');

  const resumo = protecoes.length > 0
    ? `Treino calibrado com salvaguardas articulares ativas: ${protecoes.join('; ')}.`
    : 'Treino otimizado para progressão contínua de cargas com biomecânica avançada.';

  // 1. Exercício de Peitoral Adaptado
  let exPeito: ExercicioAdaptado;
  if (temOmbro) {
    exPeito = {
      id: 'custom-supino-inclinado-neutro',
      name: 'Supino Inclinado com Halteres (Pegada Semi-Neutra)',
      bodyPart: 'peito',
      target: 'peitoral superior (clavicular)',
      equipment: 'halteres',
      gifUrl: '/exercises/incline-press.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Segure os halteres em ângulo de 45° (semi-neutro). O banco a 30° protege o manguito e mantém as escápulas estáveis.',
      protecaoTag: '🛡️ Proteção de Manguito & Ombro',
      motivoAdaptacao: 'A pegada neutra abre o espaço subacromial, eliminando pinçamentos no tendão supraespinhal.',
      nivel: 'Adaptado Seguro'
    };
  } else {
    exPeito = {
      id: 'inc-db-press-002',
      name: 'Supino Inclinado com Halteres',
      bodyPart: 'peito',
      target: 'peitoral superior',
      equipment: 'halteres',
      gifUrl: '/exercises/incline-press.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
      series: 3,
      reps: '8-12',
      seriesReps: '3 séries × 8-12 reps',
      dicas: 'Apoie completamente as costas, desça até a linha do peito e empurre aproximando no topo sem bater os halteres.',
      protecaoTag: '✨ Biomecânica Anatômica',
      motivoAdaptacao: 'Amplitude controlada com halteres permite trajetória natural aos cotovelos.',
      nivel: 'Todos os níveis'
    };
  }

  // 2. Exercício de Costas Adaptado
  let exCostas: ExercicioAdaptado;
  if (temLombar) {
    exCostas = {
      id: 'custom-puxada-ergonomica',
      name: 'Puxada Frontal na Polia com Encosto Apoiado',
      bodyPart: 'costas',
      target: 'dorsais (grande dorsal)',
      equipment: 'polia',
      gifUrl: '/exercises/lat-pulldown.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Trave bem as coxas nos roletes. Não faça pêndulo com o tronco para não gerar cisalhamento nas vértebras L4-L5.',
      protecaoTag: '🛡️ Zero Carga Axial Lombar',
      motivoAdaptacao: 'Substitui remadas livres curvadas. A tração vertical não gera sobrecarga compressiva nos discos intervertebrais.',
      nivel: 'Adaptado Seguro'
    };
  } else {
    exCostas = {
      id: 'lat-pulldown-003',
      name: 'Puxada Frontal na Polia (Pegada Aberta)',
      bodyPart: 'costas',
      target: 'dorsais (grande dorsal)',
      equipment: 'polia',
      gifUrl: '/exercises/lat-pulldown.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown.gif',
      series: 3,
      reps: '8-12',
      seriesReps: '3 séries × 8-12 reps',
      dicas: 'Inicie deprimindo as escápulas antes de fletir os braços. Traga a barra ao osso esterno.',
      protecaoTag: '✨ Foco Dorsal',
      motivoAdaptacao: 'Desenvolvimento das dorsais sem estresse articular desnecessário.',
      nivel: 'Iniciante / Avançado'
    };
  }

  // 3. Exercício de Pernas / Quadríceps Adaptado
  let exPernas1: ExercicioAdaptado;
  if (temKnee && temLombar) {
    exPernas1 = {
      id: 'hip-thrust-004',
      name: 'Elevação Pélvica com Apoio Escapular (Hip Thrust)',
      bodyPart: 'glúteos',
      target: 'glúteo máximo e posterior',
      equipment: 'barra / haltere',
      gifUrl: '/exercises/hip-thrust.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Mantenha as canelas perpendiculares ao chão no pico da contração. Aperte os glúteos e queixo colado no peito.',
      protecaoTag: '🛡️ Máxima Proteção Joelho + Lombar',
      motivoAdaptacao: 'Substitui agachamentos profundos axiais: torque no joelho é mínimo e a coluna fica neutra sem compressão vertical.',
      nivel: 'Adaptado Ortopédico'
    };
  } else if (temKnee) {
    exPernas1 = {
      id: 'hip-thrust-004',
      name: 'Elevação Pélvica com Barra (Hip Thrust)',
      bodyPart: 'glúteos',
      target: 'glúteo máximo',
      equipment: 'barra',
      gifUrl: '/exercises/hip-thrust.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Pés na largura dos ombros. Suba até extensão total do quadril, focando o trabalho na cadeia posterior.',
      protecaoTag: '🛡️ Zero Cisalhamento Patelar',
      motivoAdaptacao: 'Elimina as forças de corte anteriores na patela e meniscos comuns em agachamentos profundos.',
      nivel: 'Adaptado Seguro'
    };
  } else {
    exPernas1 = {
      id: 'smith-squat-001',
      name: 'Agachamento Completo na Máquina Smith',
      bodyPart: 'quadríceps',
      target: 'glúteos e quadríceps',
      equipment: 'máquina smith',
      gifUrl: '/exercises/smith-squat.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
      series: 3,
      reps: '8-12',
      seriesReps: '3 séries × 8-12 reps',
      dicas: 'Pés ligeiramente à frente da linha da barra, coluna alinhada e descida controlada em 3 segundos.',
      protecaoTag: '✨ Trajetória Guiada',
      motivoAdaptacao: 'Trilho guiado permite estabilidade e recrutamento de quadríceps com segurança.',
      nivel: 'Intermediário'
    };
  }

  // 4. Exercício de Posterior de Coxa
  const exPernas2: ExercicioAdaptado = {
    id: 'leg-curl-005',
    name: 'Cadeira Flexora Unilateral ou Bilateral',
    bodyPart: 'isquiotibiais',
    target: 'posterior de coxa',
    equipment: 'máquina',
    gifUrl: '/exercises/leg-curl.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Alinhe o eixo da máquina com a dobra do joelho. Flexão suave com 2 segundos na fase excêntrica.',
    protecaoTag: temKnee ? '🛡️ Estabilização de Ligamentos Cruzados' : '✨ Isolamento Seguro',
    motivoAdaptacao: 'Fortalece os isquiotibiais, que atuam como freio protetor anterior do ligamento cruzado do joelho.',
    nivel: 'Todos os níveis'
  };

  // 5. Exercício de Ombros / Deltoides Adaptado
  let exOmbros: ExercicioAdaptado;
  if (temOmbro) {
    exOmbros = {
      id: 'elevacao-lateral-escapular-009',
      name: 'Elevação Lateral no Plano Escapular (30° à frente)',
      bodyPart: 'ombros',
      target: 'deltoide lateral e estabilizadores',
      equipment: 'halteres leves',
      gifUrl: '/exercises/lateral-raise.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
      series: 3,
      reps: '12-15',
      seriesReps: '3 séries × 12-15 reps',
      dicas: 'Eleve os braços a 30° à frente do corpo (linha da escápula), polegares voltados sutilmente para cima. Nunca gire para baixo.',
      protecaoTag: '🛡️ Preservação Subacromial',
      motivoAdaptacao: 'Evita a rotação interna que esmaga o tendão supraespinhal contra o acrômio.',
      nivel: 'Fisioterapia & Hipertrofia'
    };
  } else {
    exOmbros = {
      id: 'elevacao-lateral-009',
      name: 'Elevação Lateral com Halteres',
      bodyPart: 'ombros',
      target: 'deltoide lateral',
      equipment: 'halteres',
      gifUrl: '/exercises/lateral-raise.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
      series: 3,
      reps: '12-15',
      seriesReps: '3 séries × 12-15 reps',
      dicas: 'Mantenha os cotovelos levemente flexionados e controle a descida sem deixar o peso cair.',
      protecaoTag: '✨ Isolamento Deltoide',
      motivoAdaptacao: 'Construção da largura de ombros sem fadiga lombar.',
      nivel: 'Todos'
    };
  }

  // 6. Exercício de Braços (Bíceps / Tríceps)
  let exBracos: ExercicioAdaptado;
  if (temPunho) {
    exBracos = {
      id: 'rosca-martelo-punho-seguro',
      name: 'Rosca Martelo com Halteres (Pegada Neutra)',
      bodyPart: 'braços',
      target: 'braquial e bíceps',
      equipment: 'halteres',
      gifUrl: '/exercises/biceps-curl.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Mantenha as palmas das mãos apontadas uma para a outra o tempo todo, punhos retos sem dobrar para trás.',
      protecaoTag: '🛡️ Punhos Alinhados Neutros',
      motivoAdaptacao: 'Substitui barras retas supinadas que forçam o ligamento triangular do carpo.',
      nivel: 'Adaptado Seguro'
    };
  } else {
    exBracos = {
      id: 'rosca-direta-010',
      name: 'Rosca Direta com Barra ou Halteres',
      bodyPart: 'braços',
      target: 'bíceps braquial',
      equipment: 'barra / halteres',
      gifUrl: '/exercises/biceps-curl.gif',
      remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
      backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
      series: 3,
      reps: '10-12',
      seriesReps: '3 séries × 10-12 reps',
      dicas: 'Cotovelos estáveis ao lado das costelas, contraia no topo por 1 segundo e desça alongando.',
      protecaoTag: '✨ Pico de Bíceps',
      motivoAdaptacao: 'Recrutamento clássico dos flexores de cotovelo.',
      nivel: 'Iniciante / Intermediário'
    };
  }

  // Divisão em Sessões de acordo com os dias semanais
  const sessoes: SessaoTreinoPersonalizado[] = [];

  if (respostas.frequenciaSemanal <= 3) {
    // Treino A e Treino B (Alternados Full Body Inteligente)
    sessoes.push({
      id: 'sessao-a',
      titulo: 'Treino A • Superiores & Core Protegido',
      foco: 'Peito, Costas, Ombros & Braços com Apoio Biomecânico',
      subtitulo: 'Treino de membros superiores com alívio articular total.',
      exercicios: [exPeito, exCostas, exOmbros, exBracos]
    });

    sessoes.push({
      id: 'sessao-b',
      titulo: 'Treino B • Inferiores Anti-Impacto & Glúteos',
      foco: 'Pernas, Posterior e Cadeia Estabilizadora',
      subtitulo: temKnee ? 'Alívio patelar e proteção dos joelhos em 100% das repetições.' : 'Fortalecimento completo de pernas.',
      exercicios: [exPernas1, exPernas2, exOmbros]
    });
  } else {
    // Divisão A / B / C para 4 a 6 dias
    sessoes.push({
      id: 'sessao-push',
      titulo: 'Treino A • Empurrar Seguro (Push)',
      foco: 'Peito, Deltóide Frontal/Lateral & Tríceps',
      subtitulo: 'Apoio torácico e alinhamento articular estrito.',
      exercicios: [exPeito, exOmbros, exBracos]
    });

    sessoes.push({
      id: 'sessao-pull',
      titulo: 'Treino B • Puxar & Posterior (Pull)',
      foco: 'Dorsais, Rombóides, Posterior & Bíceps',
      subtitulo: temLombar ? 'Zero torque na lombar: puxadas com apoio fixo.' : 'Desenvolvimento completo de costas.',
      exercicios: [exCostas, exBracos, exOmbros]
    });

    sessoes.push({
      id: 'sessao-legs',
      titulo: 'Treino C • Inferiores Preservados (Legs)',
      foco: 'Glúteos, Posterior de Coxa & Estabilizadores',
      subtitulo: 'Cadeia posterior ativada sem sobrecarga patelar ou discal.',
      exercicios: [exPernas1, exPernas2]
    });
  }

  const planoFinal: PlanoTreinoPersonalizado = {
    id: `plano_${Date.now()}`,
    geradoEm: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    perfil: respostas,
    resumoPrescricao: resumo,
    sessoes
  };

  salvarPlanoTreinoPersonalizado(planoFinal);
  return planoFinal;
}

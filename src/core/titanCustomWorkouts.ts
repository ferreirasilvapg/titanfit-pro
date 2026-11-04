/**
 * ============================================================================
 * TITANFIT CUSTOM WORKOUT ENGINE (MOTOR DE TREINOS PARTICULARES DO USUÁRIO)
 * ============================================================================
 * Permite que o usuário/aluno crie suas próprias rotinas de treino personalizadas
 * (ex: Treino A, Treino B, Treino C, Treino Funcional, etc.), escolha qualquer
 * exercício do acervo com animação biomecânica em GIF correspondente, configure
 * séries, repetições, cargas e registre o progresso em tempo real.
 * ============================================================================
 */

export interface ExercicioTreinoParticular {
  id: string; // ID único da instância no treino
  exerciseId: string; // ID do movimento base
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  remoteUrl?: string;
  backupUrl?: string;
  series: number;
  reps: string;
  seriesReps: string;
  cargaInicialKg?: number;
  dicas: string;
  anotacoesPessoais?: string;
  nivel?: string;
  ordem: number;
}

export interface TreinoParticular {
  id: string;
  titulo: string;
  foco: string;
  descricao?: string;
  diasSemana?: string[]; // ['Seg', 'Qua', 'Sex']
  dataCriacao: string;
  dataModificacao: string;
  exercicios: ExercicioTreinoParticular[];
}

const STORAGE_KEY_TREINOS_PARTICULARES = 'titanfit_meus_treinos_particulares';

/**
 * ACERVO EXTENSIVO DE EXERCÍCIOS COM GIFS BIOMECÂNICOS VERIFICADOS
 * Cobre todos os grupamentos musculares com animações em loop.
 */
export const BANCO_EXERCICIOS_COMPLETO = [
  // --- PEITORAL ---
  {
    id: 'inc-db-press-002',
    name: 'Supino Inclinado com Halteres',
    bodyPart: 'peito',
    target: 'peitoral superior (clavicular)',
    equipment: 'halteres',
    gifUrl: '/exercises/incline-press.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
    series: 3,
    reps: '8-12',
    seriesReps: '3 séries × 8-12 reps',
    dicas: 'Banco a 30° ou 45°. Escápulas aduzidas e cotovelos alinhados em cerca de 75° do tronco.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'cable-fly-006',
    name: 'Supino Reto com Barra',
    bodyPart: 'peito',
    target: 'peitoral maior (esternal)',
    equipment: 'barra',
    gifUrl: '/exercises/bench-press.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif',
    series: 4,
    reps: '8-10',
    seriesReps: '4 séries × 8-10 reps',
    dicas: 'Pés cravados no chão, escápulas em retração contra o banco e trajetória em leve arco.',
    nivel: 'Intermediário'
  },
  {
    id: 'crucifixo-halteres-peito',
    name: 'Crucifixo Reto com Halteres',
    bodyPart: 'peito',
    target: 'peitoral maior (alongamento)',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-fly.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-fly.gif',
    backupUrl: '/exercises/incline-press.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Cotovelos levemente flexionados durante todo o arco. Sinta o alongamento das fibras no peitoral.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'crossover-polia-peito',
    name: 'Crucifixo / Crossover na Polia Alta',
    bodyPart: 'peito',
    target: 'peitoral inferior e medial',
    equipment: 'polia',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/cable-standing-fly.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/cable-standing-fly.gif',
    backupUrl: '/exercises/bench-press.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Cruze levemente as mãos na frente do corpo no pico da contração para recrutar a porção medial.',
    nivel: 'Intermediário'
  },

  // --- COSTAS & DORSAIS ---
  {
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
    dicas: 'Deprima as escápulas antes de puxar com os cotovelos. Traga a barra ao osso esterno.',
    nivel: 'Iniciante / Avançado'
  },
  {
    id: 'remada-curvada-007',
    name: 'Remada Curvada com Barra Pronada',
    bodyPart: 'costas',
    target: 'romboides e espessura de dorsal',
    equipment: 'barra',
    gifUrl: '/exercises/incline-row.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-incline-row.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-incline-row.gif',
    series: 4,
    reps: '8-10',
    seriesReps: '4 séries × 8-10 reps',
    dicas: 'Tronco inclinado a 45°, core ativado e puxe a barra rente às coxas em direção ao umbigo.',
    nivel: 'Avançado'
  },
  {
    id: 'remada-unilateral-serrote',
    name: 'Remada Unilateral com Haltere (Serrote)',
    bodyPart: 'costas',
    target: 'grande dorsal e romboides',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-one-arm-row.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-one-arm-row.gif',
    backupUrl: '/exercises/incline-row.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Apoie o joelho e a mão oposta no banco. Puxe o haltere em direção ao quadril, não ao peito.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'puxada-triangulo-polia',
    name: 'Puxada Frontal com Triângulo (Pegada Fechada)',
    bodyPart: 'costas',
    target: 'grande dorsal e redondo maior',
    equipment: 'polia',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-close-grip-pulldown.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-close-grip-pulldown.gif',
    backupUrl: '/exercises/lat-pulldown.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Pegada neutra protege os punhos e permite maior alongamento superior do grande dorsal.',
    nivel: 'Todos os níveis'
  },

  // --- MEMBROS INFERIORES / QUADRÍCEPS ---
  {
    id: 'smith-squat-001',
    name: 'Agachamento Completo na Máquina Smith',
    bodyPart: 'quadríceps',
    target: 'quadríceps e glúteos',
    equipment: 'máquina smith',
    gifUrl: '/exercises/smith-squat.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
    series: 3,
    reps: '8-12',
    seriesReps: '3 séries × 8-12 reps',
    dicas: 'Pés ligeiramente à frente da barra, coluna neutra e desça até 90 graus com controle.',
    nivel: 'Intermediário'
  },
  {
    id: 'leg-press-012',
    name: 'Leg Press 45 Graus',
    bodyPart: 'quadríceps',
    target: 'quadríceps e glúteos',
    equipment: 'máquina',
    gifUrl: '/exercises/leg-press.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif',
    series: 4,
    reps: '10-12',
    seriesReps: '4 séries × 10-12 reps',
    dicas: 'Pés na largura dos ombros na plataforma. Não bloqueie nem hiperestenda os joelhos no topo.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'cadeira-extensora-quadriceps',
    name: 'Cadeira Extensora',
    bodyPart: 'quadríceps',
    target: 'reto femoral e vasto medial/lateral',
    equipment: 'máquina',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/lever-leg-extension.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/lever-leg-extension.gif',
    backupUrl: '/exercises/smith-squat.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Segure a contração por 1 segundo no topo e controle a fase excêntrica da descida.',
    nivel: 'Iniciante / Todos'
  },
  {
    id: 'agachamento-bulgaro-halteres',
    name: 'Agachamento Búlgaro com Halteres',
    bodyPart: 'quadríceps',
    target: 'quadríceps e glúteo',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-bulgarian-split-squat.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-bulgarian-split-squat.gif',
    backupUrl: '/exercises/smith-squat.gif',
    series: 3,
    reps: '8-10 cada perna',
    seriesReps: '3 séries × 8-10 reps',
    dicas: 'Pé de trás apoiado no banco, tronco levemente inclinado à frente para foco no glúteo.',
    nivel: 'Intermediário / Avançado'
  },

  // --- POSTERIOR DE COXA & GLÚTEOS ---
  {
    id: 'hip-thrust-004',
    name: 'Elevação Pélvica com Barra (Hip Thrust)',
    bodyPart: 'glúteos',
    target: 'glúteo máximo',
    equipment: 'barra',
    gifUrl: '/exercises/hip-thrust.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
    series: 4,
    reps: '8-12',
    seriesReps: '4 séries × 8-12 reps',
    dicas: 'Apoie as escápulas no banco, queixo no peito e faça extensão completa do quadril.',
    nivel: 'Intermediário'
  },
  {
    id: 'leg-curl-005',
    name: 'Cadeira Flexora Sentada',
    bodyPart: 'isquiotibiais',
    target: 'posterior de coxa',
    equipment: 'máquina',
    gifUrl: '/exercises/leg-curl.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Ajuste o apoio logo acima do tendão de Aquiles. Flexione mantendo o quadril firme.',
    nivel: 'Iniciante / Todos'
  },
  {
    id: 'stiff-barra-posterior',
    name: 'Stiff com Barra / Halteres',
    bodyPart: 'isquiotibiais',
    target: 'isquiotibiais e glúteos',
    equipment: 'barra',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/barbell-straight-leg-deadlift.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/barbell-straight-leg-deadlift.gif',
    backupUrl: '/exercises/hip-thrust.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Empurre o quadril para trás, coluna em extensão neutra e sinta o posterior alongar.',
    nivel: 'Intermediário'
  },
  {
    id: 'mesa-flexora-deitada',
    name: 'Mesa Flexora Deitada',
    bodyPart: 'isquiotibiais',
    target: 'posterior de coxa (bíceps femoral)',
    equipment: 'máquina',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-lying-leg-curl.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-lying-leg-curl.gif',
    backupUrl: '/exercises/leg-curl.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Mantenha a pelve pressionada contra o estofado para isolar o posterior sem forçar a lombar.',
    nivel: 'Todos os níveis'
  },

  // --- OMBROS & DELTÓIDES ---
  {
    id: 'elevacao-lateral-009',
    name: 'Elevação Lateral com Halteres',
    bodyPart: 'ombros',
    target: 'deltoide lateral',
    equipment: 'halteres',
    gifUrl: '/exercises/lateral-raise.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
    series: 4,
    reps: '12-15',
    seriesReps: '4 séries × 12-15 reps',
    dicas: 'Pense em empurrar as paredes para os lados no plano escapular (30° à frente).',
    nivel: 'Todos'
  },
  {
    id: 'desenvolvimento-halteres-ombro',
    name: 'Desenvolvimento com Halteres Sentado',
    bodyPart: 'ombros',
    target: 'deltoide anterior e lateral',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-shoulder-press.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-shoulder-press.gif',
    backupUrl: '/exercises/lateral-raise.gif',
    series: 3,
    reps: '8-12',
    seriesReps: '3 séries × 8-12 reps',
    dicas: 'Banco a 75°-80°. Empurre os halteres para cima sem bater no topo.',
    nivel: 'Intermediário'
  },
  {
    id: 'crucifixo-inverso-halteres',
    name: 'Crucifixo Invertido com Halteres',
    bodyPart: 'ombros',
    target: 'deltoide posterior e romboides',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-reverse-fly.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-reverse-fly.gif',
    backupUrl: '/exercises/lateral-raise.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Tronco inclinado, abra os braços mantendo os cotovelos altos para focar no posterior de ombro.',
    nivel: 'Todos os níveis'
  },

  // --- BRAÇOS (BÍCEPS & TRÍCEPS) ---
  {
    id: 'rosca-direta-010',
    name: 'Rosca Direta com Barra W ou Reta',
    bodyPart: 'braços',
    target: 'bíceps braquial',
    equipment: 'barra',
    gifUrl: '/exercises/biceps-curl.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Cotovelos fixos ao lado do corpo, sem balanço do quadril no início da subida.',
    nivel: 'Iniciante / Todos'
  },
  {
    id: 'rosca-martelo-halteres',
    name: 'Rosca Martelo com Halteres (Pegada Neutra)',
    bodyPart: 'braços',
    target: 'braquial e braquiorradial',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-hammer-curl.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-hammer-curl.gif',
    backupUrl: '/exercises/biceps-curl.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Palmas voltadas uma para a outra o tempo todo. Excelente para espessura de braço e antebraço.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'triceps-corda-polia',
    name: 'Tríceps na Polia com Corda',
    bodyPart: 'braços',
    target: 'tríceps (cabeça lateral e medial)',
    equipment: 'polia',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/cable-pushdown.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/cable-pushdown.gif',
    backupUrl: '/exercises/triceps-press.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Afaste as pontas da corda na parte mais baixa para estender completamente o tríceps.',
    nivel: 'Todos os níveis'
  },
  {
    id: 'triceps-corda-011',
    name: 'Tríceps Supinado com Barra (Pegada Fechada)',
    bodyPart: 'braços',
    target: 'tríceps (cabeça longa e medial)',
    equipment: 'barra',
    gifUrl: '/exercises/triceps-press.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-close-grip-bench-press.gif',
    backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-close-grip-bench-press.gif',
    series: 3,
    reps: '8-10',
    seriesReps: '3 séries × 8-10 reps',
    dicas: 'Pegada na largura dos ombros, cotovelos rentes às costelas.',
    nivel: 'Intermediário'
  },
  {
    id: 'triceps-frances-haltere',
    name: 'Tríceps Francês com Haltere (Sentado)',
    bodyPart: 'braços',
    target: 'tríceps (cabeça longa)',
    equipment: 'halteres',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-seated-triceps-extension.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-seated-triceps-extension.gif',
    backupUrl: '/exercises/triceps-press.gif',
    series: 3,
    reps: '10-12',
    seriesReps: '3 séries × 10-12 reps',
    dicas: 'Segure o haltere com as duas mãos atrás da cabeça. Mantenha os cotovelos apontados para o teto.',
    nivel: 'Todos os níveis'
  },

  // --- ABDÔMEN & PANTURRILHA ---
  {
    id: 'prancha-abdominal-014',
    name: 'Prancha Abdominal Isométrica',
    bodyPart: 'abdômen',
    target: 'core e transverso do abdômen',
    equipment: 'peso corporal',
    gifUrl: 'https://cdn.jsdelivr.net/gh/exercisedb/exercise-gifs@main/gifs/0478.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/exercisedb/exercise-gifs@main/gifs/0478.gif',
    backupUrl: '/exercises/hip-thrust.gif',
    series: 3,
    reps: '45-60 segundos',
    seriesReps: '3 séries × 45-60s',
    dicas: 'Abdômen contraído, glúteos travados e coluna reta sem deixar o quadril cair.',
    nivel: 'Iniciante / Todos'
  },
  {
    id: 'abdominal-infra-paralela',
    name: 'Elevação de Pernas na Paralela / Barra',
    bodyPart: 'abdômen',
    target: 'infra-abdominal e flexores de quadril',
    equipment: 'peso corporal',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/waist/hanging-leg-raise.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/waist/hanging-leg-raise.gif',
    backupUrl: '/exercises/smith-squat.gif',
    series: 3,
    reps: '12-15',
    seriesReps: '3 séries × 12-15 reps',
    dicas: 'Enrole o quadril para cima e não balance o corpo usando impulso.',
    nivel: 'Intermediário / Avançado'
  },
  {
    id: 'panturrilha-em-pe-013',
    name: 'Panturrilha em Pé na Máquina ou Degrau',
    bodyPart: 'panturrilhas',
    target: 'gastrocnêmio',
    equipment: 'máquina',
    gifUrl: 'https://cdn.jsdelivr.net/gh/exercisedb/exercise-gifs@main/gifs/0762.gif',
    remoteUrl: 'https://cdn.jsdelivr.net/gh/exercisedb/exercise-gifs@main/gifs/0762.gif',
    backupUrl: '/exercises/smith-squat.gif',
    series: 4,
    reps: '15-20',
    seriesReps: '4 séries × 15-20 reps',
    dicas: 'Alongamento máximo na descida e pausa de 1 segundo na contração máxima no topo.',
    nivel: 'Todos os níveis'
  }
];

/**
 * Rotinas padrão pré-configuradas para o usuário ver de imediato
 * caso ainda não tenha criado nenhum treino do zero.
 */
function gerarTreinosIniciaisPadrao(): TreinoParticular[] {
  const agora = new Date().toISOString();

  const treinoA: TreinoParticular = {
    id: 'particular-treino-a-padrao',
    titulo: 'Treino A • Peito, Ombros & Tríceps (Empurrar)',
    foco: 'Hipertrofia Superior e Carga Progressiva',
    descricao: 'Rotina completa de empurrar com biomecânica anatômica e proteção de manguito rotador.',
    diasSemana: ['Segunda', 'Quinta'],
    dataCriacao: agora,
    dataModificacao: agora,
    exercicios: [
      {
        id: 'inst-001',
        exerciseId: 'inc-db-press-002',
        name: 'Supino Inclinado com Halteres',
        bodyPart: 'peito',
        target: 'peitoral superior (clavicular)',
        equipment: 'halteres',
        gifUrl: '/exercises/incline-press.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif',
        series: 3,
        reps: '8-12',
        seriesReps: '3 séries × 8-12 reps',
        cargaInicialKg: 24,
        dicas: 'Banco a 30° ou 45°. Escápulas aduzidas e cotovelos alinhados em cerca de 75° do tronco.',
        anotacoesPessoais: 'Subir para 26kg na última série se sobrar repetição',
        ordem: 1
      },
      {
        id: 'inst-002',
        exerciseId: 'cable-fly-006',
        name: 'Supino Reto com Barra',
        bodyPart: 'peito',
        target: 'peitoral maior (esternal)',
        equipment: 'barra',
        gifUrl: '/exercises/bench-press.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif',
        series: 3,
        reps: '8-10',
        seriesReps: '3 séries × 8-10 reps',
        cargaInicialKg: 60,
        dicas: 'Pés cravados no chão, escápulas em retração contra o banco e descida controlada.',
        anotacoesPessoais: 'Manter descida de 3 segundos',
        ordem: 2
      },
      {
        id: 'inst-003',
        exerciseId: 'elevacao-lateral-009',
        name: 'Elevação Lateral com Halteres',
        bodyPart: 'ombros',
        target: 'deltoide lateral',
        equipment: 'halteres',
        gifUrl: '/exercises/lateral-raise.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif',
        series: 4,
        reps: '12-15',
        seriesReps: '4 séries × 12-15 reps',
        cargaInicialKg: 10,
        dicas: 'Pense em empurrar as paredes para os lados no plano escapular (30° à frente).',
        anotacoesPessoais: 'Sem roubar com as pernas',
        ordem: 3
      },
      {
        id: 'inst-004',
        exerciseId: 'triceps-corda-011',
        name: 'Tríceps Supinado com Barra',
        bodyPart: 'braços',
        target: 'tríceps (cabeça lateral)',
        equipment: 'barra',
        gifUrl: '/exercises/triceps-press.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-close-grip-bench-press.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-close-grip-bench-press.gif',
        series: 3,
        reps: '10-12',
        seriesReps: '3 séries × 10-12 reps',
        cargaInicialKg: 30,
        dicas: 'Pegada fechada na largura dos ombros, cotovelos rentes ao tronco.',
        anotacoesPessoais: 'Foco total no bloqueio dos braços',
        ordem: 4
      }
    ]
  };

  const treinoB: TreinoParticular = {
    id: 'particular-treino-b-padrao',
    titulo: 'Treino B • Costas, Bíceps & Posterior (Puxar)',
    foco: 'Largura Dorsal e Força de Tração',
    descricao: 'Construção da musculatura das costas com controle escápulo-umeral e flexores de braço.',
    diasSemana: ['Terça', 'Sexta'],
    dataCriacao: agora,
    dataModificacao: agora,
    exercicios: [
      {
        id: 'inst-005',
        exerciseId: 'lat-pulldown-003',
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
        cargaInicialKg: 50,
        dicas: 'Deprima as escápulas antes de puxar com os cotovelos. Traga a barra ao osso esterno.',
        anotacoesPessoais: 'Puxar forte até a clavícula',
        ordem: 1
      },
      {
        id: 'inst-006',
        exerciseId: 'remada-curvada-007',
        name: 'Remada Curvada com Barra Pronada',
        bodyPart: 'costas',
        target: 'dorsal e romboides',
        equipment: 'barra',
        gifUrl: '/exercises/incline-row.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-incline-row.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-incline-row.gif',
        series: 3,
        reps: '8-10',
        seriesReps: '3 séries × 8-10 reps',
        cargaInicialKg: 50,
        dicas: 'Tronco inclinado a 45°, core firme e barra rente às coxas.',
        anotacoesPessoais: 'Cinto lombar se colocar acima de 60kg',
        ordem: 2
      },
      {
        id: 'inst-007',
        exerciseId: 'rosca-direta-010',
        name: 'Rosca Direta com Barra',
        bodyPart: 'braços',
        target: 'bíceps braquial',
        equipment: 'barra',
        gifUrl: '/exercises/biceps-curl.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/barbell-curl.gif',
        series: 3,
        reps: '10-12',
        seriesReps: '3 séries × 10-12 reps',
        cargaInicialKg: 20,
        dicas: 'Cotovelos fixos ao lado do corpo, sem balançar o quadril na fase inicial.',
        anotacoesPessoais: 'Apertar o pico de bíceps no topo',
        ordem: 3
      }
    ]
  };

  const treinoC: TreinoParticular = {
    id: 'particular-treino-c-padrao',
    titulo: 'Treino C • Pernas Completas & Glúteos (Pernas Pesado)',
    foco: 'Membros Inferiores, Posterior e Quadríceps',
    descricao: 'Treino de alta intensidade para pernas com movimentos multiarticulares e isoladores.',
    diasSemana: ['Quarta', 'Sábado'],
    dataCriacao: agora,
    dataModificacao: agora,
    exercicios: [
      {
        id: 'inst-008',
        exerciseId: 'smith-squat-001',
        name: 'Agachamento Completo na Máquina Smith',
        bodyPart: 'quadríceps',
        target: 'glúteos e quadríceps',
        equipment: 'máquina smith',
        gifUrl: '/exercises/smith-squat.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-full-squat.gif',
        series: 4,
        reps: '8-12',
        seriesReps: '4 séries × 8-12 reps',
        cargaInicialKg: 60,
        dicas: 'Mantenha os pés ligeiramente à frente da barra, coluna neutra e desça até 90 graus.',
        anotacoesPessoais: 'Descida lenta de 3s',
        ordem: 1
      },
      {
        id: 'inst-009',
        exerciseId: 'leg-press-012',
        name: 'Leg Press 45 Graus',
        bodyPart: 'quadríceps',
        target: 'quadríceps e glúteos',
        equipment: 'máquina',
        gifUrl: '/exercises/leg-press.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif',
        series: 4,
        reps: '10-12',
        seriesReps: '4 séries × 10-12 reps',
        cargaInicialKg: 140,
        dicas: 'Pés na largura dos ombros, não bloqueie os joelhos no topo do movimento.',
        anotacoesPessoais: 'Carga excelente, focar na amplitude',
        ordem: 2
      },
      {
        id: 'inst-010',
        exerciseId: 'hip-thrust-004',
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
        cargaInicialKg: 50,
        dicas: 'Apoie as escápulas no banco, queixo no peito e faça extensão completa do quadril.',
        anotacoesPessoais: 'Pausa isométrica de 1s no topo',
        ordem: 3
      },
      {
        id: 'inst-011',
        exerciseId: 'leg-curl-005',
        name: 'Cadeira Flexora',
        bodyPart: 'isquiotibiais',
        target: 'posterior de coxa',
        equipment: 'máquina',
        gifUrl: '/exercises/leg-curl.gif',
        remoteUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
        backupUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif',
        series: 3,
        reps: '12-15',
        seriesReps: '3 séries × 12-15 reps',
        cargaInicialKg: 40,
        dicas: 'Ajuste o apoio logo acima do tendão de calcâneo. Realize a contração sem elevar o quadril.',
        anotacoesPessoais: 'Isolamento perfeito',
        ordem: 4
      }
    ]
  };

  return [treinoA, treinoB, treinoC];
}

const ouvintesTreinosParticulares = new Set<(treinos: TreinoParticular[]) => void>();

function notificarMudancas(treinos: TreinoParticular[]) {
  ouvintesTreinosParticulares.forEach((fn) => {
    try {
      fn(treinos);
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Recupera todos os treinos particulares salvos
 */
export function obterTreinosParticulares(): TreinoParticular[] {
  if (typeof window === 'undefined') return [];
  const salvo = localStorage.getItem(STORAGE_KEY_TREINOS_PARTICULARES);
  if (!salvo) {
    const padrao = gerarTreinosIniciaisPadrao();
    localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(padrao));
    return padrao;
  }
  try {
    const lista = JSON.parse(salvo);
    if (!Array.isArray(lista) || lista.length === 0) {
      const padrao = gerarTreinosIniciaisPadrao();
      localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(padrao));
      return padrao;
    }
    return lista;
  } catch {
    const padrao = gerarTreinosIniciaisPadrao();
    localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(padrao));
    return padrao;
  }
}

/**
 * Salva ou atualiza um treino particular
 */
export function salvarTreinoParticular(treino: Partial<TreinoParticular> & { titulo: string }): TreinoParticular {
  const treinos = obterTreinosParticulares();
  const agora = new Date().toISOString();

  let treinoAtualizado: TreinoParticular;

  if (treino.id) {
    const idx = treinos.findIndex((t) => t.id === treino.id);
    if (idx >= 0) {
      treinoAtualizado = {
        ...treinos[idx],
        ...treino,
        dataModificacao: agora
      };
      treinos[idx] = treinoAtualizado;
    } else {
      treinoAtualizado = {
        id: treino.id,
        titulo: treino.titulo,
        foco: treino.foco || 'Hipertrofia e Força',
        descricao: treino.descricao || '',
        diasSemana: treino.diasSemana || ['Seg', 'Qua', 'Sex'],
        dataCriacao: agora,
        dataModificacao: agora,
        exercicios: treino.exercicios || []
      };
      treinos.push(treinoAtualizado);
    }
  } else {
    treinoAtualizado = {
      id: `treino-part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      titulo: treino.titulo,
      foco: treino.foco || 'Hipertrofia e Força',
      descricao: treino.descricao || '',
      diasSemana: treino.diasSemana || ['Segunda', 'Quarta', 'Sexta'],
      dataCriacao: agora,
      dataModificacao: agora,
      exercicios: treino.exercicios || []
    };
    treinos.push(treinoAtualizado);
  }

  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinoAtualizado;
}

/**
 * Exclui um treino particular pelo ID
 */
export function excluirTreinoParticular(id: string): TreinoParticular[] {
  let treinos = obterTreinosParticulares();
  treinos = treinos.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinos;
}

/**
 * Duplica um treino particular existente
 */
export function duplicarTreinoParticular(id: string): TreinoParticular | null {
  const treinos = obterTreinosParticulares();
  const alvo = treinos.find((t) => t.id === id);
  if (!alvo) return null;

  const novoTreino: TreinoParticular = {
    ...alvo,
    id: `treino-part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    titulo: `${alvo.titulo} (Cópia)`,
    dataCriacao: new Date().toISOString(),
    dataModificacao: new Date().toISOString(),
    exercicios: alvo.exercicios.map((ex, idx) => ({
      ...ex,
      id: `inst-${Date.now()}-${idx}`
    }))
  };

  treinos.push(novoTreino);
  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return novoTreino;
}

/**
 * Adiciona um exercício com GIF a um treino particular
 */
export function adicionarExercicioAoTreinoParticular(
  treinoId: string,
  exercicio: Omit<ExercicioTreinoParticular, 'id' | 'ordem'>
): TreinoParticular | null {
  const treinos = obterTreinosParticulares();
  const idx = treinos.findIndex((t) => t.id === treinoId);
  if (idx < 0) return null;

  const novoExercicio: ExercicioTreinoParticular = {
    ...exercicio,
    id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ordem: treinos[idx].exercicios.length + 1
  };

  treinos[idx].exercicios.push(novoExercicio);
  treinos[idx].dataModificacao = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinos[idx];
}

/**
 * Remove um exercício de um treino particular
 */
export function removerExercicioDoTreinoParticular(
  treinoId: string,
  exercicioInstanciaId: string
): TreinoParticular | null {
  const treinos = obterTreinosParticulares();
  const idx = treinos.findIndex((t) => t.id === treinoId);
  if (idx < 0) return null;

  treinos[idx].exercicios = treinos[idx].exercicios
    .filter((e) => e.id !== exercicioInstanciaId)
    .map((e, index) => ({ ...e, ordem: index + 1 }));

  treinos[idx].dataModificacao = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinos[idx];
}

/**
 * Reordena um exercício dentro do treino (mover para cima ou para baixo)
 */
export function moverExercicioNoTreinoParticular(
  treinoId: string,
  exercicioInstanciaId: string,
  direcao: 'cima' | 'baixo'
): TreinoParticular | null {
  const treinos = obterTreinosParticulares();
  const idx = treinos.findIndex((t) => t.id === treinoId);
  if (idx < 0) return null;

  const exercicios = [...treinos[idx].exercicios];
  const eIdx = exercicios.findIndex((e) => e.id === exercicioInstanciaId);
  if (eIdx < 0) return null;

  if (direcao === 'cima' && eIdx > 0) {
    const temp = exercicios[eIdx];
    exercicios[eIdx] = exercicios[eIdx - 1];
    exercicios[eIdx - 1] = temp;
  } else if (direcao === 'baixo' && eIdx < exercicios.length - 1) {
    const temp = exercicios[eIdx];
    exercicios[eIdx] = exercicios[eIdx + 1];
    exercicios[eIdx + 1] = temp;
  } else {
    return treinos[idx];
  }

  // Atualiza as ordens
  treinos[idx].exercicios = exercicios.map((e, index) => ({
    ...e,
    ordem: index + 1
  }));
  treinos[idx].dataModificacao = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinos[idx];
}

/**
 * Atualiza propriedades de um exercício no treino (séries, reps, carga, anotação)
 */
export function atualizarExercicioNoTreinoParticular(
  treinoId: string,
  exercicioInstanciaId: string,
  alteracoes: Partial<ExercicioTreinoParticular>
): TreinoParticular | null {
  const treinos = obterTreinosParticulares();
  const idx = treinos.findIndex((t) => t.id === treinoId);
  if (idx < 0) return null;

  const eIdx = treinos[idx].exercicios.findIndex((e) => e.id === exercicioInstanciaId);
  if (eIdx < 0) return null;

  treinos[idx].exercicios[eIdx] = {
    ...treinos[idx].exercicios[eIdx],
    ...alteracoes
  };

  if (alteracoes.series || alteracoes.reps) {
    const s = alteracoes.series || treinos[idx].exercicios[eIdx].series;
    const r = alteracoes.reps || treinos[idx].exercicios[eIdx].reps;
    treinos[idx].exercicios[eIdx].seriesReps = `${s} séries × ${r} reps`;
  }

  treinos[idx].dataModificacao = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY_TREINOS_PARTICULARES, JSON.stringify(treinos));
  notificarMudancas(treinos);
  return treinos[idx];
}

/**
 * Inscreve um componente para receber atualizações reativas dos treinos particulares
 */
export function subscreverTreinosParticulares(callback: (treinos: TreinoParticular[]) => void): () => void {
  ouvintesTreinosParticulares.add(callback);
  callback(obterTreinosParticulares());
  return () => {
    ouvintesTreinosParticulares.delete(callback);
  };
}

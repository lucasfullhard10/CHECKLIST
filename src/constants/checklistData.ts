export interface CategoryDefinition {
  id: string;
  title: string;
  items: string[];
}

export const CHECKLIST_SAIDA: CategoryDefinition[] = [
  {
    id: 'documentacao',
    title: 'DOCUMENTAÇÃO',
    items: [
      'CNH do motorista válida',
      'Documentação do veículo regular',
      'Documentação obrigatória disponível',
      'Motorista devidamente cadastrado',
      'Integrações/treinamentos obrigatórios válidos',
      'ASO válido, quando aplicável',
      'Equipamentos/documentos exigidos para a operação disponíveis',
    ],
  },
  {
    id: 'condicoes_veiculo',
    title: 'CONDIÇÕES DO VEÍCULO',
    items: [
      'Para-brisa em boas condições',
      'Vidros em boas condições',
      'Retrovisores íntegros',
      'Portas funcionando corretamente',
      'Carroceria em boas condições',
      'Para-choques em boas condições',
      'Ausência de partes soltas',
      'Faixas refletivas em boas condições',
      'Placas de identificação legíveis',
    ],
  },
  {
    id: 'pneus',
    title: 'PNEUS',
    items: [
      'Pneus dianteiros em boas condições',
      'Pneus traseiros em boas condições',
      'Sem cortes ou bolhas aparentes',
      'Sulcos em condições adequadas',
      'Estepe disponível, quando aplicável',
      'Rodas sem danos aparentes',
      'Porcas/parafusos presentes',
    ],
  },
  {
    id: 'iluminacao',
    title: 'ILUMINAÇÃO',
    items: [
      'Faróis baixos',
      'Faróis altos',
      'Lanternas',
      'Setas',
      'Pisca-alerta',
      'Luz de freio',
      'Luz de ré',
      'Iluminação da placa',
      'Sinalização/refletores',
    ],
  },
  {
    id: 'freios_direcao',
    title: 'FREIOS E DIREÇÃO',
    items: [
      'Freio de serviço funcionando',
      'Freio de estacionamento funcionando',
      'Pedal de freio em condições normais',
      'Direção sem anormalidades aparentes',
      'Suspensão sem anormalidades aparentes',
    ],
  },
  {
    id: 'seguranca',
    title: 'SEGURANÇA',
    items: [
      'Cintos de segurança',
      'Buzina',
      'Limpadores de para-brisa',
      'Esguicho do para-brisa',
      'Extintor, quando aplicável',
      'Triângulo',
      'Equipamentos obrigatórios',
      'Kit de primeiros socorros, quando aplicável',
    ],
  },
  {
    id: 'cabine',
    title: 'CABINE',
    items: [
      'Banco do motorista em boas condições',
      'Painel sem alertas anormais',
      'Instrumentos funcionando',
      'Cabine organizada',
      'Piso/tapetes em condições adequadas',
      'Equipamentos de comunicação, quando aplicável',
    ],
  },
  {
    id: 'carga_implemento',
    title: 'CARGA / IMPLEMENTO',
    items: [
      'Baú/carroceria em boas condições',
      'Portas fechando corretamente',
      'Travas funcionando',
      'Cintas de amarração',
      'Catracas',
      'Pontos de amarração',
      'Carga devidamente acondicionada',
      'Ausência de objetos soltos',
    ],
  },
];

export const CHECKLIST_RETORNO: CategoryDefinition[] = [
  {
    id: 'condicoes_veiculo_retorno',
    title: 'CONDIÇÕES DO VEÍCULO',
    items: [
      'Veículo retornou sem avarias aparentes',
      'Para-brisa',
      'Vidros',
      'Retrovisores',
      'Portas',
      'Para-choques',
      'Carroceria',
      'Faixas refletivas',
      'Pneus',
      'Rodas',
    ],
  },
  {
    id: 'iluminacao_retorno',
    title: 'ILUMINAÇÃO',
    items: [
      'Faróis',
      'Lanternas',
      'Setas',
      'Pisca-alerta',
      'Luz de freio',
      'Luz de ré',
    ],
  },
  {
    id: 'seguranca_retorno',
    title: 'SEGURANÇA',
    items: [
      'Cintos',
      'Buzina',
      'Limpadores',
      'Equipamentos obrigatórios',
      'Extintor, quando aplicável',
      'Triângulo',
    ],
  },
  {
    id: 'carga_implemento_retorno',
    title: 'CARGA / BAÚ / IMPLEMENTO',
    items: [
      'Baú/carroceria',
      'Portas',
      'Travas',
      'Cintas',
      'Catracas',
      'Pontos de amarração',
      'Condição da carga no retorno',
      'Ausência de materiais soltos',
    ],
  },
];

export const RETURN_OCCURRENCE_OPTIONS = [
  'Nenhuma ocorrência',
  'Avaria no veículo',
  'Acidente',
  'Quase acidente',
  'Problema mecânico',
  'Problema com pneu',
  'Problema com carga',
  'Devolução',
  'Divergência de entrega',
  'Outros',
];

export const VEHICLE_TYPES = [
  'VUC (Veículo Urbano de Carga)',
  'Toco (Caminhão 2 Eixos)',
  'Truck (Caminhão 3 Eixos)',
  'Cavalo Mecânico Simples',
  'Cavalo Mecânico Traçado',
  'Carreta 2 Eixos',
  'Carreta 3 Eixos',
  'Bitrem / Rodotrem',
  'Furgão / Van',
  'Utilitário Leve / Fiorino',
  'Veículo Operacional / Apoio',
  'Outro',
];

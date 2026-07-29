// Base de dados padrão (normas reais de 2025/2026)
// Este arquivo é atualizado automaticamente pelo script de scraping diário.

export interface LegislationDiff {
  targetArticle: string;
  oldText: string;
  newText: string;
}

export interface LegislationItem {
  id: string;
  title: string;
  date: string;
  effectiveDate: string;
  source: string;
  type: string;
  impact: 'Alto' | 'Médio' | 'Baixo';
  areas: string[];
  summary: string;
  details: string;
  officialLink: string;
  diff?: LegislationDiff;
}

export const DEFAULT_LEGISLATIONS: LegislationItem[] = [
  {
    "id": "cnpc-65-2026",
    "title": "Resolução CNPC nº 65, de 13 de maio de 2026",
    "date": "2026-05-13",
    "effectiveDate": "2026-06-01",
    "source": "CNPC",
    "type": "Resolução",
    "impact": "Alto",
    "areas": ["Portabilidade", "Resgate", "Autopatrocínio", "Carência"],
    "summary": "Promove alterações profundas na Resolução CNPC nº 50/2022, flexibilizando os institutos de saída e permanência de participantes no sistema.",
    "details": "A norma busca modernizar o regime de previdência fechada ao dar maior autonomia aos participantes. Entre as principais mudanças estão a possibilidade de realizar portabilidade mesmo após a concessão do benefício (para fins de melhoria de renda ou renda temporária) e regras mais específicas sobre resgates parciais originados de recursos portados ou de retirada de patrocínio.",
    "officialLink": "https://www.gov.br/previc/pt-br/acesso-a-informacao/legislacao/resolucoes-cnpc",
    "diff": {
      "targetArticle": "Art. 12 & Art. 15 - Regras de Portabilidade na Concessão e Carência de Resgate",
      "oldText": "Art. 12. A portabilidade de recursos acumulados pelo participante somente poderá ser requerida e executada durante o período de acumulação de recursos, sendo vedado o trânsito de reservas matemáticas após a data de concessão do benefício de prestação continuada programada.\n\nArt. 15. O prazo de carência para o primeiro resgate não poderá ser inferior a 36 (trinta e seis) meses de vinculação do participante ao plano de benefícios.",
      "newText": "Art. 12. Fica autorizada a portabilidade de recursos mesmo durante a fase de concessão de benefícios, desde que o regulamento do plano preveja tal possibilidade com a finalidade exclusiva de melhoria do benefício atual ou contratação de benefício temporário adicional.\n\nArt. 15. O prazo de carência de resgate para planos instituídos (PIPPP) passa a ser de 60 (sessenta) meses. Fica dispensada a carência para resgate integral de recursos portados se a origem for plano instituído por instituidor."
    }
  },
  {
    "id": "previc-324-2026",
    "title": "Portaria PREVIC nº 324, de 28 de abril de 2026",
    "date": "2026-04-28",
    "effectiveDate": "2026-05-01",
    "source": "PREVIC",
    "type": "Portaria",
    "impact": "Alto",
    "areas": ["Atuarial", "Avaliação Técnica", "Investimentos"],
    "summary": "Define a estrutura da taxa de juros parâmetro e do corredor de referência para avaliações atuariais do exercício de 2026.",
    "details": "A portaria é vital para o equilíbrio atuarial das EFPCs. Ela estabelece a taxa de juros real máxima permitida para o cálculo das provisões matemáticas dos planos de Benefício Definido (BD) e Contribuição Variável (CV) no encerramento do exercício de 2026. A definição leva em conta o comportamento das taxas reais das NTN-B no mercado financeiro.",
    "officialLink": "https://www.gov.br/previc/pt-br/acesso-a-informacao/legislacao/portarias",
    "diff": {
      "targetArticle": "Anexo I - Tabela de Taxa de Juros Limite Real Anual",
      "oldText": "Taxa máxima real permitida para planos com duration superior a 15 anos: 5,25% a.a.\nCorredor de referência baseado na média móvel de 3 anos das taxas da NTN-B.",
      "newText": "Taxa máxima real permitida para planos com duration superior a 15 anos: 5,45% a.a.\nCorredor ajustado para refletir o estresse de mercado recente e evitar subavaliação de passivos atuariais."
    }
  },
  {
    "id": "previc-26-2025",
    "title": "Resolução PREVIC nº 26, de 18 de dezembro de 2025",
    "date": "2025-12-18",
    "effectiveDate": "2026-01-01",
    "source": "PREVIC",
    "type": "Resolução",
    "impact": "Alto",
    "areas": ["Investimentos", "ASG", "Governança", "Transparência"],
    "summary": "Atualiza a Resolução PREVIC nº 23/2023, introduzindo obrigatoriedade de critérios ASG nas políticas de investimentos e novas diretrizes de governança.",
    "details": "Esta resolução traz para o centro da supervisão das EFPCs as métricas Ambientais, Sociais e de Governança (ASG). A partir de sua vigência, os comitês de investimentos das entidades devem demonstrar documentalmente como os riscos climáticos e sociais impactam a carteira de investimentos. Também estabelece incentivos à diversidade nos conselhos deliberativos e fiscais das entidades.",
    "officialLink": "https://www.gov.br/previc/pt-br/acesso-a-informacao/legislacao/resolucoes-previc",
    "diff": {
      "targetArticle": "Art. 84 - Da Política de Investimentos e Riscos Socioambientais",
      "oldText": "Art. 84. As EFPCs devem, na elaboração de suas políticas de investimento, buscar identificar riscos de mercado e de liquidez. A consideração de aspectos ambientais, sociais e de governança corporativa constitui recomendação de boas práticas de gestão.",
      "newText": "Art. 84. As EFPCs são obrigadas a integrar a análise de riscos e oportunidades socioambientais e climáticos (fatores ASG) na elaboração de suas políticas de investimentos, devendo tal análise constar formalmente nas atas decisórias de alocação de ativos."
    }
  },
  {
    "id": "cnpc-64-2025",
    "title": "Resolução CNPC nº 64, de 8 de dezembro de 2025",
    "date": "2025-12-08",
    "effectiveDate": "2026-01-01",
    "source": "CNPC",
    "type": "Resolução",
    "impact": "Médio",
    "areas": ["Benefícios", "Atuarial", "Processos"],
    "summary": "Altera a Resolução CNPC nº 40/2021, definindo novas regras sobre índices de reajuste de benefícios em planos de Benefício Definido (BD).",
    "details": "A alteração visa proteger o valor real das aposentadorias contra flutuações drásticas de preços, principalmente em períodos de deflação. A resolução permite a utilização de composições de índices inflacionários e veda a redução nominal dos benefícios em casos de deflação, determinando sua compensação atuarial nos períodos subsequentes de alta.",
    "officialLink": "https://www.gov.br/previc/pt-br/acesso-a-informacao/legislacao/resolucoes-cnpc",
    "diff": {
      "targetArticle": "Art. 18 - Reajuste de Benefícios e Deflação",
      "oldText": "Art. 18. O reajuste anual de benefícios deve observar estritamente a variação acumulada do indexador estabelecido no regulamento do plano.",
      "newText": "Art. 18. O indexador pode ser composto por múltiplos índices. Em caso de deflação acumulada no período de apuração, fica vedada a redução do valor nominal do benefício. O saldo deflacionário deverá ser compensado nos reajustes positivos subsequentes."
    }
  },
  {
    "id": "previc-539-2025",
    "title": "Portaria PREVIC nº 539, de 17 de junho de 2025",
    "date": "2025-06-17",
    "effectiveDate": "2026-01-01",
    "source": "PREVIC",
    "type": "Portaria",
    "impact": "Baixo",
    "areas": ["Segmentação", "Fiscalização", "Compliance"],
    "summary": "Estabelece a segmentação oficial das EFPCs para o ano de 2026, com foco em simplificação de obrigações acessórias para entidades menores.",
    "details": "A portaria classifica as Entidades Fechadas de Previdência Complementar (EFPCs) em perfis (S1, S2, S3, S4) baseados no total de ativos sob gestão e na complexidade do patrocinador. A segmentação permite calibrar as exigências regulatórias, simplificando os reportes periódicos para as entidades classificadas como de menor risco (S3 e S4).",
    "officialLink": "https://www.gov.br/previc/pt-br/acesso-a-informacao/legislacao/portarias"
  }
];

import fundsData from '../data/funds.json';

export interface Fund {
  slug: string;
  nome: string;
  categoria: string;
  tese: string;
  teseCompleta?: string;
  geo: string;
  moeda: 'BRL' | 'USD';
  ticketMinimo: number;
  ticketMinimoTexto: string;
  statusCaptacao: 'aberto' | 'fechado';
  lockup: string;
  hardCap: number | null;
  tags: string[];
  risco: string;
  perfil: string;
  publicoAlvo: string;
  desinvestido: boolean;
  informacoesGerais: { label: string; valor: string }[];
  documentosPublicos: { nome: string; tipo: string; url: string }[];
  videos: { titulo: string; url: string }[];
  documentosRestritos: { nome: string; categoria: string; url: string }[];
  faq?: { q: string; a: string }[];
}

export interface FundFilters {
  search?: string;
  moeda?: 'BRL' | 'USD' | 'todos';
  status?: 'aberto' | 'fechado' | 'todos';
  perfil?: 'qualificado' | 'profissional' | 'todos';
}

const funds = fundsData as Fund[];

const FundsMockService = {
  list(filters?: FundFilters): Fund[] {
    let result = [...funds];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((f) => f.nome.toLowerCase().includes(q) || f.tese.toLowerCase().includes(q));
    }
    if (filters?.moeda && filters.moeda !== 'todos') {
      result = result.filter((f) => f.moeda === filters.moeda);
    }
    if (filters?.status && filters.status !== 'todos') {
      result = result.filter((f) => f.statusCaptacao === filters.status);
    }
    if (filters?.perfil && filters.perfil !== 'todos') {
      result = result.filter((f) => f.perfil === filters.perfil);
    }
    return result;
  },

  getBySlug(slug: string): Fund | null {
    return funds.find((f) => f.slug === slug) || null;
  },
};

export default FundsMockService;

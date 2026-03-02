import { useParams, Link } from 'react-router-dom';
import Header from '../../shared/ui/Header';
import Badge from '../../shared/ui/Badge';
import Button from '../../shared/ui/Button';
import FundsMockService from '../../shared/services/FundsMockService';

const MOCK_TRANSACTIONS = [
  { data: '2024-03-15', descricao: 'Aporte inicial', valor: 250000, tipo: 'entrada' },
  { data: '2024-06-30', descricao: 'Distribuição de rendimentos', valor: 5250, tipo: 'entrada' },
  { data: '2024-09-30', descricao: 'Distribuição de rendimentos', valor: 5600, tipo: 'entrada' },
];

export default function FundPosition() {
  const { slug } = useParams<{ slug: string }>();
  const fund = FundsMockService.getBySlug(slug || '');

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="app" />
        <div className="flex-1 flex items-center justify-center text-gray-500">Fundo não encontrado.</div>
      </div>
    );
  }

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: fund.moeda }).format(v);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header variant="app" />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <Link to="/app" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Voltar ao dashboard</Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="success">Ativo</Badge>
            <Badge variant="info">{fund.moeda}</Badge>
            <Badge variant={fund.risco === 'Conservador' ? 'success' : fund.risco === 'Moderado' ? 'warning' : 'error'}>
              Risco {fund.risco}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{fund.nome}</h1>
          <p className="text-gray-500 text-sm">{fund.tese}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Valor investido</div>
            <div className="text-xl font-bold text-gray-900">{fmt(250000)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Data do aporte</div>
            <div className="text-xl font-bold text-gray-900">15/03/2024</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Lock-up</div>
            <div className="text-xl font-bold text-gray-900">{fund.lockup}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Histórico de transações</h2>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{tx.descricao}</div>
                  <div className="text-xs text-gray-400">{new Date(tx.data).toLocaleDateString('pt-BR')}</div>
                </div>
                <span className={`text-sm font-semibold ${tx.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.tipo === 'entrada' ? '+' : '-'}{fmt(tx.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link to={`/data-room/${fund.slug}`}>
          <Button variant="secondary" className="w-full">Acessar Data Room do Fundo</Button>
        </Link>
      </main>
    </div>
  );
}

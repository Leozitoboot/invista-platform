import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../shared/ui/Header';
import Footer from '../../shared/ui/Footer';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import FundsMockService from '../../shared/services/FundsMockService';
import InvestorStateMockService from '../../shared/services/InvestorStateMockService';
import AuthMockService from '../../shared/services/AuthMockService';

function formatCurrency(value: number, moeda: string) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda, maximumFractionDigits: 0 }).format(value);
}

export default function InvestStart() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const fund = FundsMockService.getBySlug(slug || '');
  const onboardingStatus = InvestorStateMockService.getOnboardingStatus();
  const suitability = InvestorStateMockService.getSuitabilityProfile();
  const session = AuthMockService.getSession();

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-500">Fundo não encontrado.</div>
        <Footer />
      </div>
    );
  }

  const checks = [
    { label: 'Perfil de risco', value: fund.risco, ok: true },
    { label: 'Ticket mínimo', value: formatCurrency(fund.ticketMinimo, fund.moeda), ok: true },
    { label: 'Lock-up', value: fund.lockup, ok: true },
    { label: 'Captação', value: fund.statusCaptacao === 'aberto' ? 'Aberta' : 'Encerrada', ok: fund.statusCaptacao === 'aberto' },
  ];

  const handleContinue = () => {
    if (suitability) {
      navigate(`/assinatura/${fund.slug}`);
    } else {
      navigate(`/suitability?slug=${fund.slug}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Investimento</h1>
        <p className="text-gray-500 mb-8">Revise as condições antes de prosseguir</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">{fund.nome}</h2>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{fund.tese}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{fund.moeda}</Badge>
            <Badge variant={fund.risco === 'Conservador' ? 'success' : fund.risco === 'Moderado' ? 'warning' : 'error'}>
              Risco {fund.risco}
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Checklist de elegibilidade</h3>
          <div className="space-y-3">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.value}</span>
                  <span className={c.ok ? 'text-green-500' : 'text-red-500'}>{c.ok ? '✓' : '✕'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Situação do cadastro</h3>
          <div className="flex items-center gap-3">
            <Badge variant={
              onboardingStatus === 'approved' ? 'success' :
              onboardingStatus === 'pending' ? 'warning' : 'neutral'
            }>
              {onboardingStatus === 'approved' ? 'Aprovado' :
               onboardingStatus === 'pending' ? 'Em análise' : 'Incompleto'}
            </Badge>
            <span className="text-sm text-gray-600">{session?.email}</span>
          </div>
          {suitability && (
            <div className="mt-3 flex items-center gap-3">
              <Badge variant={suitability === 'Conservador' ? 'success' : suitability === 'Moderado' ? 'warning' : 'error'}>
                {suitability}
              </Badge>
              <span className="text-sm text-gray-600">Perfil de suitability</span>
            </div>
          )}
        </div>

        {onboardingStatus === 'incomplete' ? (
          <div className="space-y-3">
            <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              Complete seu cadastro para prosseguir com o investimento.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => navigate('/onboarding/pf')}>Cadastro PF</Button>
              <Button variant="secondary" onClick={() => navigate('/onboarding/pj')}>Cadastro PJ</Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            disabled={fund.statusCaptacao === 'fechado'}
            onClick={handleContinue}
          >
            {fund.statusCaptacao === 'fechado' ? 'Captação encerrada' : suitability ? 'Ir para assinatura' : 'Começar suitability'}
          </Button>
        )}
      </main>
      <Footer />
    </div>
  );
}

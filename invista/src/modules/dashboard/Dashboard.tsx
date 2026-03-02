import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Card from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import AuthMockService from '../../shared/services/AuthMockService';
import InvestorStateMockService from '../../shared/services/InvestorStateMockService';
import FundsMockService from '../../shared/services/FundsMockService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const session = AuthMockService.getSession();
  const onboardingStatus = InvestorStateMockService.getOnboardingStatus();
  const suitability = InvestorStateMockService.getSuitabilityProfile();
  const signedSlugs = InvestorStateMockService.getSignedFunds();
  const signedFunds = signedSlugs.map((s) => FundsMockService.getBySlug(s)).filter(Boolean);
  const draft = InvestorStateMockService.getOnboardingDraft();

  const onboardingBadge = {
    incomplete: { variant: 'neutral' as const, label: t('dashboard.onboarding_incomplete') },
    pending: { variant: 'warning' as const, label: t('dashboard.onboarding_pending') },
    approved: { variant: 'success' as const, label: t('dashboard.onboarding_approved') },
  }[onboardingStatus];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header variant="app" />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.welcome', { name: session?.email?.split('@')[0] })}</h1>
          <p className="text-gray-500">{t('dashboard.welcome_subtitle')}</p>
        </div>

        {/* Draft banner */}
        {draft && (
          <Alert variant="warning" className="mb-6 flex items-center justify-between gap-4">
            <span>{t('dashboard.resume_banner')}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(draft.type === 'pf' ? '/onboarding/pf' : '/onboarding/pj')}
            >
              {t('dashboard.resume_cta')}
            </Button>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Status cadastro */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.compliance_status')}</h3>
            <Badge variant={onboardingBadge.variant}>{onboardingBadge.label}</Badge>
            {suitability && (
              <div className="mt-2">
                <Badge variant={suitability === 'Conservador' ? 'success' : suitability === 'Moderado' ? 'warning' : 'error'}>
                  {t('dashboard.suitability_label')}: {suitability}
                </Badge>
              </div>
            )}
            {onboardingStatus === 'incomplete' && (
              <div className="mt-3 space-y-2">
                <Button size="sm" variant="secondary" className="w-full" onClick={() => navigate('/onboarding/pf')}>
                  {t('dashboard.complete_pf')}
                </Button>
                <Button size="sm" variant="ghost" className="w-full" onClick={() => navigate('/onboarding/pj')}>
                  {t('dashboard.complete_pj')}
                </Button>
              </div>
            )}
          </Card>

          {/* Investimentos */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.my_investments')}</h3>
            <p className="text-3xl font-bold text-gray-900">{signedFunds.length}</p>
            <p className="text-sm text-gray-500">{t('dashboard.signed_funds')}</p>
          </Card>

          {/* Documentos */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.documents')}</h3>
            <p className="text-sm text-gray-600 mb-3">{t('dashboard.documents_desc')}</p>
            <Link to="/fundos">
              <Button size="sm" variant="secondary">{t('dashboard.documents_cta')}</Button>
            </Link>
          </Card>
        </div>

        {/* Investments list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.my_investments')}</h2>
          {signedFunds.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('dashboard.empty_investments')}</h3>
              <p className="text-gray-500 text-sm mb-6">{t('dashboard.empty_investments_subtitle')}</p>
              <Link to="/fundos">
                <Button>{t('dashboard.explore_funds')}</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signedFunds.map((fund) => fund && (
                <Card key={fund.slug} hoverable onClick={() => navigate(`/app/investimentos/${fund.slug}`)}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="success">{t('dashboard.active')}</Badge>
                      <Badge variant="info">{fund.moeda}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{fund.nome}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">{fund.tese}</p>
                    <div className="text-xs text-gray-400">{t('dashboard.fund_position')}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

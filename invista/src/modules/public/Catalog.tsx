import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Footer from '../../shared/ui/Footer';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Select from '../../shared/ui/Select';
import FundsMockService from '../../shared/services/FundsMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';
import type { FundFilters } from '../../shared/services/FundsMockService';

const GEO_FLAG: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  'Brasil': '🇧🇷',
};

export default function Catalog() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FundFilters>({
    search: '',
    moeda: 'todos',
    status: 'todos',
    perfil: 'todos',
  });

  useEffect(() => {
    AnalyticsMockService.track('view_funds_list', '/fundos');
  }, []);

  const funds = FundsMockService.list(filters);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('funds.title')}</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Estratégias imobiliárias globais com governança institucional.</p>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder={t('funds.search_placeholder')}
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          <Select
            value={filters.moeda}
            onChange={(e) => setFilters((f) => ({ ...f, moeda: e.target.value as FundFilters['moeda'] }))}
          >
            <option value="todos">{t('funds.filter_currency')}: {t('funds.all')}</option>
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as FundFilters['status'] }))}
          >
            <option value="todos">{t('funds.filter_status')}: {t('funds.all')}</option>
            <option value="aberto">{t('funds.open')}</option>
            <option value="fechado">{t('funds.closed')}</option>
          </Select>
          <Select
            value={filters.perfil}
            onChange={(e) => setFilters((f) => ({ ...f, perfil: e.target.value as FundFilters['perfil'] }))}
          >
            <option value="todos">{t('funds.filter_profile')}: {t('funds.all')}</option>
            <option value="qualificado">{t('funds.qualified')}</option>
            <option value="profissional">{t('funds.professional')}</option>
          </Select>
        </div>

        {funds.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>{t('funds.no_results')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund) => (
              <Card key={fund.slug} glass hover onClick={() => navigate(`/fundos/${fund.slug}`)}>
                <div className="p-6">
                  {/* Category + status row */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-xs font-medium truncate px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                      {fund.categoria}
                    </span>
                    {fund.desinvestido ? (
                      <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-amber-500 text-amber-950">
                        {t('funds.desinvested')}
                      </span>
                    ) : (
                      <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${fund.statusCaptacao === 'aberto' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {fund.statusCaptacao === 'aberto' ? t('funds.open') : t('funds.closed')}
                      </span>
                    )}
                  </div>

                  <h2 className="font-semibold text-base leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>{fund.nome}</h2>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{fund.tese}</p>

                  {/* Geo + moeda + risco */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                    <span style={{ color: 'var(--text-subtle)' }}>{GEO_FLAG[fund.geo] || ''} {fund.geo}</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-primary font-medium">{fund.moeda}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${fund.risco === 'Moderado' ? 'bg-yellow-100 text-yellow-700 ' : fund.risco === 'Moderado-Alto' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200' : 'bg-emerald-700 text-white'}`}>
                      {fund.risco}
                    </span>
                  </div>

                  {/* Ticket + público */}
                  <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                    <div><span className="font-medium">{t('funds.min_ticket')}:</span> {fund.ticketMinimoTexto}</div>
                    <div><span className="font-medium">{t('fund.profile_required')}:</span> {fund.publicoAlvo}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

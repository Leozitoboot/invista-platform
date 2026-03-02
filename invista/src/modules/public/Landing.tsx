import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Footer from '../../shared/ui/Footer';
import Card from '../../shared/ui/Card';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';
import FundsMockService from '../../shared/services/FundsMockService';

const WHY_ITEMS = [
  { icon: '🌎', text: 'Alta capacidade de originação de oportunidades imobiliárias globais' },
  { icon: '🤝', text: 'Acesso facilitado a gestores imobiliários globais especializados' },
  { icon: '📊', text: 'Diversificação de portfólio (gestores, setores, geografias, estruturas)' },
  { icon: '🏛️', text: 'Diligência orientada a padrões internacionais de governança' },
];

const TEAM = [
  { name: 'Marcelo Rainho', role: 'Sócio Fundador', initials: 'MR' },
  { name: 'Thiago Leomil', role: 'Sócio Fundador', initials: 'TL' },
  { name: 'Fernando Teixeira', role: 'Sócio-Diretor', initials: 'FT' },
  { name: 'Diogo Rodrigues', role: 'Fundador e Diretor de Consultoria Imobiliária', initials: 'DR' },
  { name: 'Leonardo Veloso', role: 'CFO e Portfolio Manager', initials: 'LV' },
];

const GEO_FLAG: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  'Brasil': '🇧🇷',
};

export default function Landing() {
  const { t } = useTranslation();
  const funds = FundsMockService.list();

  useEffect(() => {
    AnalyticsMockService.track('view_landing', '/');
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header />

      {/* Hero */}
      <section
        style={{ background: 'linear-gradient(135deg, #006856 0%, #00867b 100%)' }}
        className="relative text-white py-28 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Investimentos imobiliários globais com governança institucional
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Somos gestores independentes e um portal de acesso inteligente a teses de investimentos imobiliários globais, direcionado a indivíduos, Family Offices e investidores Institucionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/fundos" className="px-8 py-3 bg-white text-brand-primary font-semibold rounded-xl hover:bg-brand-light transition-colors">
              {t('landing.cta_funds')}
            </Link>
            <Link to="/auth/login" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-brand-primary transition-colors">
              {t('landing.cta_enter')}
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre nós */}
      <section id="empresa" className="py-20 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>{t('landing.about_title')}</h2>
          <p className="text-center mb-12 max-w-3xl mx-auto text-lg" style={{ color: 'var(--text-body)' }}>
            Sediados no Brasil e Estados Unidos, nosso time carrega profunda experiência no setor, transformando restritas oportunidades imobiliárias em sólidas estruturas de investimentos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌎', title: 'Presença Global', desc: 'Escritórios no Brasil e EUA com acesso direto aos principais mercados imobiliários globais.' },
              { icon: '🏆', title: 'Experiência Comprovada', desc: 'Time com décadas de experiência em estruturação, gestão e desinvestimento de ativos imobiliários.' },
              { icon: '🔍', title: 'Diligência Rigorosa', desc: 'Seleção criteriosa de ativos seguindo padrões internacionais de análise e governança.' },
            ].map((item) => (
              <Card key={item.title} glass className="p-6">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos produtos */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Nossos produtos</h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Estratégias imobiliárias globais selecionadas com rigor institucional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund) => (
              <Card key={fund.slug} glass hover className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                    {fund.categoria}
                  </span>
                  {fund.desinvestido ? (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500 text-amber-950">
                      {t('funds.desinvested')}
                    </span>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${fund.statusCaptacao === 'aberto' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {fund.statusCaptacao === 'aberto' ? t('funds.open') : t('funds.closed')}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1 mt-3" style={{ color: 'var(--text-primary)' }}>{fund.nome}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ color: 'var(--text-subtle)' }} className="text-sm">{GEO_FLAG[fund.geo] || ''} {fund.geo}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-light text-brand-primary font-medium">{fund.moeda}</span>
                </div>
                <Link
                  to={`/fundos/${fund.slug}`}
                  className="block text-center py-2 px-4 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primaryHover transition-colors"
                >
                  Saiba mais
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/fundos" className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primaryHover transition-colors inline-block">
              {t('landing.cta_funds')}
            </Link>
          </div>
        </div>
      </section>

      {/* Por que inVista */}
      <section id="seguranca" className="py-20 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>{t('landing.why_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {WHY_ITEMS.map((item) => (
              <Card key={item.text} glass className="p-6 flex items-start gap-4">
                <span className="text-3xl shrink-0">{item.icon}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>{t('landing.team_title')}</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {TEAM.map((member) => (
              <Card key={member.name} glass className="p-6 w-44 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {member.initials}
                </div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{member.name}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{member.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

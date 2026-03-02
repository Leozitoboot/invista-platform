import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Footer from '../../shared/ui/Footer';
import Modal from '../../shared/ui/Modal';
import { ToastContainer } from '../../shared/ui/Toast';
import { useToast } from '../../shared/ui/useToast';
import { GlassPanel } from '../../shared/ui/GlassPanel';
import FundsMockService from '../../shared/services/FundsMockService';
import type { Fund } from '../../shared/services/FundsMockService';
import AuthMockService from '../../shared/services/AuthMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';

const GEO_FLAG: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  'Brasil': '🇧🇷',
};

export default function FundPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fund = FundsMockService.getBySlug(slug || '') as Fund | null;
  const isAuth = AuthMockService.isAuthenticated();
  const { toasts, addToast, dismiss } = useToast();
  const [previewDoc, setPreviewDoc] = useState<{ nome: string; tipo: string; url: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (fund) {
      AnalyticsMockService.track('view_fund_detail', window.location.pathname, { fundSlug: fund.slug });
    }
  }, [fund]);

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>{t('fund.not_found')}</div>
        <Footer />
      </div>
    );
  }

  const isClosed = fund.statusCaptacao === 'fechado' || fund.desinvestido;

  const handleInvest = () => {
    AnalyticsMockService.track('click_invest', window.location.pathname, { fundSlug: fund.slug });
    if (isAuth) navigate(`/investir/${fund.slug}`);
    else navigate(`/auth/login?redirect=${encodeURIComponent(`/investir/${fund.slug}`)}`);
  };

  const handleDataRoom = () => {
    if (isAuth) navigate(`/data-room/${fund.slug}`);
    else navigate(`/auth/login?redirect=${encodeURIComponent(`/data-room/${fund.slug}`)}`);
  };

  const handleDownload = (docName: string) => {
    addToast('success', `${t('fund.docs_download')}: ${docName}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header />
      <main className="flex-1 pb-32">

        {/* 1. Hero */}
        <section
          style={{ background: 'linear-gradient(135deg, #006856 0%, #00867b 100%)' }}
          className="relative text-white py-16 px-4 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <Link to="/fundos" className="text-white text-sm mb-4 inline-block" style={{ opacity: 0.85 }}>
              {t('fund.back_catalog')}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}>{fund.categoria}</span>
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}>{GEO_FLAG[fund.geo] || ''} {fund.geo}</span>
              {fund.desinvestido ? (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-400/80 text-amber-900 font-semibold">
                  {t('funds.desinvested')}
                </span>
              ) : (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${fund.statusCaptacao === 'aberto' ? 'bg-green-400 text-green-900' : 'bg-gray-300 text-gray-900'}`}>
                  {fund.statusCaptacao === 'aberto' ? t('fund.status_open') : t('fund.status_closed')}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{fund.nome}</h1>
            <p className="text-lg max-w-3xl" style={{ color: 'rgba(255,255,255,0.95)' }}>{fund.tese}</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

          {/* 2. Metrics Grid */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t('funds.min_ticket'), value: fund.ticketMinimoTexto },
                { label: t('fund.profile_required'), value: fund.publicoAlvo },
                { label: t('fund.currency'), value: fund.moeda },
                { label: t('fund.lockup'), value: fund.lockup },
              ].map((item) => (
                <GlassPanel key={item.label} className="p-4">
                  <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-subtle)' }}>{item.label}</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                </GlassPanel>
              ))}
            </div>
          </section>

          {/* 3. O Fundo */}
          {fund.teseCompleta && (
            <section>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('fund.about')}</h2>
              <GlassPanel className="p-6">
                <p className="leading-relaxed" style={{ color: 'var(--text-body)' }}>{fund.teseCompleta}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {fund.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>{tag}</span>
                  ))}
                </div>
              </GlassPanel>
            </section>
          )}

          {/* 4. Informações Gerais */}
          {fund.informacoesGerais && fund.informacoesGerais.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('fund.general_info')}</h2>
              <GlassPanel className="overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {fund.informacoesGerais.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? '' : ''} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="px-5 py-3 font-medium w-1/3" style={{ color: 'var(--text-subtle)' }}>{row.label}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--text-primary)' }}>{row.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassPanel>
            </section>
          )}

          {/* 5. Documentos */}
          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('fund.docs_title')}</h2>
            <div className="space-y-2">
              {fund.documentosPublicos.map((doc) => (
                <GlassPanel key={doc.nome} className="flex items-center gap-3 p-4">
                  <span className="text-red-400">📄</span>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{doc.nome}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700 text-white font-medium">{t('fund.docs_public_badge')}</span>
                  <button onClick={() => setPreviewDoc(doc)} className="text-xs hover:underline px-2" style={{ color: 'var(--text-muted)' }}>{t('fund.docs_view')}</button>
                  <button onClick={() => handleDownload(doc.nome)} className="text-xs hover:underline px-2" style={{ color: 'var(--text-muted)' }}>{t('fund.docs_download')}</button>
                </GlassPanel>
              ))}
            </div>
          </section>

          {/* 6. Vídeos */}
          {fund.videos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('fund.videos_title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fund.videos.map((video) => (
                  <div key={video.titulo} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <div className="aspect-video bg-brand-primary/10 flex items-center justify-center">
                      <span className="text-brand-primary text-4xl">▶</span>
                    </div>
                    <div className="p-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{video.titulo}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. FAQ */}
          {fund.faq && fund.faq.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('fund.faq_title')}</h2>
              <div className="space-y-2">
                {fund.faq.map((item, i) => (
                  <GlassPanel key={i} className="overflow-hidden">
                    <button
                      className="w-full text-left px-5 py-4 flex items-center justify-between font-medium hover:bg-brand-primary/5 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{item.q}</span>
                      <span className="ml-4" style={{ color: 'var(--text-subtle)' }}>{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
                        {item.a}
                      </div>
                    )}
                  </GlassPanel>
                ))}
              </div>
            </section>
          )}

          {/* Data Room Teaser */}
          <GlassPanel className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🔒</span>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Data Room — {t('fund.dataroom_teaser')}</h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('fund.dataroom_desc')}</p>
            </div>
            <button
              onClick={handleDataRoom}
              className="px-5 py-2 rounded-lg border font-medium text-sm transition-colors hover:bg-brand-primary hover:text-white"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              {t('fund.dataroom_cta')}
            </button>
          </GlassPanel>
        </div>
      </main>

      {/* 8. Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t z-30 p-4" style={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{fund.nome}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('funds.min_ticket')}: {fund.ticketMinimoTexto}</div>
          </div>
          <button
            onClick={handleInvest}
            disabled={isClosed}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-colors ${isClosed ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-300' : 'bg-brand-primary text-white hover:bg-brand-primaryHover'}`}
          >
            {isClosed ? t('fund.invest_cta_closed') : t('fund.invest_cta')}
          </button>
        </div>
      </div>

      {/* Modal preview */}
      {previewDoc && (
        <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc.nome}>
          <div className="text-sm space-y-3" style={{ color: 'var(--text-muted)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>{previewDoc.nome}</strong></p>
            <p>Este é um documento de visualização mock. Em produção, o conteúdo real do PDF seria exibido aqui.</p>
            <p>Tipo: {previewDoc.tipo} | Fundo: {fund.nome}</p>
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <Footer />
    </div>
  );
}

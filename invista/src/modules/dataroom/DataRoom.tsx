import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../shared/ui/Header';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import { ToastContainer } from '../../shared/ui/Toast';
import { useToast } from '../../shared/ui/useToast';
import FundsMockService from '../../shared/services/FundsMockService';
import NdaMockService from '../../shared/services/NdaMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';

const CATEGORIES = ['Financeiro', 'Jurídico', 'Operacional'];

export default function DataRoom() {
  const { slug } = useParams<{ slug: string }>();
  const fund = FundsMockService.getBySlug(slug || '');
  const [accepted, setAccepted] = useState(() => NdaMockService.hasAccepted(slug || ''));
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, dismiss } = useToast();

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-500">Fundo não encontrado.</div>
      </div>
    );
  }

  const handleAcceptNDA = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    NdaMockService.accept(slug!);
    AnalyticsMockService.track('nda_accepted', window.location.pathname, { fundSlug: slug });
    setAccepted(true);
    setLoading(false);
  };

  const handleDownload = (docName: string) => {
    addToast('success', `Download registrado: ${docName}`);
  };

  if (!accepted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 text-sm mb-4">
              Para acessar os documentos do Data Room do fundo <strong>{fund.nome}</strong>, você precisa aceitar o Acordo de Não Divulgação (NDA).
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-6">
              <h3 className="font-semibold text-sm mb-2">{fund.nome}</h3>
              <p className="text-gray-500 text-xs mb-2">{fund.tese}</p>
              <Badge variant={fund.statusCaptacao === 'aberto' ? 'success' : 'neutral'}>
                {fund.statusCaptacao === 'aberto' ? 'Captação Aberta' : 'Captação Encerrada'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Ao aceitar, você concorda em manter os documentos confidenciais e não divulgá-los a terceiros sem autorização prévia por escrito da inVista.
            </p>
            <Button className="w-full" loading={loading} onClick={handleAcceptNDA}>
              Aceitar NDA e acessar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <Link to={`/fundos/${fund.slug}`} className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Voltar ao fundo</Link>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Data Room</h1>
          <Badge variant="success">NDA aceito</Badge>
        </div>
        <p className="text-gray-500 mb-8">{fund.nome}</p>

        {CATEGORIES.map((cat) => {
          const docs = fund.documentosRestritos.filter((d) => d.categoria === cat);
          if (docs.length === 0) return null;
          return (
            <div key={cat} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{cat}</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {docs.map((doc, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 ${i < docs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 text-lg">📄</span>
                      <span className="text-sm font-medium text-gray-900">{doc.nome}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(doc.nome)}>
                      ⬇ Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

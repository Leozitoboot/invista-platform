import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../shared/ui/Header';
import Button from '../../shared/ui/Button';
import FundsMockService from '../../shared/services/FundsMockService';
import InvestorStateMockService from '../../shared/services/InvestorStateMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';

const CONFETTI_COLORS = ['#1a56db', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Pre-generate stable confetti data outside component
const CONFETTI_ITEMS = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}vw`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: `${(i * 0.07) % 1}s`,
  duration: `${1.5 + (i * 0.06) % 1}s`,
  round: i % 2 === 0 ? '50%' : '0',
}));

function Confetti() {
  return (
    <div className="pointer-events-none">
      {CONFETTI_ITEMS.map((item, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: item.left,
            top: `-20px`,
            backgroundColor: item.color,
            animationDelay: item.delay,
            animationDuration: item.duration,
            borderRadius: item.round,
          }}
        />
      ))}
    </div>
  );
}

export default function Signature() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const fund = FundsMockService.getBySlug(slug || '');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(() =>
    slug ? InvestorStateMockService.getSignedFunds().includes(slug) : false
  );

  const handleSign = async () => {
    if (!agreed || !slug) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    InvestorStateMockService.signFund(slug);
    AnalyticsMockService.track('commitment_signed', window.location.pathname, { fundSlug: slug });
    setLoading(false);
    setSigned(true);
  };

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-500">Fundo não encontrado.</div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Confetti />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10 relative z-10">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compromisso assinado!</h2>
            <p className="text-gray-500 mb-2">Seu comprometimento com o fundo <strong>{fund.nome}</strong> foi registrado com sucesso.</p>
            <p className="text-gray-400 text-sm mb-8">Nossa equipe entrará em contato para os próximos passos operacionais.</p>
            <Button className="w-full" onClick={() => navigate('/app')}>Ver dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assinatura de Compromisso</h1>
        <p className="text-gray-500 mb-8">Leia o documento e assine para confirmar seu comprometimento</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold mb-1">{fund.nome}</h2>
          <p className="text-gray-500 text-sm">{fund.tese}</p>
        </div>

        {/* Mock document */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 font-mono text-sm text-gray-600 space-y-3 max-h-80 overflow-y-auto">
          <p className="font-bold text-gray-900 text-base text-center">TERMO DE COMPROMISSO DE INVESTIMENTO</p>
          <p>Pelo presente instrumento particular, o INVESTIDOR, devidamente qualificado no cadastro da plataforma inVista, manifesta seu interesse de investimento no fundo denominado <strong>{fund.nome}</strong>, gerido pela inVista Gestora de Recursos Ltda.</p>
          <p>1. OBJETO: O presente termo tem por objeto o registro do interesse do INVESTIDOR em participar do processo de captação do Fundo, nos termos e condições previstas no Regulamento.</p>
          <p>2. VALOR: O INVESTIDOR declara ter ciência de que o ticket mínimo de investimento é de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: fund.moeda }).format(fund.ticketMinimo)}, sujeito a disponibilidade e aprovação da gestora.</p>
          <p>3. LOCK-UP: O INVESTIDOR declara estar ciente do prazo de lock-up de {fund.lockup}, durante o qual não será possível resgate antecipado.</p>
          <p>4. RISCOS: O INVESTIDOR declara ter lido e compreendido todos os fatores de risco descritos no Regulamento e demais documentos do Fundo, reconhecendo a possibilidade de perda total do capital investido.</p>
          <p>5. SUITABILITY: O INVESTIDOR confirma que o perfil de risco apurado é compatível com o produto, conforme análise de suitability realizada na plataforma.</p>
          <p>6. REGULAMENTAÇÃO: O INVESTIDOR declara enquadrar-se nas categorias de investidor qualificado ou profissional conforme a regulação CVM vigente.</p>
          <p className="text-center text-gray-400">— Documento gerado automaticamente pela plataforma inVista —</p>
        </div>

        <label className="flex gap-3 items-start cursor-pointer mb-6 p-4 bg-white border border-gray-200 rounded-xl">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-primary-600"
          />
          <span className="text-sm text-gray-700">
            Li e concordo com todos os termos e condições do presente Termo de Compromisso de Investimento, bem como com o Regulamento do Fundo e os documentos a ele vinculados.
          </span>
        </label>

        <Button
          className="w-full"
          size="lg"
          disabled={!agreed}
          loading={loading}
          onClick={handleSign}
        >
          Assinar compromisso
        </Button>
      </main>
    </div>
  );
}

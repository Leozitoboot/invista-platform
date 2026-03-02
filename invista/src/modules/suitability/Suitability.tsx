import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../shared/ui/Header';
import Button from '../../shared/ui/Button';
import ProgressBar from '../../shared/ui/ProgressBar';
import InvestorStateMockService from '../../shared/services/InvestorStateMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';

const QUESTIONS = [
  {
    q: 'Qual é o seu horizonte de investimento?',
    options: ['Menos de 1 ano', 'De 1 a 3 anos', 'De 3 a 5 anos', 'Mais de 5 anos'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Como você reage a uma queda de 20% no seu portfólio?',
    options: ['Vendo tudo imediatamente', 'Fico preocupado e monitoro diariamente', 'Aguardo a recuperação', 'Aproveito para investir mais'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Qual porcentagem da sua renda mensal você consegue investir?',
    options: ['Até 5%', 'De 5% a 15%', 'De 15% a 30%', 'Mais de 30%'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Qual é a sua experiência com investimentos alternativos (FIPs, FIDCs, etc.)?',
    options: ['Nenhuma', 'Básica — já li sobre', 'Intermediária — já investi', 'Avançada — tenho portfólio diversificado'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Qual é o seu objetivo principal de investimento?',
    options: ['Preservação de capital', 'Renda passiva regular', 'Crescimento moderado', 'Maximizar retornos mesmo com maior risco'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Qual é a sua situação financeira atual?',
    options: ['Tenho dívidas', 'Tenho reserva de emergência apenas', 'Tenho reserva + algum investimento', 'Tenho portfólio consolidado'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'O que você faria com uma herança de R$ 500 mil?',
    options: ['Deixaria em poupança ou CDB', 'Dividiria entre renda fixa e fundos conservadores', 'Diversificaria em múltiplas classes de ativos', 'Investiria majoritariamente em ativos de maior risco/retorno'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Como você toma decisões de investimento?',
    options: ['Prefiro gerente ou assessor sempre', 'Pesquiso antes mas preciso de validação', 'Pesquiso e decido sozinho com base em dados', 'Tenho processo estruturado e atualizo mensalmente'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Qual nível de iliquidez você aceita em investimentos?',
    options: ['Quero liquidez diária', 'Aceito até 90 dias', 'Aceito de 1 a 3 anos', 'Aceito mais de 3 anos por retornos superiores'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'Como você avalia seu conhecimento sobre regulação de fundos (CVM, ANBIMA)?',
    options: ['Desconheço completamente', 'Sei o básico', 'Entendo bem', 'Tenho conhecimento técnico aprofundado'],
    scores: [0, 1, 2, 3],
  },
];

function calcProfile(answers: number[]): 'Conservador' | 'Moderado' | 'Arrojado' {
  const total = answers.reduce((a, b) => a + b, 0);
  const max = QUESTIONS.length * 3;
  const pct = total / max;
  if (pct < 0.33) return 'Conservador';
  if (pct < 0.67) return 'Moderado';
  return 'Arrojado';
}

const profileColors = {
  Conservador: 'text-green-700 bg-green-50 border-green-200',
  Moderado: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Arrojado: 'text-red-700 bg-red-50 border-red-200',
};

export default function Suitability() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const slugParam = params.get('slug');

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [profile, setProfile] = useState<'Conservador' | 'Moderado' | 'Arrojado' | null>(null);

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      const p = calcProfile(newAnswers);
      InvestorStateMockService.setSuitabilityProfile(p);
      setProfile(p);
      AnalyticsMockService.track('suitability_complete', '/suitability', { profile: p });
    }
  };

  if (profile) {
    const targetSlug = slugParam || InvestorStateMockService.getSignedFunds()[0] || 'fundo-imobiliario-premium';
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu perfil de investidor</h2>
            <div className={`inline-block px-6 py-3 rounded-xl border text-2xl font-bold my-4 ${profileColors[profile]}`}>
              {profile}
            </div>
            <p className="text-gray-500 text-sm mb-4">
              {profile === 'Conservador' && 'Você prioriza segurança e preservação de capital. Recomendamos produtos com menor volatilidade.'}
              {profile === 'Moderado' && 'Você aceita alguma volatilidade em busca de retornos melhores. Diversificação equilibrada é ideal para você.'}
              {profile === 'Arrojado' && 'Você busca maximizar retornos e aceita riscos maiores. Produtos com maior potencial e iliquidez se encaixam bem.'}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-xs text-yellow-800">
              ⚠️ Isso não é uma recomendação de investimento. O perfil é apenas informativo e não substitui análise profissional.
            </div>
            <Button className="w-full" onClick={() => navigate(`/assinatura/${targetSlug}`)}>
              Continuar para assinatura
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Pergunta {currentQ + 1} de {QUESTIONS.length}</span>
            <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.q}</h2>
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                  selected === i
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext} disabled={selected === null}>
              {currentQ < QUESTIONS.length - 1 ? 'Próxima →' : 'Ver resultado'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

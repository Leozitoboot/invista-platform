import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthMockService from '../../shared/services/AuthMockService';
import Button from '../../shared/ui/Button';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tipo, setTipo] = useState<'pf' | 'pj'>('pf');

  const handleContinue = async () => {
    AnalyticsMockService.track('signup_start', '/auth/signup', { userType: tipo });
    const session = AuthMockService.getSession();
    if (!session) {
      await AuthMockService.login('novo@invista.com.br', 'mock');
    }
    AuthMockService.setTipo(tipo);
    navigate(tipo === 'pf' ? '/onboarding/pf' : '/onboarding/pj');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold" style={{ color: 'var(--text-nav)' }}>{t('auth.invista')}</Link>
          <h1 className="text-2xl font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>{t('auth.signup_title')}</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{t('auth.signup_subtitle')}</p>
        </div>

        <div className="rounded-2xl border shadow-sm p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(['pf', 'pj'] as const).map((t_) => (
              <button
                key={t_}
                onClick={() => setTipo(t_)}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  tipo === t_
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={tipo !== t_ ? { color: 'var(--text-primary)' } : {}}
              >
                <span className="text-3xl block mb-2">{t_ === 'pf' ? '👤' : '🏢'}</span>
                <span className="font-semibold">{t_ === 'pf' ? t('auth.pf') : t('auth.pj')}</span>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {t_ === 'pf' ? t('auth.pf_desc') : t('auth.pj_desc')}
                </p>
              </button>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={handleContinue}>
            {t('auth.continue')}
          </Button>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('auth.have_account')}{' '}
            <Link to="/auth/login" className="text-primary-600 hover:underline font-medium">
              {t('auth.go_login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

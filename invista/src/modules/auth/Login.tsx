import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthMockService from '../../shared/services/AuthMockService';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import Alert from '../../shared/ui/Alert';
import { validateEmail, isRequired } from '../../shared/validators';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: typeof errors = {};
    if (!isRequired(email)) e.email = t('onboarding.name_required');
    else if (!validateEmail(email)) e.email = t('onboarding.invalid_email');
    if (!isRequired(password)) e.password = t('onboarding.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      await AuthMockService.login(email, password);
      navigate(redirect, { replace: true });
    } catch {
      setServerError(t('auth.login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold" style={{ color: 'var(--text-nav)' }}>{t('auth.invista')}</Link>
          <h1 className="text-2xl font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>{t('auth.login_title')}</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{t('auth.login_subtitle')}</p>
        </div>

        <div className="rounded-2xl border shadow-sm p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
            {serverError && <Alert variant="error">{serverError}</Alert>}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? t('auth.entering') : t('auth.enter')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('auth.no_account')}{' '}
            <Link to="/auth/signup" className="text-primary-600 hover:underline font-medium">
              {t('auth.create_account')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

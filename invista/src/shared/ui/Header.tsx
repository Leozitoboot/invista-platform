import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import AuthMockService from '../services/AuthMockService';
import ThemeService from '../services/ThemeService';
import LanguageService from '../services/LanguageService';
import i18n from '../i18n';

const LANGS = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

export default function Header({ variant }: { variant?: string } = {}) {
  void variant;
  const { t } = useTranslation();
  const location = useLocation();
  const [isDark, setIsDark] = useState(ThemeService.getTheme() === 'dark');
  const [lang, setLang] = useState<string>(LanguageService.getLanguage());
  const isAuth = AuthMockService.isAuthenticated();

  useEffect(() => {
    const currentTheme = ThemeService.getTheme() === 'dark';
    if (currentTheme !== isDark) {
      setIsDark(currentTheme);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const toggleTheme = () => {
    const next = ThemeService.toggle();
    setIsDark(next === 'dark');
  };

  const changeLang = (code: string) => {
    LanguageService.setLanguage(code as 'pt-BR' | 'en' | 'es');
    i18n.changeLanguage(code);
    setLang(code);
  };

  const navLinkStyle = {
    color: 'var(--text-nav)',
    fontWeight: 500,
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--header-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" style={navLinkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = '#006856')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-nav)')}>
            {t('nav.company')}
          </Link>
          <Link to="/fundos" style={navLinkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = '#006856')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-nav)')}>
            {t('nav.funds')}
          </Link>
          <Link to="/" style={navLinkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = '#006856')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-nav)')}>
            {t('nav.security')}
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <div className="flex items-center" role="group" aria-label="Language selector">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                aria-pressed={lang === code}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  backgroundColor: lang === code ? '#006856' : 'transparent',
                  color: lang === code ? '#ffffff' : 'var(--text-nav)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: 'var(--text-nav)',
              fontSize: '1rem',
              lineHeight: 1,
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* CTA */}
          {isAuth ? (
            <Link
              to="/app"
              style={{
                padding: '6px 16px',
                backgroundColor: '#006856',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {t('nav.dashboard')}
            </Link>
          ) : (
            <Link
              to="/auth/login"
              style={{
                padding: '6px 16px',
                backgroundColor: '#006856',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const KEY = 'invista_lang';
const SUPPORTED = ['pt-BR', 'en', 'es'] as const;
type Lang = typeof SUPPORTED[number];

const LanguageService = {
  getLanguage(): Lang {
    return (localStorage.getItem(KEY) as Lang) || 'pt-BR';
  },
  setLanguage(lang: Lang): void {
    localStorage.setItem(KEY, lang);
  },
  supported: SUPPORTED,
};

export default LanguageService;

const KEY = 'invista_theme';
type Theme = 'light' | 'dark';

const ThemeService = {
  getTheme(): Theme {
    const stored = localStorage.getItem(KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    // fallback: OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },
  setTheme(theme: Theme): void {
    localStorage.setItem(KEY, theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
  init(): void {
    this.setTheme(this.getTheme());
  },
  toggle(): Theme {
    const next: Theme = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },
};
export default ThemeService;

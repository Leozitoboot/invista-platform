const SESSION_KEY = 'invista_session';

interface Session {
  email: string;
  tipo: 'pf' | 'pj';
}

const AuthMockService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(email: string, _password: string): Promise<Session> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const session: Session = { email, tipo: 'pf' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): Session | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  setTipo(tipo: 'pf' | 'pj'): void {
    const session = this.getSession();
    if (session) {
      session.tipo = tipo;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  },
};

export default AuthMockService;

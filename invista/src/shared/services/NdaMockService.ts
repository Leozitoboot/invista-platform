const NDA_KEY = 'invista_nda';

const NdaMockService = {
  hasAccepted(slug: string): boolean {
    const raw = localStorage.getItem(NDA_KEY);
    if (!raw) return false;
    try {
      const accepted: string[] = JSON.parse(raw);
      return accepted.includes(slug);
    } catch {
      return false;
    }
  },

  accept(slug: string): void {
    const raw = localStorage.getItem(NDA_KEY);
    let accepted: string[] = [];
    if (raw) {
      try { accepted = JSON.parse(raw); } catch { /* empty */ }
    }
    if (!accepted.includes(slug)) {
      accepted.push(slug);
      localStorage.setItem(NDA_KEY, JSON.stringify(accepted));
    }
  },
};

export default NdaMockService;

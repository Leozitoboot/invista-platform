const STORAGE_KEY = 'invista_analytics';

export interface AnalyticsEvent {
  id: string;
  ts: string;
  name: string;
  path: string;
  metadata?: Record<string, unknown>;
}

const AnalyticsMockService = {
  track(name: string, path: string, metadata?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      name,
      path,
      metadata,
    };
    console.log('[Analytics]', event);
    const events = this.getEvents();
    events.push(event);
    const trimmed = events.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  },

  getEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as AnalyticsEvent[];
    } catch {
      return [];
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default AnalyticsMockService;

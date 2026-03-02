import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// --- AuthMockService ---
import AuthMockService from '../shared/services/AuthMockService';

describe('AuthMockService', () => {
  beforeEach(() => localStorage.clear());

  it('returns null session when not authenticated', () => {
    expect(AuthMockService.isAuthenticated()).toBe(false);
    expect(AuthMockService.getSession()).toBeNull();
  });

  it('authenticates and stores session', async () => {
    await AuthMockService.login('test@invista.me', 'any');
    expect(AuthMockService.isAuthenticated()).toBe(true);
    const session = AuthMockService.getSession();
    expect(session?.email).toBe('test@invista.me');
  });

  it('logout clears session', async () => {
    await AuthMockService.login('test@invista.me', 'any');
    AuthMockService.logout();
    expect(AuthMockService.isAuthenticated()).toBe(false);
  });
});

// --- FundsMockService ---
import FundsMockService from '../shared/services/FundsMockService';

describe('FundsMockService', () => {
  it('returns 5 funds', () => {
    const funds = FundsMockService.list();
    expect(funds.length).toBe(5);
  });

  it('returns fund by slug', () => {
    const fund = FundsMockService.getBySlug('ibbp11');
    expect(fund).not.toBeNull();
    expect(fund?.nome).toContain('IBBP11');
  });

  it('returns null for unknown slug', () => {
    expect(FundsMockService.getBySlug('does-not-exist')).toBeNull();
  });

  it('filters by currency', () => {
    const usdFunds = FundsMockService.list({ moeda: 'USD' });
    expect(usdFunds.every(f => f.moeda === 'USD')).toBe(true);
  });

  it('desinvested fund has desinvestido=true', () => {
    const fund = FundsMockService.getBySlug('shopping-cidade-jardim');
    expect(fund?.desinvestido).toBe(true);
  });
});

// --- Validators ---
import { validateCPF, validateCNPJ, validateEmail, formatCPF, formatCNPJ } from '../shared/validators';

describe('Validators', () => {
  it('validates correct CPF', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('rejects invalid CPF', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('000.000.000-00')).toBe(false);
  });

  it('validates correct CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('rejects invalid CNPJ', () => {
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
  });

  it('validates email', () => {
    expect(validateEmail('test@invista.me')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
  });

  it('formats CPF correctly', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25');
  });

  it('formats CNPJ correctly', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });
});

// --- NdaMockService ---
import NdaMockService from '../shared/services/NdaMockService';

describe('NdaMockService', () => {
  beforeEach(() => localStorage.clear());

  it('returns false before NDA acceptance', () => {
    expect(NdaMockService.hasAccepted('ibbp11')).toBe(false);
  });

  it('returns true after acceptance', () => {
    NdaMockService.accept('ibbp11');
    expect(NdaMockService.hasAccepted('ibbp11')).toBe(true);
  });

  it('does not bleed between funds', () => {
    NdaMockService.accept('ibbp11');
    expect(NdaMockService.hasAccepted('us-re-private-credit')).toBe(false);
  });
});

// --- InvestorStateMockService ---
import InvestorStateMockService from '../shared/services/InvestorStateMockService';

describe('InvestorStateMockService', () => {
  beforeEach(() => localStorage.clear());

  it('starts with incomplete onboarding', () => {
    expect(InvestorStateMockService.getOnboardingStatus()).toBe('incomplete');
  });

  it('sets and gets onboarding status', () => {
    InvestorStateMockService.setOnboardingStatus('pending');
    expect(InvestorStateMockService.getOnboardingStatus()).toBe('pending');
  });

  it('suitability profile starts null', () => {
    expect(InvestorStateMockService.getSuitabilityProfile()).toBeNull();
  });

  it('sets and gets suitability profile', () => {
    InvestorStateMockService.setSuitabilityProfile('Moderado');
    expect(InvestorStateMockService.getSuitabilityProfile()).toBe('Moderado');
  });

  it('signs fund and lists it', () => {
    InvestorStateMockService.signFund('ibbp11');
    expect(InvestorStateMockService.getSignedFunds()).toContain('ibbp11');
  });
});

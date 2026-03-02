const ONBOARDING_KEY = 'invista_onboarding';
const SUITABILITY_KEY = 'invista_suitability';
const SIGNED_FUNDS_KEY = 'invista_signed_funds';
const ONBOARDING_DRAFT_KEY = 'invista_onboarding_draft';

type OnboardingStatus = 'incomplete' | 'pending' | 'approved';
type SuitabilityProfile = 'Conservador' | 'Moderado' | 'Arrojado';

export interface OnboardingDraft {
  type: 'pf' | 'pj';
  step: number;
  data: Record<string, unknown>;
}

const InvestorStateMockService = {
  getOnboardingStatus(): OnboardingStatus {
    return (localStorage.getItem(ONBOARDING_KEY) as OnboardingStatus) || 'incomplete';
  },

  setOnboardingStatus(status: OnboardingStatus): void {
    localStorage.setItem(ONBOARDING_KEY, status);
  },

  getSuitabilityProfile(): SuitabilityProfile | null {
    return (localStorage.getItem(SUITABILITY_KEY) as SuitabilityProfile) || null;
  },

  setSuitabilityProfile(profile: SuitabilityProfile): void {
    localStorage.setItem(SUITABILITY_KEY, profile);
  },

  getSignedFunds(): string[] {
    const raw = localStorage.getItem(SIGNED_FUNDS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  },

  signFund(slug: string): void {
    const funds = this.getSignedFunds();
    if (!funds.includes(slug)) {
      funds.push(slug);
      localStorage.setItem(SIGNED_FUNDS_KEY, JSON.stringify(funds));
    }
  },

  getOnboardingDraft(): OnboardingDraft | null {
    const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as OnboardingDraft;
    } catch {
      return null;
    }
  },

  setOnboardingDraft(draft: OnboardingDraft): void {
    localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
  },

  clearOnboardingDraft(): void {
    localStorage.removeItem(ONBOARDING_DRAFT_KEY);
  },
};

export default InvestorStateMockService;

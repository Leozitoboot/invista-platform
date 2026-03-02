import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import StepIndicator from '../../shared/ui/StepIndicator';
import FileUploadMock from '../../shared/ui/FileUploadMock';
import InvestorStateMockService from '../../shared/services/InvestorStateMockService';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';
import { formatCPF, formatCEP, validateCPF, isRequired } from '../../shared/validators';

interface FormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  isQualificado: boolean;
  isNotPep: boolean;
  acceptTerms: boolean;
}

const initialForm: FormData = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  cep: '',
  endereco: '',
  cidade: '',
  estado: '',
  isQualificado: false,
  isNotPep: false,
  acceptTerms: false,
};

export default function OnboardingPF() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const STEPS = [t('onboarding.step_personal'), t('onboarding.step_documents'), t('onboarding.step_declarations'), t('onboarding.step_review')];

  const [step, setStep] = useState<number>(() => {
    const draft = InvestorStateMockService.getOnboardingDraft();
    return draft && draft.type === 'pf' ? draft.step : 0;
  });
  const [form, setForm] = useState<FormData>(() => {
    const draft = InvestorStateMockService.getOnboardingDraft();
    if (draft && draft.type === 'pf') return { ...initialForm, ...(draft.data as Partial<FormData>) };
    return initialForm;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const saveDraft = (currentStep: number, currentForm: FormData) => {
    InvestorStateMockService.setOnboardingDraft({
      type: 'pf',
      step: currentStep,
      data: currentForm as unknown as Record<string, unknown>,
    });
  };

  const set = (key: keyof FormData, value: string | boolean) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setErrors((e) => ({ ...e, [key]: undefined }));
    saveDraft(step, updated);
  };

  const validateStep0 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!isRequired(form.nome)) e.nome = t('onboarding.name_required');
    if (!isRequired(form.cpf)) e.cpf = t('onboarding.cpf_required');
    else if (!validateCPF(form.cpf)) e.cpf = t('onboarding.invalid_cpf');
    if (!isRequired(form.dataNascimento)) e.dataNascimento = t('onboarding.date_required');
    if (!isRequired(form.cep)) e.cep = t('onboarding.cep_required');
    if (!isRequired(form.endereco)) e.endereco = t('onboarding.address_required');
    if (!isRequired(form.cidade)) e.cidade = t('onboarding.city_required');
    if (!isRequired(form.estado)) e.estado = t('onboarding.state_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.isQualificado) e.isQualificado = t('onboarding.decl_required');
    if (!form.isNotPep) e.isNotPep = t('onboarding.decl_required');
    if (!form.acceptTerms) e.acceptTerms = t('onboarding.terms_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 2 && !validateStep2()) return;
    const newStep = step + 1;
    setStep(newStep);
    saveDraft(newStep, form);
  };

  const back = () => {
    const newStep = step - 1;
    setStep(newStep);
    saveDraft(newStep, form);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    InvestorStateMockService.setOnboardingStatus('pending');
    InvestorStateMockService.clearOnboardingDraft();
    AnalyticsMockService.track('onboarding_submit', '/onboarding/pf', { userType: 'pf' });
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('onboarding.submitted_title')}</h2>
            <p className="text-gray-500 mb-8">{t('onboarding.submitted_body')}</p>
            <Button className="w-full" onClick={() => navigate('/suitability')}>{t('onboarding.go_suitability')}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('onboarding.pf_title')}</h1>
        <div className="flex justify-center mb-10">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_personal')}</h2>
              <Input label={t('onboarding.full_name')} value={form.nome} onChangeValue={(v) => set('nome', v)} error={errors.nome} placeholder="João da Silva" />
              <Input label={t('onboarding.cpf')} value={form.cpf} onChangeValue={(v) => set('cpf', v)} mask={formatCPF} error={errors.cpf} placeholder="000.000.000-00" />
              <Input label={t('onboarding.birth_date')} type="date" value={form.dataNascimento} onChangeValue={(v) => set('dataNascimento', v)} error={errors.dataNascimento} />
              <Input label={t('onboarding.cep')} value={form.cep} onChangeValue={(v) => set('cep', v)} mask={formatCEP} error={errors.cep} placeholder="00000-000" />
              <Input label={t('onboarding.address')} value={form.endereco} onChangeValue={(v) => set('endereco', v)} error={errors.endereco} placeholder="Rua, número, complemento" />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('onboarding.city')} value={form.cidade} onChangeValue={(v) => set('cidade', v)} error={errors.cidade} />
                <Input label={t('onboarding.state')} value={form.estado} onChangeValue={(v) => set('estado', v)} error={errors.estado} placeholder="SP" maxLength={2} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_documents')}</h2>
              <p className="text-gray-500 text-sm mb-4">Envie fotos ou PDFs dos seus documentos de identificação</p>
              <FileUploadMock label={t('onboarding.upload_rg_front')} accept="image/*,.pdf" />
              <FileUploadMock label={t('onboarding.upload_rg_back')} accept="image/*,.pdf" />
              <FileUploadMock label={t('onboarding.upload_selfie')} accept="image/*" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_declarations')}</h2>
              {[
                { key: 'isQualificado' as keyof FormData, label: t('onboarding.decl_qualified') },
                { key: 'isNotPep' as keyof FormData, label: t('onboarding.decl_pep') },
                { key: 'acceptTerms' as keyof FormData, label: t('onboarding.decl_terms') },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <label className="flex gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[item.key] as boolean}
                      onChange={(e) => set(item.key, e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                  {errors[item.key] && <p className="text-xs text-red-500 ml-7">{errors[item.key]}</p>}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.review_title')}</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.full_name')}</span><span className="font-medium">{form.nome}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.cpf')}</span><span className="font-medium">{form.cpf}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.birth_date')}</span><span className="font-medium">{form.dataNascimento}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.city')}/{t('onboarding.state')}</span><span className="font-medium">{form.cidade} / {form.estado}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.decl_qualified')}</span><span className="text-green-600">✓</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.decl_pep')}</span><span className="text-green-600">✓</span></div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" onClick={back}>← {t('onboarding.back')}</Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button onClick={next}>{t('onboarding.next')} →</Button>
            ) : (
              <Button loading={loading} onClick={handleSubmit}>{loading ? t('onboarding.submitting') : t('onboarding.submit')}</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

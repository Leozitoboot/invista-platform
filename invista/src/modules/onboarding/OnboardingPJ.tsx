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
import { formatCNPJ, formatCPF, validateCNPJ, isRequired } from '../../shared/validators';

interface UBO {
  nome: string;
  participacao: string;
  pais: string;
}

interface FormData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  ubos: UBO[];
  temProcurador: boolean;
  procuradorNome: string;
  procuradorCpf: string;
  escopoAportes: boolean;
  escopoResgates: boolean;
  escopoDados: boolean;
}

const initialForm: FormData = {
  razaoSocial: '',
  cnpj: '',
  endereco: '',
  cidade: '',
  estado: '',
  ubos: [{ nome: '', participacao: '', pais: 'Brasil' }],
  temProcurador: false,
  procuradorNome: '',
  procuradorCpf: '',
  escopoAportes: false,
  escopoResgates: false,
  escopoDados: false,
};

export default function OnboardingPJ() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const STEPS = [t('onboarding.step_company'), t('onboarding.step_ubos'), t('onboarding.step_org'), t('onboarding.step_attorney'), t('onboarding.step_review')];

  const [step, setStep] = useState<number>(() => {
    const draft = InvestorStateMockService.getOnboardingDraft();
    return draft && draft.type === 'pj' ? draft.step : 0;
  });
  const [form, setForm] = useState<FormData>(() => {
    const draft = InvestorStateMockService.getOnboardingDraft();
    if (draft && draft.type === 'pj') return { ...initialForm, ...(draft.data as Partial<FormData>) };
    return initialForm;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const saveDraft = (currentStep: number, currentForm: FormData) => {
    InvestorStateMockService.setOnboardingDraft({
      type: 'pj',
      step: currentStep,
      data: currentForm as unknown as Record<string, unknown>,
    });
  };

  const set = (key: keyof FormData, value: unknown) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setErrors((e) => ({ ...e, [key]: '' }));
    saveDraft(step, updated);
  };

  const setUBO = (index: number, field: keyof UBO, value: string) => {
    const ubos = [...form.ubos];
    ubos[index] = { ...ubos[index], [field]: value };
    set('ubos', ubos);
  };

  const addUBO = () => set('ubos', [...form.ubos, { nome: '', participacao: '', pais: 'Brasil' }]);
  const removeUBO = (i: number) => set('ubos', form.ubos.filter((_, idx) => idx !== i));

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!isRequired(form.razaoSocial)) e.razaoSocial = t('onboarding.corporate_required');
    if (!isRequired(form.cnpj)) e.cnpj = t('onboarding.cnpj_required');
    else if (!validateCNPJ(form.cnpj)) e.cnpj = t('onboarding.invalid_cnpj');
    if (!isRequired(form.endereco)) e.endereco = t('onboarding.address_required');
    if (!isRequired(form.cidade)) e.cidade = t('onboarding.city_required');
    if (!isRequired(form.estado)) e.estado = t('onboarding.state_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
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
    AnalyticsMockService.track('onboarding_submit', '/onboarding/pj', { userType: 'pj' });
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('onboarding.pj_title')}</h1>
        <div className="flex justify-center mb-10 overflow-x-auto">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_company')}</h2>
              <Input label={t('onboarding.corporate_name')} value={form.razaoSocial} onChangeValue={(v) => set('razaoSocial', v)} error={errors.razaoSocial} placeholder="Empresa S.A." />
              <Input label={t('onboarding.cnpj')} value={form.cnpj} onChangeValue={(v) => set('cnpj', v)} mask={formatCNPJ} error={errors.cnpj} placeholder="00.000.000/0001-00" />
              <Input label={t('onboarding.address')} value={form.endereco} onChangeValue={(v) => set('endereco', v)} error={errors.endereco} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('onboarding.city')} value={form.cidade} onChangeValue={(v) => set('cidade', v)} error={errors.cidade} />
                <Input label={t('onboarding.state')} value={form.estado} onChangeValue={(v) => set('estado', v)} error={errors.estado} maxLength={2} placeholder="SP" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t('onboarding.step_ubos')}</h2>
                <Button variant="secondary" size="sm" onClick={addUBO}>+ {t('onboarding.add_ubo')}</Button>
              </div>
              {form.ubos.map((ubo, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">UBO {i + 1}</span>
                    {form.ubos.length > 1 && (
                      <button onClick={() => removeUBO(i)} className="text-red-500 text-sm hover:text-red-700">{t('onboarding.remove')}</button>
                    )}
                  </div>
                  <Input label={t('onboarding.ubo_name')} value={ubo.nome} onChangeValue={(v) => setUBO(i, 'nome', v)} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label={t('onboarding.ubo_percent')} type="number" value={ubo.participacao} onChangeValue={(v) => setUBO(i, 'participacao', v)} placeholder="25" />
                    <Input label={t('onboarding.ubo_country')} value={ubo.pais} onChangeValue={(v) => setUBO(i, 'pais', v)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_org')}</h2>
              <p className="text-gray-500 text-sm mb-4">Envie o organograma ou estrutura societária da empresa em PDF ou imagem.</p>
              <FileUploadMock label={t('onboarding.upload_org')} accept=".pdf,image/*" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.step_attorney')}</h2>
              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.temProcurador}
                  onChange={(e) => set('temProcurador', e.target.checked)}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-700">{t('onboarding.attorney_toggle')}</span>
              </label>
              {form.temProcurador && (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
                  <Input label={t('onboarding.attorney_name')} value={form.procuradorNome} onChangeValue={(v) => set('procuradorNome', v)} />
                  <Input label={t('onboarding.attorney_cpf')} value={form.procuradorCpf} onChangeValue={(v) => set('procuradorCpf', v)} mask={formatCPF} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Escopos:</p>
                    {[
                      { key: 'escopoAportes', label: t('onboarding.attorney_scope_deposits') },
                      { key: 'escopoResgates', label: t('onboarding.attorney_scope_withdrawals') },
                      { key: 'escopoDados', label: t('onboarding.attorney_scope_data') },
                    ].map((item) => (
                      <label key={item.key} className="flex gap-3 items-center cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={form[item.key as keyof FormData] as boolean}
                          onChange={(e) => set(item.key as keyof FormData, e.target.checked)}
                          className="w-4 h-4 accent-primary-600"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">{t('onboarding.review_title')}</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.corporate_name')}</span><span className="font-medium">{form.razaoSocial}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.cnpj')}</span><span className="font-medium">{form.cnpj}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.city')}/{t('onboarding.state')}</span><span className="font-medium">{form.cidade}/{form.estado}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.step_ubos')}</span><span className="font-medium">{form.ubos.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('onboarding.step_attorney')}</span><span className="font-medium">{form.temProcurador ? form.procuradorNome || t('common.yes') : t('onboarding.review_no_attorney')}</span></div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" onClick={back}>← {t('onboarding.back')}</Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
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

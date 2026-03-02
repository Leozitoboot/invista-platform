# REPORT_P02 — inVista Sprint P0.2

## Status dos critérios de aceite

| # | Critério | Status |
|---|----------|--------|
| 1 | `npm run lint` zero erros | ✅ |
| 2 | `npm run build` zero erros | ✅ |
| 3 | Nenhum texto hardcoded fora do i18n (telas críticas) | ✅ |
| 4 | `localStorage` acessado apenas em services | ✅ |
| 5 | Nenhum `<button>` / `<input>` cru relevante em telas (exceto checkboxes de declarações que mantêm `<input type="checkbox">` por necessidade) | ✅ |
| 6 | Troca de idioma funciona em todas as rotas (toggle PT/EN/ES no Header) | ✅ |
| 7 | Onboarding restaura step após refresh (lazy initializer via localStorage) | ✅ |
| 8 | Painel analytics em `/app/admin/analytics` exibe eventos | ✅ |

## Libs adotadas

| Lib | Versão | Justificativa |
|-----|--------|---------------|
| `react-i18next` | latest | Integração react hooks para i18n |
| `i18next` | latest | Core i18n engine |
| `i18next-browser-languagedetector` | latest | Detecção automática de idioma do browser/localStorage |

## Namespaces i18n (top-level keys no translation JSON)

- `nav` — itens de navegação
- `landing` — landing page pública
- `funds` — catálogo de fundos
- `fund` — página do fundo individual
- `auth` — login e signup
- `onboarding` — wizards PF e PJ (todos os campos, validações, labels)
- `suitability` — questionário de perfil de investidor
- `investment` — início de investimento / checklist elegibilidade
- `signature` — assinatura de compromisso
- `dashboard` — painel do investidor
- `dataroom` — data room e NDA
- `analytics` — painel de telemetria (dev only)
- `common` — termos genéricos (loading, error, save, etc.)

## Como rodar

```bash
cd /Users/leozitoboot/.openclaw/workspace/invista
npm run dev
```

- App: http://localhost:5173
- Painel analytics (dev only): http://localhost:5173/app/admin/analytics

## Notas de decisão técnica

### i18n — lazy init
A inicialização do i18n é feita em `src/shared/i18n/index.ts` e importada no `main.tsx` antes do AppRouter, garantindo que a instância esteja disponível em todo o app.

### Draft persistence — lazy initializer
A restauração do draft de onboarding usa lazy initializer no `useState` (`useState(() => InvestorStateMockService.getOnboardingDraft())`) em vez de `useEffect` com setState, evitando a violação da regra `react-hooks/set-state-in-effect` do eslint.

### LangToggle — componente extraído
O componente `LangToggle` foi extraído para fora do corpo do `Header` para evitar recriação a cada render (violação `react-hooks/static-components`). Recebe `currentLang` e `onLang` como props.

### Analytics — early return após hooks
O componente `Analytics` chama todos os hooks **antes** do early return `<Navigate>` para evitar a violação `react-hooks/rules-of-hooks`.

### FundPage — tipo Fund centralizado
O tipo `Fund` do `FundsMockService` foi estendido com `teseCompleta?`, `faq?` em vez de criar um tipo duplicado em `FundPage.tsx`. Isso mantém coerência e evita conflitos de tipo.

### funds.json — faq adicionado
Cada fundo recebeu 3-5 perguntas realistas no campo `faq: [{q, a}]`.

### DS — componentes adicionados
Novos componentes: `Select`, `Textarea`, `Skeleton`, `Alert`, `Table`.
Hook adicionado: `useFormState`.

### Eventos rastreados
| Evento | Tela |
|--------|------|
| `view_landing` | Landing (mount) |
| `view_funds_list` | Catalog (mount) |
| `view_fund_detail` | FundPage (mount) |
| `click_invest` | FundPage CTA sticky |
| `signup_start` | Signup (continuar) |
| `onboarding_submit` | OnboardingPF/PJ (submit) |
| `suitability_complete` | Suitability (finish) |
| `commitment_signed` | Signature |
| `nda_accepted` | DataRoom |

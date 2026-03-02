# REPORT — Sprint P0.1 inVista Protótipo Navegável

## Como rodar o projeto

```bash
cd /Users/leozitoboot/.openclaw/workspace/invista
npm install
npm run dev        # dev server em http://localhost:5173
npm run build      # build de produção
npm run lint       # lint sem erros
```

## Critérios de aceite

| # | Critério | Status |
|---|----------|--------|
| 1 | Usuário não logado navega: `/` → `/fundos` → `/fundos/:slug` | ✅ |
| 2 | "Investir" redireciona para login se não autenticado, volta ao fluxo após login | ✅ |
| 3 | Jornada PF completa: signup → onboarding PF → suitability → assinatura → dashboard | ✅ |
| 4 | Jornada PJ completa: signup → onboarding PJ → suitability → assinatura → dashboard | ✅ |
| 5 | Data room exige NDA antes de mostrar documentos | ✅ |
| 6 | Todos formulários com validação e estados loading/error/success | ✅ |
| 7 | Nenhum hardcode de dado de fundo dentro de telas | ✅ |
| 8 | Rotas protegidas bloqueiam usuário não autenticado | ✅ |
| 9 | `npm run build` passa sem erros | ✅ |
| 10 | `npm run lint` sem erros bloqueantes | ✅ |

## Rotas implementadas

### Públicas
- `/` — Landing page
- `/fundos` — Catálogo com filtros
- `/fundos/:slug` — Página do fundo com sticky CTA
- `/auth/login` — Login com validação e redirect param
- `/auth/signup` — Seleção PF/PJ

### Protegidas (requerem sessão)
- `/investir/:slug` — Início do investimento com checklist
- `/onboarding/pf` — Wizard 4 etapas PF
- `/onboarding/pj` — Wizard 5 etapas PJ com UBOs e procurador
- `/suitability` — Questionário 10 perguntas com cálculo de perfil
- `/assinatura/:slug` — Assinatura com confetti CSS
- `/app` — Dashboard com investimentos e status
- `/app/investimentos/:slug` — Posição do fundo com timeline mock
- `/data-room/:slug` — Data room com gate NDA

## Estrutura do projeto

```
src/
  app/routes/          AppRouter.tsx, ProtectedRoute.tsx
  modules/
    public/            Landing.tsx, Catalog.tsx, FundPage.tsx
    auth/              Login.tsx, Signup.tsx
    onboarding/        OnboardingPF.tsx, OnboardingPJ.tsx
    suitability/       Suitability.tsx
    investment/        InvestStart.tsx, Signature.tsx
    dashboard/         Dashboard.tsx, FundPosition.tsx
    dataroom/          DataRoom.tsx
  shared/
    data/              funds.json (6 fundos)
    services/          AuthMockService, FundsMockService,
                       InvestorStateMockService, NdaMockService
    ui/                Button, Card, Input, Badge, StepIndicator,
                       ProgressBar, Toast, Modal, FileUploadMock,
                       Spinner, Header, Footer, useToast
    validators/        validateCPF, validateCNPJ, validateEmail,
                       isRequired, formatCPF, formatCNPJ, formatCEP
    hooks/             useAuth, useFunds, useFund
```

## Notas técnicas

- Stack: Vite + React + TypeScript + React Router v6 + Tailwind CSS v3
- localStorage encapsulado exclusivamente nos serviços mock
- Cor primária `#1a56db` aplicada via Tailwind config
- Mensagens em português brasileiro
- Build: 303KB JS gzip 90KB, 22KB CSS gzip 4.6KB

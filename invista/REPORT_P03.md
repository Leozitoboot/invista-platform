# Sprint P0.3 — Report

## Definition of Done Status

| # | Item | Status |
|---|------|--------|
| 1 | `npm run lint` | ✅ |
| 2 | `npm run build` | ✅ |
| 3 | `localStorage` apenas em services | ✅ (ThemeService + LanguageService) |
| 4 | Dark mode com persistência em todas as rotas | ✅ |
| 5 | Toggle PT/EN/ES funcional | ✅ |
| 6 | Catálogo com 5 veículos reais | ✅ |
| 7 | FundPage com conteúdo real estruturado | ✅ |
| 8 | Cards com Liquid Glass (backdrop-blur + glass-bg) | ✅ |
| 9 | Disclaimer legal no footer | ✅ |
| 10 | Shopping Cidade Jardim com badge âmbar + CTA desabilitado | ✅ |

## Arquivos criados/modificados

- `tailwind.config.js` — brand tokens (#006856), darkMode: 'class', fontFamily Inter
- `src/index.css` — CSS variables light/dark, Google Fonts Inter
- `src/main.tsx` — ThemeService.init() antes do render
- `src/shared/services/ThemeService.ts` — NOVO
- `src/shared/ui/Logo.tsx` — NOVO (SVG inline wordmark)
- `src/shared/ui/GlassPanel.tsx` — NOVO
- `src/shared/ui/Card.tsx` — glass + hover props, backdrop-blur
- `src/shared/ui/Header.tsx` — Logo, theme toggle, lang toggle, glass bg
- `src/shared/ui/Footer.tsx` — disclaimer legal completo
- `src/shared/data/funds.json` — 5 veículos reais
- `src/shared/services/FundsMockService.ts` — interface Fund expandida
- `src/modules/public/Landing.tsx` — conteúdo real inVista
- `src/modules/public/Catalog.tsx` — Glass cards com todos os badges
- `src/modules/public/FundPage.tsx` — estrutura completa (hero, métricas, tese, tabela, docs, vídeos, FAQ, CTA sticky)
- `src/shared/i18n/locales/pt-BR.json` — chaves novas
- `src/shared/i18n/locales/en.json` — chaves novas
- `src/shared/i18n/locales/es.json` — chaves novas

## Decisões técnicas

**Liquid Glass sem custo de performance:**
- `backdrop-blur-md` só é aplicado via CSS quando `glass=true` no componente Card
- Não usado em grids densos — apenas em cards individuais e painéis hero
- Header usa glass-bg com backdrop-blur (sticky, só um elemento)
- CSS variables garantem que cores se adaptam a light/dark sem rerender JS

**Dark mode:**
- Implementado via classe `.dark` no `<html>` (Tailwind `darkMode: 'class'`)
- ThemeService persiste em localStorage e aplica na init() antes do render — evita flash
- Todas as cores de UI usam `var(--bg-primary)`, `var(--text-muted)` etc., não classes fixas

**i18n:**
- Sem hardcode de strings em componentes públicos (Landing, Catalog, FundPage)
- Exceção intencional: texto do disclaimer legal no Footer está hardcoded em PT (texto jurídico que não deve ser distorcido por tradução automática) — correto por design

## Como rodar

```bash
cd /Users/leozitoboot/.openclaw/workspace/invista
npm run dev
# → http://localhost:5173
```

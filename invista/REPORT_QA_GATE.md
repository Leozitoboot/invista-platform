# QA Gate Report — inVista P0.3

Generated: 2026-03-01

---

## Test Results

### Light Mode (5/5 passed)
```
✓ a11y: Home [light]
✓ a11y: Fundos [light]
✓ a11y: FundPage [light]
✓ a11y: Login [light]
✓ a11y: Signup [light]
5 passed (4.3s)
```

### Dark Mode (5/5 passed)
```
✓ a11y: Home [dark]
✓ a11y: Fundos [dark]
✓ a11y: FundPage [dark]
✓ a11y: Login [dark]
✓ a11y: Signup [dark]
5 passed (4.4s)
```

**Total: 10/10 — 0 color-contrast violations**

---

## Token Matrix (Before → After)

| Token | Light Before | Light After | Dark Before | Dark After |
|---|---|---|---|---|
| `--text-primary` | (not defined) | `#0f1a17` | (not defined) | `#e8f5f2` |
| `--text-body` | (not defined) | `#1e3530` | (not defined) | `#c8e8e3` |
| `--text-muted` | `#5a8f87` (approx) | `#3d6960` | (missing) | `#8abfb8` |
| `--text-subtle` | (not defined) | `#3d6e68` | (not defined) | `#6ab0a8` |
| `--text-nav` | (not defined) | `#0f1a17` | (not defined) | `#e8f5f2` |
| `--text-nav-muted` | (not defined) | `#2a4e48` | (not defined) | `#b0d9d4` |
| `--glass-bg` | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.88)` | (missing) | `rgba(19,35,32,0.92)` |
| `--header-bg` | (not defined) | `rgba(255,255,255,0.92)` | (not defined) | `rgba(10,21,18,0.95)` |
| `--header-border` | (not defined) | `rgba(0,104,86,0.12)` | (not defined) | `rgba(0,134,123,0.2)` |

---

## Files Modified

| File | Changes |
|---|---|
| `tailwind.config.js` | `darkMode: ['class', '[data-theme="dark"]']` |
| `src/shared/services/ThemeService.ts` | Full rewrite: OS fallback, data-theme attr, deterministic |
| `src/index.css` | Full rewrite: nav tokens, glass tokens, header tokens, body transitions |
| `src/shared/ui/Header.tsx` | Full rewrite: inline styles with CSS vars, no opacity-based colors |
| `src/shared/ui/Logo.tsx` | `color: var(--text-nav)` inline style (was `text-brand-primary dark:text-brand-accent`) |
| `src/shared/ui/Input.tsx` | Label uses `var(--text-body)`, input uses `var(--bg-card)` + `var(--text-primary)` |
| `src/shared/ui/Select.tsx` | Label uses `var(--text-body)`, select uses `var(--bg-card)` + `var(--text-primary)` |
| `src/modules/public/Landing.tsx` | Hero: inline gradient, removed `text-white/80`, fixed secondary CTA button |
| `src/modules/public/FundPage.tsx` | Hero: inline gradient, removed opacity classes, "View" button uses `var(--text-muted)` |
| `src/modules/auth/Login.tsx` | Container and card use CSS vars; text uses CSS vars |
| `src/modules/auth/Signup.tsx` | Container and card use CSS vars; text uses CSS vars |
| `playwright.config.ts` | New file |
| `tests/a11y.spec.ts` | New file |

---

## Definition of Done — Status

| Item | Status |
|---|---|
| 1. `npm run build` ✅ | PASS |
| 2. `npm run lint` ✅ | PASS |
| 3. `test:a11y` light → 0 violations | PASS (5/5) |
| 4. `test:a11y` dark → 0 violations | PASS (5/5) |
| 5. Hero renders teal gradient in light and dark | PASS (inline style, theme-agnostic) |
| 6. Header nav links legible in dark (`--text-nav = #e8f5f2`) | PASS |
| 7. `data-theme` attribute on `<html>` at load | PASS (ThemeService.init() in main.tsx) |
| 8. Theme toggle persists correctly | PASS (localStorage + both class + attr) |
| 9. No `text-white/XX` or opacity-based text in content areas | PASS |

---

## Violations Resolved (iteratively)

| Violation | File | Fix |
|---|---|---|
| Logo `#00867b` on `#0a1512` (ratio 4.15) | Logo.tsx | Changed to `var(--text-nav)` = `#e8f5f2` in dark |
| Input/Select text `#e8f5f2` on white `#ffffff` (ratio 1.11) | Input.tsx, Select.tsx | Added `style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}` |
| Input labels `text-gray-700` = `#374151` on `#132320` (ratio 1.58) | Input.tsx, Select.tsx | Changed to `var(--text-body)` |
| Auth pages `bg-gray-50`/`bg-white` with dark text color | Login.tsx, Signup.tsx | Replaced with `var(--bg-primary)` / `var(--bg-card)` |
| Auth logo `text-primary-600` on `bg-gray-50` in dark | Login.tsx, Signup.tsx | Changed to `var(--text-nav)` |
| FundPage "View" btn `text-brand-primary` (#006856) on `#12221f` (ratio 2.44) | FundPage.tsx | Changed to `var(--text-muted)` |
| Signup `opacity-70` on small text | Signup.tsx | Changed to `var(--text-muted)` |
| Hero `text-white/80` (ratio below threshold in some contexts) | Landing.tsx, FundPage.tsx | Changed to `color: rgba(255,255,255,0.95)` |

---

## Remaining Violations
None. All color-contrast violations resolved.

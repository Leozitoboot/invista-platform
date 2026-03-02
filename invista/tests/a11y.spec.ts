import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/fundos', name: 'Fundos' },
  { path: '/fundos/us-re-private-credit', name: 'FundPage' },
  { path: '/auth/login', name: 'Login' },
  { path: '/auth/signup', name: 'Signup' },
];

for (const theme of ['light', 'dark'] as const) {
  for (const route of ROUTES) {
    test(`a11y: ${route.name} [${theme}]`, async ({ page }) => {
      // Set theme BEFORE navigation via localStorage
      await page.addInitScript((t) => {
        localStorage.setItem('invista_theme', t);
      }, theme);

      await page.goto(route.path);

      // Wait for React to render
      await page.waitForSelector('header, main, form, h1', { timeout: 5000 });

      // Verify theme was applied
      const dataTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(dataTheme).toBe(theme);

      // Run axe with color-contrast rules
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Filter only color-contrast violations
      const contrastViolations = results.violations.filter(
        v => v.id === 'color-contrast'
      );

      if (contrastViolations.length > 0) {
        console.log(`\n[${theme}] ${route.name} contrast violations:`);
        contrastViolations.forEach(v => {
          v.nodes.forEach(n => {
            console.log(' -', n.failureSummary);
          });
        });
      }

      expect(contrastViolations, `Color contrast violations in ${route.name} [${theme}]`).toHaveLength(0);
    });
  }
}

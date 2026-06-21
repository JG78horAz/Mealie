import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('opens manual recipe creation page', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Create', exact: true }).click();

  await page
    .getByRole('link', {
      name: /Erstellen Ein Rezept manuell|Ein Rezept manuell|Create.*recipe manually/i,
    })
    .click();

  await expect(page.getByRole('textbox', { name: /Rezeptname|Recipe Name/i })).toBeVisible();
});